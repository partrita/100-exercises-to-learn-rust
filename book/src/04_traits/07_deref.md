# `Deref` 트레이트

이전 연습 문제에서는 할 일이 별로 없었죠?

```rust
impl Ticket {
    pub fn title(&self) -> &String {
        &self.title
    }
}
```

를

```rust
impl Ticket {
    pub fn title(&self) -> &str {
        &self.title
    }
}
```

로 바꾸는 것만으로 코드가 컴파일되고 테스트를 통과했습니다.
하지만 머릿속에서 경고음이 울려야 합니다.

## 작동해서는 안 되는데, 작동합니다

사실을 검토해 봅시다:

- `self.title`은 `String`입니다.
- 따라서 `&self.title`은 `&String`입니다.
- (수정된) `title` 메소드의 출력은 `&str`입니다.

컴파일러 오류를 예상했을 것입니다, 그렇지 않나요? `Expected &String, found &str` 또는 비슷한 오류 말입니다.
대신, 그냥 작동합니다. **왜**일까요?

## `Deref`가 구원합니다

`Deref` 트레이트는 [**역참조 강제 변환(deref coercion)**](https://doc.rust-lang.org/std/ops/trait.Deref.html#deref-coercion)으로 알려진 언어 기능의 배후 메커니즘입니다.
이 트레이트는 표준 라이브러리의 `std::ops` 모듈에 정의되어 있습니다:

```rust
// 지금은 정의를 약간 단순화했습니다.
// 전체 정의는 나중에 볼 것입니다.
pub trait Deref {
    type Target;
    
    fn deref(&self) -> &Self::Target;
}
```

`type Target`은 **연관 타입**입니다.
트레이트가 구현될 때 지정해야 하는 구체적인 타입에 대한 자리 표시자입니다.

## 역참조 강제 변환

타입 `T`에 대해 `Deref<Target = U>`를 구현함으로써 컴파일러에게 `&T`와 `&U`가 어느 정도 상호 교환 가능하다는 것을 알립니다.
특히, 다음과 같은 동작을 얻게 됩니다:

- `T`에 대한 참조는 암시적으로 `U`에 대한 참조로 변환됩니다 (즉, `&T`는 `&U`가 됩니다).
- `&T`에서 `&self`를 입력으로 받는 `U`에 정의된 모든 메소드를 호출할 수 있습니다.

역참조 연산자인 `*`에 대한 것이 하나 더 있지만, 아직 필요하지 않습니다 (궁금하다면 `std`의 문서를 참조하세요).

## `String`은 `Deref`를 구현합니다

`String`은 `Target = str`로 `Deref`를 구현합니다:

```rust
impl Deref for String {
    type Target = str;
    
    fn deref(&self) -> &str {
        // [...]
    }
}
```

이 구현과 역참조 강제 변환 덕분에 `&String`은 필요할 때 자동으로 `&str`로 변환됩니다.

## 역참조 강제 변환을 남용하지 마세요

역참조 강제 변환은 강력한 기능이지만 혼란을 초래할 수 있습니다.
타입을 자동으로 변환하면 코드를 읽고 이해하기가 더 어려워질 수 있습니다. `T`와 `U` 모두에 동일한 이름의 메소드가 정의되어 있다면 어느 것이 호출될까요?

과정의 뒷부분에서 역참조 강제 변환의 "가장 안전한" 사용 사례인 스마트 포인터를 살펴볼 것입니다.