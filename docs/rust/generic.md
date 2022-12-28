# 泛型

泛型就是通过 `<>`，把需要用到的类型也当作变量（变量名通常为 `T`）传入函数或其他复杂类型。

最简单的例子就是我们已经很熟悉的 `Option` 和 `Result`：

```rust
enum Option<T> {
    Some(T),
    None,
}
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

在函数签名中使用：

```rust
fn largest<T: std::cmp::PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];

    for item in list {
        if item > largest {
            largest = item;
        }
    }

    largest
}
```

`<T: std::cmp::PartialOrd>` 在 T 的基础上要求拥有 `PartialOrd` Trait，下一节会详细解释。

在 `struct` 中使用：

```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

fn main() {
    let integer = Point { x: 5, y: 10 };
    let float = Point { x: 1.0, y: 4.0 };
    let p = Point { x: 5, y: 10 };

    println!("p.x = {}", p.x());
}

```

```rust
struct Point<T, U> {
    x: T,
    y: U,
}

fn main() {
    let both_integer = Point { x: 5, y: 10 };
    let both_float = Point { x: 1.0, y: 4.0 };
    let integer_and_float = Point { x: 5, y: 4.0 };
}
```