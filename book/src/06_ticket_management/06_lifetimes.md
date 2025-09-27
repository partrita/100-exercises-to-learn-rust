# 라이프타임

`for` 루프에서 최대한의 편의를 위해 `&TicketStore`에 대한 `IntoIterator` 구현을 추가하여 이전 연습 문제를 완료해 봅시다.

구현의 가장 "명백한" 부분부터 채워 넣겠습니다:

```rust
impl IntoIterator for &TicketStore {
    type Item = &Ticket;
    type IntoIter = // 여기에 무엇이 들어갈까요?

    fn into_iter(self) -> Self::IntoIter {
        self.tickets.iter()
    }
}
```

`type IntoIter`는 무엇으로 설정되어야 할까요?
직관적으로 `self.tickets.iter()`가 반환하는 타입, 즉 `Vec::iter()`가 반환하는 타입이어야 합니다.
표준 라이브러리 문서를 확인하면 `Vec::iter()`가 `std::slice::Iter`를 반환한다는 것을 알 수 있습니다.
`Iter`의 정의는 다음과 같습니다:

```rust
pub struct Iter<'a, T> { /* 필드 생략 */ }
```

`'a`는 **라이프타임 매개변수**입니다.

## 라이프타임 매개변수

라이프타임은 Rust 컴파일러가 참조(가변 또는 불변)가 유효한 기간을 추적하는 데 사용하는 **레이블**입니다.
참조의 라이프타임은 참조하는 값의 스코프에 의해 제한됩니다. Rust는 컴파일 타임에 항상 참조가 가리키는 값이 삭제된 후 사용되지 않도록 하여 댕글링 포인터 및 해제 후 사용 버그를 방지합니다.

이것은 익숙하게 들릴 것입니다: 소유권과 빌림을 논의할 때 이미 이러한 개념을 실제로 보았습니다.
라이프타임은 특정 참조가 유효한 기간을 **명명**하는 방법일 뿐입니다.

여러 참조가 있고 서로 어떻게 **관련되어 있는지** 명확히 해야 할 때 명명은 중요해집니다.
`Vec::iter()`의 시그니처를 살펴봅시다:

```rust
impl <T> Vec<T> {
    // 약간 단순화됨
    pub fn iter<'a>(&'a self) -> Iter<'a, T> {
        // [...]
    }
}
```

`Vec::iter()`는 `'a`라는 라이프타임 매개변수에 대해 제네릭입니다.
`'a`는 `Vec`의 라이프타임과 `iter()`가 반환하는 `Iter`의 라이프타임을 **함께 묶는** 데 사용됩니다.
평이하게 말하면: `iter()`가 반환하는 `Iter`는 생성된 `Vec` 참조(`&self`)보다 오래 살 수 없습니다.

이것은 `Vec::iter`가 논의한 바와 같이 `Vec` 요소에 대한 **참조**를 반환하기 때문에 중요합니다.
`Vec`이 삭제되면 반복자가 반환하는 참조는 유효하지 않게 됩니다. Rust는 이런 일이 발생하지 않도록 해야 하며, 라이프타임은 이 규칙을 강제하는 데 사용하는 도구입니다.

## 라이프타임 생략

Rust에는 **라이프타임 생략 규칙**이라고 하는 일련의 규칙이 있어 많은 경우에 명시적인 라이프타임 주석을 생략할 수 있습니다.
예를 들어, `std`의 소스 코드에서 `Vec::iter`의 정의는 다음과 같습니다:

```rust
impl <T> Vec<T> {
    pub fn iter(&self) -> Iter<'_, T> {
        // [...]
    }
}
```

`Vec::iter()`의 시그니처에는 명시적인 라이프타임 매개변수가 없습니다.
생략 규칙은 `iter()`가 반환하는 `Iter`의 라이프타임이 `&self` 참조의 라이프타임에 묶여 있음을 의미합니다.
`'_`를 `&self` 참조의 라이프타임에 대한 **자리 표시자**로 생각할 수 있습니다.

라이프타임 생략에 대한 공식 문서 링크는 [참조](#references) 섹션을 참조하십시오.
대부분의 경우, 명시적인 라이프타임 주석을 추가해야 할 때 컴파일러가 알려줄 것입니다.

## 참조

- [std::vec::Vec::iter](https://doc.rust-lang.org/std/vec/struct.Vec.html#method.iter)
- [std::slice::Iter](https://doc.rust-lang.org/std/slice/struct.Iter.html)
- [라이프타임 생략 규칙](https://doc.rust-lang.org/reference/lifetime-elision.html)