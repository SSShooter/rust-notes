# Trait

## 定义

十分接近 go 的 interface。

```rust
// 只定义函数签名
pub trait Summary {
    fn summarize(&self) -> String;
}

// 定义默认行为
pub trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}
```

## 实现

在某个 Type 实现某 Trait

```rust
pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}
```

在实现时不指定函数的话，如 `impl Summary for NewsArticle {}`，会使用 Trait 的默认函数。

## 指定某 Trait 为参数

```rust
pub fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}
```

### Trait Bound Syntax

```rust
pub fn notify<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}
```

`impl Trait` 是 Trait Bound Syntax 的语法糖，只有一个参数时确实方便，但涉及到多个参数或多个 `Trait` 时 Trait Bound Syntax 的优势就显现出来了。

```rust
pub fn notify(item1: &impl Summary, item2: &impl Summary){}
pub fn notify<T: Summary>(item1: &T, item2: &T){}
```

规定同时实现多个 `Trait` 的参数：

```rust
pub fn notify(item: &(impl Summary + Display)) {}
pub fn notify<T: Summary + Display>(item: &T) {}
```

用 `where` 优化函数签名：

```rust
fn some_function<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> i32 {}
fn some_function<T, U>(t: &T, u: &U) -> i32
    where T: Display + Clone,
          U: Clone + Debug
{}
```

## Trait 作为泛型的条件

```rust
use std::fmt::Display;

struct Pair<T> {
    x: T,
    y: T,
}

impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self { x, y }
    }
}

impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {}", self.x);
        } else {
            println!("The largest member is y = {}", self.y);
        }
    }
}
```

这个例子就是“只为同时拥有 `Display + PartialOrd` Trait 的 `T` 实现 `cmp_display`”。类似的，给带 `Display` Trait 的 `T` 实现 `ToString` 可以这么写：

```rust
impl<T: Display> ToString for T {
    // --snip--
}
```
