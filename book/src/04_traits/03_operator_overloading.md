# 연산자 오버로딩 (Operator Overloading)

이제 트레이트에 대한 기본적인 이해가 생겼으니, 다시 **연산자 오버로딩(Operator Overloading)**에 대해 이야기해 봅시다. 연산자 오버로딩은 `+`, `-`, `*`, `/`, `==`, `!=` 등의 연산자에 대해 사용자 정의 동작을 부여하는 기능입니다.

## 연산자는 트레이트입니다 (Operators are Traits)

Rust에서 모든 연산자는 사실 트레이트입니다. 각 연산자의 동작은 특정 트레이트에 정의되어 있으며, 우리가 만든 타입에 해당 트레이트를 구현하면 연산자 사용을 **해제(unlock)**할 수 있습니다.

예를 들어, [`PartialEq` 트레이트](https://doc.rust-lang.org/std/cmp/trait.PartialEq.html)는 `==`와 `!=` 연산자의 동작을 정의합니다.

```rust
// Rust 표준 라이브러리의 `PartialEq` 트레이트 정의(단순화됨)
pub trait PartialEq {
    // 필수 메서드
    // `Self`는 "해당 트레이트를 구현하는 타입"을 의미하는 키워드입니다.
    fn eq(&self, other: &Self) -> bool;

    // 기본 제공 메서드
    fn ne(&self, other: &Self) -> bool { ... }
}
```

여러분이 코드에 `x == y`라고 적으면, 컴파일러는 `x`와 `y`의 타입에 대해 `PartialEq` 트레이트 구현을 찾습니다. 그리고 `x == y`를 `x.eq(y)`로 변환해 줍니다. 일종의 **구문 설탕(Syntactic sugar)**인 셈이죠!

주요 연산자와 그에 대응하는 트레이트는 다음과 같습니다:

| 연산자 | 트레이트 |
| :--- | :--- |
| `+` | [`Add`](https://doc.rust-lang.org/std/ops/trait.Add.html) |
| `-` | [`Sub`](https://doc.rust-lang.org/std/ops/trait.Sub.html) |
| `*` | [`Mul`](https://doc.rust-lang.org/std/ops/trait.Mul.html) |
| `/` | [`Div`](https://doc.rust-lang.org/std/ops/trait.Div.html) |
| `%` | [`Rem`](https://doc.rust-lang.org/std/ops/trait.Rem.html) |
| `==` 및 `!=` | [`PartialEq`](https://doc.rust-lang.org/std/cmp/trait.PartialEq.html) |
| `<`, `>`, `<=`, `>=` | [`PartialOrd`](https://doc.rust-lang.org/std/cmp/trait.PartialOrd.html) |

산술 연산자는 [`std::ops`](https://doc.rust-lang.org/std/ops/index.html) 모듈에, 비교 연산자는 [`std::cmp`](https://doc.rust-lang.org/std/cmp/index.html) 모듈에 위치해 있습니다.

## 기본 구현 (Default Implementation)

`PartialEq::ne` 메서드 정의를 보면 `{ ... }` 블록이 이미 있는 것을 볼 수 있습니다. 이는 `PartialEq` 트레이트가 `ne`에 대한 **기본 구현(Default Implementation)**을 제공한다는 뜻입니다. 생략된 블록을 확장해 보면 다음과 같습니다.

```rust
pub trait PartialEq {
    fn eq(&self, other: &Self) -> bool;

    fn ne(&self, other: &Self) -> bool {
        !self.eq(other)
    }
}
```

우리가 예상할 수 있듯이, `ne`는 단순히 `eq` 결과를 반전시킨 것입니다. 이렇게 기본 구현이 제공되는 경우, 타입에 대해 트레이트를 구현할 때 해당 메서드를 직접 구현하지 않아도 됩니다. `eq`만 구현해도 충분하죠:

```rust
struct WrappingU8 {
    inner: u8,
}

impl PartialEq for WrappingU8 {
    fn eq(&self, other: &WrappingU8) -> bool {
        self.inner == other.inner
    }
    // `ne` 구현은 생략 가능!
}
```

물론 원한다면 기본 구현을 재정의(Override)할 수도 있습니다.

```rust
struct MyType;

impl PartialEq for MyType {
    fn eq(&self, other: &MyType) -> bool {
        // 사용자 정의 eq 구현
    }

    fn ne(&self, other: &MyType) -> bool {
        // 사용자 정의 ne 구현
    }
}
```
