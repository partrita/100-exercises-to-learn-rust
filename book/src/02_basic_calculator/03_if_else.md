# 제어 흐름(Control flow) - 1부

지금까지 우리가 작성한 프로그램은 아주 단순했습니다. 명령어들이 위에서 아래로 순서대로 실행되고 나면 끝이었죠.

이제 조건에 따라 다른 코드를 실행하는 **분기(Branching)**를 배워볼 시간입니다.

## `if` 문

`if` 키워드는 특정 조건이 참(True)일 때만 코드 블록을 실행하고 싶을 때 사용합니다.

간단한 예를 살펴볼까요?

```rust
let number = 3;
if number < 5 {
    println!("`number`가 5보다 작습니다.");
}
```

이 프로그램은 `number < 5`라는 조건이 참이므로, "`number`가 5보다 작습니다."라는 메시지를 출력합니다.

### `else` 절

대부분의 프로그래밍 언어와 마찬가지로, Rust도 `if` 조건이 거짓일 때 실행할 `else` 분기를 지원합니다.

```rust
let number = 3;

if number < 5 {
    println!("`number`가 5보다 작습니다.");
} else {
    println!("`number`가 5보다 크거나 같습니다.");
}
```

### `else if` 절

여러 조건을 검사해야 할 때 `if`를 계속 중첩해서 쓰면, 코드가 점점 오른쪽으로 밀려나 보기 힘들어집니다.

```rust
let number = 3;

if number < 5 {
    println!("`number`가 5보다 작습니다.");
} else {
    if number >= 3 {
        println!("`number`가 3 이상 5 미만입니다.");
    } else {
        println!("`number`가 3보다 작습니다.");
    }
}
```

이럴 때는 `else if` 키워드를 사용하여 여러 조건을 깔끔하게 하나로 묶을 수 있습니다.

```rust
let number = 3;

if number < 5 {
    println!("`number`가 5보다 작습니다.");
} else if number >= 3 {
    println!("`number`가 3 이상 5 미만입니다.");
} else {
    println!("`number`가 3보다 작습니다.");
}
```

## 불리언(Booleans)

`if` 문 뒤에 오는 조건은 반드시 `bool` 타입, 즉 **불리언**이어야 합니다.

불리언은 정수와 마찬가지로 Rust의 기본 데이터 타입 중 하나입니다. 값은 오직 `true` 또는 `false` 중 하나만 가질 수 있습니다.

### "참 같은 값(Truthy)"이나 "거짓 같은 값(Falsy)"은 없습니다

Rust는 `if` 문의 조건으로 불리언이 아닌 값을 넣으면 컴파일 오류를 냅니다.

예를 들어, 다음과 같은 코드는 컴파일되지 않습니다.

```rust
let number = 3;
if number {
    println!("`number`는 0이 아닙니다.");
}
```

컴파일 시 다음과 같은 오류가 발생합니다.

```text
error[E0308]: mismatched types
 --> src/main.rs:3:8
  | 
3 |     if number {
  |        ^^^^^^ expected `bool`, found integer
```

이는 타입 변환에 대한 Rust의 엄격한 철학 때문입니다. 불리언이 아닌 타입을 불리언으로 자동 변환해주지 않거든요.
Rust에는 JavaScript나 Python에 있는 **참 같은(Truthy)** 또는 **거짓 같은(Falsy)** 값이라는 개념이 아예 없습니다. 따라서 우리가 확인하려는 조건을 명확하게 불리언 형식으로 작성해야 합니다.

### 비교 연산자(Comparison operators)

`if` 문에서 조건을 만들 때는 보통 비교 연산자를 많이 사용합니다. 정수 데이터에서 사용할 수 있는 비교 연산자는 다음과 같습니다.

- `==`: 같음
- `!=`: 같지 않음
- `<`: 작음
- `>`: 큼
- `<=`: 작거나 같음
- `>=`: 크거나 같음

## `if/else`는 표현식(Expression)입니다

Rust에서 `if`는 단순한 명령(Statement)이 아니라 값을 반환하는 **표현식**입니다. 즉, `if`의 결과값을 변수에 바로 할당하거나 다른 계산에 활용할 수 있습니다.

```rust
let number = 3;
let message = if number < 5 {
    "5보다 작음"
} else {
    "5보다 크거나 같음"
};
```

위 예제에서 `if`와 `else` 각 분기의 결과값이 `message` 변수에 할당됩니다. 여기서 주의할 점은, `if`와 `else`의 각 분기가 **반드시 같은 타입의 값을 반환해야 한다**는 점입니다.
