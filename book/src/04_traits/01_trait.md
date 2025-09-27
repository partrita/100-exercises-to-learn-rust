# 트레이트

`Ticket` 타입을 다시 살펴봅시다:

```rust
pub struct Ticket {
    title: String,
    description: String,
    status: String,
}
```

지금까지 모든 테스트는 `Ticket`의 필드를 사용하여 단언을 수행했습니다.

```rust
assert_eq!(ticket.title(), "A new title");
```

두 `Ticket` 인스턴스를 직접 비교하고 싶다면 어떻게 해야 할까요?

```rust
let ticket1 = Ticket::new(/* ... */);
let ticket2 = Ticket::new(/* ... */);
ticket1 == ticket2
```

컴파일러가 우리를 막을 것입니다:

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

`Ticket`은 새로운 타입입니다. 기본적으로 **어떠한 동작도 연결되어 있지 않습니다**.
Rust는 `String`을 포함하고 있다는 이유만으로 두 `Ticket` 인스턴스를 비교하는 방법을 마술처럼 추론하지 않습니다.

하지만 Rust 컴파일러는 우리를 올바른 방향으로 이끌고 있습니다. `PartialEq`의 구현이 누락되었을 수 있다고 제안합니다. `PartialEq`는 **트레이트**입니다!

## 트레이트란 무엇인가요?

트레이트는 Rust에서 **인터페이스**를 정의하는 방법입니다.
트레이트는 타입이 트레이트의 계약을 만족시키기 위해 구현해야 하는 메소드 집합을 정의합니다.

### 트레이트 정의하기

트레이트 정의 구문은 다음과 같습니다:

```rust
trait <TraitName> {
    fn <method_name>(<parameters>) -> <return_type>;
}
```

예를 들어, 구현자에게 `is_zero` 메소드를 정의하도록 요구하는 `MaybeZero`라는 트레이트를 정의할 수 있습니다:

```rust
trait MaybeZero {
    fn is_zero(self) -> bool;
}
```

### 트레이트 구현하기

타입에 대한 트레이트를 구현하려면 일반적인[^inherent] 메소드와 마찬가지로 `impl` 키워드를 사용하지만 구문이 약간 다릅니다:

```rust
impl <TraitName> for <TypeName> {
    fn <method_name>(<parameters>) -> <return_type> {
        // 메소드 본문
    }
}
```

예를 들어, 사용자 정의 숫자 타입인 `WrappingU32`에 대해 `MaybeZero` 트레이트를 구현하려면:

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

### 트레이트 메소드 호출하기

트레이트 메소드를 호출하려면 일반적인 메소드와 마찬가지로 `.` 연산자를 사용합니다:

```rust
let x = WrappingU32 { inner: 5 };
assert!(!x.is_zero());
```

트레이트 메소드를 호출하려면 두 가지가 사실이어야 합니다:

- 타입이 트레이트를 구현해야 합니다.
- 트레이트가 범위 내에 있어야 합니다.

후자를 만족시키려면 트레이트에 대한 `use` 문을 추가해야 할 수 있습니다:

```rust
use crate::MaybeZero;
```

다음과 같은 경우에는 필요하지 않습니다:

- 트레이트가 호출이 발생하는 동일한 모듈에 정의된 경우.
- 트레이트가 표준 라이브러리의 **프렐류드**에 정의된 경우.
  프렐류드는 모든 Rust 프로그램에 자동으로 가져오는 트레이트 및 타입 집합입니다.
  모든 Rust 모듈의 시작 부분에 `use std::prelude::*;`가 추가된 것과 같습니다.

프렐류드의 트레이트 및 타입 목록은 [Rust 문서](https://doc.rust-lang.org/std/prelude/index.html)에서 찾을 수 있습니다.

[^inherent]: 트레이트를 사용하지 않고 타입에 직접 정의된 메소드는 **고유 메소드**라고도 합니다.