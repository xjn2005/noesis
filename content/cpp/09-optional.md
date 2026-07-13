---

publish: true

draft: false

---
我们在实现数据结构查找操作的时候，如果碰到没有找到的情况，C的风格就是`return -1`，返回一个sentinel value。这种做法虽然简单，但并不总是可靠。对于某些类型而言，很难找到一个永远不会与正常数据冲突的特殊值。
因此在C++17 引入了`std::optional`标准库类型，如需使用，则要`include <optional>`。
`std::optional<T>` 表示：可能包含一个 `T` 类型的值，也可能什么都不包含。
Example：`std::optional<std::size_t> find(const T& value)`
- 如果查找成功：`return i`
- 如果查找成功：`return std::nullopt`

其中，std::nullopt 表示当前 optional 不包含任何值。
使用时，通常需要先判断是否有值：​
```C++
auto result = find(value);
if (result) {
    std::cout << *result;
}
```
这里的`*result`，表示获取 optional 内部保存的对象，其作用类似于对指针解引用。