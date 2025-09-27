# `impl Trait`

`TicketStore::to_dos`는 `Vec<&Ticket>`을 반환합니다.
이 시그니처는 `to_dos`가 호출될 때마다 새로운 힙 할당을 도입하며, 이는 호출자가 결과로 무엇을 해야 하는지에 따라 불필요할 수 있습니다.
`to_dos`가 `Vec` 대신 반복자를 반환하여 호출자가 결과를 `Vec`으로 수집할지 아니면 단순히 반복할지 결정할 수 있도록 하는 것이 더 좋을 것입니다.

하지만 그것은 까다롭습니다!
아래에 구현된 `to_dos`의 반환 타입은 무엇일까요?

```rust
impl TicketStore {
    pub fn to_dos(&self) -> ??? {
        self.tickets.iter().filter(|t| t.status == Status::ToDo)
    }
}
```

## 이름 없는 타입

`filter` 메소드는 `std::iter::Filter`의 인스턴스를 반환하며, 다음과 같은 정의를 가집니다:

```rust
pub struct Filter<I, P> { /* 필드 생략 */ }
```

여기서 `I`는 필터링되는 반복자의 타입이고 `P`는 요소를 필터링하는 데 사용되는 술어입니다.
이 경우 `I`는 `std::slice::Iter<'_, Ticket>`이라는 것을 알지만, `P`는 무엇일까요?
`P`는 클로저, 즉 **익명 함수**입니다. 이름에서 알 수 있듯이 클로저는 이름이 없으므로 코드에 작성할 수 없습니다.

Rust에는 이에 대한 해결책이 있습니다: **impl Trait**입니다.

## `impl Trait`

`impl Trait`는 타입의 이름을 지정하지 않고 타입을 반환할 수 있게 해주는 기능입니다.
타입이 구현하는 트레이트를 선언하기만 하면 Rust가 나머지를 알아서 처리합니다.

이 경우, `Ticket`에 대한 참조 반복자를 반환하고 싶습니다:

```rust
impl TicketStore {
    pub fn to_dos(&self) -> impl Iterator<Item = &Ticket> {
        self.tickets.iter().filter(|t| t.status == Status::ToDo)
    }
}
```

그게 다입니다!

## 제네릭?

반환 위치의 `impl Trait`는 제네릭 매개변수가 **아닙니다**.

제네릭은 함수의 호출자가 채우는 타입에 대한 자리 표시자입니다.
제네릭 매개변수가 있는 함수는 **다형적**입니다: 다른 타입으로 호출될 수 있으며, 컴파일러는 각 타입에 대해 다른 구현을 생성합니다.

`impl Trait`의 경우는 그렇지 않습니다.
`impl Trait`가 있는 함수의 반환 타입은 컴파일 타임에 **고정**되며, 컴파일러는 이에 대한 단일 구현을 생성합니다.
이것이 `impl Trait`가 **불투명 반환 타입**이라고도 불리는 이유입니다: 호출자는 반환 값의 정확한 타입을 알지 못하고, 지정된 트레이트를 구현한다는 것만 압니다. 하지만 컴파일러는 정확한 타입을 알고 있으며, 다형성은 관련되지 않습니다.

## RPIT

RFC나 Rust에 대한 심층 분석을 읽다 보면 **RPIT**라는 약어를 접할 수 있습니다.
이는 **"Return Position Impl Trait"**의 약자이며, 반환 위치에서 `impl Trait`를 사용하는 것을 의미합니다.