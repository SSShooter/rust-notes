---
path: '/rust-guide-ownership'
date: '2022-08-12T16:48:09.519Z'
title: 'Rust 文档笔记 Ownership'
tags: ['coding', 'Rust']
description: 'description'
---

## Ownership

- Rust 的每个值都有 owner
- 某一时刻只会有一个 owner
- owner 离开作用域，值会被丢弃

## 内存分配

字符串字面量无法在程序运行时指定，因此需要 `String` 类型，它可以：

- 在运行时分配内存
- 不再使用时释放内存

Rust 采用有别于传统 GC 的内存清理方式，离开作用域时通过自动调用 `drop ` 回收内存。类似的策略在 C++ 被称为 Resource Acquisition Is Initialization (RAII)。

## Move

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;
}
```

s1 s2 都离开了作用域，那是否会被清空两次？不会，因为 Owner 从 s1 转移到了 s2，这个时候 s1 已经没用了。

Move 就是“浅复制，并把之前的变量无效化”。Rust 默认情况下不会进行深复制。

## Clone

堆数据深复制：

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();

    println!("s1 = {}, s2 = {}", s1, s2);
}
```

栈数据（如 `u32`、`bool`、`char` 等）自动复制：通过 `Copy` **trait** 默认复制栈的值。相关传送：[Derivable Traits](https://doc.rust-lang.org/book/appendix-03-derivable-traits.html)

## 传参与 return

传参和 return 也是 **Owner 转移**。

```rust
fn main() {
    let s = String::from("hello");  // s comes into scope

    takes_ownership(s);             // s's value moves into the function...
                                    // ... and so is no longer valid here

    let x = 5;                      // x comes into scope

    makes_copy(x);                  // x would move into the function,
                                    // but i32 is Copy, so it's okay to still
                                    // use x afterward

} // Here, x goes out of scope, then s. But because s's value was moved, nothing
  // special happens.

fn takes_ownership(some_string: String) { // some_string comes into scope
    println!("{}", some_string);
} // Here, some_string goes out of scope and `drop` is called. The backing
  // memory is freed.

fn makes_copy(some_integer: i32) { // some_integer comes into scope
    println!("{}", some_integer);
} // Here, some_integer goes out of scope. Nothing special happens.
```

```rust
fn main() {
    let s1 = gives_ownership();         // gives_ownership moves its return
                                        // value into s1

    let s2 = String::from("hello");     // s2 comes into scope

    let s3 = takes_and_gives_back(s2);  // s2 is moved into
                                        // takes_and_gives_back, which also
                                        // moves its return value into s3
} // Here, s3 goes out of scope and is dropped. s2 was moved, so nothing
  // happens. s1 goes out of scope and is dropped.

fn gives_ownership() -> String {             // gives_ownership will move its
                                             // return value into the function
                                             // that calls it

    let some_string = String::from("yours"); // some_string comes into scope

    some_string                              // some_string is returned and
                                             // moves out to the calling
                                             // function
}

// This function takes a String and returns one
fn takes_and_gives_back(a_string: String) -> String { // a_string comes into
                                                      // scope

    a_string  // a_string is returned and moves out to the calling function
}
```

## Borrow

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

创建一个 reference，其实跟指针一样，把地址传到函数。如上，s1 仍然有效。函数实际不是 Owner，这个行为称为 Borrow。

那么代价是什么？**无法修改数据**。那岂不是实用性很低，也不是，加上 `mut` 就可以改了，但是不加 `mut` 可以借**无数次**，否则**只能借出 1 次**，这个设定主要避免 data race。

### Mutable Reference

```rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

## Dangling Pointer

Dangling Pointer（悬空指针）顾名思义便是原来的值已经被丢弃，但指针仍然存在，那么它就指向了一个空无一物（甚至被新值占据）的地方，这就算是 Dangling。

**Rust 编译器保证不会出现 dangling pointer**，编译器不会允许变量先于指针离开作用域。

## The Slice Type

Slice Type 是一种特殊 reference，不拥有 ownership。可以从下图直观看出二者关系：

![rust reference](https://doc.rust-lang.org/book/img/trpl04-05.svg)

![rust slice](https://doc.rust-lang.org/book/img/trpl04-06.svg)
