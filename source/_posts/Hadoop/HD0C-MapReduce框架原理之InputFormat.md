---
title: HD0C - MapReduce 框架原理之 InputFormat
date: 2023-11-08 21:47:48
categories: Hadoop
permalink: HD/0C/
---

HDFS 在物理层面上把数据分成若干个数据块（block）

切片是在逻辑上对输入的数据划分，一个切片对应一个 MapTask。

<!--more-->

## Job 提交流程

- Job.waitForCompletion()
  - Job.submit()
    - Job.connect()
    - JobSubmitter.submitJobInternal()
      - ..

---

- Completion：完成

```java
Configuration conf = new Configuration();
Job job = Job.getInstance(conf);
//……

boolean result = job.waitForCompletion(true);
// 传的参：是否向用户打印进度


System.exit(result ? 0 : 1);
```

```java
  public boolean waitForCompletion(boolean verbose
                                   ) throws IOException, InterruptedException,
                                            ClassNotFoundException {
    if (state == JobState.DEFINE) {
      submit();
    }
//……
```

- ensure：确保
- cluster：集群
- ugi：用户组信息
- privilege：特权
- internal：内部的
- track：跟踪

```java
  public void submit()
         throws IOException, InterruptedException, ClassNotFoundException {
    ensureState(JobState.DEFINE);
    setUseNewAPI();
    connect();

    final JobSubmitter submitter =
        getJobSubmitter(cluster.getFileSystem(), cluster.getClient());

    status = ugi.doAs(new PrivilegedExceptionAction<JobStatus>() {
      public JobStatus run() throws IOException, InterruptedException,
      ClassNotFoundException {
        return submitter.submitJobInternal(Job.this, cluster);
      }
    });

    state = JobState.RUNNING;
    LOG.info("The url to track the job: " + getTrackingURL());
   }
```
