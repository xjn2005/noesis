---

publish: true

draft: false

---
类型推断是C++11引入的一个特性，它允许编译器根据变量的初始值自动推断变量的类型。类型推断的基本语法是使用 auto 关键字。
```cpp
auto p = std::make_unique<T[]>(initialCapacity);
```
上述这行代码，完整写下来是这样的：
```cpp
std::unique_ptr<T[]> p = std::make_unique<T[]>(initialCapacity);
```
因为变量类型比较长，用auto就可以使代码更简洁、更易读。
>[!WARNING]
>当 auto 能够**消除冗长类型并保持代码清晰**时，应优先使用。当 auto 会**隐藏重要类型信息**时，应显式写出类型。例如`auto it = std::max_element(v.begin(), v.end());`中， `it` 的类型是 `std::vector<int>::iterator` 是确定的，这个类型名称很长，且明确知道它是迭代器类型。此时使用就比较合适。但是如果写`auto x = 5`就属于滥用，因为很明显`x`是`int`类型。