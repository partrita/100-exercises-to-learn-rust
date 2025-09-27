# `From` 및 `Into`

문자열 여정이 시작된 곳으로 돌아가 봅시다:

```rust
let ticket = Ticket::new(
    "A title".into(), 
    "A description".into(), 
    "To-Do".into()
);
```

이제 `.into()`가 여기서 무엇을 하는지 분석할 만큼 충분히 알고 있습니다.

## 문제점

`new` 메소드의 시그니처는 다음과 같습니다:

```rust
impl Ticket {
    pub fn new(
        title: String, 
        description: String, 
        status: String
    ) -> Self {
        // [...]
    }
}
```

또한 문자열 리터럴(예: `"A title"`)이 `&str` 타입이라는 것도 보았습니다.
여기서 타입 불일치가 있습니다: `String`이 예상되지만 `&str`이 있습니다.
이번에는 마법 같은 강제 변환이 우리를 구해주지 않을 것입니다. **변환을 수행해야 합니다**.

## `From` 및 `Into`

Rust 표준 라이브러리는 `std::convert` 모듈에서 **실패하지 않는 변환**을 위한 두 가지 트레이트인 `From`과 `Into`를 정의합니다.

```rust
pub trait From<T>: Sized {
    fn from(value: T) -> Self;
}

pub trait Into<T>: Sized {
    fn into(self) -> T;
}
```

이러한 트레이트 정의는 이전에 보지 못했던 몇 가지 개념을 보여줍니다: **슈퍼트레이트**와 **암시적 트레이트 바운드**입니다.
먼저 그것들을 풀어봅시다.

### 슈퍼트레이트 / 서브트레이트

`From: Sized` 구문은 `From`이 `Sized`의 **서브트레이트**임을 의미합니다: `From`을 구현하는 모든 타입은 `Sized`도 구현해야 합니다.
또는 `Sized`가 `From`의 **슈퍼트레이트**라고 말할 수도 있습니다.

### 암시적 트레이트 바운드

제네릭 타입 매개변수가 있을 때마다 컴파일러는 암시적으로 그것이 `Sized`라고 가정합니다.

예를 들어:

```rust
pub struct Foo<T> {
    inner: T,
}
```

는 실제로 다음과 동일합니다:

```rust
pub struct Foo<T: Sized> 
{
    inner: T,
}
```

`From<T>`의 경우, 트레이트 정의는 다음과 동일합니다:

```rust
pub trait From<T: Sized>: Sized {
    fn from(value: T) -> Self;
}
```

즉, `T`와 `From<T>`를 구현하는 타입 _모두_ `Sized`여야 합니다. 전자의 바운드는 암시적이지만 말입니다.

### 부정 트레이트 바운드

**부정 트레이트 바운드**를 사용하여 암시적인 `Sized` 바운드를 선택 해제할 수 있습니다:

```rust
pub struct Foo<T: ?Sized> {
    //            ^^^^^^^
    //            이것은 부정 트레이트 바운드입니다
    inner: T,
}
```

이 구문은 "`T`는 `Sized`일 수도 있고 아닐 수도 있다"로 읽히며, `T`를 DST에 바인딩할 수 있게 해줍니다(예: `Foo<str>`). 하지만 이것은 특별한 경우입니다: 부정 트레이트 바운드는 `Sized`에만 국한되며, 다른 트레이트와 함께 사용할 수 없습니다.

## `&str`에서 `String`으로

[`std`의 문서](https://doc.rust-lang.org/std/convert/trait.From.html#implementors)에서 어떤 `std` 타입이 `From` 트레이트를 구현하는지 볼 수 있습니다.
`String`이 `From<&str> for String`을 구현한다는 것을 알 수 있습니다. 따라서 다음과 같이 작성할 수 있습니다:

```rust
let title = String::from("A title");
```

하지만 우리는 주로 `.into()`를 사용해 왔습니다.
[`Into`의 구현자](https://doc.rust-lang.org/std/convert/trait.Into.html#implementors)를 확인하면 `Into<String> for &str`을 찾을 수 없습니다. 무슨 일일까요?

`From`과 `Into`는 **이중 트레이트**입니다.
특히, `Into`는 **블랭킷 구현**을 사용하여 `From`을 구현하는 모든 타입에 대해 구현됩니다:

```rust
impl<T, U> Into<U> for T
where
    U: From<T>,
{
    fn into(self) -> U {
        U::from(self)
    }
}
```

타입 `U`가 `From<T>`를 구현하면 `Into<U> for T`가 자동으로 구현됩니다. 이것이 `let title = "A title".into();`라고 쓸 수 있는 이유입니다.

## `.into()`

`.into()`를 볼 때마다 타입 간의 변환을 목격하는 것입니다.
하지만 대상 타입은 무엇일까요?

대부분의 경우 대상 타입은 다음 중 하나입니다:

- 함수/메소드의 시그니처에 의해 지정됨 (예: 위 예제의 `Ticket::new`)
- 타입 어노테이션이 있는 변수 선언에 지정됨 (예: `let title: String = "A title".into();`)

컴파일러가 모호함 없이 컨텍스트에서 대상 타입을 추론할 수 있는 한 `.into()`는 즉시 작동합니다.