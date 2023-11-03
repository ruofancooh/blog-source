---
title: HD09 - HDFS 的 EditLog 和 FsImage 文件
date: 2023-10-30 22:01:00
categories: Hadoop
permalink: HD/09/
---

有两种二进制文件保证元数据的可靠性：

- EditLog：编辑日志，对 HDFS 进行操作的日志
- FsImage：文件系统（元数据）镜像

位于 NN 的 `$HADOOP_HOME/data/dfs/name/current`

和 2NN 的 `$HADOOP_HOME/data/dfs/namesecondary/current`

<!--more-->

执行下面两个命令都不需要启动集群（dfs）。

## 用 oev 命令转换 EditLog 为 xml

```sh
hdfs oev -p XML -i edits_0000000000000000564-0000000000000000613 -o ./edits_0000000000000000564-0000000000000000613.xml
```

类似：

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<EDITS>
  <EDITS_VERSION>-66</EDITS_VERSION>

  <RECORD>
    <OPCODE>OP_START_LOG_SEGMENT</OPCODE>
    <DATA>
      <TXID>564</TXID>
    </DATA>
  </RECORD>

  <RECORD>
    <OPCODE>OP_DELETE</OPCODE>
    <DATA>
      <TXID>565</TXID>
      <LENGTH>0</LENGTH>
      <PATH>/琵琶行.txt</PATH>
      <TIMESTAMP>1697199826498</TIMESTAMP>
      <RPC_CLIENTID>1c72adfa-4559-4961-9db6-5a54dd302b69</RPC_CLIENTID>
      <RPC_CALLID>3</RPC_CALLID>
    </DATA>
  </RECORD>

  <RECORD>
    <OPCODE>OP_MKDIR</OPCODE>
    <DATA>
      <TXID>566</TXID>
      <LENGTH>0</LENGTH>
      <INODEID>16498</INODEID>
      <PATH>/test</PATH>
      <TIMESTAMP>1697199859837</TIMESTAMP>
      <PERMISSION_STATUS>
        <USERNAME>rc</USERNAME>
        <GROUPNAME>supergroup</GROUPNAME>
        <MODE>493</MODE>
      </PERMISSION_STATUS>
    </DATA>
  </RECORD>

  <!--RECORD-->

  <RECORD>
    <OPCODE>OP_END_LOG_SEGMENT</OPCODE>
    <DATA>
      <TXID>613</TXID>
    </DATA>
  </RECORD>
</EDITS>
```

## 用 oiv 命令转换 FsImage 为 xml

```sh
hdfs oiv -p XML -i fsimage_0000000000000000613 -o ./fsimage_0000000000000000613.xml
```

类似：

```xml
<?xml version="1.0"?>
<fsimage>

    <version>
        <layoutVersion>-66</layoutVersion>
        <onDiskVersion>1</onDiskVersion>
        <oivRevision>1be78238728da9266a4f88195058f08fd012bf9c</oivRevision>
    </version>

    <NameSection>
        <namespaceId>1636112529</namespaceId>
        <genstampV1>1000</genstampV1>
        <genstampV2>1085</genstampV2>
        <genstampV1Limit>0</genstampV1Limit>
        <lastAllocatedBlockId>1073741909</lastAllocatedBlockId>
        <txid>613</txid>
    </NameSection>

    <ErasureCodingSection>
         <!--一些未启用的纠删码策略-->
    </ErasureCodingSection>

    <INodeSection>
        <!--文件与文件夹的元数据-->
        <lastInodeId>16509</lastInodeId>
        <numInodes>61</numInodes>

        <inode>
            <id>16386</id>
            <type>DIRECTORY</type>
            <name>wcinput</name>
            <mtime>1694187482432</mtime>
            <permission>rc:supergroup:0755</permission>
            <nsquota>-1</nsquota>
            <dsquota>-1</dsquota>
        </inode>

        <!--inode-->
    </INodeSection>

    <INodeReferenceSection></INodeReferenceSection>

    <SnapshotSection>
        <snapshotCounter>0</snapshotCounter>
        <numSnapshots>0</numSnapshots>
    </SnapshotSection>

    <INodeDirectorySection>
        <!--文件夹与文件的层次关系-->
        <directory>
            <parent>16385</parent>
            <child>16458</child>
            <child>16505</child>
            <child>16387</child>
            <child>16386</child>
            <child>16439</child>
        </directory>

        <!--directory-->
    </INodeDirectorySection>

    <FileUnderConstructionSection></FileUnderConstructionSection>

    <SecretManagerSection>
        <currentId>0</currentId>
        <tokenSequenceNumber>0</tokenSequenceNumber>
        <numDelegationKeys>0</numDelegationKeys>
        <numTokens>0</numTokens>
    </SecretManagerSection>

    <CacheManagerSection>
        <nextDirectiveId>1</nextDirectiveId>
        <numDirectives>0</numDirectives>
        <numPools>0</numPools>
    </CacheManagerSection>
</fsimage>
```
