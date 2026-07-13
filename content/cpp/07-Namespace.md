---

publish: true

draft: false

---
在一个较大的项目中，不同开发者可能会定义同名的变量、函数或类。例如，两个人都定义了一个名为 `show()` 的函数：
```cpp
void show() {
    std::cout << "Hello";
}
```

如果这些代码被编译到同一个程序中，编译器将无法区分它们，从而产生Name Collision。
为了解决这一问题，C++ 引入了 命名空间（Namespace）。
命名空间 可以理解为一个**独立的名字作用域**。同一个名字只要位于不同的命名空间中，就不会发生冲突。

```cpp
namespace Alice {
    int value = 42;

    void show() {
        std::cout << "Alice: " << value << std::endl;
    }
}

namespace Bob {
    int value = 100;

    void show() {
        std::cout << "Bob: " << value << std::endl;
    }
}
```

虽然 `Alice` 和 `Bob` 中都定义了 `value` 和 `show()`，但由于它们属于不同的命名空间，因此可以同时存在。
如果需要访问其中的成员，只需使用**作用域解析运算符（`::`）** 指定命名空间。
命名空间可以理解为一个**独立的名字作用域**。同一个名字只要位于不同的命名空间中，就不会发生冲突。

```cpp
Alice::show();
Bob::show();

std::cout << Alice::value << std::endl;
std::cout << Bob::value << std::endl;
```

>[!warning] 谨慎使用 using namespace
>在头文件中，不要使用`using namespace std;`
>因为头文件会被多个源文件包含，这会把整个 std 命名空间引入所有包含它的文件，增加命名冲突的风险。
