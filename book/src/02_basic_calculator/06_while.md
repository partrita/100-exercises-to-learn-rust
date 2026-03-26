# 반복문(Loops) - 1부: `while`

이전 연습 문제에서 `factorial` 함수를 구현할 때 재귀(Recursion)를 사용했었죠. 함수형 프로그래밍에 익숙한 분들에게는 자연스러운 방식이겠지만, C나 Python 같은 명령형(Imperative) 언어를 주로 써오신 분들에게는 조금 낯설게 느껴졌을 수도 있습니다.

이번에는 재귀 대신 **반복문(Loops)**을 사용해서 똑같은 기능을 구현하는 방법을 알아보겠습니다.

## `while` 루프

`while` 루프는 특정 **조건**이 참인 동안 코드 블록을 반복해서 실행하는 방식입니다. 기본적인 형태는 다음과 같습니다.

```rust
while <조건> {
    // 반복 실행할 코드
}
```

예를 들어, 1부터 5까지의 숫자를 모두 더하고 싶다면 다음과 같이 작성할 수 있습니다.

```rust
let sum = 0;
let i = 1;

// "i가 5보다 작거나 같은 동안 반복"
while i <= 5 {
    // `+=`는 `sum = sum + i`를 줄여 쓴 것입니다.
    sum += i;
    i += 1;
}
```

이 코드는 `i`가 5보다 커질 때까지 `i`를 1씩 증가시키며 `sum`에 더하는 과정을 반복합니다.

## `mut` 키워드

하지만 위에서 작성한 예제 코드를 그대로 실행하면 컴파일 오류가 발생합니다.

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
...
```

그 이유는 Rust의 변수가 기본적으로 **불변(Immutable)**이기 때문입니다. 한 번 값을 할당하고 나면, 나중에 그 값을 마음대로 바꿀 수 없죠.

변수의 값을 수정하고 싶다면 선언할 때 `mut` 키워드를 붙여서 해당 변수가 **가변(Mutable)**임을 명시해야 합니다.

```rust
// 이제 `sum`과 `i`의 값을 마음껏 바꿀 수 있습니다!
let mut sum = 0;
let mut i = 1;

while i <= 5 {
    sum += i;
    i += 1;
}
```

이렇게 수정하면 오류 없이 정상적으로 컴파일되고 실행됩니다.

## 더 읽어보기

- [`while` 루프 공식 문서](https://doc.rust-lang.org/std/keyword.while.html)
