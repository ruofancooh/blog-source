---
title: 用C语言模拟一个像素时钟
date: 2024-05-08 14:00:00
categories: 永远不看系列
permalink: myclock.html
---

C 语言基础不牢。

<!--more-->

## myclock.h

```c
#define YIN ' '
#define YANG 'O'
#define SCREEN_WIDTH 34
#define SCREEN_HEIGHT 7
#define PROBE_NUM 4

extern char screen[SCREEN_HEIGHT][SCREEN_WIDTH]; // 模拟屏幕，34 * 7 像素
extern const int hOffset[6];                     // 水平方向上的偏移量，每位数字的左上角
extern char *probe[PROBE_NUM];                   // 一排四个探针，存放四个像素的地址
extern const int model[10][SCREEN_HEIGHT];       // 每行是一个数字模型的像素情况，每行里的一个记录代表数字模型的一行
extern int timeDidits[6];                        // 18:44:02

void probeReset();                 // 探针回到原点，屏幕左上角
void probeMoveDown1Px();           // 探针向下移动一个像素
void probeMoveRightPx(int offset); // 探针向右移动多个像素

void getTimeDidits();                    // 获取本地时间的六个数字
void writeTimeToScreen();                // 写六个数字
void writeDigit(int digit, int hOffset); // 按偏移量写一个数字
```

## myclock.c

```c
#include <stdio.h>
#include <stdlib.h> //system("cls")
#include <conio.h>  //_kbhit()
#include <time.h>
#include "myclock.h"

char screen[SCREEN_HEIGHT][SCREEN_WIDTH] = {
    /*0                        5                                  12                       17                                 24                       29                  33*/
    {'O', 'O', 'O', 'O', ' ', 'O', 'O', 'O', 'O', ' ', ' ', ' ', 'O', 'O', 'O', 'O', ' ', 'O', 'O', 'O', 'O', ' ', ' ', ' ', 'O', 'O', 'O', 'O', ' ', 'O', 'O', 'O', 'O', '\n'},
    {'O', ' ', ' ', 'O', ' ', 'O', ' ', ' ', 'O', ' ', ' ', ' ', 'O', ' ', ' ', 'O', ' ', 'O', ' ', ' ', 'O', ' ', ' ', ' ', 'O', ' ', ' ', 'O', ' ', 'O', ' ', ' ', 'O', '\n'},
    {'O', ' ', ' ', 'O', ' ', 'O', ' ', ' ', 'O', ' ', 'O', ' ', 'O', ' ', ' ', 'O', ' ', 'O', ' ', ' ', 'O', ' ', 'O', ' ', 'O', ' ', ' ', 'O', ' ', 'O', ' ', ' ', 'O', '\n'},
    {'O', 'O', 'O', 'O', ' ', 'O', 'O', 'O', 'O', ' ', ' ', ' ', 'O', 'O', 'O', 'O', ' ', 'O', 'O', 'O', 'O', ' ', ' ', ' ', 'O', 'O', 'O', 'O', ' ', 'O', 'O', 'O', 'O', '\n'},
    {'O', ' ', ' ', 'O', ' ', 'O', ' ', ' ', 'O', ' ', 'O', ' ', 'O', ' ', ' ', 'O', ' ', 'O', ' ', ' ', 'O', ' ', 'O', ' ', 'O', ' ', ' ', 'O', ' ', 'O', ' ', ' ', 'O', '\n'},
    {'O', ' ', ' ', 'O', ' ', 'O', ' ', ' ', 'O', ' ', ' ', ' ', 'O', ' ', ' ', 'O', ' ', 'O', ' ', ' ', 'O', ' ', ' ', ' ', 'O', ' ', ' ', 'O', ' ', 'O', ' ', ' ', 'O', '\n'},
    {'O', 'O', 'O', 'O', ' ', 'O', 'O', 'O', 'O', ' ', ' ', ' ', 'O', 'O', 'O', 'O', ' ', 'O', 'O', 'O', 'O', ' ', ' ', ' ', 'O', 'O', 'O', 'O', ' ', 'O', 'O', 'O', 'O', '\0'}};

const int hOffset[6] = {0, 5, 12, 17, 24, 29};

char *probe[PROBE_NUM] = {&screen[0][0], &screen[0][1], &screen[0][2], &screen[0][3]};

const int model[10][SCREEN_HEIGHT] =
    {
        {0b1111, 0b1001, 0b1001, 0b1001, 0b1001, 0b1001, 0b1111},
        /* 0 1 2 3
        **********
        0| O O O O
        1| O     O
        2| O     O
        3| O     O
        4| O     O
        5| O     O
        6| O O O O
        **********/
        {0b0001, 0b0001, 0b0001, 0b0001, 0b0001, 0b0001, 0b0001},
        /* 0 1 2 3
        **********
        0|       O
        1|       O
        2|       O
        3|       O
        4|       O
        5|       O
        6|       O
        **********/
        {0b1111, 0b0001, 0b0001, 0b1111, 0b1000, 0b1000, 0b1111},
        /* 0 1 2 3
        **********
        0| O O O O
        1|       O
        2|       O
        3| O O O O
        4| O
        5| O
        6| O O O O
        **********/
        {0b1111, 0b0001, 0b0001, 0b1111, 0b0001, 0b0001, 0b1111},
        /* 0 1 2 3
        **********
        0| O O O O
        1|       O
        2|       O
        3| O O O O
        4|       O
        5|       O
        6| O O O O
        **********/
        {0b1001, 0b1001, 0b1001, 0b1111, 0b0001, 0b0001, 0b0001},
        /* 0 1 2 3
        **********
        0| O     O
        1| O     O
        2| O     O
        3| O O O O
        4|       O
        5|       O
        6|       O
        **********/
        {0b1111, 0b1000, 0b1000, 0b1111, 0b0001, 0b0001, 0b1111},
        /* 0 1 2 3
        **********
        0| O O O O
        1| O
        2| O
        3| O O O O
        4|       O
        5|       O
        6| O O O O
        **********/
        {0b1111, 0b1000, 0b1000, 0b1111, 0b1001, 0b1001, 0b1111},
        /* 0 1 2 3
        **********
        0| O O O O
        1| O
        2| O
        3| O O O O
        4| O     O
        5| O     O
        6| O O O O
        **********/
        {0b1111, 0b0001, 0b0001, 0b0001, 0b0001, 0b0001, 0b0001},
        /* 0 1 2 3
        **********
        0| O O O O
        1|       O
        2|       O
        3|       O
        4|       O
        5|       O
        6|       O
        **********/
        {0b1111, 0b1001, 0b1001, 0b1111, 0b1001, 0b1001, 0b1111},
        /* 0 1 2 3
        **********
        0| O O O O
        1| O     O
        2| O     O
        3| O O O O
        4| O     O
        5| O     O
        6| O O O O
        **********/
        {0b1111, 0b1001, 0b1001, 0b1111, 0b0001, 0b0001, 0b1111}
        /* 0 1 2 3
        **********
        0| O O O O
        1| O     O
        2| O     O
        3| O O O O
        4|       O
        5|       O
        6| O O O O
        **********/
};

int timeDidits[6];

int main()
{
    system("cls");
    printf("\033[?25l"); // 隐藏光标
    while (!_kbhit())
    {
        getTimeDidits();
        writeTimeToScreen();
        printf("%s\n\n\nPress any key to exit...\n", (const char *)screen);
        printf("\033[0;0H"); // 光标移动到 (0,0)
    }
    system("cls");
    printf("\033[?25h"); // 显示光标
}

void probeReset()
{
    for (int i = 0; i < PROBE_NUM; i++)
    {
        probe[i] = &screen[0][i];
    }
}

void probeMoveDown1Px()
{
    for (int i = 0; i < PROBE_NUM; i++)
    {
        probe[i] += SCREEN_WIDTH;
    }
}

void probeMoveRightPx(int offset)
{
    for (int i = 0; i < PROBE_NUM; i++)
    {
        probe[i] += offset;
    }
}

void getTimeDidits()
{
    time_t utc = time(NULL);
    struct tm local_time;
    localtime_s(&local_time, &utc);
    timeDidits[0] = local_time.tm_hour / 10;
    timeDidits[1] = local_time.tm_hour % 10;
    timeDidits[2] = local_time.tm_min / 10;
    timeDidits[3] = local_time.tm_min % 10;
    timeDidits[4] = local_time.tm_sec / 10;
    timeDidits[5] = local_time.tm_sec % 10;
}

void writeTimeToScreen()
{
    for (int i = 0; i < 6; i++)
    {
        writeDigit(timeDidits[i], hOffset[i]);
    }
}

void writeDigit(int digit, int hOffset)
{
    probeMoveRightPx(hOffset); // 探针移动到数字的起始位置
    for (int digitRowIndex = 0; digitRowIndex < SCREEN_HEIGHT; digitRowIndex++)
    {
        // 写一个数字的每一行.对于所有数字的每一行，总共有四种状态
        int digitRowStatus = model[digit][digitRowIndex];
        switch (digitRowStatus)
        {
        // 探针写一行，四个像素点
        case 0b1111:
            *probe[0] = YANG;
            *probe[1] = YANG;
            *probe[2] = YANG;
            *probe[3] = YANG;
            break;
        case 0b1000:
            *probe[0] = YANG;
            *probe[1] = YIN;
            *probe[2] = YIN;
            *probe[3] = YIN;
            break;
        case 0b0001:
            *probe[0] = YIN;
            *probe[1] = YIN;
            *probe[2] = YIN;
            *probe[3] = YANG;
            break;
        case 0b1001:
            *probe[0] = YANG;
            *probe[1] = YIN;
            *probe[2] = YIN;
            *probe[3] = YANG;
            break;
        default:
            break;
        }

        probeMoveDown1Px(); // 向下按行扫描
    }
    probeReset(); // 回归原位
}
```
