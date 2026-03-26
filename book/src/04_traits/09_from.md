# `From` 및 `Into` (변환 트레이트)

우리가 처음 문자열을 다루기 시작했던 코드로 다시 돌아가 봅시다.

```rust
let ticket = Ticket::new(
    "A title".into(), 
    "A description".into(), 
    "To-Do".into()
);
```

이제 우리는 여기서 `.into()`가 정확히 어떤 역할을 하는지 분석할 수 있는 충분한 지식을 갖추었습니다.

## 문제의 발단

`new` 메서드의 시그니처는 다음과 같이 정의되어 있습니다.

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

우리는 앞서 `"A title"`과 같은 문자열 리터럴이 `&str` 타입이라는 것을 배웠습니다. 여기서 **타입 불일치**가 발생합니다. 메서드는 `String`을 요구하는데, 우리는 `&str`을 전달하고 있기 때문입니다. 이번에는 컴파일러가 알아서 해주는 마법 같은 강제 변환이 일어나지 않습니다. 즉, 우리가 직접 **타입 변환**을 수행해야 합니다.

## `From` 및 `Into`

Rust 표준 라이브러리의 `std::convert` 모듈에는 **실패할 가능성이 없는 변환**을 처리하기 위한 두 가지 트레이트인 `From`과 `Into`가 정의되어 있습니다.

```rust
pub trait From<T>: Sized {
    fn from(value: T) -> Self;
}

pub trait Into<T>: Sized {
    fn into(self) -> T;
}
```

이 트레이트 정의에는 지금까지 보지 못했던 새로운 개념인 **슈퍼트레이트(supertrait)**와 **암시적 트레이트 바운드(implicit trait bound)**가 포함되어 있습니다. 하나씩 살펴봅시다.

### 슈퍼트레이트(Supertrait)와 서브트레이트(Subtrait)

`From: Sized` 구문은 `From`이 `Sized`의 **서브트레이트**임을 나타냅니다. 즉, `From`을 구현하는 모든 타입은 반드시 `Sized`도 구현해야 합니다. 반대로 `Sized`는 `From`의 **슈퍼트레이트**라고 부릅니다.

### 암시적 트레이트 바운드

Rust 컴파일러는 제네릭 타입 매개변수가 사용될 때마다, 별도의 명시가 없으면 해당 타입이 `Sized`일 것이라고 암시적으로 가정합니다.

예를 들어, 다음과 같은 구조체 정의는

```rust
pub struct Foo<T> {
    inner: T,
}
```

실제로는 다음과 동일하게 취급됩니다.

```rust
pub struct Foo<T: Sized> 
{
    inner: T,
}
```

따라서 `From<T>`의 정의 역시 실제로는 다음과 같습니다.

```rust
pub trait From<T: Sized>: Sized {
    fn from(value: T) -> Self;
}
```

이는 `T`와 `From<T>`를 구현하는 타입 **모두** 반드시 `Sized`여야 함을 의미합니다. (`T`에 대한 바운드는 명시하지 않아도 자동으로 적용됩니다.)

### 물음표 트레이트 바운드 (Question Mark Trait Bound)

만약 암시적인 `Sized` 제약을 해제하고 싶다면, **물음표 트레이트 바운드**를 사용하면 됩니다.

```rust
pub struct Foo<T: ?Sized> {
    //            ^^^^^^^
    //            이것이 Sized 제약을 해제하는 구문입니다.
    inner: T,
}
```

이 구문은 "`T`는 `Sized`일 수도 있고 아닐 수도 있다"는 뜻으로 해석됩니다. 이를 통해 `T`에 `str`과 같은 DST를 대입할 수 있게 됩니다(예: `Foo<str>`). 단, 이 특수한 구문은 `Sized` 트레이트에만 사용할 수 있습니다.

## `&str`에서 `String`으로의 변환

[`std` 문서](https://doc.rust-lang.org/std/convert/trait.From.html#implementors)를 보면 어떤 타입들이 `From` 트레이트를 구현하고 있는지 확인할 수 있습니다. 거기서 `String`이 `From<&str>`을 구현하고 있다는 사실을 찾을 수 있죠. 따라서 우리는 다음과 같이 쓸 수 있습니다.

```rust
let title = String::from("A title");
```

그런데 우리는 그동안 주로 `.into()`를 사용해 왔습니다.
[`Into` 구현 목록](https://doc.rust-lang.org/std/convert/trait.Into.html#implementors)을 찾아봐도 `&str`에 대해 `Into<String>`이 직접 구현된 것은 보이지 않습니다. 어떻게 된 걸까요?

사실 `From`과 `Into`는 서로 짝을 이루는 **대칭적인 트레이트**입니다. 특히 `Into`는 **블랭킷 구현(blanket implementation)**을 통해, `From`을 구현하는 모든 타입에 대해 자동으로 구현됩니다.

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

즉, 어떤 타입 `U`가 `From<T>`를 구현하면, 타입 `T`에 대해 `Into<U>`가 자동으로 구현됩니다. 이것이 우리가 `let title = "A title".into();`라고 자연스럽게 쓸 수 있었던 이유입니다.

## `.into()` 활용하기

코드에서 `.into()`를 본다면, 그것은 한 타입에서 다른 타입으로의 변환이 일어나고 있다는 신호입니다. 그렇다면 변환될 목적지 타입은 어떻게 결정될까요?

대부분의 경우 목적지 타입은 다음 중 하나를 통해 결정됩니다.

- 함수나 메서드의 시그니처 (예: 앞서 본 `Ticket::new`의 매개변수 타입)
- 타입 명시가 포함된 변수 선언 (예: `let title: String = "A title".into();`)

컴파일러가 주변 맥락을 통해 목적지 타입을 명확히 추론할 수 있다면, `.into()`는 별도의 추가 설정 없이 바로 작동합니다.
