---

publish: true

draft: false

---
当多个线程同时修改同一个普通变量时，可能会产生数据竞争。例如，`counter++` 实际上包含读取、加一和写回三个步骤，两个线程可能读取到相同的旧值，导致其中一次更新丢失。

C++11 引入了 `std::atomic` 原子类型，如需使用，则要 `#include <atomic>`。
`std::atomic<T>` 可以保证针对这个对象的单次操作不可分割，其他线程不会观察到操作执行到一半的状态。

```C++
#include <atomic>

std::atomic<int> counter{0};

void increment() {
    counter.fetch_add(1);
}
```

常用操作包括：

- `load()`：读取当前值。
- `store(value)`：写入新值。
- `fetch_add(value)`：原子加法，并返回修改前的值。
- `fetch_sub(value)`：原子减法，并返回修改前的值。
- `exchange(value)`：写入新值，并返回旧值。

```C++
std::atomic<int> value{0};

value.store(10);
int current = value.load();
int old = value.fetch_add(2);

// current == 10
// old == 10
// value == 12
```

原子操作默认使用 `std::memory_order_seq_cst`，它提供最容易理解的全局顺序保证。如果变量只是一个独立计数器，不负责通知其他线程「数据已经准备完成」，可以使用 `std::memory_order_relaxed`：

```C++
counter.fetch_add(1, std::memory_order_relaxed);
```

`memory_order_relaxed` 仍然保证计数操作本身是原子的，但不会同步其他普通变量。Count-Min Sketch 等并发计数场景通常只关心计数不会丢失，因此可以使用这种内存序。

>[!warning]
>`std::atomic` 只保证单次操作的原子性。下面的 `load()` 和 `store()` 分别是原子的，但组合起来并不是一次原子递增：
>```C++
>counter.store(counter.load() + 1);
>```
>这种情况应该使用 `fetch_add(1)`。如果需要同时维护多个变量，或者保护包含多个步骤的操作，应使用 `std::mutex`。

此外，`volatile` 不能代替 `std::atomic`。`volatile` 不提供线程同步，也不能避免数据竞争。
