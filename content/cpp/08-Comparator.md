---

publish: true

draft: false

---
在泛型编程（Generic Programming）中，我们不仅希望数据类型是可变的，也希望某些行为能够由用户自定义。
例如，对于排序算法而言。我们时常需要处理正序排序和逆序排序。但二者使用的是同一个排序算法，不同之处仅在于比较规则。
因此，我们可以将比较规则抽象为一个模板参数
```C++
template <typename T, typename Compare = std::less<T>>
```
其中
- `T` 表示元素类型；
- `Compare` 表示比较器（Comparator）类型；
- `std::less<T>` 为默认比较器，表示使用 `<` 进行比较。

主要关注`typename Compare = std::less<T>` 。表示规则为升序排序。如果希望降序排序，则改为`typename Compare = std::greater<T>`。
在实际案例中的运用：
```C++
template <typename T, typename Compare = std::less<T>>
void insertionSort(std::vector<T>& data, Compare comp = Compare()) {
    for (std::size_t i = 1; i < data.size(); ++i) {
        T key = data[i];
        std::size_t j = i;
        while (j > 0 && comp(key, data[j - 1])) {
            data[j] = data[j - 1];
            --j;
        }
        data[j] = key;
    }
}
```
在函数参数里面写`Compare comp = Compare()`就可以初始化一个comp对象。然后`comp(参数1，参数2)`就可以来判断两个参数的大小关系了。