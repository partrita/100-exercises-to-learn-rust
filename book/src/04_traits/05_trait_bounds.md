# 트레이트 바운드

지금까지 트레이트의 두 가지 사용 사례를 보았습니다:

- "내장된" 동작 잠금 해제 (예: 연산자 오버로딩)
- 기존 타입에 새로운 동작 추가 (즉, 확장 트레이트)

세 번째 사용 사례가 있습니다: **제네릭 프로그래밍**입니다.

## 문제점

지금까지 우리의 모든 함수와 메소드는 **구체적인 타입**으로 작업했습니다.
구체적인 타입으로 작동하는 코드는 일반적으로 작성하고 이해하기 쉽습니다. 하지만 재사용성에는 한계가 있습니다.
예를 들어, 정수가 짝수인지 확인하는 함수를 작성하고 싶다고 상상해 봅시다.
구체적인 타입으로 작업하면 지원하려는 각 정수 타입에 대해 별도의 함수를 작성해야 합니다:

```rust
fn is_even_i32(n: i32) -> bool {
    n % 2 == 0
}

fn is_even_i64(n: i64) -> bool {
    n % 2 == 0
}

// 등등.
```

또는 단일 확장 트레이트를 작성한 다음 각 정수 타입에 대해 다른 구현을 작성할 수 있습니다:

```rust
trait IsEven {
    fn is_even(&self) -> bool;
}

impl IsEven for i32 {
    fn is_even(&self) -> bool {
        self % 2 == 0
    }
}

impl IsEven for i64 {
    fn is_even(&self) -> bool {
        self % 2 == 0
    }
}

// 등등.
```

중복은 여전히 남아 있습니다.

## 제네릭 프로그래밍

**제네릭**을 사용하면 더 잘할 수 있습니다.
제네릭을 사용하면 구체적인 타입 대신 **타입 매개변수**로 작동하는 코드를 작성할 수 있습니다:

```rust
fn print_if_even<T>(n: T)
where
    T: IsEven + Debug
{
    if n.is_even() {
        println!("{n:?} is even");
    }
}
```

`print_if_even`은 **제네릭 함수**입니다.
특정 입력 타입에 묶여 있지 않습니다. 대신 다음을 만족하는 모든 타입 `T`와 함께 작동합니다:

- `IsEven` 트레이트를 구현합니다.
- `Debug` 트레이트를 구현합니다.

이 계약은 **트레이트 바운드**로 표현됩니다: `T: IsEven + Debug`.
`+` 기호는 `T`가 여러 트레이트를 구현하도록 요구하는 데 사용됩니다. `T: IsEven + Debug`는 "`T`가 `IsEven` **그리고** `Debug`를 구현하는 곳"과 동일합니다.

## 트레이트 바운드

`print_if_even`에서 트레이트 바운드는 어떤 목적을 수행합니까?
알아보기 위해 제거해 봅시다:

```rust
fn print_if_even<T>(n: T) {
    if n.is_even() {
        println!("{n:?} is even");
    }
}
```

이 코드는 컴파일되지 않습니다:

```text
error[E0599]: no method named `is_even` found for type parameter `T` 
              in the current scope
 --> src/lib.rs:2:10
  |
1 | fn print_if_even<T>(n: T) {
  |                  - method `is_even` not found 
  |                    for this type parameter
2 |     if n.is_even() {
  |          ^^^^^^^ method not found in `T`

error[E0277]: `T` doesn't implement `Debug`
 --> src/lib.rs:3:19
  |
3 |         println!("{n:?} is even");
  |                   ^^^^^ 
  |   `T` cannot be formatted using `{:?}` because 
  |         it doesn't implement `Debug`
  |
help: consider restricting type parameter `T`
  |
1 | fn print_if_even<T: std::fmt::Debug>(n: T) {
  |                   +++++++++++++++++
```

트레이트 바운드가 없으면 컴파일러는 `T`가 **무엇을 할 수 있는지** 알지 못합니다.
`T`에 `is_even` 메소드가 있다는 것을 모르고, `T`를 출력용으로 포맷하는 방법도 모릅니다.
컴파일러의 관점에서 볼 때, 순수한 `T`는 전혀 동작이 없습니다.
트레이트 바운드는 함수 본문에서 요구하는 동작이 존재하도록 보장하여 사용할 수 있는 타입 집합을 제한합니다.

## 구문: 인라인 트레이트 바운드

위의 모든 예제는 트레이트 바운드를 지정하기 위해 **`where` 절**을 사용했습니다:

```rust
fn print_if_even<T>(n: T)
where
    T: IsEven + Debug
//  ^^^^^^^^^^^^^^^^^
//  이것은 `where` 절입니다
{
    // [...]
}
```

트레이트 바운드가 간단하다면 타입 매개변수 바로 옆에 **인라인**으로 지정할 수 있습니다:

```rust
fn print_if_even<T: IsEven + Debug>(n: T) {
    //           ^^^^^^^^^^^^^^^^^
    //           이것은 인라인 트레이트 바운드입니다
    // [...]
}
```

## 구문: 의미 있는 이름

위의 예에서는 타입 매개변수 이름으로 `T`를 사용했습니다. 이것은 함수에 타입 매개변수가 하나만 있을 때 일반적인 관례입니다.
하지만 더 의미 있는 이름을 사용하는 것을 막는 것은 없습니다:

```rust
fn print_if_even<Number: IsEven + Debug>(n: Number) {
    // [...]
}
```

여러 타입 매개변수가 있거나 `T`라는 이름이 타입의 역할에 대한 충분한 정보를 전달하지 않을 때 의미 있는 이름을 사용하는 것이 실제로 **바람직합니다**.
변수나 함수 매개변수와 마찬가지로 타입 매개변수의 이름을 지정할 때 명확성과 가독성을 극대화하십시오.
하지만 Rust의 관례를 따르십시오: [타입 매개변수 이름에는 위쪽 카멜 케이스를 사용하십시오](https://rust-lang.github.io/api-guidelines/naming.html#casing-conforms-to-rfc-430-c-case).

## 함수 시그니처가 왕입니다

트레이트 바운드가 왜 필요한지 궁금할 수 있습니다. 컴파일러가 함수 본문에서 필요한 트레이트를 추론할 수 없나요?
할 수는 있지만, 하지 않을 것입니다.
근거는 [함수 매개변수에 대한 명시적 타입 어노테이션](../02_basic_calculator/02_variables.md#function-arguments-are-variables)과 동일합니다:
각 함수 시그니처는 호출자와 피호출자 간의 계약이며, 조건은 명시적으로 명시되어야 합니다.
이를 통해 더 나은 오류 메시지, 더 나은 문서, 버전 간의 의도하지 않은 손상 감소 및 더 빠른 컴파일 시간을 얻을 수 있습니다.