# 트레이트 구현하기 (Implementing Traits)

Rust의 표준 라이브러리에 정의된 타입(예: `u32`)에 직접 새로운 메서드를 정의하려고 하면 어떻게 될까요?

```rust
impl u32 {
    fn is_even(&self) -> bool {
        self % 2 == 0
    }
}
```

안타깝게도 컴파일러는 이를 허용하지 않습니다.

```text
error[E0390]: cannot define inherent `impl` for primitive types
  |
1 | impl u32 {
  | ^^^^^^^^
  |
  = help: consider using an extension trait instead
```

## 확장 트레이트 (Extension Traits)

**확장 트레이트(Extension Traits)**는 외부 타입에 새로운 메서드를 추가할 때 사용하는 패턴입니다. 이전 연습 문제에서 보았던 것처럼, `IsEven` 트레이트를 정의하고 `i32`와 `u32`에 구현한 뒤, 해당 트레이트가 스코프 안에 있다면 해당 타입들에서 `is_even` 메서드를 자유롭게 호출할 수 있습니다.

```rust
// 트레이트를 스코프로 가져옵니다.
use my_library::IsEven;

fn main() {
    // 이제 해당 타입에서 메서드를 호출할 수 있습니다.
    if 4.is_even() {
        // [...] 
    }
}
```

## 유일한 구현 (One Implementation)

트레이트를 구현할 때는 한 가지 제약이 있습니다. 동일한 크레이트 내에서 특정 타입에 대해 같은 트레이트를 두 번 구현할 수 없다는 점입니다.

```rust
trait IsEven {
    fn is_even(&self) -> bool;
}

impl IsEven for u32 {
    fn is_even(&self) -> bool {
        true
    }
}

impl IsEven for u32 {
    fn is_even(&self) -> bool {
        false
    }
}
```

컴파일러는 이를 다음과 같이 거절합니다.

```text
error[E0119]: conflicting implementations of trait `IsEven` for type `u32`
   |
5  | impl IsEven for u32 {
   | ------------------- first implementation here
...
11 | impl IsEven for u32 {
   | ^^^^^^^^^^^^^^^^^^^ conflicting implementation for `u32`
```

메서드 호출 시 어떤 구현체를 사용해야 할지 모호함이 없어야 하기 때문입니다.

## 고아 규칙 (Orphan Rule)

여러 크레이트가 얽혀 있는 상황에서는 구현 규칙이 조금 더 복잡해집니다. 이를 **고아 규칙(Orphan Rule)**이라고 부르며, 다음 중 하나라도 충족되어야 트레이트 구현이 가능합니다.

1. 구현할 **트레이트**가 현재 크레이트에 정의되어 있음.
2. 구현할 **타입**이 현재 크레이트에 정의되어 있음.

이 규칙의 목적은 메서드 탐색 과정을 명확하게 보장하는 것입니다. 만약 이런 규칙이 없다면 어떤 문제가 생길까요?

- 크레이트 `A`가 `IsEven` 트레이트를 정의함.
- 크레이트 `B`가 `u32`에 대해 `IsEven`을 구현함.
- 크레이트 `C`가 `u32`에 대해 (서로 다른) `IsEven`을 구현함.
- 크레이트 `D`가 `B`와 `C`를 모두 참조하고 `1.is_even()`을 호출함.

이때 어떤 구현을 사용해야 할까요? 정답이 없기 때문에 Rust는 이러한 시나리오 자체가 발생하지 않도록 고아 규칙을 적용합니다. 결과적으로 크레이트 `B`와 `C`는 컴파일되지 않습니다.

## 추가 자료 (Further Reading)

- 고아 규칙에는 몇 가지 예외 사항이 있습니다. 더 깊이 있는 내용이 궁금하시다면 [Rust 레퍼런스](https://doc.rust-lang.org/reference/items/implementations.html#trait-implementation-coherence)를 참고해 보세요.
