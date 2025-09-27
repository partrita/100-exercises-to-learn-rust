# 제어 흐름, 1부

지금까지 우리의 모든 프로그램은 매우 간단했습니다.\
명령 시퀀스가 위에서 아래로 실행되고 그것으로 끝이었습니다.

이제 **분기**를 도입할 시간입니다.

## `if` 절

`if` 키워드는 조건이 참인 경우에만 코드 블록을 실행하는 데 사용됩니다.

다음은 간단한 예입니다:

```rust
let number = 3;
if number < 5 {
    println!("`number` is smaller than 5");
}
```

이 프로그램은 `number < 5` 조건이 참이므로 `number is smaller than 5`를 인쇄합니다.

### `else` 절

대부분의 프로그래밍 언어와 마찬가지로 Rust는 `if` 표현식의 조건이 거짓일 때 코드 블록을 실행하기 위한 선택적 `else` 분기를 지원합니다.\
예를 들어:

```rust
let number = 3;

if number < 5 {
    println!("`number` is smaller than 5");
} else {
    println!("`number` is greater than or equal to 5");
}
```

### `else if` 절

여러 `if` 표현식이 서로 중첩되어 있으면 코드가 점점 오른쪽으로 치우치게 됩니다.

```rust
let number = 3;

if number < 5 {
    println!("`number` is smaller than 5");
} else {
    if number >= 3 {
        println!("`number` is greater than or equal to 3, but smaller than 5");
    } else {
        println!("`number` is smaller than 3");
    }
}
```

`else if` 키워드를 사용하여 여러 `if` 표현식을 하나로 결합할 수 있습니다:

```rust
let number = 3;

if number < 5 {
    println!("`number` is smaller than 5");
} else if number >= 3 {
    println!("`number` is greater than or equal to 3, but smaller than 5");
} else {
    println!("`number` is smaller than 3");
}
```

## 불리언

`if` 표현식의 조건은 `bool` 타입, 즉 **불리언**이어야 합니다.

불리언은 정수와 마찬가지로 Rust의 기본 타입입니다.

불리언은 `true` 또는 `false` 두 가지 값 중 하나를 가질 수 있습니다.

### 참 같은 값 또는 거짓 같은 값 없음

`if` 표현식의 조건이 불리언이 아니면 컴파일 오류가 발생합니다.

예를 들어, 다음 코드는 컴파일되지 않습니다:

```rust
let number = 3;
if number {
    println!("`number` is not zero");
}
```

다음과 같은 컴파일 오류가 발생합니다:

```text
error[E0308]: mismatched types
 --> src/main.rs:3:8
  | 
3 |     if number {
  |        ^^^^^^ expected `bool`, found integer
```

이는 타입 강제 변환에 대한 Rust의 철학에서 비롯됩니다: 불리언이 아닌 타입에서 불리언으로의 자동 변환은 없습니다.
Rust에는 JavaScript나 Python과 같은 **참 같은(truthy)** 또는 **거짓 같은(falsy)** 값의 개념이 없습니다.
확인하려는 조건을 명시적으로 지정해야 합니다.

### 비교 연산자

`if` 표현식의 조건을 만들기 위해 비교 연산자를 사용하는 것이 매우 일반적입니다.
정수로 작업할 때 Rust에서 사용할 수 있는 비교 연산자는 다음과 같습니다:

- `==`: 같음
- `!=`: 같지 않음
- `<`: 미만
- `>`: 초과
- `<=`: 이하
- `>=`: 이상

## `if/else`는 표현식입니다

Rust에서 `if` 표현식은 문이 아니라 **표현식**입니다: 값을 반환합니다.
그 값은 변수에 할당되거나 다른 표현식에서 사용될 수 있습니다. 예를 들어:

```rust
let number = 3;
let message = if number < 5 {
    "smaller than 5"
} else {
    "greater than or equal to 5"
};
```

위 예에서 `if`의 각 분기는 문자열 리터럴로 평가된 다음 `message` 변수에 할당됩니다.
유일한 요구 사항은 `if`의 두 분기가 모두 동일한 타입을 반환해야 한다는 것입니다.