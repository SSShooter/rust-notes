# 数据集合

## Vector

向量用于储存一连串**相同类型**的变量。与数组不同的是向量存在 heap，数组存在 stack。

[编程和数学中的向量](https://stackoverflow.com/questions/6170854/difference-between-a-vector-in-maths-and-programming)

```rust
let mut v = Vec::new();
v.push(5);
v.push(6);
v.push(7);
v.push(8);

// macro
let v = vec![1, 2, 3];
```

### 读取 Vector

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];

    let third: &i32 = &v[2];
    println!("The third element is {}", third);

    let third: Option<&i32> = v.get(2);
    match third {
        Some(third) => println!("The third element is {}", third),
        None => println!("There is no third element."),
    }
}
```

- 方法 1，使用 `&` 和 `[]`，取不到会 panic
- 方法 2，使用 `get`，返回安全的 `Option`

### 遍历

```rust
fn main() {
    let mut v = vec![100, 32, 57];
    for i in &mut v {
        *i += 50;
    }
}
```

Vector 文档传送门：https://doc.rust-lang.org/std/vec/struct.Vec.html

### 存放多种类型

虽然向量只能存放一个类型，但是如果这个类型是 `enum` 的话……

```rust
fn main() {
    enum SpreadsheetCell {
        Int(i32),
        Float(f64),
        Text(String),
    }

    let row = vec![
        SpreadsheetCell::Int(3),
        SpreadsheetCell::Text(String::from("blue")),
        SpreadsheetCell::Float(10.12),
    ];
}
```

## String

Rust 语言本身的“String”只有 string slice，也就是 `str`，通常以 `&str` 出现。而接着要说的类型 `String` 来自**标准库**——

> The `String` type, which is provided by Rust’s standard library rather than coded into the core language, is a growable, mutable, owned, UTF-8 encoded string type.

`String` 是基于 `Vec<T>` 实现的，本质上它就是“字节的向量”，所以向量很多方法 `String` 都适用。但是下标取值对 `String` 不好使，因为 UTF-8 编码下，一个字可能由多个字节组成，所以直接下标取值会造成错误。即使是 Slicing String 也会有“取到半个值”的问题。

编码前置知识传送门：https://ssshooter.com/2020-08-12-html-encode/#utf-8

```rust
// 新建空 String
let mut s = String::new();

// 字符串字面量转 String
let s = "initial contents".to_string();

// String::from 生成 String
let s = String::from("initial contents");
```

### 更新

```rust
// push_str
let mut s1 = String::from("foo");
let s2 = "bar";
s1.push_str(s2);
println!("s2 is {}", s2);

// push a single character
let mut s = String::from("lo");
s.push('l');

// +
let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2; // note s1 has been moved here and can no longer be used

// format!
let s1 = String::from("tic");
let s2 = String::from("tac");
let s3 = String::from("toe");

let s = format!("{}-{}-{}", s1, s2, s3);
```

### 迭代

```rust
for c in "Зд".chars() {
    println!("{}", c);
}

for b in "Зд".bytes() {
    println!("{}", b);
}
```

## Hash Map

`HashMap<K, V>` 映射类型 K 的值到类型 V 的值。

```rust
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);

let team_name = String::from("Blue");
let score = scores.get(&team_name);

for (key, value) in &scores {
    println!("{}: {}", key, value);
}
```

- 跟 vector 的 `get` 一样，返回安全的 `Option`
- `for` 循环可以获取 `key` 和 `value`
- `String` 被 HashMap 使用后 Ownership 转移

### 更新

```rust
// 最简单的直接覆盖
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Blue"), 25);

// 无当前 key 时添加数据
scores.entry(String::from("Blue")).or_insert(50);

// 用 * 更新值
let text = "hello world wonderful world";
let mut map = HashMap::new();
for word in text.split_whitespace() {
  let count = map.entry(word).or_insert(0);
  *count += 1;
}
println!("{:?}", map);
```

`HashMap` 默认使用 SipHash，可以通过修改 hasher 切换哈希函数，获得更快的计算速度。