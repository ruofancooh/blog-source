---
title: HD0B - Hadoop 的序列化案例
date: 2023-11-07 21:47:48
categories: Hadoop
permalink: HD/0B/
---

序列化（serialization）是指将内存中的对象转换成字节序列，以便传输和持久化存储（硬盘）。

反序列化是反过来，把存储在硬盘中的持久化数据转换为内存中的对象。

例如 JSON，它的文本文件属于持久化数据，读 json 文件后转换成对象属于反序列化。

为什么要序列化：内存中的对象是鲜活的，需要把它序列化成标准形式，便于持久化管理和多台计算机通信。对象是“声音”，序列化后是“文字”。

<!--more-->

## JavaBean

是一种遵守某套开发规范的类，可以存储具有整体性的实体信息：学生的姓名、学号、班级等。

规则：

- 必须有一个无参构造方法
- 所有属性私有，且对其提供 public 的 `getXxx()` 与 `setXxx()` 方法

## 案例

获取 `score.txt` 里各科成绩的最高分信息

### score.txt

```
张三 语文 73
张三 数学 97
张三 英语 21
张三 物理 72
张三 化学 49
张三 生物 69
李四 语文 106
李四 数学 112
李四 英语 38
李四 物理 42
李四 化学 47
李四 生物 78
王五 语文 108
王五 数学 143
王五 英语 9
王五 物理 8
王五 化学 84
王五 生物 14
陈六 语文 84
陈六 数学 128
陈六 英语 68
陈六 物理 66
陈六 化学 3
陈六 生物 78
```

### ScoreBean.java

```java
package test.hrf.hd;

import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

import org.apache.hadoop.io.Writable;

class ScoreBean implements Writable {
    String studentName;
    String courseName;
    int score;

    public ScoreBean() {
    }

    @Override
    public void write(DataOutput out) throws IOException {
        // 序列化
        // 这个和下面那个方法, 如果少写了, 会出现 null, 数字变奇怪 之类的错误
        out.writeUTF(studentName);
        out.writeUTF(courseName);
        out.writeInt(score);
    }

    @Override
    public void readFields(DataInput in) throws IOException {
        // 反序列化
        studentName = in.readUTF();
        courseName = in.readUTF();
        score = in.readInt();
    }

    @Override
    public String toString() {
        // 好像在 reducer 里的 context.write() 里传 VALUEOUT 后会调用
        // 如果不重写，会返回类似 "test.hrf.hd.ScoreBean@1aae33be"
        return studentName + "\t" + courseName + "\t" + score;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
```

### ScoreStatsMapper.java

```java
package test.hrf.hd;

import java.io.IOException;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

class ScoreStatsMapper extends Mapper<LongWritable, Text, Text, ScoreBean> {
    // KEYIN（偏移量），VALUEIN（每一行的文本），KEYOUT（courseName），VALUEOUT（ScoreBean）

    private Text outK = new Text();// courseName
    private ScoreBean outV = new ScoreBean();

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        String line = value.toString();
        String[] split = line.split(" ");

        String studentName = split[0];
        String courseName = split[1];
        int score = Integer.parseInt(split[2]);

        outK.set(courseName);// 因为需要找的是对于每门课的最高成绩
        outV.setStudentName(studentName);
        outV.setCourseName(courseName);
        outV.setScore(score);

        context.write(outK, outV);
    }
}
```

### ScoreStatsReducer.java

```java
package test.hrf.hd;

import java.io.IOException;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

public class ScoreStatsReducer extends Reducer<Text, ScoreBean, Text, ScoreBean> {
    private ScoreBean outV = new ScoreBean();

    @Override
    protected void reduce(Text key, Iterable<ScoreBean> values, Context context)
            throws IOException, InterruptedException {
        // 这里的 key 是 mapper 的 KEYOUT, 即 courseName
        // 这里的 values 是 map 后同名 key 的 VALUEOUT 集合, 即同课程名的 ScoreBean 集合
        int currentMaxScore = 0;
        for (ScoreBean scoreBean : values) {

            System.out.println(scoreBean.toString());

            int currentScore = scoreBean.getScore();
            if (currentScore > currentMaxScore) {
                currentMaxScore = currentScore;

                outV = new ScoreBean();// 如果用浅拷贝, 会在退出循环后变成最后一个
                outV.setStudentName(scoreBean.getStudentName());
                outV.setCourseName(scoreBean.getCourseName());
                outV.setScore(currentMaxScore);
            }
        }

        context.write(key, outV);
    }
}
```

### ScoreStatsDriver.java

适当改 Path

```java
package test.hrf.hd;

import org.apache.hadoop.io.Text;
import java.io.IOException;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class ScoreStatsDriver {
    public static void main(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf);

        job.setJarByClass(ScoreStatsDriver.class);

        job.setMapperClass(ScoreStatsMapper.class);
        job.setReducerClass(ScoreStatsReducer.class);

        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(ScoreBean.class);

        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(ScoreBean.class);

        FileInputFormat.setInputPaths(job, new Path("score.txt"));
        FileOutputFormat.setOutputPath(job, new Path("output"));

        boolean result = job.waitForCompletion(true);
        System.exit(result ? 0 : 1);
    }
}
```

### 输出结果

```
化学	王五	化学	84
数学	王五	数学	143
物理	张三	物理	72
生物	陈六	生物	78
英语	陈六	英语	68
语文	王五	语文	108
```
