---
path: '/rust-guide-match'
date: '2022-08-15T15:05:43.209Z'
title: 'Rust 文档笔记 枚举和匹配'
tags: ['tag']
description: 'description'
---

# {{ $frontmatter.title }}

## Enum

```rust
enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}

let home = IpAddr::V4(127, 0, 0, 1);

let loopback = IpAddr::V6(String::from("::1"));
```

可以这么理解，`IpAddr::V4()` 是一个函数调用，以 `String` 为参数返回 `IpAddr` 类型。

```rust
impl Message {
    fn call(&self) {
        // method body would be defined here
    }
}

let m = Message::Write(String::from("hello"));
m.call();
```

## Option

标准库自带一个叫 `Option<T>` 的 Enum，用于处理数据可能为空的情况。

```rust
enum Option<T> {
    None,
    Some(T),
}
```

`Option`、`Some`、`None` 都通过 [prelude](https://doc.rust-lang.org/std/prelude/index.html) 自动带入作用域，不需要手动引入。

注意 `5` 和 `Some(5)` 并不是一个东西，不能直接相加，需要后续处理才能使用，这也强迫你尽量处理 `None` 的情况，当然你还是可以逃课的，但前提是你必须知道你在做什么。

## match

```rust
#[derive(Debug)] // so we can inspect the state in a minute
enum UsState {
    Alabama,
    Alaska,
    // --snip--
}
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => {
            println!("Lucky penny!");
            1
        }
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        }
    }
}
```

上例就是对 `coin` 的值进行匹配，并运行函数。对于传入了值的 `Quarter`，运行函数时就直接把值当成参数传进去了（其实，也挺符合直觉的）。

### Option 的 match

```rust
fn main() {
    fn plus_one(x: Option<i32>) -> Option<i32> {
        match x {
            None => None,
            Some(i) => Some(i + 1),
        }
    }

    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);
}
```

在使用 `match` 时，你必须处理可能匹配到的**所有情况**，否则编译报错。

```rust
fn main() {
    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        other => move_player(other),
        // _ => reroll(),
    }

    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
    fn move_player(num_spaces: u8) {}
}
```

匹配所有情况不代表要把所有选项都写一遍，使用 `other` 或 `_` 可以简单处理剩余所有情况。

## if let

与 `match` 处理所有情况相反，`if let` 用于更方便地处理**某一特定情况**，其他情况全部 `else`。

```rust
fn main() {
    let coin = Coin::Penny;
    let mut count = 0;
    if let Coin::Quarter(state) = coin {
        println!("State quarter from {:?}!", state);
    } else {
        count += 1;
    }
}
```
