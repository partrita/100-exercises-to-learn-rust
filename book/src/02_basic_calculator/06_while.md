# 루프, 1부: `while`

`factorial`의 구현은 재귀를 사용하도록 강제되었습니다.\
특히 함수형 프로그래밍 배경을 가진 분들에게는 이것이 자연스럽게 느껴질 수 있습니다.
또는 C나 Python과 같은 더 명령형 언어에 익숙하다면 이상하게 느껴질 수도 있습니다.

대신 **루프**를 사용하여 동일한 기능을 구현하는 방법을 알아봅시다.

## `while` 루프

A `while` 루프는 **조건**이 참인 동안 코드 블록을 실행하는 방법입니다.\
일반적인 구문은 다음과 같습니다:

```rust
while <조건> {
    // 실행할 코드
}
```

예를 들어, 1부터 5까지의 숫자를 더하고 싶을 수 있습니다:

```rust
let sum = 0;
let i = 1;
// "i가 5보다 작거나 같을 동안"
while i <= 5 {
    // `+=`는 `sum = sum + i`의 줄임말입니다
    sum += i;
    i += 1;
}
```

이것은 `i`가 더 이상 5보다 작거나 같지 않을 때까지 `i`에 1을 더하고 `sum`에 `i`를 더하는 것을 계속합니다.

## `mut` 키워드

위의 예제는 그대로 컴파일되지 않습니다. 다음과 같은 오류가 발생합니다:

```text
error[E0384]: cannot assign twice to immutable variable `sum`
 --> src/main.rs:7:9
  |
2 |     let sum = 0;
  |         ---
  |         |
  |         first assignment to `sum`
  |         help: consider making this binding mutable: `mut sum`
...
7 |         sum += i;
  |         ^^^^^^^^ cannot assign twice to immutable variable

error[E0384]: cannot assign twice to immutable variable `i`
 --> src/main.rs:8:9
  |
3 |     let i = 1;
  |         -
  |         |
  |         first assignment to `i`
  |         help: consider making this binding mutable: `mut i`
...
8 |         i += 1;
  |         ^^^^^^ cannot assign twice to immutable variable
```

이는 Rust의 변수가 기본적으로 **불변**이기 때문입니다.\
한 번 할당된 값은 변경할 수 없습니다.

수정을 허용하려면 `mut` 키워드를 사용하여 변수를 **가변**으로 선언해야 합니다:

```rust
// `sum`과 `i`는 이제 가변입니다!
let mut sum = 0;
let mut i = 1;

while i <= 5 {
    sum += i;
    i += 1;
}
```

이것은 오류 없이 컴파일되고 실행됩니다.

## 추가 자료

- [`while` 루프 문서](https://doc.rust-lang.org/std/keyword.while.html)