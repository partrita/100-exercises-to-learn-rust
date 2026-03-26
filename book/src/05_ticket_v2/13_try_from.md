# `TryFrom` 및 `TryInto` 트레이트

이전 장에서 우리는 **실패할 리 없는** 타입 변환을 위한 Rust의 표준 인터페이스인 [`From` 및 `Into` 트레이트](../04_traits/09_from.md)를 살펴보았습니다. 하지만 만약 변환이 항상 성공하리라는 보장이 없다면 어떻게 해야 할까요?

이제 우리는 오류(Error) 처리에 대해 충분히 알고 있으니, `From`과 `Into`에 대응하는 **실패 가능성이 있는(Fallible)** 변환 도구인 `TryFrom`과 `TryInto`에 대해 이야기해 볼 수 있습니다.

## `TryFrom` 및 `TryInto`

`TryFrom`과 `TryInto` 역시 `From`/`Into`와 마찬가지로 `std::convert` 모듈에 정의되어 있습니다.

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

이 트레이트들과 `From`/`Into`의 가장 큰 차이점은 반환 타입이 `Result`라는 점입니다. 덕분에 변환에 실패하더라도 프로그램이 패닉(Panic)에 빠지지 않고, 대신 무엇이 잘못되었는지 알려주는 오류를 안전하게 반환할 수 있습니다.

## `Self::Error`

`TryFrom`과 `TryInto`는 모두 **연관 타입(Associated type)**인 `Error`를 가지고 있습니다. 이것을 통해 트레이트를 구현하는 쪽에서는 해당 변환 상황에 가장 적절한 오류 타입을 자유롭게 지정할 수 있습니다.

`Self::Error`는 트레이트 내부에서 정의된 `Error` 연관 타입을 가리키는 방식입니다.

## 상호 관계(Duality)

`From` 및 `Into`와 마찬가지로, `TryFrom`과 `TryInto`도 긴밀하게 연결되어 있습니다. 특정 타입에 대해 `TryFrom`을 구현하면, Rust는 `TryInto` 구현체를 자동으로 제공해 줍니다. 그러니 보통은 `TryFrom`만 구현하면 된답니다!