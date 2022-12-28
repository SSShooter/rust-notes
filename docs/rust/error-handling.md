# 错误处理

## 不可恢复的 panic!

主动制造 panic：

```rust
panic!("crash and burn");
```

代码造成 panic，在 C 中，取数组长度后的内存不会报错，但 Rust 为了避免 buffer overread，禁止取数组范围外的值：

```rust
fn main() {
    let v = vec![1, 2, 3];

    v[99];
}
```

使用 `RUST_BACKTRACE=1 cargo run` 在报错时可以得到调用栈。

## 可恢复的 Result

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

类似于 `Option` 的结构，使用方法也类似。`Option` 拆开来是值和 `None`，`Result` 拆开来是值和错误，给你机会从错误中恢复，标准库的很多函数都会返回 `Result`。

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let greeting_file_result = File::open("hello.txt");

    let greeting_file = match greeting_file_result {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {:?}", e),
            },
            other_error => {
                panic!("Problem opening the file: {:?}", other_error);
            }
        },
    };
}
```

使用 `unwrap_or_else` 实现跟 `match` 一样的功能：

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let greeting_file = File::open("hello.txt").unwrap_or_else(|error| {
        if error.kind() == ErrorKind::NotFound {
            File::create("hello.txt").unwrap_or_else(|error| {
                panic!("Problem creating the file: {:?}", error);
            })
        } else {
            panic!("Problem opening the file: {:?}", error);
        }
    });
}
```

`||{}` 代表匿名函数，详情请见 [closure 章节](https://doc.rust-lang.org/book/ch13-01-closures.html)。

### Err 转 Panic 的快捷方法

```rust
// unwrap
let greeting_file = File::open("hello.txt").unwrap();
// expect
let greeting_file = File::open("hello.txt")
        .expect("hello.txt should be included in this project");
```

- `unwrap` 遇到 `Err` 自动 `panic!`
- `expect` 可以在 `unwrap` 的基础上再传一条报错信息代替默认的报错信息

## 错误“冒泡”

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let username_file_result = File::open("hello.txt");

    let mut username_file = match username_file_result {
        Ok(file) => file,
        Err(e) => return Err(e),
    };

    let mut username = String::new();

    match username_file.read_to_string(&mut username) {
        Ok(_) => Ok(username),
        Err(e) => Err(e),
    }
}
```

不在当前函数处理错误，转而返回给函数调用者，这种做法称为 Propagate Error。前端领域 DOM 里的事件传播（Propagation）翻译成“冒泡”，这里就直接借用一下着名字吧。注意最后整个 `match` 没有分号，相当于整块都 return 了。

## 快捷冒泡

```rust
use std::fs::File;
use std::io;
use std::io::Read;

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username_file = File::open("hello.txt")?;
    let mut username = String::new();
    username_file.read_to_string(&mut username)?;
    Ok(username)
}
```

在 `Result` 后添加 `?` 跟 `match` 效果相当，`Ok` 时赋值，`Err` 时直接返回 `Err`。注意函数返回值必须为 `Result`。

你甚至可以更简洁地写成 `File::open("hello.txt")?.read_to_string(&mut username)?;`，我愿称 `?` 为目前为止最妙的语法。

相关拓展：`From` trait
