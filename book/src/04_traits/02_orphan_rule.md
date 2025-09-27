# 트레이트 구현하기

타입이 다른 크레이트(예: Rust의 표준 라이브러리의 `u32`)에 정의된 경우, 직접 새로운 메소드를 정의할 수 없습니다. 시도하면:

```rust
impl u32 {
    fn is_even(&self) -> bool {
        self % 2 == 0
    }
}
```

컴파일러가 불평할 것입니다:

```text
error[E0390]: cannot define inherent `impl` for primitive types
  |
1 | impl u32 {
  | ^^^^^^^^
  |
  = help: consider using an extension trait instead
```

## 확장 트레이트

**확장 트레이트**는 `u32`와 같은 외부 타입에 새로운 메소드를 첨부하는 것이 주된 목적인 트레이트입니다.
이것이 바로 이전 연습 문제에서 `IsEven` 트레이트를 정의한 다음 `i32` 및 `u32`에 대해 구현하여 배포한 패턴입니다. 그런 다음 `IsEven`이 범위 내에 있는 한 해당 타입에서 `is_even`을 자유롭게 호출할 수 있습니다.

```rust
// 트레이트를 범위로 가져오기
use my_library::IsEven;

fn main() {
    // 구현하는 타입에서 메소드 호출하기
    if 4.is_even() {
        // [...] 
    }
}
```

## 하나의 구현

작성할 수 있는 트레이트 구현에는 제한이 있습니다.\
가장 간단하고 직접적인 것은 크레이트에서 동일한 타입에 대해 동일한 트레이트를 두 번 구현할 수 없다는 것입니다.

예를 들어:

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

컴파일러는 이를 거부합니다:

```text
error[E0119]: conflicting implementations of trait `IsEven` for type `u32`
   |
5  | impl IsEven for u32 {
   | ------------------- first implementation here
...
11 | impl IsEven for u32 {
   | ^^^^^^^^^^^^^^^^^^^ conflicting implementation for `u32`
```

`u32` 값에서 `IsEven::is_even`이 호출될 때 어떤 트레이트 구현을 사용해야 하는지에 대한 모호함이 없어야 하므로 하나만 있을 수 있습니다.

## 고아 규칙

여러 크레이트가 관련된 경우 상황이 더 미묘해집니다.
특히 다음 중 적어도 하나는 사실이어야 합니다:

- 트레이트가 현재 크레이트에 정의되어 있습니다.
- 구현자 타입이 현재 크레이트에 정의되어 있습니다.

이것은 Rust의 **고아 규칙**으로 알려져 있습니다. 그 목표는 메소드 확인 프로세스를 명확하게 만드는 것입니다.

다음 상황을 상상해 보십시오:

- 크레이트 `A`는 `IsEven` 트레이트를 정의합니다.
- 크레이트 `B`는 `u32`에 대해 `IsEven`을 구현합니다.
- 크레이트 `C`는 `u32`에 대해 (다른) `IsEven` 트레이트 구현을 제공합니다.
- 크레이트 `D`는 `B`와 `C` 모두에 의존하고 `1.is_even()`을 호출합니다.

어떤 구현을 사용해야 할까요? `B`에 정의된 것? 아니면 `C`에 정의된 것?
좋은 답이 없으므로 이 시나리오를 방지하기 위해 고아 규칙이 정의되었습니다.
고아 규칙 덕분에 크레이트 `B`나 크레이트 `C` 모두 컴파일되지 않습니다.

## 추가 자료

- 위에서 언급한 고아 규칙에는 몇 가지 주의 사항과 예외가 있습니다.
  미묘한 차이에 익숙해지고 싶다면 [참조](https://doc.rust-lang.org/reference/items/implementations.html#trait-implementation-coherence)를 확인하십시오.