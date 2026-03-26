# Error 트레이트 (Error Trait)

## 오류 보고 (Error Reporting)

이전 연습 문제에서는 `TitleError` 베리언트(Variant)를 구조 분해(Destructuring)하여 오류 메시지를 추출한 뒤 `panic!` 매크로에 전달해야 했습니다. 이것이 바로 **오류 보고(Error reporting)**의 아주 기초적인 예입니다. 즉, 오류 타입을 사용자와 개발자, 혹은 시스템 관리자가 이해할 수 있는 형태의 메시지로 변환하는 것이죠.

하지만 Rust의 모든 개발자가 저마다 다른 방식으로 오류를 보고한다면 어떨까요? 시간 낭비일 뿐만 아니라, 프로젝트마다 방식이 달라 코드의 일관성이 크게 떨어질 것입니다. 이것이 바로 Rust가 표준 라이브러리(`std`)에서 `std::error::Error` 트레이트를 제공하는 이유입니다.

## `Error` 트레이트

`Result`의 `Err` 베리언트 타입 자체에는 특별한 제약이 없지만, 보통은 `Error` 트레이트를 구현한 타입을 사용하는 것이 좋습니다.
`Error` 트레이트는 Rust 오류 처리 체계의 핵심입니다.

```rust
// `Error` 트레이트의 정의 (약간 단순화됨)
pub trait Error: Debug + Display {}
```

[`From` 트레이트](../04_traits/09_from.md#supertrait--subtrait)를 다룰 때 보았던 `:` 구문이 기억나시나요? 이는 **상위 트레이트(Supertrait)**를 지정할 때 사용합니다.
`Error` 트레이트의 경우, `Debug`와 `Display`라는 두 개의 상위 트레이트가 있습니다. 즉, 어떤 타입이 `Error` 트레이트를 구현하려면 반드시 `Debug`와 `Display` 트레이트도 함께 구현해야 한다는 뜻입니다.

## `Display`와 `Debug` 트레이트

이미 [이전 연습 문제](../04_traits/04_derive.md)에서 `Debug` 트레이트를 보신 적이 있을 겁니다. `assert_eq!`에서 단언(Assertion)이 실패했을 때 변수의 값을 개발자가 보기 좋게 출력해주던 그 트레이트 말이죠.

기능적인 측면에서 `Display`와 `Debug`는 비슷합니다. 두 트레이트 모두 해당 타입을 문자열과 같은 형태로 변환하는 방법을 정의합니다.

```rust
// `Debug` 정의 pub trait Debug {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error>;
}

// `Display` 정의 pub trait Display {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error>;
}
```

결정적인 차이는 그 **목적**에 있습니다.
- **`Display`**: 일반 사용자에게 보여줄 최종 메시지를 위한 것입니다.
- **`Debug`**: 개발자나 운영자에게 유용한, 시스템 내부의 저수준 정보(Low-level representation)를 보여주기 위한 것입니다.

그렇기 때문에 `Debug` 트레이트는 `#[derive(Debug)]` 어트리뷰트를 사용해 자동으로 생성할 수 있지만, `Display` 트레이트는 어떤 메시지를 보여줄지 여러분이 직접 **수동으로 구현**해야 합니다.