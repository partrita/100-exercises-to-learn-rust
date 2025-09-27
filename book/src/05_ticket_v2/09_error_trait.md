# Error 트레이트

## 오류 보고

이전 연습 문제에서는 `TitleError` 베리언트를 구조 분해하여 오류 메시지를 추출하고 `panic!` 매크로에 전달해야 했습니다.
이것은 **오류 보고**의 (기초적인) 예입니다: 오류 타입을 사용자, 서비스 운영자 또는 개발자에게 보여줄 수 있는 표현으로 변환하는 것입니다.

각 Rust 개발자가 자신만의 오류 보고 전략을 만드는 것은 실용적이지 않습니다: 시간 낭비이며 프로젝트 간에 잘 구성되지 않을 것입니다.
이것이 Rust가 `std::error::Error` 트레이트를 제공하는 이유입니다.

## `Error` 트레이트

`Result`의 `Err` 베리언트 타입에는 제약이 없지만, `Error` 트레이트를 구현하는 타입을 사용하는 것이 좋습니다.
`Error`는 Rust의 오류 처리 이야기의 초석입니다:

```rust
// `Error` 트레이트의 약간 단순화된 정의
pub trait Error: Debug + Display {}
```

[`From` 트레이트](../04_traits/09_from.md#supertrait--subtrait)에서 `:` 구문을 기억할 수 있습니다. 이것은 **슈퍼트레이트**를 지정하는 데 사용됩니다.
`Error`의 경우, `Debug`와 `Display` 두 개의 슈퍼트레이트가 있습니다. 타입이 `Error`를 구현하려면 `Debug`와 `Display`도 구현해야 합니다.

## `Display`와 `Debug`

[이전 연습 문제](../04_traits/04_derive.md)에서 `Debug` 트레이트를 이미 접했습니다. 이것은 `assert_eq!`가 단언이 실패할 때 비교하는 변수의 값을 표시하는 데 사용하는 트레이트입니다.

"기계적인" 관점에서 `Display`와 `Debug`는 동일합니다. 타입이 문자열과 유사한 표현으로 변환되는 방법을 인코딩합니다:

```rust
// `Debug`
pub trait Debug {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error>;
}

// `Display`
pub trait Display {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error>;
}
```

차이점은 _목적_에 있습니다: `Display`는 "최종 사용자"를 위한 표현을 반환하는 반면, `Debug`는 개발자 및 서비스 운영자에게 더 적합한 저수준 표현을 제공합니다.
이것이 `Debug`가 `#[derive(Debug)]` 속성을 사용하여 자동으로 구현될 수 있는 반면, `Display`는 수동 구현이 **필요한** 이유입니다.