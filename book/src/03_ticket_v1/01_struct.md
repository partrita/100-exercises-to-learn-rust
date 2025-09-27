# 구조체

각 티켓에 대해 세 가지 정보를 추적해야 합니다:

- 제목
- 설명
- 상태

이를 나타내기 위해 [`String`](https://doc.rust-lang.org/std/string/struct.String.html)을 사용하여 시작할 수 있습니다. `String`은 Rust의 표준 라이브러리에 정의된 타입으로, [UTF-8 인코딩된](https://en.wikipedia.org/wiki/UTF-8) 텍스트를 나타냅니다.

하지만 이 세 가지 정보를 단일 엔티티로 **결합**하려면 어떻게 해야 할까요?

## `struct` 정의하기

`struct`는 **새로운 Rust 타입**을 정의합니다.

```rust
struct Ticket {
    title: String,
    description: String,
    status: String
}
```

구조체는 다른 프로그래밍 언어에서 클래스나 객체라고 부르는 것과 매우 유사합니다.

## 필드 정의하기

새로운 타입은 다른 타입을 **필드**로 결합하여 만들어집니다. 각 필드는 이름과 타입을 가져야 하며, 콜론 `:`으로 구분됩니다. 필드가 여러 개인 경우 쉼표 `,`로 구분됩니다.

아래 `Configuration` 구조체에서 볼 수 있듯이 필드는 동일한 타입일 필요가 없습니다:

```rust
struct Configuration {
   version: u32,
   active: bool
}
```

## 인스턴스화

각 필드의 값을 지정하여 구조체의 인스턴스를 만들 수 있습니다:

```rust
// 구문: <구조체이름> { <필드_이름>: <값>, ... }
let ticket = Ticket {
    title: "Build a ticket system".into(),
    description: "A Kanban board".into(),
    status: "Open".into()
};
```

## 필드 접근하기

`.` 연산자를 사용하여 구조체의 필드에 접근할 수 있습니다:

```rust
// 필드 접근
let x = ticket.description;
```

## 메소드

**메소드**를 정의하여 구조체에 동작을 첨부할 수 있습니다. `Ticket` 구조체를 예로 들어 보겠습니다:

```rust
impl Ticket {
    fn is_open(self) -> bool {
        self.status == "Open"
    }
}

// 구문:
// impl <구조체이름> {
//    fn <메소드_이름>(<매개변수>) -> <반환_타입> {
//        // 메소드 본문
//    }
// }
```

메소드는 함수와 매우 유사하지만 두 가지 주요 차이점이 있습니다:

1. 메소드는 **`impl` 블록** 내부에 정의되어야 합니다.
2. 메소드는 첫 번째 매개변수로 `self`를 사용할 수 있습니다. `self`는 키워드이며 메소드가 호출되는 구조체의 인스턴스를 나타냅니다.

### `self`

메소드가 첫 번째 매개변수로 `self`를 사용하는 경우 **메소드 호출 구문**을 사용하여 호출할 수 있습니다:

```rust
// 메소드 호출 구문: <인스턴스>.<메소드_이름>(<매개변수>)
let is_open = ticket.is_open();
```

이것은 [이전 장](../02_basic_calculator/09_saturating.md)에서 `u32` 값에 대해 포화 산술 연산을 수행하는 데 사용한 것과 동일한 호출 구문입니다.

### 정적 메소드

메소드가 첫 번째 매개변수로 `self`를 사용하지 않으면 **정적 메소드**입니다.

```rust
struct Configuration {
    version: u32,
    active: bool
}

impl Configuration {
    // `default`는 `Configuration`의 정적 메소드입니다.
    fn default() -> Configuration {
        Configuration { version: 0, active: false }
    }
}
```

정적 메소드를 호출하는 유일한 방법은 **함수 호출 구문**을 사용하는 것입니다:

```rust
// 함수 호출 구문: <구조체이름>::<메소드_이름>(<매개변수>)
let default_config = Configuration::default();
```

### 동등성

첫 번째 매개변수로 `self`를 사용하는 메소드에도 함수 호출 구문을 사용할 수 있습니다:

```rust
// 함수 호출 구문:
//   <구조체이름>::<메소드_이름>(<인스턴스>, <매개변수>)
let is_open = Ticket::is_open(ticket);
```

함수 호출 구문은 `ticket`이 메소드의 첫 번째 매개변수인 `self`로 사용되고 있음을 매우 명확하게 하지만, 확실히 더 장황합니다. 가능하면 메소드 호출 구문을 선호하십시오.