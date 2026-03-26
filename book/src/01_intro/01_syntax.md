# 구문 (Syntax)

<div class="warning">

**잠깐만요!**

이 섹션을 시작하기 전에 이전 섹션의 연습 문제를 먼저 완료해 주세요.
[과정 GitHub 저장소](https://github.com/mainmatter/100-exercises-to-learn-rust)의 `exercises/01_intro/00_welcome` 폴더에 있습니다.
[`wr`](00_welcome.md#wr-the-workshop-runner) 도구를 실행하여 과정을 시작하고 정답을 확인하시기 바랍니다.

</div>

방금 푼 과제는 연습 문제라기엔 아주 간단했지만, 여러분은 이미 Rust **구문**의 기초적인 부분들을 접해보셨습니다.

이전 연습 문제에서 쓰인 모든 문법적 세부 사항을 지금 당장 완벽히 파헤치지는 않을 것입니다. 너무 세세한 내용에 얽매여 지치기보다는, 일단 학습을 계속 이어나갈 수 있을 정도로만 핵심 위주로 짚어보고 넘어가겠습니다. 한 걸음씩 차근차근 나아가 봅시다!

## 주석 (Comments)

한 줄 주석을 작성할 때는 `//`를 사용합니다.

```rust
// 이것은 한 줄 주석입니다.
// 다음 줄에도 주석을 이어 달 수 있습니다.
```

## 함수 (Functions)

Rust에서 함수는 `fn` 키워드로 정의합니다. 그 뒤로 함수 이름, 입력 매개변수(Parameter), 그리고 반환 타입(Return type)이 차례로 옵니다. 함수의 실제 동작을 담은 본문은 중괄호 `{}`로 감쌉니다.

이전 연습 문제에서 보았던 `greeting` 함수를 다시 살펴볼까요?

```rust
// `fn` <함수_이름> ( <입력_매개변수> ) -> <반환_타입> { <본문> }
fn greeting() -> &'static str {
    // TODO: 여기를 수정하세요 👇
    "I'm ready to __!"
}
```

`greeting` 함수는 입력 매개변수가 없으며, 문자열 슬라이스에 대한 참조(`&'static str`)를 반환합니다.

### 반환 타입 (Return type)

함수가 아무런 값도 반환하지 않는 경우(정확히는 Rust의 '유닛 타입'인 `()`를 반환하는 경우), 함수 선언부에서 반환 타입을 생략할 수 있습니다. `test_welcome` 함수가 바로 그런 예입니다.

```rust
fn test_welcome() {
    assert_eq!(greeting(), "I'm ready to learn Rust!");
}
```

위 코드는 사실 아래 코드와 똑같은 의미입니다.

```rust
// 유닛 반환 타입을 명시적으로 적어준 경우
//                   👇
fn test_welcome() -> () {
    assert_eq!(greeting(), "I'm ready to learn Rust!");
}
```

### 값 반환하기

Rust 함수는 본문의 **마지막 표현식(Expression)**의 값을 자동으로 반환합니다. `return` 키워드를 따로 쓰지 않아도 됩니다.

```rust
fn greeting() -> &'static str {
    // 이것이 함수의 마지막 표현식입니다.
    // 따라서 이 값이 `greeting` 함수의 결과로 반환됩니다.
    "I'm ready to learn Rust!"
}
```

물론 `return` 키워드를 사용해 함수 중간에 값을 즉시 반환할 수도 있습니다.

```rust
fn greeting() -> &'static str {
    // return을 사용할 때는 줄 끝에 세미콜론(;)을 붙여야 함에 주의하세요!
    return "I'm ready to learn Rust!";
}
```

Rust에서는 꼭 필요한 경우가 아니라면 `return` 키워드를 생략하는 것을 권장(Idiomatic)합니다.

### 입력 매개변수 (Input parameters)

함수 이름 뒤의 괄호 `()` 안에 입력 매개변수를 선언합니다. 각 매개변수는 `이름: 타입` 순서로 적습니다.

예를 들어, 아래의 `greet` 함수는 `&str` 타입("문자열 슬라이스")의 `name` 매개변수를 받습니다.

```rust
// 입력 매개변수 선언
//        👇
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
```

매개변수가 여러 개라면 쉼표(,)로 구분하여 나열합니다.

### 타입 명시 (Type annotations)

앞서 '타입'이라는 말을 여러 번 언급했는데요, 중요하니까 짚고 넘어갑시다. Rust는 **정적 타입 언어(Statically typed language)**입니다. 즉, Rust의 모든 값은 타입을 가지며, 컴파일러는 빌드 시점에 그 타입이 무엇인지 정확히 알고 있어야 합니다.

타입은 **정적 분석**의 핵심 도구입니다. 컴파일러가 프로그램의 모든 값에 붙이는 '이름표'라고 생각하면 이해하기 쉽습니다. 이 이름표 덕분에 컴파일러는 "문자열에 숫자를 더할 수는 없지만, 숫자끼리는 더할 수 있다"와 같은 규칙을 엄격하게 적용할 수 있습니다. 이를 잘 활용하면 프로그램 실행 중에 발생할 수 있는 수많은 버그를 미리 잡아낼 수 있습니다.
