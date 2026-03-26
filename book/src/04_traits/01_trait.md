# 트레이트 (Traits)

`Ticket` 타입을 다시 한번 살펴봅시다:

```rust
pub struct Ticket {
    title: String,
    description: String,
    status: String,
}
```

지금까지 우리는 `Ticket`의 각 필드에 접근해서 테스트를 수행해 왔습니다.

```rust
assert_eq!(ticket.title(), "A new title");
```

그런데 만약 두 개의 `Ticket` 인스턴스를 직접 비교하고 싶다면 어떻게 해야 할까요?

```rust
let ticket1 = Ticket::new(/* ... */);
let ticket2 = Ticket::new(/* ... */);
ticket1 == ticket2
```

이 코드를 실행하면 컴파일러가 다음과 같은 오류를 냅니다.

```text
error[E0369]: binary operation `==` cannot be applied to type `Ticket`
  --> src/main.rs:18:13
   |
18 |     ticket1 == ticket2
   |     ------- ^^ ------- Ticket
   |     |
   |     Ticket
   |
note: an implementation of `PartialEq` might be missing for `Ticket`
```

`Ticket`은 우리가 새롭게 정의한 타입입니다. 기본적으로 **어떠한 동작도 정의되어 있지 않죠.** 
내부에 `String` 필드가 있다고 해서 Rust가 마법처럼 두 `Ticket` 인스턴스를 비교하는 법을 알아서 추측해 주지는 않습니다.

하지만 컴파일러의 힌트를 보면 `PartialEq`를 구현해보라고 제안하고 있습니다. 바로 이 `PartialEq`가 **트레이트(Trait)**입니다!

## 트레이트란 무엇인가요?

트레이트는 Rust에서 **인터페이스(Interfaces)**를 정의하는 방식입니다. 트레이트는 특정 타입이 가져야 할 기능을 명세하며, 해당 트레이트를 구현하고자 하는 타입은 명세된 메서드들을 반드시 정의해야 합니다.

### 트레이트 정의하기

트레이트를 정의하는 구문은 다음과 같습니다:

```rust
trait <TraitName> {
    fn <method_name>(<parameters>) -> <return_type>;
}
```

예를 들어, 어떤 값이 0인지 확인하는 기능을 요구하는 `MaybeZero` 트레이트를 만들어 봅시다:

```rust
trait MaybeZero {
    fn is_zero(self) -> bool;
}
```

### 트레이트 구현하기

특정 타입에 대해 트레이트를 구현할 때는 `impl` 키워드를 사용합니다. 구문은 일반적인 메서드 구현[^inherent]과 약간 다릅니다:

```rust
impl <TraitName> for <TypeName> {
    fn <method_name>(<parameters>) -> <return_type> {
        // 메서드 본문
    }
}
```

사용자 정의 타입인 `WrappingU32`에 `MaybeZero` 트레이트를 구현하면 다음과 같습니다:

```rust
pub struct WrappingU32 {
    inner: u32,
}

impl MaybeZero for WrappingU32 {
    fn is_zero(self) -> bool {
        self.inner == 0
    }
}
```

### 트레이트 메서드 호출하기

트레이트 메서드도 일반 메서드와 마찬가지로 `.` 연산자를 사용하여 호출합니다.

```rust
let x = WrappingU32 { inner: 5 };
assert!(!x.is_zero());
```

트레이트 메서드를 사용하려면 다음 두 가지 조건이 충족되어야 합니다.

1. 타입이 해당 트레이트를 구현하고 있어야 함.
2. 해당 트레이트가 현재 범위(Scope) 안에 있어야 함.

두 번째 조건을 만족시키기 위해 `use` 문이 필요할 수도 있습니다:

```rust
use crate::MaybeZero;
```

단, 다음과 같은 경우에는 `use`가 필요 없습니다.

- 트레이트가 메서드를 호출하는 모듈 안에 정의된 경우
- 트레이트가 표준 라이브러리의 **프렐류드(Prelude)**에 포함된 경우
  - 프렐류드는 모든 Rust 프로그램에 자동으로 로드되는 트레이트와 타입들의 집합입니다. 마치 모든 Rust 파일 시작 부분에 `use std::prelude::*;`가 적혀있는 것과 같습니다.

프렐류드에 포함된 항목들은 [Rust 공식 문서](https://doc.rust-lang.org/std/prelude/index.html)에서 확인할 수 있습니다.

[^inherent]: 트레이트 없이 타입 자체에 직접 정의된 메서드는 **고유 메서드(Inherent methods)**라고 부릅니다.
