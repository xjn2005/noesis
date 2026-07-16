---

publish: true

draft: false

---
## 1.1 布尔代数
布尔代数处理布尔值（e.g. 0/1、true/false、yes/no、on/off）。<u>在这门课程里我们统一使用 1 or 0</u>。布尔函数（Boolean function）输入输出均为布尔值，描述方式包括：
- 真值表（truth Table Representation）：枚举函数所有可能的输入变量组合，然后写出每一种组合所对应的函数输出值。

 ![布尔函数真值表表示](https://cdn.jsdelivr.net/gh/xjn2005/my-blog-images/img/20260518201817040.png)
- 布尔表达式（Boolean Expressions）：使用布尔算子（e.g. And、Or、Not）描述。为了方便表示，我们规定：
	- $x \cdot y(或者 \ xy) \coloneqq x \ And \ y$
	-  $x + y \coloneqq x \ Or \ y$
	-  $\bar{x} \coloneqq Not \ x$
从而我们认为真值表中的$f(x,y,z)$ 可以被表示为 $(x+y)\cdot \bar{z}$。
- 规范表示法（Canonical Representation）：每个布尔函数至少拥有的一种布尔表达式描述方式。它从**真值表**出发，按以下步骤构造：
	1. 找出真值表中函数值为1的所有行。
	2. 对每一行构造一个乘积项：
	    - 将该行中每个输入变量表示为**原变量**（若该变量在该行为1）或**反变量**（若该变量在该行为0）
	    - 将这些文字量用 And（$\cdot$） 连接起来，得到一个**仅在当前行输出为1**的表达式。
	3. 将所有这样的乘积项用 Or（$+$） 连接起来，所得的表达式即与原始真值表完全等价。
*Example*：
- $\bar{x}y\bar{z}$ （对应 `(0,1,0)`）
- $x\bar{y}\bar{z}$ （对应 `(1,0,0)`）
- $xy\bar{z}$ （对应 `(1,1,0)`

2-输入变量的布尔函数（Two-Input Boolean Functions）：对于 $n$ 个二进制变量能够构成的布尔函数的数量为$2^{2^n}$。
*Example*：$x,y$只能取值为$0,1$。那么组合结果有$2^2=4$种。我们对于${x,y}$定义一种运算，则有$f(x,y)$。那么根据这个运算，我们对于$x,y$值的每种组合结果都产生两个输出$0或者1$。详情如图所示：

![2-输入变量布尔函数真值表](https://cdn.jsdelivr.net/gh/xjn2005/my-blog-images/img/20260518211114325.png)

>[!Note] NAND 与 NOR 的完备性
>NAND 与 NOR 函数有一个非常重要的性质：仅使用 NAND（或仅使用 NOR），就可以构造出所有布尔函数。
>因此理论上来说，只要在物理世界实现了一种 NAND 门，就能够构建整个计算机。

## 1.2 门逻辑
门（gate）是用来实现布尔函数的物理设备。如果布尔函数 $f$ 有 $n$ 个输入变量，返回 $m$ 个二进制的结果，那么对应的门就具有：$n$ 个输入管脚（input pins）和 $m$ 个输出管脚（output pins）。当我们输入$v_1,\dots v_n$，内部的门逻辑就会计算并输出$f(v_1,\dots,v_n)$的值。
最简单的门是由微小的电子开关，即**晶体管**（transistors）构成，这些晶体管依照拓扑结构连接，来实现整个门的功能。
我们并不关心原始的门的内部实现，我们可以将其看作黑箱。我们运用黑箱来实现逻辑操作。
以下是基本逻辑门的标准符号表示：
![基本logic gate的标准符号表示](https://cdn.jsdelivr.net/gh/xjn2005/my-blog-images/img/20260518220048636.png)
那么实际上门的结构大抵如此：
![门的实现](https://cdn.jsdelivr.net/gh/xjn2005/my-blog-images/img/20260518221031724.png)
### 1.2.1 简单门与复合门（Primitive and Composite Gates）
所有逻辑门都具有统一的输入与输出语义，即输入和输出都由二进制值 (0) 与 (1) 构成。由于这些门具有统一的接口，因此它们可以相互连接，进一步构建出功能更加复杂的门电路，这类门称为复合门（composite gates）。

逻辑设计（logic design）的核心思想，就是通过连接多个基础逻辑门，构建功能更复杂的复合门电路。复合门本身仍然是某种布尔函数的实现，只不过其内部结构往往比基础门更加复杂。
对于任何一个门电路，都可以从两个角度进行观察：
- 外部接口（interface）
- 内部实现（implementation）
外部接口描述的是门的输入与输出管脚，即它「对外表现为什么」。而内部实现则描述该门具体由哪些基础门连接而成。

对于大多数使用者而言，只需要关心门的外部接口即可，而不必了解其内部实现细节。这种思想本质上是一种抽象（abstraction）思想。

*Example*：我们可以用$Or(And(a,Not(b)),And(Not(a),b))$表示出$Xor(a,b)$
这说明：复杂逻辑函数可以由多个基础逻辑门组合得到
>[!Note] Note
>门的接口是唯一的，而内部实现方式可以有很多种。

同一个逻辑门，既可以通过真值表定义，也可以通过布尔表达式定义，还可以通过不同的门电路结构实现。
虽然逻辑设计的基本功能可以通过多种方式来实现其外部接口，但是基本原则是**使用尽可能少的门来实现尽可能多的功能**。
## 1.3 实际硬件结构
在了解了由简单门组成复杂门结构的逻辑之后，开始需要进一步讨论这些门是如何被实际构建出来的。自然的推论是，既然复杂门能够由多个简单门按照特定逻辑连接而成，那么已经构造完成的门，自然能够继续作为新的基础模块参与更复杂电路的构建。
*Example*：我们之前讨论了$Xor$门的构建，那么根据我们得到的表达式：$Or(And(a,Not(b)),And(Not(a),b))$，可以发现，一个 Xor 门能够由：
- 两个 And 门
- 两个 Not 门
- 一个 Or 门
组合实现。
因此，在物理实现中，只需要按照该逻辑结构，将这些基础门放置在电路板上，并通过导线正确连接它们的输入与输出，即可形成完整的 Xor 电路。
当整个电路连接完成之后，通常会将其封装为一个新的芯片模块。封装后的电路只保留输入与输出管脚暴露在外，而内部的连接结构则被隐藏。
这样一来，这个新的 Xor 门就能够像最初的 And、Or、Not 门一样，被继续作为基础模块使用，用于构建更加复杂的电路。
这种设计方式体现了计算机系统中的层次化设计（hierarchical design）思想。

得益于这种实现方式，对于门电路的使用者而言，通常并不需要了解门内部究竟由哪些电路组成，而只需要关心：
- 输入是什么
- 输出会得到什么结果
这也是为什么一个复杂门可以当成「黑箱」使用的原因。
## 1.4 硬件描述语言（HDL）
现代硬件设计已经无需物理制造，而是通过HDL（Hardware Description Language）编写芯片结构，配合硬件仿真器虚拟测试，验证正确后再流片生产。

>[!INFO] info
>在本课程中，我们提到的芯片和门的概念可以交换使用。

我们通过 Xor 门的 HDL 实现，来看一看HDL程序的两大组成部分：
- Header：
	- 定义芯片的接口（interface）
	- 定义输入/输出管脚的名称
- Parts：描述芯片的子芯片及其连接关系。
*Example*：Xor 门的HDL实现：
```hdl
// 接口声明
CHIP Xor {
    IN a, b;
    OUT out;

    // 内部实现
    PARTS:
    Not(in=a, out=nota);//把 a 作为输入管脚，nota 作为输出管脚
    Not(in=b, out=notb);
    And(a=a, b=notb, out=w1);
    And(a=nota, b=b, out=w2);
    Or(a=w1, b=w2, out=out);
}
```
具体结构如图所示：
![Xor 结构图](https://cdn.jsdelivr.net/gh/xjn2005/my-blog-images/img/20260519201613515.png)
完整的程序如图所示：
![](https://cdn.jsdelivr.net/gh/xjn2005/my-blog-images/img/20260519202150481.png)
## 2.1 Nand 门
从之前的论述我们可以知道，Nand门是门逻辑里面最为基础的门。所有其他的门电路和芯片能够通过它来构建，它可以用于实现如下布尔函数：
![](https://cdn.jsdelivr.net/gh/xjn2005/my-blog-images/img/20260519203037344.png)
我们可以用一种称为「芯片 API」的方式来描述门逻辑：

| 芯片名 | Nand                               |
| --- | ---------------------------------- |
| 输入  | a，b                                |
| 输出  | out                                |
| 功能  | if a=b=1 then out = 0 else out = 1 |
## 2.2 基本逻辑门
### 2.2.1 Not 门
单输入变量的 Not 门，称为「反相器（converter）」。

| 芯片名 | Not                                 |
| --- | ----------------------------------- |
| 输入  | in                                  |
| 输出  | out                                 |
| 功能  | if in = 0 then out = 1 else out = 0 |
### 2.2.2 And 门
只有当输入都是 1 时，And 函数输出 1，否则输出 0。

| 芯片名 | And                                |
| --- | ---------------------------------- |
| 输入  | a，b                                |
| 输出  | out                                |
| 功能  | if a=b=1 then out = 1 else out = 0 |
### 2.2.3 Or 门
只要输入变量中有 1，Or 函数输出 1，否则输出 0。

| 芯片名 | And                                |
| --- | ---------------------------------- |
| 输入  | a，b                                |
| 输出  | out                                |
| 功能  | if a=b=0 then out = 0 else out = 1 |
### 2.2.4 Xor 门
异或门，当两个输入值相反时，Xor 函数输出 1，其他情况返回0。

| 芯片名 | Xor                               |
| --- | --------------------------------- |
| 输入  | a，b                               |
| 输出  | out                               |
| 功能  | if a=/b then out = 1 else out = 0 |
### 2.2.5 Multiplexor 
Multiplexor 是三输入变量的门电路，其中一个输入称为「选择位」，选择另外两个输入变量（称为「数据位」）中的一个作为输出。
![](https://cdn.jsdelivr.net/gh/xjn2005/my-blog-images/img/20260519205039661.png)

| 芯片名 | Mux                                  |
| --- | ------------------------------------ |
| 输入  | a，b，sel                              |
| 输出  | out                                  |
| 功能  | if sel = 0 then out = a else out = b |
### 2.2.6 Demultiplexor

![](https://cdn.jsdelivr.net/gh/xjn2005/my-blog-images/img/20260519205623955.png)

| 芯片名 | Mux                                                |
| --- | -------------------------------------------------- |
| 输入  | in，sel                                             |
| 输出  | a，b                                                |
| 功能  | if sel = 0 then (a = in,b = 0) else (a = 0,b = in) |
## 2.3 多位基本门
多位基本门是将基本的1位逻辑门（如Not、And、Or、Mux）扩展为可同时处理多位宽数据总线的版本。在计算机中，数据常以多比特位（如16位、32位）为单位进行传输和运算，因此需要能够对整条总线进行逐位（bit‑wise）并行操作的硬件模块。
### 2.3.1 多位 Not(Multi-Bit Not)
n 位的Not门所执行的操作是：对它的 n 位输入总线上的每一位取反。

| 芯片名 | Not16                               |
| --- | ----------------------------------- |
| 输入  | in[16] // 16-bit 管脚                 |
| 输出  | out[16]                             |
| 功能  | For i = 0 .. 15 out[i] = Not(in[i]) |
### 2.3.2 多位 And(Multi-Bit And)
n 位的 And 门所执行的操作是：对两个 n 位输入总线上对应的每一对输入变量进行「与操作」，然后输出。

| 芯片名 | And16                                   |
| --- | --------------------------------------- |
| 输入  | a[16]，b[16]                             |
| 输出  | out[16]                                 |
| 功能  | For i = 0 .. 15 out[i] = And(a[i],b[i]) |
### 2.3.3 多位 Or(Multi-Bit Or)
n 位的 Or 门所执行的操作是：对两个 n 位输入总线上对应的每一对输入变量进行「或操作」，然后输出。

| 芯片名 | Or16                                   |
| --- | -------------------------------------- |
| 输入  | a[16]，b[16]                            |
| 输出  | out[16]                                |
| 功能  | For i = 0 .. 15 out[i] = Or(a[i],b[i]) |
### 2.3.4 多位 Multiplexor(Multi-Bit Multiplexor)
n 位的 Multiplexor 门和二进制Multiplexor 门几乎一样，只是原来1 bit 位的输入变量变成了两个 n 位的输入变量，选择位仍然是 1 位。

| 芯片名 | Mux16                                                                            |
| --- | -------------------------------------------------------------------------------- |
| 输入  | a[16]，b[16]，sel                                                                  |
| 输出  | out[16]                                                                          |
| 功能  | if sel = 0 then for i = 0 .. 15 out[i] = a[i] else for i = 0 .. 15 out[i] = b[i] |
## 2.4 多通道逻辑门
很多 2 位（即接收两个输入）的逻辑门能够推广到多位（即接收任意数量的输入）。
### 2.4.1 多通道 Or(Multi-Way Or)
对于一个 n 位的 Or门，当 n位输入变量中任意一位或一位以上为1，输出就为1，否则就为0。
*Example*：n = 8

| 芯片名 | Or8way                              |
| --- | ----------------------------------- |
| 输入  | in[8]                               |
| 输出  | out                                 |
| 功能  | out = Or(in[0],in[1]$,\dots,$in[7]) |
### 2.4.2 多通道 Multiplexor(Multi-Way Multiplexor)
一个拥有 m 个通道、每个通道数据宽度为 n 位的 multiplexor 选择器，将 m 个 n 位输入变量中选择一个并从其单一的 n 位输出总线上输出。我们用 k 个控制位来指定这个选择，这里的$k = \log_2 m$。
*Example*：m = 4，n = 16
![](https://cdn.jsdelivr.net/gh/xjn2005/my-blog-images/img/20260519220429652.png)

| 芯片名 | Mux4Way16                                                                                          |
| --- | -------------------------------------------------------------------------------------------------- |
| 输入  | a[16]，b[16]，c[16]，d[16]，sel[2]                                                                     |
| 输出  | out[16]                                                                                            |
| 功能  | If sel=00 then out=a else if sel=01 then out=b else if sel=10 then out=c else if sel=11 then out=d |
### 2.4.3 多通道 Demultiplexor(Multi-Way Demultiplexor)
一个拥有 m 个通道、每个通道数据宽度为 n 位的 Demultiplexor，会从 m 个可能的 n 位输出通道中选择输出一个 n 位的输入变量。我们用 k 个控制位来指定这个选择，这里的$k = \log_2 m$。
![](https://cdn.jsdelivr.net/gh/xjn2005/my-blog-images/img/20260519221311305.png)

| 芯片名 | DMux4Way16                                                                                                                                          |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 输入  | in，sel[2]                                                                                                                                           |
| 输出  | a，b，c，d                                                                                                                                             |
| 功能  | If sel=00 then {a=in, b=c=d=0}<br>else if sel=01 then {b=in, a=c=d=0}<br>else if sel=10 then {c=in, a=b=d=0}<br>else if sel=11 then {d=in, a=b=c=0} |
## 3.1 实现
因为每一个提到的门类在 Project 1中都会实现到，因此我在这里就简单介绍一下如何使用Nand门来实现Not门和And门。
### 3.1.1 实现Not门
```hdl
CHIP Not {

    IN in;

    OUT out;


    PARTS:

    //// Replace this comment with your code.

    Nand(a=in, b=in, out=out); 

}
```
### 3.1.2 实现 And 门
```hdl
CHIP And {

    IN a, b;

    OUT out;

    PARTS:

    //// Replace this comment with your code.

    Nand(a=a, b=b, out=nandOut);

    Nand(a=nandOut,b=nandOut,out=out);

}
```
