---
publish: true
draft: true
---
## 1. C++的新特性

### 1.0 输入输出

- C++ 可以使用输入输出流 `(std::cin, std::cout)` 进行输出，比如 `std::cout << "Hello World";` 需要包含 **头文件** `#include <iostream>`
- 文件的输入输出, 使用ofstream和ifstream
```cpp
#include <fstream>
#include <iostream>
#include <string>

int main() {
  std::string str = "Hello World!";
  std::ofstream fout("out.txt");
  fout << str << std::endl;

  std::ifstream fin("out.txt");
  std::string str1;
  std::string str2;
  fin >> str1 >> str2;
  return 0;
}
```

### 1.1 变量和动态内存分配

- C++中的变量类型
- global variable 全局变量，存储在 **全局变量区**
	- 可以在不同的cpp文件之间共享，可以使用关键字 `extern` 来使用别的cpp文件中的全局变量
- static global variable **静态全局变量** ，不能在cpp文件之间共享
- local variable 存储在 **栈** 区上
- static local variable 静态局部变量
	- 存储在全局变量区
		- 在初次使用的时候初始化，keeps its value between visit to the function
- allocated variable 动态分配的变量
	- 存储在内存的堆结构中
```cpp
std::string s = "hello";
std::string* ps = &s;
(*ps).length();
ps->length();
```
- C++动态内存分配
- new用于动态分配内存给变量，如 `new int` ， `new double[1000]`
	- 与malloc的区别： **malloc不执行类的构造函数** ，而new出新的对象的时候会执行对象的构造函数 `new Class_Name[x]` 会执行x次Class\_Name的构造函数
		- **内存泄漏** Memory Leak
	```cpp
	// Bad: 第二次赋值会丢失第一块动态内存的地址，造成内存泄漏。
	int* leaked = new int;
	*leaked = 123;
	leaked = new int;
	delete leaked;  // 只能释放第二块内存，第一块已经找不到了。

	// Good: 覆盖指针前，先释放原来管理的动态内存。
	int* p = new int;
	*p = 123;
	delete p;
	p = new int;
	delete p;
	```
	- 上面反例中一开始为指针 leaked 分配了一段内存空间并赋值了 123，但是第三行代码又为 leaked 赋值了一段新的内存空间，原来的内存空间已经没有指针指向，因此 **不能访问，也不能删除**，造成了内存泄漏
- delete用于删除动态分配的内存
	- 用法 `delete p;` `delete[] p;`
		- 和 new 类似，delete 会执行所删除对象的析构函数，不能 delete 没有通过 new 得到的对象，同一块动态内存不能 delete 两次
		- 两个指针p1,p2指向同一个数据，如果p1被delete了，p2也不能访问原本p1指向的变量的值，因为delete删除的是内存里的数据
	```cpp
	// Bad: p1 和 p2 指向同一块动态内存。
	int* p1 = new int;
	int* p2 = p1;
	*p2 = 1;
	delete p1;
	// std::cout << *p2 << std::endl;  // Bad: p2 已经变成悬垂指针。

	// Good: delete 后立刻把不再有效的指针置空。
	p1 = nullptr;
	p2 = nullptr;
	```
	- 指向同一个数据的两个指针实际上只是两个不同的变量名而已，delete删除的不是变量名而是数据

### 1.2 引用（Reference）

- a new type in C++， 相当于给变量取了一个别名，使用方法为 `type &refname = name;` 引用的对象 **不能** 是表达式
- 引用和指针的区别
- 不能定义 **空引用** ，引用必须连接到一块合法的内存
- 一旦引用被初始化为一个对象 **就不能更改**
- 引用在创建的时候必须要 **初始化**
```cpp
int* f(int* x) {
  (*x)++;
  return x;
}

int& g(int& x) {
  x++;
  return x;
}

int x;
int& h() {
  return x;
}

int main() {
  int a = 0;
  f(&a);
  g(a);
  h() = 16;  // 这里全局变量 x 被赋值为 16
}
```

### 1.3 const类型

- 用于定义常量类型，如 `const int x=12345;`, const类型的变量在初始化之后就不能改变其值，const型变量不能在连接单元外使用
- Run-time constants 运行时常量
- 数组的定义时的长度值必须在 **编译期** 就已知，所以宏定义中的常数可以作为数组长度，而 `int n; int a[n]` 这样的语法不是标准 C++17。某些编译器可能把它作为扩展放行，但不应依赖。
```cpp
const int size = 100;
int a[size];  // OK

int x;
std::cin >> x;
const int runtime_size = x;
// int b[runtime_size];  // Error: runtime_size 不是编译期常量。
```
- const和指针pointer
- 常量指针： `char s[] = "abc"; char * const p = s;` **不能赋予这个指针新的地址**，相当于地址是 const 类型，但是 p 指向的值可以改变
- `const char* p = "abc";` 这种情况下p指向的是一个const char类型的值，因此 **指向的值不能改变** ，而指针指向的对象可以改变
```cpp
// 第一种情况是 q 是一个 const 指针，但是 q 指向的东西可以变
char s[] = "abc";
char* const q = s;
*q = 'c';  // OK
// q++;    // Error: q 本身是 const 指针。

// 第二种情况下，(*q) 是一个 const 的值，此时 q 所指向的值不能变
const char* p = "abc";
// *p = 'c';  // Error: p 指向 const char。

// 区别这三种东西
std::string name = "zyc";
std::string other = "xjn";

const std::string* pointer_to_const = &name;  // 不能通过指针修改字符串内容。
pointer_to_const = &other;                    // OK: 指针本身可以改指向。

std::string const* also_pointer_to_const = &name;  // 和上一行含义相同。

std::string* const const_pointer = &name;  // 指针本身不能改指向。
*const_pointer = "gzy";                    // OK: 可以修改指向的字符串内容。
```
- 不能将const类型的变量赋值给对应的指针，因为可能会带来const变量的改变，这是const类型的变量不允许的
- 可以把非const类型的值赋给对应的const型变量，函数中可以将参数设置为const类型表明这些参数在函数中不能被修改原本的值，也可以将返回值类型设置为const表示返回值不能被修改
```cpp
#include <iostream>

struct Student {
  int id;
};

void foo(const Student* ps) {
  // *ps could not be changed in the function.
  std::cout << ps->id << std::endl;
  std::cout << (*ps).id << std::endl;
}

void bar(const Student& s) {
  // s could not be changed in the function.
  std::cout << s.id << std::endl;
}

int main() {
  Student s;
  s.id = 2;
  foo(&s);
  return 0;
}
```
- `char * s="Hello World!";`实质上是 `const char *` 类型，不要去修改s中的内容，这是一种 **未定义的行为** (undefined behavior)，应该写成 `char s[]="Hello World!";`
```cpp
#include <iostream>

int main() {
  const char* s1 = "Hello World";
  const char* s2 = "Hello World";

  std::cout << static_cast<const void*>(s1) << std::endl;
  std::cout << static_cast<const void*>(s2) << std::endl;
  // 输出的结果是 s1 和 s2 的地址，他们的结果是一样的。
  return 0;
}
```

## 2\. 类 class

### 2.0 类的基本概念

- C++中的对象=属性+操作 objects=attributes+operations，对于面向对象的编程而言，任何东西都是一个对象，任何对象都有对应的类型，程序就是一系列对象互相之间传递信息来完成功能
- C++的类包含成员变量和成员函数
- C++中class的定义，具体实现和调用可以分成三个文件
	- 头文件header是具体实现和调用之间的接口，每个类的定义需要用1个头文件
- `::`操作符可以用来访问类中的内容

### 2.1 构造函数和析构函数

- constructor 构造函数
- 构造函数的函数名和类的名字相同，可以传入一些参数用来初始化一个对象，在类的对象被定义的时候会自动调用构造函数
- default constructor 默认构造函数，不需要参数也可以使用的构造函数
- 初始化列表：在函数签名后面，大括号之前直接对类中定义的变量进行赋值
	- const类型的成员变量初始化 **只能用初始化列表**
		- 构造函数的执行分为两个阶段：初始化阶段和函数执行阶段，会先执行初始化列表里的赋值，在进入函数主体进行对应的操作
- Destructor 析构函数
- 析构函数的函数名是类名前面加一个~，析构函数不需要参数，在类的生命周期结束的时候会 **被编译器自动调用**
- function overloading 函数重载：
- 函数名相同而参数的个数和类型不同的几个函数构成重载关系，一个类可以有多个不同的构造函数来解决不同情况下的构造
- default value：缺省值，可以在函数参数表中直接声明一些参数的值，但是必须要从右往左，当传入的参数缺省时函数默认将已经声明的值作为参数的值
- constant object常量对象
- 需要加const声明，在声明之后就不能改变这个对象内部变量的值
- 会有一些成员函数不能正常使用
- **在成员函数参数表后面加const可以成为const型成员函数，const类型的成员函数不能修改成员变量的值**
	- const声明写在函数的开头表示函数的返回值类型是const
		- const声明写在函数签名的末尾表示这个成员函数 **不能修改类中定义的成员变量** ，被称为 **常成员函数**
		- 但是如果是成员变量中有指针，并不能保证指针指向的内容不被修改
		- const类型的函数和非const类型的函数也可以构成重载关系，比如：
		```cpp
		class A {
		 public:
		  void foo() {
		    std::cout << "A::foo();" << std::endl;
		  }

		  void foo() const {
		    std::cout << "A::foo() const;" << std::endl;
		  }
		};

		int main() {
		  A a;
		  a.foo();  // 访问的是非 const 类型的 foo。

		  const A aa;
		  aa.foo();  // 访问的是 const 类型的 foo。
		  return 0;
		}
		```
		- const类型的成员函数的使用规则如下：
		- non-const成员函数不能调用const类型对象的成员变量，而const类型可以访问
				- const类型函数不会改变任何成员变量的值
				- 构成重载关系的时候，const类型的对象只能调用const类型的成员函数，不能调用non-const，而非const类型的对象 **优先调用non-const的成员函数** ，如果没有non-const再调用const类型的
- copy constructor 拷贝构造函数
- 用一个已有对象初始化一个新对象时会调用拷贝构造函数，一般的形式为 `class_name(const class_name& copy_class_var)`。已经存在的对象之间赋值时，调用的是拷贝赋值运算符。
- 如果定义变量时直接给变量用同类型的变量赋值，调用的就是拷贝构造函数，如果是定义之后再赋值，就是调用了重载之后的等号，比如下面这一段代码
	```cpp
	class A {
	 public:
	  A() {}
	  A(const A& a) {}
	  A& operator=(const A& a) {}
	};

	int main() {
	  A a;
	  A b = a;  // 调用拷贝构造函数。
	  A c;
	  c = a;  // 调用重载之后的等号。
	}
	```
	- C++ 中的拷贝：**浅拷贝** 和 **深拷贝**。浅拷贝通常指多个指针成员指向同一块动态内存；深拷贝会重新分配内存并复制内容。`std::string s1 = "zyc"; std::string s2(s1);` 会得到独立管理的字符串对象，不应当作裸指针浅拷贝示例。缺省拷贝构造函数和拷贝赋值运算符会逐成员拷贝；如果成员里有裸指针，才容易产生浅拷贝风险。拷贝构造函数在对象创建时调用，赋值运算符用于已经存在的对象。例如：
```cpp
#include <cstring>
#include <iostream>

struct Person {
  char* name;

  explicit Person(const char* s) {
    name = new char[std::strlen(s) + 1];
    std::strcpy(name, s);
  }

  // 深拷贝：为新对象分配自己的内存。
  Person(const Person& other) {
    name = new char[std::strlen(other.name) + 1];
    std::strcpy(name, other.name);
  }

  // 拷贝赋值：先处理自赋值，再释放旧资源，最后复制新内容。
  Person& operator=(const Person& other) {
    if (this == &other) {
      return *this;
    }

    char* new_name = new char[std::strlen(other.name) + 1];
    std::strcpy(new_name, other.name);
    delete[] name;
    name = new_name;
    return *this;
  }

  ~Person() {
    delete[] name;
  }
};

// C++17 中这里通常会发生拷贝消除，不适合用来观察拷贝构造次数。
Person bar(const char* s) {
  std::cout << "in bar()" << std::endl;
  return Person(s);
}

int main() {
  Person p1("Trump");
  Person p2 = p1;
  std::cout << p1.name << " at " << static_cast<void*>(p1.name) << std::endl;
  std::cout << p2.name << " at " << static_cast<void*>(p2.name) << std::endl;
  // 两个地址不同，说明 p2 拥有自己的字符数组。

  return 0;
}
```

### 2.2 static类型

- 类中的成员(变量和函数)分为两种
- 静态成员：在类内所有对象之间共享
- 实例成员：只能在某个具体的对象中调用
- **静态函数不能访问实例成员**
- 之前已经讲到了static类型的全局变量只在当前文件有效，不能通过extern跨文件调用，而函数中的static类型的变量在 **第一次调用** 的时候会被初始化，之后再调用该函数这个static类型的变量 **保持上一次函数调用结束时的值**
```cpp
#include <iostream>

class A {
 public:
  A() { std::cout << "A::A()" << std::endl; }
  ~A() { std::cout << "A::~A()" << std::endl; }
};

void f(int n) {
  if (n > 10) {
    static A a;
  }
  std::cout << "f()" << std::endl;
}

int main() {
  std::cout << "start" << std::endl;
  f(1);
  f(11);
  return 0;
}
// 此时只有在第二次调用时 a 才会被构造。
// 无论什么情况，A 的构造和析构函数只会被执行一次。
```
- 类中的static
- 类中定义的static类型的变量是 **静态成员变量** ，其值会在这个类的 **所有成员之间共享**
	- non-const类型的静态成员变量需要在类的外面进行定义，比如：
	```cpp
	#include <iostream>

	class A {
	 public:
	  static int count;

	  A() {
	    A::count++;
	  }
	};

	int A::count = 0;  // 在类的外部赋值的时候不需要说明 static，但是需要注明 A::，否则就是一个新的变量。

	int main() {
	  A array[3];
	  std::cout << A::count << std::endl;
	  // 输出 3：三个对象共享同一个静态成员变量 count。
	}
	```
	- C++17 起也可以使用 `inline static int count = 0;` 在类内完成定义和初始化。
	- const类型的静态成员变量作为类内共享的一个常量，也需要在类的外部进行定义，此时要写出关键字const，并且这个静态成员变量是不能被改变的
- 静态成员函数：
	- **可以访问类定义中的静态成员变量** ，但是 **不能直接访问普通的** 成员变量
		- 需要在函数定义之前加static关键字

### 2.3 Inline Function内联函数

- 需要在函数名前面加关键字 `inline`
- 内联函数在编译期会被编译器在调用处直接扩展为一个完整的函数，因此可以减少运行时调用函数的cost
- 内联函数的定义和函数主体部分都应该写在 **头文件** 中
- 本质是空间换时间
- 在 class 定义内部直接给出函数体的成员函数是 **隐式 inline** 的
- an inline function is expanded in place, like a preprocessormacro, so the overhead of the function call is eliminated,不需要函数调用产生的开销，由编译器 **直接优化** ，但是可能会使得需要编译的代码量增大(虽然写的人是看不出来的)，主要作用是减小函数调用时的开销，一般在函数比较小的时候才会使用

### 2.4 继承Inheritance

- composition 组合：把其他的类作为自己的成员变量
- Inheritance：从基类中继承生成派生类
- 派生类 **继承了基类的所有变量和成员函数**
- 派生类中 **不能直接访问** 基类的private的变量和成员函数，但是可以通过基类的成员函数来访问这些成员函数和变量
- 派生类的构造函数
	- 可以在派生类的构造函数中 **调用** 基类的构造函数
		- 派生类在被构造的时候会 **先调用基类的构造函数** ，再调用派生类的构造函数，析构的时候先调用派生类的析构函数，再调用基类的析构函数
		- 如果派生类没有定义构造函数，编译器会隐式生成派生类构造函数，并在其中先构造基类子对象
		- 如果派生类定义了构造函数，在执行之前会先调用基类的构造函数，如果派生类的构造函数中没有显式调用基类的构造函数，则会选择调用基类的无参构造函数
	```cpp
	class A {
	 public:
	  int i;

	  explicit A(int ii = 0) : i(ii) {
	    std::cout << "A(): " << i << std::endl;
	  }
	};

	class B : public A {
	 public:
	  int i;
	  A a;

	  explicit B(int ii = 0) : i(ii) {
	    std::cout << "B(): " << i << std::endl;
	  }
	};

	int main() {
	  B b(100);
	  return 0;
	}
	```
	- 当继承和组合两种情况同时出现时，先构造基类，再构造派生类中组合的其他类，再构造派生类，析构的时候类似
		- Base class is always constructed first
		- 就算组合的类在 **初始化列表或者构造函数中没有调用** 构造函数，C++编译器也会自动调用这个类默认的构造函数
		- 派生类中可以对基类函数进行重载，此时如果派生类对象调用对应的函数按照派生类中的同名函数执行
		- 仍然调用基类的方法 `object.Base::function()`
		- class和struct的区别：class中的变量和函数 **默认为private** ，struct中的函数默认为public
		- 访问控制
		- public：所有情况下可见
		- protected：可以被自己/派生类和友元函数访问
		- private：对于自己和友元函数可见
		- 继承的种类：public，private，protected继承，继承之后的基类变量的访问控制取原本类型和继承类型中较严格的
		- 可以通过 **强制类型转换** 把派生类的对象转化为基类的对象

### 2.5 友元 friend

- 友元函数
- 在类中声明一个全局函数或者其他类的成员函数为 `friend`
- 可以使这些函数拥有访问类内private和protected类型的变量和函数的权限
- 友元函数也可以是一个类，这种情况下被称为是友元类，整个类和所有的成员都是友元
- 友元函数本身不是那个类的成员函数，函数签名里不需要 `className::`来表示是这个类的成员函数，直接作为普通函数即可
```cpp
class A {
 public:
  explicit A(int value) : val(value) {
    std::cout << "A()" << std::endl;
  }

  friend void showValue(A a);

 private:
  int val;
};

void showValue(A a) {
  std::cout << a.val << std::endl;
}
```

### 2.6 多态和虚函数

- 多态 Polymorphism
- 同一段代码可以产生不同效果
- 对于继承体系中的某一系列同名函数，不同的类型会调用不用的函数
- 一般情况下，有继承关系的类之间有函数构成重载关系，依然会根据变量类型来调用对应的函数，比如：
	```cpp
	#include <iostream>

	class A {
	 public:
	  virtual void foo() {
	    std::cout << 1 << std::endl;
	  }
	};

	class B : public A {
	 public:
	  void foo() override {
	    std::cout << 2 << std::endl;
	  }
	};

	int main() {
	  A a;
	  B b;
	  a.foo();
	  b.foo();
	  return 0;
	}
	```
	- 此时运行的结果是1和2，即A型的变量的foo函数是基类中的，B类型的变量的foo函数是派生类中的
- 静态链接
- 函数的调用在程序开始运行之前就已经确定了
- 对于像下面这样的情况，基类的指针(引用)指向派生类，并且调用了基类中也存在的同名函数，最终调用的都是基类的同名函数
	```cpp
	class Shape {
	 public:
	  Shape(int a = 0, int b = 0) : width(a), height(b) {}

	  int area() {
	    std::cout << "Parent class area :" << std::endl;
	    return 0;
	  }

	 protected:
	  int width;
	  int height;
	};

	class Rectangle : public Shape {
	 public:
	  Rectangle(int a = 0, int b = 0) : Shape(a, b) {}

	  int area() {
	    std::cout << "Rectangle class area :" << std::endl;
	    return width * height;
	  }
	};

	class Triangle : public Shape {
	 public:
	  Triangle(int a = 0, int b = 0) : Shape(a, b) {}

	  int area() {
	    std::cout << "Triangle class area :" << std::endl;
	    return width * height / 2;
	  }
	};

	int main() {
	  Shape* shape;
	  Rectangle rec(10, 7);
	  Triangle tri(10, 5);
	  shape = &rec;
	  shape->area();
	  shape = &tri;
	  shape->area();
	  return 0;
	}
	```
- 虚函数 Virtual Function
- 一种用于 **实现多态** 的机制，核心理念是通过基类访问派生类定义的函数
	- 这种方式称为 **动态** 链接
		- 用于区分派生类中和基类同名的方法函数，需要将 **基类** 的成员函数类型声明为virtual
		- 如果会通过基类指针删除派生类对象，基类中的 **析构函数必须为虚函数**，否则会出现对象释放错误
		- 纯虚函数： `virtual int func() = 0;` 表明该函数没有主体，基类中没有给出有意义的实现方式，需要在派生类中进行扩展
- override 语法：派生类中可以用 override 关键字来声明，表示对基类虚函数的重写（override），不是重载（overload）
- 虚函数需要借助指针和引用达到多态的效果
	- 如果基类指针/引用 **指向基类** ，那就正常调用基类的相关成员函数
		- 如果基类指针 **指向派生类** ，则调用的时候会调用派生类的成员函数
		- 派生类指针 **不能** 指向基类
	```cpp
	class A {
	 public:
	  virtual ~A() = default;

	  virtual void foo() {
	    std::cout << "A" << std::endl;
	  }
	};

	class B : public A {
	 public:
	  void foo() override {
	    std::cout << "B" << std::endl;
	  }
	};

	int main() {
	  B b;
	  A* a = &b;
	  a->foo();  // 输出 B：通过基类指针调用派生类重写的虚函数。
	  return 0;
	}
	```
- 虚函数的实现方式： **虚函数表** virtual table
	- 每一个有虚函数的类都会有一个虚函数表，该类的任何对象中都存放着虚函数表的指针，虚函数表中 **列出了该类的虚函数地址**
		- 虚函数表是一个指针数组，里面存放了一系列虚函数的指针
		- 虚函数的调用需要经过虚函数表的查询，非虚函数的调用不需要经过虚函数表
		- 虚函数表在代码的编译阶段就完成了构造
		- 一个类只有一张虚函数表，每一个对象都有指向虚函数表的一个指针 `__vptr`
		- 多态的函数调用语句被编译成一系列根据基类指针所指向的对象存放的虚函数表的地址，在从虚函数表中查找地址调用对应的虚函数
		- 虚函数通常由编译器通过虚函数表等机制实现，但 `__vptr`、指针大小等属于具体实现细节，不是 C++17 标准保证
- 接口(C++抽象类)
- 描述了一个类应该有的功能和行为，但是不用在这个类中实现，而是在派生类中实现
- 可以使用纯虚函数来实现抽象类的定义，比如：
```cpp
class Shape {
 public:
  Shape(int a, int b) : length(a), width(b) {}
  virtual ~Shape() = default;

  virtual double getArea() = 0;

 protected:
  int length;
  int width;
};

class Rectangle : public Shape {
 public:
  Rectangle(int a, int b) : Shape(a, b) {}

  double getArea() override {
    return length * width;
  }
};

class Triangle : public Shape {
 public:
  Triangle(int a, int b) : Shape(a, b) {}

  double getArea() override {
    return length * width / 2;
  }
};

int main() {
  Rectangle rectangle(10, 7);
  Triangle triangle(10, 5);

  Shape* shape = &rectangle;
  std::cout << shape->getArea() << std::endl;  // 70

  shape = &triangle;
  std::cout << shape->getArea() << std::endl;  // 25
}
```

### 2.7 虚函数使用总结

- 情况1：基类和派生类都不是virtual
- 此时对于基类的对象和基类的指针，执行的就是基类的f，对于派生类的执行的就是派生类的f
```cpp
class A {
 public:
  void f() {
    std::cout << "af" << std::endl;
  }
};

class B : public A {
 public:
  void f() {
    std::cout << "bf" << std::endl;
  }
};

int main() {
  A a;
  B b;
  a.f();
  b.f();
  A* pb = &b;
  pb->f();
}
```
- 情况2：派生类中的同名函数是虚函数：无影响，和1一模一样
- 情况3：基类中的是虚函数，派生类中不注明是虚函数：此时派生类的对象和指向派生类的指针执行的都是派生类的函数f，基类的对象和指向基类对象的指针执行的都是基类的函数f
- 总结：
- virtual的虚函数关键字是 **向下负责** 的，派生类声明virtual对基类无任何影响
- 对于指针和引用而言
	- 不是虚函数的时候，调用的函数取决于指针和引用的变量类型(基类指针调用基类，派生类指针调用派生类)
		- 是虚函数的时候，调用函数取决于指针和引用指向的变量类型(指向基类调用基类，指向派生类调用派生类)
		- 当然如果派生类里没有新的同名函数，那么执行的都是基类里的
		- 要注意派生类指针不能直接指向基类的对象
		- 如果虚函数里还需要调用其他函数，调用的规则也和上面的一样，比如下面有个历年卷上面的神题：
- 历年卷上的一个题目：写出程序的输出
	```cpp
	class B {
	 public:
	  void f() {
	    std::cout << "bf" << std::endl;
	  }

	  virtual void vf() {
	    std::cout << "bvf" << std::endl;
	  }

	  void ff() {
	    vf();
	    f();
	  }

	  virtual void vff() {
	    vf();
	    f();
	  }
	};

	class D : public B {
	 public:
	  void f() {
	    std::cout << "df" << std::endl;
	  }

	  void ff() {
	    f();
	    vf();
	  }

	  void vf() override {
	    std::cout << "dvf" << std::endl;
	  }
	};

	int main() {
	  D d;
	  B* pb = &d;
	  pb->f();
	  pb->ff();
	  pb->vf();
	  pb->vff();
	}
	```
	- 这道题的分析过程如下：
		- 首先调用f，而f不是虚函数，所以根据指针类型调用了B中的f，输出bf
		- 再调用ff，因为ff也不是虚函数，所以调用B中的ff，B中的ff调用了vf和f，而vf是虚函数，B类型指针指向的是D，所以调用D中的vf，输出dvf，调用f则和上面一样输出bf
		- 再调用vf，由于vf是虚函数，所以要调用D中的vf，输出dvf
		- 再调用vff，虽然是虚函数但是D中没有定义同名函数，所以调用B中的vff，vff中调用vf和f，同2一样输出的是dvf和bf
		- 所以最终的输出是
	```cpp
	// bf
	// dvf
	// bf
	// dvf
	// dvf
	// bf
	```
	- 这道题涵盖了单继承虚函数的所有情况
- 基类虚函数的优先级高于派生类中的需要强制类型转换的同名函数
- 比如下面一段代码中
```cpp
class A {
 public:
  virtual void f(int i) {
    std::cout << 1 << std::endl;
  }
};

class B : public A {
 public:
  virtual void f(double i) {
    std::cout << 2 << std::endl;
  }
};

int main() {
  B b;
  A* pa = &b;
  pa->f(1);
  return 0;
}
```
- 这里输出的结果是1，事实上两个f并不构成虚函数的关系，因为f(1)中1是int类型，所以优先调用了对int匹配度高的
- 事实上如果是f(1.1)输出的结果仍然是1，并且CLion会提示参数需要类型转换
- 事实上两个f不构成虚函数的多态关系，所以调用哪个并不看指针指向的对象，而是看指针本身的类型！

### 2.8 强制类型转换

#### 2.8.1 static\_cast

- `static_cast` 用于数据类型的强制转换，有这样几种用法
- 基本数据类型的转换，比如char转换成int
- 在类的体系中把基类和派生类的指针和引用进行转换
	- 向上转换是安全的
		- 向下转换是不安全的
		- 只能在有相互联系的类型中进行相互转换，不一定包含虚函数
- 把空指针转换成目标类型的空指针
- 把任何类型转换成void类型
- static\_cast不能转换掉有const的变量

#### 2.8.2 const\_cast

- `const_cast` 可以强制去掉const的常数特性， **只能用在指针和引用** 上面
- 常量指针被转化成非常量的指针，仍然指向原来的对象
- 常量引用被转换成为非常量的引用，仍指向原来的对象
- 来看一段代码
- 如果原对象本来就是 const，去掉 const 后再写入是未定义行为；如果原对象不是 const，只是临时用 const 指针/引用观察它，则可以用 `const_cast` 恢复可写访问
```cpp
// Bad: 原对象本来就是 const，去掉 const 后再修改是未定义行为。
const int a = 10;
const int* p = &a;
int* q = const_cast<int*>(p);
// *q = 20;  // Undefined behavior.

// Good: 原对象不是 const，只是通过 const 指针观察它。
int b = 10;
const int* read_only = &b;
int* writable = const_cast<int*>(read_only);
*writable = 20;
std::cout << b << std::endl;  // 20
```

#### 2.8.3 reinterpret\_cast

- `reinterpret_cast` 主要有三种用途
- 改变指针或者引用的类型
- 将指针或者引用转换成为足够长的整形
- 将整型编程指针或者引用类型

#### 2.8.4 dynamic\_cast

- 跟其他几个不同，其他几个都是编译时完成的， `dynamic_cast` 是在运行时进行类型检查的
- 不能用于内置的基本数据类型的强制转换
- 如果转换指针成功，将返回目标类型指针；指针转换失败会返回 `nullptr`。如果转换引用失败，会抛出 `std::bad_cast`
- 转换时基类一定要有虚函数，否则无法通过编译
- 原因是虚函数表名这个类希望可以用基类指针指向派生类，这样转换才有意义
- 在类的向上转换的时候，和 `static_cast` 效果一样，但是向下转换的时候比 `static_cast` 更安全，因此要求也更高
- 来看一段代码
```cpp
class A {
 public:
  virtual ~A() = default;
};

class B : public A {};

int main() {
  A a;
  B b;
  A* ap = &a;

  if (dynamic_cast<B*>(ap)) {
    std::cout << "OK1" << std::endl;
  } else {
    std::cout << "Fail1" << std::endl;
  }

  B* maybe_b = static_cast<B*>(ap);
  std::cout << maybe_b << std::endl;
  // static_cast 不做运行时检查；这里得到的指针不能当成真正的 B 对象使用。

  ap = &b;
  if (dynamic_cast<B*>(ap)) {
    std::cout << "OK2" << std::endl;
  } else {
    std::cout << "Fail2" << std::endl;
  }
  return 0;
}
```
- 运行的结果是第一个失败，其他的都成功
- 推测导致这个结果的原因：
	- 当ap指向派生类的时候，进行强制类型转换变成派生类是可以成功的
		- 当ap指向基类的时候， `dynamic_cast` 转换是否成功取决于指针指向的类型和即将转换的类型是不是一样，不一样就会失败，返回一个NULL，而static是可以成功的
		- 其实是更安全的机制导致dynamic的检查更多，要求更高

## 3\. 重载

### 3.0 函数的重载

- 多个同名函数的参数的个数或者类型不相同，这几个函数就构成重载关系
- 不能仅通过返回值类型的不同来形成函数的重载，事实上函数重载和返回值类型的关系不大
- 调用的时候优先调用匹配度最高的重载函数，重载的优先级是：
	- 先找完全匹配的普通函数
		- 再找模板函数
		- 再找需要隐式转换的函数
- 当没有参数类型恰好匹配的重载函数的时候，就会将参数进行隐式转换之后来寻找可以调用的重载函数，此时如果重载函数有多个符合条件，就会产生error
	```cpp
	#include <iostream>

	void foo(int a, int b) {
	  std::cout << 1 << std::endl;
	}

	void foo(double a, double b) {
	  std::cout << 2 << std::endl;
	}

	int main() {
	  foo(1, 2);
	  foo(1.0, 2.0);
	  // foo(1, 2.0);  // Error: 两个重载都需要一次类型转换，调用有歧义。
	}
	```

### 3.1 运算符的重载

- 重载的一些基本性质
- 大部分运算符都可以重载
- `.`、`.*`、`::`、`?:` 不能重载，`sizeof`、`typeid`、`alignof` 等也不是可重载运算符
- 不能重载不存在的运算符
- 必须对于整个class或者enumeration type进行运算符的重载
- 重载之后的运算符依然保持 **原来一样的运算优先级和操作数的个数**
- 运算符重载的基本语法
- 在类定义中对member function进行重载 `return_type class_name::operator运算符(parameters)` 此时参数为对应运算符所需参数-1
- 对外部函数进行重载 `返回值类型 operator运算符(参数表)` 此时参数个数和对应的运算符的所需个数相同
	- 如果要访问类的private内容，需要声明这个重载函数为 **友元**
		- 单目运算符一般声明为成员函数，双目运算符一般作为外部的函数
		- \[ \] ( ) -> 等运算符必须作为成员函数
- 前缀的++和后缀的++
	- 区别：后缀的++参数表是有个int类型的变量作为参数的
```cpp
Integer& operator++();     // prefix++
Integer operator++(int x);  // postfix++
```
- 比较大小关系的运算符重载时，可以通过 **代码的复用** 减少不必要的代码量
- 自定义的 **类型转换**
- 例如 `Rational::operator double() const {};`
- 隐式类型转换：
	- Single-argument constructors
		- implicit type conversion operators
		- 避免隐式转换的方法：把单参数构造函数或转换函数声明为 explicit，表示不能进行隐式的类型转换

### 3.2 输入输出流的重载

- stream的种类
- Text stream 用ASCII码来解析，包括files和character buffers
- Binary stream 二进制数据，no translation
- stream的类型：
- cin标准输入，使用流提取运算符>>，在C++标准库的istream中定义
- cout标准输出，使用流插入运算符<<，在ostream中定义
- cerr标准错误提示(unbuffered error)
- clog标准错误提示(buffered error)
- 对>>和<<的重载
- Has to be a 2-argument free function
```cpp
std::istream& operator>>(std::istream& is, T& obj) {
  // Special way to read in obj.
  return is;
  // Return an istream& for chaining.
}

// << 的重载方式与之类似。
std::ostream& operator<<(std::ostream& os, const T& obj) {
  return os;
}
```
- 控制输出的格式，使用头文件 `#include<iomanip>`
- 其他的输入输出的方式：
- `int get()` 支持单个字符读入
	- Returns the **next character** in the stream
		- Returns EOF if no characters left
- `get(char *buf, int limit, char delim='\n')`
- `getline(char *buf, int limit, char delim='\n')`

## 4\. 模板

### 4.1 namespace 命名空间

- 使用命名空间来划分全局的各类类名可以避免名字的冲突，可以在不同的命名空间里定义相同的变量名
- 在引用的时候加上命名空间的限制符就可以了
- 或者也可以用 `using namespace xxx` 来说明程序中接下来用哪个命名空间中的东西
```cpp
namespace space1 {
std::string name = "randomstar";
}

namespace space2 {
std::string name = "ToyamaKasumi";
}

int main() {
  std::cout << space1::name << std::endl;
  using namespace space2;
  std::cout << name << std::endl;
}
```

### 4.2 template编程

- 模板编程是一种复用代码的手段，是generic programming(泛型编程)，把变量的类型当作参数来声明
- 函数模板：使用关键字template 后面加若干个变量作为类型声明一个函数模板，类型变量可以代替函数的返回值类型，参数类型和函数中的变量的类型
- 函数模板需要 **实例化** (instantiation)之后再使用，如果没有被调用就不会被实例化
	- 实例化是讲模板函数中的模板替换为对应的变量类型，然后生成一个对应的函数
		- 函数模板在使用过程中不能发生参数和返回值的类型转换，必须要 **类型完全匹配才能使用**
		- #### 函数重载时候的优先级
		- 先找是否有完全匹配的普通函数
		- 再找是否有完全匹配的模板函数
		- 再找有没有通过进行隐式类型转换可以调用的函数
- 类模板
- 和函数模板差不多，template中声明的既可以是类内各种需要变量类型的地方
- 模板类也可以继承非模板类，也可以继承模板类(需要实例化)
- 非模板类可以继承自模板类(需要实例化)
- Expression parameter
- 模板中的可以声明一些常数，class和typename的类型名可以有默认值default value，比如 `template<typename T = int>`
```cpp
template <class T, int bounds = 100>
class FixedVector {
 public:
  T& operator[](int i);

 private:
  T elements[bounds];
};

template <class T, int bounds>
T& FixedVector<T, bounds>::operator[](int i) {
  return elements[i];  // No error checking.
}

// Usage.
FixedVector<int, 50> v1;
FixedVector<int, 10 * 10> v2;
FixedVector<int> v3;  // Default value.
```
- Specialization 特化--用于萃取器
- 全特化：将模板类中所有的类型参数赋予明确的类型，并写了一个类名和主模板类名相同的类，这个类就是全特化类
	- 全特化之后，已经失去了template的特性
	```cpp
	template <class T>
	bool compare(T x, T y) {
	  return x > y;
	}

	// 这个就是对上面写的模板函数的全特化
	template <>
	bool compare(int x, int y) {
	  return x > y;
	}
	```
- 偏特化：只给模板类赋一部分的类型，得到的偏特化类/函数可以作为一个子模版使用
	- 还保留了一部分template的功能
- 模板类调用的 **优先级**
	- 全特化类>偏特化类>主版本的模板类（就是直接调用模板类，最常见的用法）
		- 有隐式转换的优先级比较低，先考虑所有不需要隐式转换的模板，再考虑需要隐式转换的模板

### 4.3 STL和迭代器

- STL=Standard Template Library 是标准库的一部分，使用C++STL可以减少开发时间，提高可读性和 **鲁棒性** ，STL包含了：
- 容器
- 迭代器
- 函数
- STL容器的使用：刻在DNA里，不需要整理
- 关于map：map的key **必须是** 可以满足 **可以排序** 性质的，如果是自定义的类需要 **重载<函数** ，否则这个类不能作为key值
- 迭代器： `STL<parameters>::iterator  xxx`
- 迭代器是一种顺序访问容器的方式：Generalization of pointers
- 两个特殊的迭代器：begin( ) 和 end( )分别表示容器的 **头和尾**
	- 很多时候end并不能达到，因此到结束的判断条件往往是`!=stl.end()`
- 迭代器支持的操作
- `iter++` `iter+=2` (不是任何容器的迭代器都可以)
	- `*iter`
	```cpp
	std::list<int> l;
	std::list<int>::iterator iter = l.begin();
	l.erase(iter);  // iter = l.erase(iter);
	++iter;         // Error!!!
	```
- 可以看成是一种 **泛化的指针**

## 5. Exceptions 异常处理

- 用于异常处理的语法
- `try{ } catch{ }` ：捕获throw抛出的异常
	- `catch (...)` 表示捕捉 **所有可能的异常**
		- try括号中的代码被称为保护代码
- throw语句：抛出异常
	- `throw exp;` 抛出一个表达式：throw的参数可以是任何的表达式，表达式中的类型决定了抛出的结果的类型
		- `throw;` 只有在catch子句中有效，把原本捕捉到的异常抛出
- 异常处理的执行过程
- 程序按照正常的顺序执行，到达try语句，开始执行try内的保护段
- 如果在保护段执行期间没有发生异常，那么跳过所有的catch
- 如果保护段的执行期间有调用的任何函数中有异常，则可以通过throw创建一个异常对象并抛出，程序转到对应的catch处理段
- 首先要按顺序寻找匹配的catch处理器，如果没有找到，则 `terminate( )` 会被自动调用，该函数会调用abort终止程序
	- 如果在函数中进行异常处理并且触发了terminate，那么终止的是当前函数
		- 异常类型需要严格的匹配
- 如果找到了匹配的catch处理程序，并且通过值进行捕获，则其形参通过拷贝异常对象进行初始化，在形参被初始化之后，展开栈的过程开始，开始对对应的try块中，从开始到异常丢弃地点之间创建的所有局部对象的析构
- C++中自带的异常的继承体系，定义在头文件 `<exception>` 中
- what方法给出了产生异常的原因，是异常类之间都有的公共方法，已经被所有的子异常类重载
- 自定义的异常类：需要继承exception类
- 函数定义的异常声明
- 可以在函数名后面加 `noexcept` 关键字，说明该函数在运行的过程中 **不抛出任何异常** ，如果还是产生了异常，就会调用 `std::terminate` 终止程序
- C++17 中旧式动态异常说明（例如 `double f(int, int) throw(int);`）已经被移除；现代 C++ 使用 `noexcept` 表达“不抛出异常”
- throw会导致一个函数没有执行完毕，但是在函数throw之前会执行所有 **局部变量的析构函数**
- 最好不要在析构函数中抛出异常
```cpp
class T {
 public:
  T() {
    std::cout << "T()" << std::endl;
  }

  ~T() {
    std::cout << "~T()" << std::endl;
  }
};

void foo() {
  T t;
  throw 1;
}

int main() {
  try {
    foo();
  } catch (...) {
    std::cout << "Catched!" << std::endl;
  }
  return 0;
}

// 运行的结果是：
// T()
// ~T()
// Catched
```
