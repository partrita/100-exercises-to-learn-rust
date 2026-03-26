# 라이프타임(Lifetimes)

`for` 루프에서 최대한의 편의를 위해 `&TicketStore`에 대한 `IntoIterator` 구현을 추가해 보겠습니다.

구현에서 가장 "명백한" 부분부터 채워 넣어 볼까요?

```rust
impl IntoIterator for &TicketStore {
    type Item = &Ticket;
    type IntoIter = // 여기에 무엇이 들어갈까요?

    fn into_iter(self) -> Self::IntoIter {
        self.tickets.iter()
    }
}
```

`type IntoIter`에는 무엇을 넣어야 할까요? 직관적으로 생각하면 `self.tickets.iter()`가 반환하는 타입, 즉 `Vec::iter()`가 반환하는 타입이 되어야 할 것입니다. 표준 라이브러리 문서를 확인해 보면 `Vec::iter()`는 `std::slice::Iter`를 반환함을 알 수 있습니다. `Iter`의 정의는 다음과 같습니다.

```rust
pub struct Iter<'a, T> { /* 필드 생략 */ }
```

여기서 `'a`는 바로 **라이프타임 매개변수(Lifetime parameter)**입니다.

## 라이프타임 매개변수

**라이프타임(Lifetimes)**은 Rust 컴파일러가 참조(가변 혹은 불변 참조 모두 해당)가 유효한 기간을 추적하기 위해 사용하는 **레이블(Label)**입니다. 참조의 수명은 그 참조가 가리키는 실제 값의 **스코프(Scope)**에 의해 결정됩니다. Rust는 참조가 가리키는 값이 이미 메모리에서 사라졌는데도 그 참조를 사용하는 일, 즉 **댕글링 포인터(Dangling pointer)**나 **해제 후 사용(Use-after-free)** 버그를 방지하기 위해 컴파일 시점에 라이프타임을 검사합니다.

어딘가 익숙하시죠? 소유권과 빌림을 배울 때 이미 실제로 겪어본 개념들입니다. 라이프타임은 그저 특정 참조가 유효한 기간을 **명시적으로 이름 붙이는** 방법일 뿐입니다.

보통은 라이프타임을 명시하지 않아도 되지만, 여러 참조가 얽혀 있고 이들이 서로 어떻게 **관련되어 있는지** 명확히 해야 할 때 이름을 붙여야 하는 경우가 생깁니다. `Vec::iter()`의 시그니처를 예로 들어보겠습니다.

```rust
impl <T> Vec<T> {
    // 설명을 위해 약간 단순화했습니다.
    pub fn iter<'a>(&'a self) -> Iter<'a, T> {
        // [...]
    }
}
```

`Vec::iter()`는 `'a`라는 라이프타임 매개변수를 사용합니다. 이 `'a`는 `Vec`의 수명과 `iter()`가 반환하는 `Iter`의 수명을 **함께 묶어주는** 역할을 합니다. 쉽게 말해, `iter()`가 반환한 `Iter`는 이 `Iter`를 만든 `Vec` 참조(`&self`)보다 더 오래 살아남을 수 없다는 뜻입니다.

이는 매우 중요합니다. `Vec::iter`는 이름 그대로 `Vec` 안의 요소들에 대한 **참조**를 반환하기 때문입니다. 만약 `Vec` 자체가 메모리에서 사라지면 반복자가 반환한 참조들도 모두 무효화됩니다. Rust는 이런 안전하지 않은 상황이 발생하지 않도록 라이프타임이라는 도구를 사용하여 이 규칙을 강제합니다.

## 라이프타임 생략(Lifetime Elision)

사실 Rust에는 **라이프타임 생략 규칙(Lifetime elision rules)**이라는 것이 있어서, 많은 경우에 라이프타임을 일일이 적어주지 않아도 됩니다. 예를 들어 실제 `std` 소스 코드에서 `Vec::iter`는 다음과 같이 정의되어 있습니다.

```rust
impl <T> Vec<T> {
    pub fn iter(&self) -> Iter<'_, T> {
        // [...]
    }
}
```

보시다시피 명시적인 라이프타임 매개변수가 보이지 않습니다. 생략 규칙 덕분에 컴파일러는 `iter()`가 반환하는 `Iter`의 수명이 `&self`의 수명과 연결되어 있음을 자동으로 알아챕니다. 여기서 `'_`는 `&self`의 수명을 가리키는 **자리 표시자**로 생각하시면 됩니다.

더 자세한 내용은 [참조](#references) 섹션의 공식 문서를 확인해 보세요. 대부분의 경우 라이프타임을 명시해야 할 때는 친절하게 컴파일러가 알려주니 너무 걱정하지 않으셔도 됩니다!

## 참조

- [std::vec::Vec::iter](https://doc.rust-lang.org/std/vec/struct.Vec.html#method.iter)
- [std::slice::Iter](https://doc.rust-lang.org/std/slice/struct.Iter.html)
- [라이프타임 생략 규칙(Lifetime Elision Rules)](https://doc.rust-lang.org/reference/lifetime-elision.html)