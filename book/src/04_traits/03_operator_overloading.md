# 연산자 오버로딩

이제 트레이트가 무엇인지 기본적으로 이해했으니 **연산자 오버로딩**으로 다시 돌아가 봅시다.
연산자 오버로딩은 `+`, `-`, `*`, `/`, `==`, `!=` 등과 같은 연산자에 대한 사용자 정의 동작을 정의하는 기능입니다.

## 연산자는 트레이트입니다

Rust에서 연산자는 트레이트입니다.
각 연산자에 대해 해당 연산자의 동작을 정의하는 해당 트레이트가 있습니다.
타입에 대해 해당 트레이트를 구현하면 해당 연산자의 사용을 **잠금 해제**할 수 있습니다.

예를 들어, [`PartialEq` 트레이트](https://doc.rust-lang.org/std/cmp/trait.PartialEq.html)는 `==` 및 `!=` 연산자의 동작을 정의합니다:

```rust
// Rust의 표준 라이브러리에서 가져온 `PartialEq` 트레이트 정의
// (지금은 *약간* 단순화되었습니다)
pub trait PartialEq {
    // 필수 메소드
    //
    // `Self`는 "트레이트를 구현하는 타입"을 의미하는 Rust 키워드입니다.
    fn eq(&self, other: &Self) -> bool;

    // 제공되는 메소드
    fn ne(&self, other: &Self) -> bool { ... }
}
```

`x == y`를 작성하면 컴파일러는 `x`와 `y`의 타입에 대한 `PartialEq` 트레이트 구현을 찾고 `x == y`를 `x.eq(y)`로 바꿉니다. 이것은 문법적 설탕입니다!

주요 연산자에 대한 대응 관계는 다음과 같습니다:

| 연산자                 | 트레이트                                                                   |
| ------------------------ | ----------------------------------------------------------------------- |
| `+`                      | [`Add`](https://doc.rust-lang.org/std/ops/trait.Add.html)               |
| `-`                      | [`Sub`](https://doc.rust-lang.org/std/ops/trait.Sub.html)               |
| `*`                      | [`Mul`](https://doc.rust-lang.org/std/ops/trait.Mul.html)               |
| `/`                      | [`Div`](https://doc.rust-lang.org/std/ops/trait.Div.html)               |
| `%`                      | [`Rem`](https://doc.rust-lang.org/std/ops/trait.Rem.html)               |
| `==` 및 `!=`            | [`PartialEq`](https://doc.rust-lang.org/std/cmp/trait.PartialEq.html)   |
| `<`, `>`, `<=`, 및 `>=` | [`PartialOrd`](https://doc.rust-lang.org/std/cmp/trait.PartialOrd.html) |

산술 연산자는 [`std::ops`](https://doc.rust-lang.org/std/ops/index.html) 모듈에 있고, 비교 연산자는 [`std::cmp`](https://doc.rust-lang.org/std/cmp/index.html) 모듈에 있습니다.

## 기본 구현

`PartialEq::ne`에 대한 주석에는 "`ne`는 제공되는 메소드입니다"라고 명시되어 있습니다.
이는 `PartialEq`가 트레이트 정의에서 `ne`에 대한 **기본 구현**을 제공한다는 것을 의미합니다. 정의 스니펫에서 생략된 `{ ... }` 블록입니다.
생략된 블록을 확장하면 다음과 같습니다:

```rust
pub trait PartialEq {
    fn eq(&self, other: &Self) -> bool;

    fn ne(&self, other: &Self) -> bool {
        !self.eq(other)
    }
}
```

예상대로입니다: `ne`는 `eq`의 부정입니다.
기본 구현이 제공되므로 타입에 대해 `PartialEq`를 구현할 때 `ne` 구현을 건너뛸 수 있습니다.
`eq`를 구현하는 것으로 충분합니다:

```rust
struct WrappingU8 {
    inner: u8,
}

impl PartialEq for WrappingU8 {
    fn eq(&self, other: &WrappingU8) -> bool {
        self.inner == other.inner
    }
    
    // 여기에 `ne` 구현 없음
}
```

하지만 기본 구현을 사용하도록 강제되지는 않습니다.
트레이트를 구현할 때 재정의하도록 선택할 수 있습니다:

```rust
struct MyType;

impl PartialEq for MyType {
    fn eq(&self, other: &MyType) -> bool {
        // 사용자 정의 구현
    }

    fn ne(&self, other: &MyType) -> bool {
        // 사용자 정의 구현
    }
}
```