---

publish: true

draft: false

---
# 1.Storage
在这门课中，我们关注的是一种「面向磁盘」的 DBMS 架构，假设数据库的主要存储位置在非易失性磁盘（non-volatile disk）上。
> [!INFO] info
>- **CPU**：执行计算与指令的核心部件，速度极快但几乎不用于存储数据。
>- **Memory（内存）**：CPU直接访问的工作区，支持快速随机访问但断电会丢失数据。
>- **SSD**：基于闪存的非易失性存储设备，速度较快且无机械结构。
>- **HDD**：传统机械硬盘，依赖物理旋转读写，速度较慢但容量大且成本低）。

![](https://cdn.jsdelivr.net/gh/xjn2005/my-blog-images/img/20260521134307326.png)

在存储层次结构中，最接近CPU的设备通常是最快的，但也是最小且最贵的。随着距离CPU越来越远，存储设备的容量变大，但速度会变慢，且每GB的成本也会下降。
## 1.1易失性设备（Volatile Devices）
Volatile 意味着设备在断电后不会保留其数据。因此，存储在这些设备上的数据会丢失。
• 易失性存储设备支持按字节地址进行快速随机访问，意味着程序可以直接跳转到某个字节地址并读取数据（例如：DRAM）。
• 在本课程中，我们将这类设备统称为「内存」。
## 1.2非易失性设备（Non-Volatile Devices）
Non-volatile 设备能够在机器关闭或断电后依然保留数据。
• 非易失性设备是按块或页面进行寻址的。也就是说，程序在读取某个特定偏移量（byte）的数据时，需要先将包含该数据的4KB页面加载到内存中。
• 非易失性存储设备通常在顺序访问性能上表现更好（读取连续的数据块），这是因为硬盘和SSD等设备的架构更适合顺序读取。
在本课程中，我们将其统称为「磁盘」。我们**不会**对固态硬盘（SSD）和传统机械硬盘（HDD）做出显著区分。
# 2.Disk-Oriented DBMS Overview
数据库存储在磁盘（disk）上，数据以页（pages）为单位组织，其中第一页通常是目录页（directory page）。
为了操作数据，DBMS 必须先将数据加载到内存（memory）中。
DBMS 通过**缓冲池（buffer pool）** 管理磁盘与内存之间的数据移动。
- 执行引擎（execution engine）负责执行 queries
- 执行引擎向 buffer pool 请求所需的 page
- buffer pool：
	-  将 page 从 disk 加载到 memory
	- 返回该 page 在内存中的 pointer
- 缓冲池管理器（buffer pool manager）保证：
	- 在执行期间，该 page 始终驻留在内存中

![](https://cdn.jsdelivr.net/gh/xjn2005/my-blog-images/img/20260708095855220.png)
# 3.DBMS vs. OS

DBMS 的设计目标之一是支持**超过内存容量的数据（data > memory）**。
由于磁盘 I/O 成本高，需要避免因磁盘访问导致系统阻塞（stall）
因此希望在等待磁盘数据时，仍能继续执行其他查询。
该设计类似于**虚拟内存（virtual memory）**：
- 提供大的地址空间（address space）
- 由 OS 在 disk 与 memory 之间调度 page

一种实现方式是使用 **mmap（memory mapping）**：
- 将文件映射到进程地址空间
- 由 OS 负责 page 在 disk 与 memory 之间的移动
>[!Question] 问题：
> 当发生 **page fault** 时，进程会被阻塞（blocked）

因此，写 DBMS 时通常不应依赖 `mmap` 管理数据库文件。原因不只是性能，还是正确性：DBMS 希望自己决定何时读取、写回、刷盘和控制并发，而不是把这些关键行为交给 OS 的通用策略。
DBMS 更了解：
- 数据访问模式（access pattern）
- 查询执行情况（queries）
OS 采用通用策略，无法针对数据库优化（The operating system is not your friend）
我们更可能这样使用 OS：
- madvise：提示访问模式
- mlock：防止内存被换出（swap）
- msync：将内存数据刷回磁盘
出于正确性和性能的考虑，我们不建议在 DBMS 中使用 `mmap`。
尽管该系统具有一些看似操作系统可以提供的功能，但让 DBMS 自行实现这些过程可以带来更好的控制和性能。
# 4.File Storage
最基本的 DBMS 将数据库以文件的形式存储在磁盘上。有些 DBMS 使用文件层级结构，有些则使用单个文件（例如 SQLite）。
操作系统对这些文件的内容一无所知。只有 DBMS 才知道如何解读它们的内容，因为这些文件是以 DBMS 特有的方式编码的。
DBMS 的存储管理器负责管理数据库的文件。它将文件表示为页面的集合。它还跟踪页面中已读取和写入的数据，以及这些页面中的可用空间。
# 5.Database Pages
DBMS 将数据库组织为一个或多个文件，并以**固定大小的数据块（fixed-size blocks）** 进行管理，这些块称为 pages。
- 一个 page 可以包含不同类型的数据（tuples、indexes 等）
- 大多数系统**不会在同一个 page 中混合不同类型的数据**
- 一些系统要求 page 是**自包含（self-contained）** 的：
    - 即读取一个 page 所需的全部信息都在该 page 内
每个 page 都有唯一标识：Page ID
若数据库是单文件：page ID 可以是文件偏移（file offset）
- page ID 的唯一性可能作用范围：
    - DBMS 实例级
    - 数据库级
    - 表级
大多数 DBMS 使用 indirection layer。将 page 映射到 file path 和 file offset。
而上层系统是只会请求 page number，然后由 storage manager 解析为具体位置。

大多数 DBMS 使用**固定大小 page**，以避免支持可变大小 page 带来的复杂性：
- 固定大小 page 的好处是定位简单：给定 page ID 后，可以更容易计算或查表得到它在文件中的位置
- 删除 page 可能导致文件出现「空洞」（hole）
- 难以重新利用
DBMS 中存在三种 Page 概念：
1. 硬件页（hardware page）：通常 4KB
2. 操作系统页（OS page）：通常 4KB
3. 数据库页（database page）：1–16KB
面向只读（read-only）场景的系统，通常使用更大的 page。

存储设备保证对硬件页大小的写入操作具有原子性。如果硬件页大小为 4 KB，而系统尝试向磁盘写入 4 KB 的数据，那么要么全部写入，要么一个也不写入。这意味着，如果数据库页大于硬件页，数据库管理系统 (DBMS) 就必须采取额外的措施来确保数据安全写入，因为程序可能在系统崩溃时正在将数据库页写入磁盘。

# 6.Database Heap
DBMS 在磁盘上定位所需 page 有多种方式，其中一种是 heap file（堆文件）。
heap file 指的是一种 **无序（unordered）** 的 page 集合，其中 tuples 以随机顺序存储。

给定一个 page_id，DBMS 可以通过两种方式在磁盘上定位该 page：使用 page 的链表（linked list），或者使用页目录（page directory）。
在 linked list 方案中，系统维护一个 header page，其中包含两类指针：
- 指向空闲页（free pages），
- 指向数据页（data pages）。
当 DBMS 需要查找某个特定 page 时，必须沿着数据页链表进行顺序扫描（sequential scan），直到找到目标 page。

在 page directory 方案中，DBMS 维护一类特殊的 page，称为 page directory，用于记录数据页的位置（location）、每个 page 的空闲空间（free space）、空闲页列表（free/empty pages）以及 page 的类型（page type）。这些目录页中，每个数据库对象（database object）都有对应的一条记录（entry）。

# 7.Page Layout
每一个 page 都包含一个 header，用于记录该 page 的元数据（meta-data）。这些信息通常包括 ：
- page size
- checksum
- DBMS version
- transaction visibility

以及是否要求 self-containment（某些系统如 Oracle 会要求）。
一种最直观的数据组织方式是：记录当前 page 中存储了多少 tuples，并在每次插入新 tuple 时，将其追加到 page 的末尾。然而，这种方式在 tuples 被删除或存在变长属性（variable-length attributes）时会出现问题。
因此，DBMS 通常采用两种主要的 page layout 方式：
- slotted pages 
- log-structured。
在 **slotted pages** 结构中，page 内部维护一个 slot 到 offset 的映射关系，这是当前 DBMS 中最常见的实现方式。page header 会记录已使用 slot 的数量、最后一个已使用 slot 的起始位置，以及一个 slot array，该数组用于记录每个 tuple 起始位置的偏移量。

Slotted page 的核心好处是把「tuple 的逻辑位置」和「tuple 在 page 内的物理位置」分开。上层通过 slot 找 tuple，即使 tuple 在 page 内移动，也只需要更新 slot array。

在插入新 tuple 时，slot array 从 page 的开头向后增长，而 tuple 数据则从 page 的末尾向前增长。当 slot array 与 tuple 数据区域相遇时，page 被认为已满。
# 8. Tuple Layout
A tuple 本质上是一个字节序列（这些字节不一定是 contiguous 的）。DBMS 的工作就是将这些字节解释为 attribute types 和 values。

例如表 `user(id INT, name VARCHAR)` 的一条记录，在磁盘上不是以对象形式保存，而是一串字节。DBMS 根据 schema 才知道前 4 个字节是 `id`，后面的变长区域是 `name`。

## 8.1 Tuple Header

包含关于 tuple 的 meta-data。
- 用于 DBMS concurrency control protocol 的 visibility information（即：哪个 transaction 创建 / 修改了该 tuple 的信息，课程后面会讲）。
- 用于 NULL values 的 Bit Map。
- 注意：DBMS 不需要在这里存储关于 database schema 的 meta-data。
## 8.2 Tuple Data
实际的 attribute data。
- Attributes 通常按照你创建 table 时指定的顺序存储。
- 大多数 DBMS 不允许一个 tuple 超过一个 page 的大小。
## 8.3 Unique Identifier
- 数据库中的每个 tuple 都会被分配一个 unique identifier。
- 最常见的形式：`page id + (offset or slot)`。
- Application 不应该依赖这些 ids。
## 8.4 Denormalized Tuple Data
如果两个 tables 之间存在关联，DBMS 可以提前将它们 “pre-join”，使它们最终位于同一个 page 上。这样读取会更快，因为 DBMS 只需要加载一个 page，而不是两个 separate pages。
不过，这也会让 updates 更昂贵，因为 DBMS 需要为每个 tuple 分配更多空间。
![](https://cdn.jsdelivr.net/gh/xjn2005/my-blog-images/img/20260713163851757.png)
