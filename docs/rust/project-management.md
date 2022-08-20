# Package、Crate 和 Module

## Crate

Crate 是 Rust 编译器处理代码的最小单位，包含 binary crate 和 library crate 两种。

- binary crate 可以打包为可执行文件，必须有 `main` 函数
- library crate 用于提供公用函数，像 `rand`。不需要 `main` 函数

通常谈及 crate，指的是 library crate，也常直接把它称为“库”。

`cargo new` 可以方便地新建一个 crate

## Module

- 从根开始处理（`src/lib.rs` 或 `src/main.rs`）
- 模块宣言，当我们在根文件添加 `mod garden;`
  - 可以行内定义模块，后面会展开讲
  - 自动寻找 `src/garden/vegetables.rs`
  - 自动寻找 `src/garden/vegetables/mod.rs`
- 子模块，当我们在 garden 模块添加 `mod vegetables;`，同理
  - 行内
  - `src/garden/vegetables.rs`
  - `src/garden/mod.rs`
- 获取模块的路径长这样：`crate::garden::vegetables`
- 非同模块默认私有，需要通过 `pub mod` 暴露
- 用 `use` 简化引入路径，如果你添加了 `use crate::garden::vegetables::Asparagus;`，就能直接使用 `Asparagus`

例如在 `src/lib.rs` 文件添加这些 mod，可以拆分为下面文件结构的文件：

```rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}

        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}

        fn serve_order() {}

        fn take_payment() {}
    }
}
```

```
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment
```

## Path

- 绝对路径，从 `crate` 开始
- 相对路径，从当前模块、`self`、`super` 开始

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // Absolute path
    crate::front_of_house::hosting::add_to_waitlist();

    // Relative path
    front_of_house::hosting::add_to_waitlist();
}
```

## Use

**mod 是宣言这个位置有 mod 的存在，需要按要求查找并处理 mod，而 use 是使用某个 mod。**

- `use` 一定要写在需要使用的作用域内，否则编译报错
- 习惯上不会直接 `use` 到最后一级，这么做在使用时可以更清楚当前函数的来源，也能避免同名函数冲突
- 发生冲突时可以使用 `as` 重命名，如 `use std::io::Result as IoResult;`
- 通过 `pub use` 可以在其他层级 Re-export 一个模块
- 使用花括号可以减少 `use` 的次数，如 `use std::io::{self, Write};` 等于 `use std::io;` 和 `use std::io::Write;`
- `use std::collections::*;` 可以把某模块的子模块全撒到当前作用域，慎用
- 在 `Cargo.toml` 中添加依赖后可以通过 `use` 使用外部库

```toml
rand = "0.8.3"
```

```rust
use std::io;
use rand::Rng;

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1..=100);

    println!("The secret number is: {secret_number}");

    println!("Please input your guess.");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");

    println!("You guessed: {guess}");
}
```
