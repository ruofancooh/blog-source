---
title: 给 VM 里的 Ubuntu 扩容
date: 2024-1-14 10:30:00
categories: 实用系列
permalink: Expand-the-Ubuntu-capacity-in-the-VM.html
---

## 工具

- `df -h`：查看文件系统使用情况、挂载到的目录
- `lsblk`：查看块设备相关信息、挂载点
- `parted`：分区管理
- `vgs` `vgdisplay`：卷组信息（Volume Group）
- `pvs` `pvdisplay`：物理卷信息（Physical volume）
- `lvs` `lvdisplay`：逻辑卷信息（Logical Volume）

## 层次（空间缝隙）

- `/dev/sda`：大概是 VM 设置里分配的硬盘空间大小
  - `/dev/sda1`：bios_grub
  - `/dev/sda2`：`/boot`
  - 物理卷 pv：`/dev/sda3`
    - 逻辑卷 lv：
      - 文件系统 `/dev/mapper/ubuntu--vg-ubuntu--lv` -> `/dev/dm-0`

需求：

1. 先扩 sda
2. 从 sda 向 sda3 匀
3. 从 sda3 向 lv 匀

## 步骤

1. 给 VM 的虚拟磁盘扩容

   关机状态下：编辑虚拟机设置 -> 硬盘 -> 扩展

2. 从 sda 向 sda3 匀

   ```sh
   sudo parted
   ```

   ```
   GNU Parted 3.4
   Using /dev/sda
   Welcome to GNU Parted! Type 'help' to view a list of commands.
   (parted) print all
   // 输出……

   (parted) print free
   Model: VMware, VMware Virtual S (scsi)
   Disk /dev/sda: 32.2GB
   Sector size (logical/physical): 512B/512B
   Partition Table: gpt
   Disk Flags:

   Number  Start   End     Size    File system  Name  Flags
           17.4kB  1049kB  1031kB  Free Space
    1      1049kB  2097kB  1049kB                     bios_grub
    2      2097kB  1904MB  1902MB  ext4
    3      1904MB  21.5GB  19.6GB
           21.5GB  32.2GB  10.7GB  Free Space

   (parted) resizepart 3
   End?  [21.5GB]? 32.3GB //在后面输入扩到的 End，比 End 略大就是扩到底
   ```

   扩完后，`sudo pvs` 出的 /dev/sda3 会比 `lsblk` 出的 sda3 小，执行：

   ```sh
   sudo pvresize /dev/sda3
   ```

3. 从 sda3 向 lv 匀

   ```sh
   sudo lvresize -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv
   ```

   扩完后，`df -h` 出的 /dev/mapper/ubuntu--vg-ubuntu--lv 还没变，执行：

   ```sh
   sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
   ```
