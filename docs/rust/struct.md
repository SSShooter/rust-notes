---
path: '/rust-guide-struct'
date: '2022-08-16T14:02:21.589Z'
title: 'Rust 文档笔记 Struct'
tags: ['tag']
released: true
hidden: false
description: 'description'
---

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    let mut user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };

    user1.email = String::from("anotheremail@example.com");
}

fn build_user(email: String, username: String) -> User {
    User {
        email,
        username,
        active: true,
        sign_in_count: 1,
    }
}
```

`Struct` 就是对象的框架，对 JavaScript 用户来说别提多亲切了，定义和修改对象的方式也很相似，不过 `user1` 在这边被称为 instance（实例）。

## struct update syntax

struct 更新语法，类比到 JavaScript 就是“解构赋值”，看例子很好理解：

```rust
fn main() {
    // --snip--

    let user2 = User {
        email: String::from("another@example.com"),
        ..user1
    };
}
```

- 注意点 1：Rust 比 JavaScript 少一个 `.`
- 注意点 2：`username` 的赋值是一种“Move”，因此 `user1` 在赋值到 `user2` 后失效

## 其他两种 Struct

### Tuple struct

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
}
```

### Unit-like struct

```rust
struct AlwaysEqual;

fn main() {
    let subject = AlwaysEqual;
}
```

## 添加 method

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area()
    );
}
```

可以通过 `impl` 给 Struct 添加 method，操作和函数差不多，特殊在第一个参数总是 `self`。`&self` 是 `self: &Self`，指向调用者。也可以使用 `&mut self`，甚至 `self` 直接获取 ownership，这取决于你的需求。

### automatic referencing and dereferencing

C++ 有 `.` 和 `->` 的区别，但 Rust 已经自动帮你处理了，无论是指针还是本体，直接 `.` 就完事了。

## associated function

> All functions defined within an impl block are called associated functions because they’re associated with the type named after the impl. We can define associated functions that don’t have self as their first parameter (and thus are not methods) because they don’t need an instance of the type to work with.

associated function（关联函数）包含 method（方法），传了 self 就是 method，没传就是 associated function。method 通过 `.` 调用，associated function 通过 `::` 调用。

associated function 通常用于构造对象：

```rust
impl Rectangle {
    fn square(size: u32) -> Self {
        Self {
            width: size,
            height: size,
        }
    }
}

// usage
Rectangle::square(3);
```