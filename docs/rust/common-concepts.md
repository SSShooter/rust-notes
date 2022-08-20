# 基本概念

## Variable 与 Mutability

```rust
let x = 5;
x = 6;
```

用 `let` 定义变量，但重新赋值编译器会报错。这是 Rust 故意为之，为了不让程序随便修改变量，若要修改，必须手动加上 `mut` 。

```rust
let mut x = 5;
```

与 JavaScript 对比，其实 Rust 的 `let` 是 JavaScript 的 `const`， Rust 的 `let mut` 才是 JavaScript 的 `let`。

## Constant

```rust
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;
```

Rust 的 `const` 必须是编译时确定的。

## Shadowing

```rust
fn main() {
    let x = 5;

    let x = x + 1;

    {
        let x = x * 2;
        println!("The value of x in the inner scope is: {x}");
    }

    println!("The value of x is: {x}");
}
```

Shadowing 可以翻译成“覆盖”，指可以通过重复 `let` 修改变量的值，需要注意作用域范围。

Shadowing 和 `mut` 的区别是，Shadowing 等于重新定义一个变量，可以覆盖为不同的值类型，但 `mut` 只是单纯修改值。

```rust
// 可以
let spaces = "   ";
let spaces = spaces.len();

// 不行
let mut spaces = "   ";
spaces = spaces.len();
```

## 数据类型

**单值：整型、浮点数、布尔、字符**

| Length  | Signed  | Unsigned |
| ------- | ------- | -------- |
| 8-bit   | `i8`    | `u8`     |
| 16-bit  | `i16`   | `u16`    |
| 32-bit  | `i32`   | `u32`    |
| 64-bit  | `i64`   | `u64`    |
| 128-bit | `i128`  | `u128`   |
| arch    | `isize` | `usize`  |

| Number literals  | Example       |
| ---------------- | ------------- |
| Decimal          | `98_222`      |
| Hex              | `0xff`        |
| Octal            | `0o77`        |
| Binary           | `0b1111_0000` |
| Byte (`u8` only) | `b'A'`        |

浮点数有 `f32`、`f64` 两种，因为现代 CPU 普遍 64 位，默认 `f64` 速度快且精度高。

```rust
let t = true;
let f: bool = false; // with explicit type annotation
```

布尔就是布尔，你熟悉的布尔。

```rust
let c = 'z';
let z: char = 'ℤ'; // with explicit type annotation
let heart_eyed_cat = '😻';
```

单引号包裹的是 `char`，string literal 是双引号，注意，数据类型里面不包含 string literal，它是 `&str`。

Rust 的 `char` 占 4 字节，是 Unicode Scalar Value。拓展阅读：https://doc.rust-lang.org/book/ch08-02-strings.html#storing-utf-8-encoded-text-with-strings

**组合值：元组、数组**

元组可用点取值、可“解构”

```rust
let tup: (i32, f64, u8) = (500, 6.4, 1);
let (x, y, z) = tup;
let five_hundred = x.0;
let six_point_four = x.1;
let one = x.2;
```

数组有一些特别定义方式，取值方式无亮点。

```rust
// 5 个 i32
let a: [i32; 5] = [1, 2, 3, 4, 5];
// 5 个整型 3
let b = [3; 5];
```

## 函数

```rust
fn main() {
    print_labeled_measurement(5, 'h');
}

fn print_labeled_measurement(value: i32, unit_label: char) {
    println!("The measurement is: {value}{unit_label}");
}
```

函数命名风格是下划线分隔小写字母，需要在函数签名定义每个参数的类型。

```rust
fn main() {
    let x = plus_one(5);

    println!("The value of x is: {x}");
}

fn plus_one(x: i32) -> i32 {
    x + 1
}
```

注意返回值不能加 `;`，因为返回值必须是**Expression（表达式）**，加了 `;` 会成为**Statement（语句）**。

## Rust 里的表达式和语句

Rust 的语句**不会返回值**，相反表达式会运行并计算出一个值。在其它语言中类似 `x = y = 6` 的操作在 Rust 中不可行。

```rust
{
    let x = 3;
    x + 1
}
```

上面的一小块代码是一个表达式，会返回 4，但是如果在 `x + 1` 后添加 `;`，最后就变成没返回了，将没有返回的表达式放到语句里会报错。

## 控制流

### if else

```rust
fn main() {
    let number = 6;

    if number % 4 == 0 {
        println!("number is divisible by 4");
    } else if number % 3 == 0 {
        println!("number is divisible by 3");
    } else if number % 2 == 0 {
        println!("number is divisible by 2");
    } else {
        println!("number is not divisible by 4, 3, or 2");
    }

    let condition = true;
    let number = if condition { 5 } else { 6 };

    println!("The value of number is: {number}");
}
```

- 条件不用写括号
- 条件返回值必须是布尔
- 与 `let` 组合时两个条件的返回值类型须一致

### loop

```rust
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

    println!("The result is {result}");
}
```

- `break` 后的值会被返回（注意这里有 `;`）

多层 loop：

```rust
fn main() {
    let mut count = 0;
    'counting_up: loop {
        println!("count = {count}");
        let mut remaining = 10;

        loop {
            println!("remaining = {remaining}");
            if remaining == 9 {
                break;
            }
            if count == 2 {
                break 'counting_up;
            }
            remaining -= 1;
        }

        count += 1;
    }
    println!("End count = {count}");
}
```

- 用一个单引号 `'` 标记 `loop`，`break` 特定标签推出特定 `loop`

### while

```rust
fn main() {
    let mut number = 3;

    while number != 0 {
        println!("{number}!");

        number -= 1;
    }

    println!("LIFTOFF!!!");
}
```

### for

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a {
        println!("the value is: {element}");
    }
}
```
