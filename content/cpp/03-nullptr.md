---

publish: true

draft: false

---
`nullptr` 是 C++11 引入的空指针字面量，用来替代 C 风格里的 `NULL` 或 `0`。

```cpp
int* p = nullptr;

if (p == nullptr) {
    std::cout << "p is empty\n";
}
```

使用 `nullptr` 的好处是：它的类型是 `std::nullptr_t`，编译器可以明确知道它表示空指针，而不是整数 `0`。因此在现代 C++ 中，表示空指针时应优先使用 `nullptr`。