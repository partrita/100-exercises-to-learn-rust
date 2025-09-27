# `TryFrom` 및 `TryInto`

이전 챕터에서 우리는 **실패하지 않는** 타입 변환을 위한 Rust의 관용적인 인터페이스인 [`From` 및 `Into` 트레이트](../04_traits/09_from.md)를 살펴보았습니다.
하지만 변환이 성공할 것이라고 보장되지 않는다면 어떻게 될까요?

이제 오류에 대해 충분히 알았으므로 `From` 및 `Into`의 **실패 가능한** 대응물인 `TryFrom` 및 `TryInto`에 대해 논의할 수 있습니다.

## `TryFrom` 및 `TryInto`

`TryFrom`과 `TryInto`는 모두 `From` 및 `Into`와 마찬가지로 `std::convert` 모듈에 정의되어 있습니다.

```rust
pub trait TryFrom<T>: Sized {
    type Error;
    fn try_from(value: T) -> Result<Self, Self::Error>;
}

pub trait TryInto<T>: Sized {
    type Error;
    fn try_into(self) -> Result<T, Self::Error>;
}
```

`From`/`Into`와 `TryFrom`/`TryInto`의 주요 차이점은 후자가 `Result` 타입을 반환한다는 것입니다.
이를 통해 변환이 실패할 수 있으며, 패닉을 일으키는 대신 오류를 반환할 수 있습니다.

## `Self::Error`

`TryFrom`과 `TryInto`는 모두 연관된 `Error` 타입을 가지고 있습니다.
이를 통해 각 구현은 시도되는 변환에 가장 적합한 자체 오류 타입을 지정할 수 있습니다.

`Self::Error`는 트레이트 자체에 정의된 `Error` 연관 타입을 참조하는 방법입니다.

## 이중성

`From` 및 `Into`와 마찬가지로 `TryFrom` 및 `TryInto`는 이중 트레이트입니다.
타입에 대해 `TryFrom`을 구현하면 `TryInto`를 무료로 얻을 수 있습니다.