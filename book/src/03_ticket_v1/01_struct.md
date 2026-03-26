# 구조체(Struct)

각 티켓에 대해서는 세 가지 정보를 관리해야 합니다:

- 제목
- 설명
- 상태

이 정보들을 표현하기 위해 가장 먼저 [`String`](https://doc.rust-lang.org/std/string/struct.String.html) 타입을 떠올릴 수 있습니다. `String`은 Rust 표준 라이브러리에 정의된 타입으로, [UTF-8 방식](https://en.wikipedia.org/wiki/UTF-8)으로 인코딩된 텍스트를 담는 데 사용됩니다.

그런데 이 세 가지 정보를 하나의 덩어리, 즉 '단일 엔티티(Entity)'로 묶으려면 어떻게 해야 할까요?

## `struct` 정의하기

`struct`(구조체)를 사용하면 Rust에서 **새로운 타입**을 직접 정의할 수 있습니다.

```rust
struct Ticket {
    title: String,
    description: String,
    status: String
}
```

구조체는 다른 프로그래밍 언어에서 흔히 접하는 클래스(Class)나 객체(Object)와 매우 비슷한 개념이라고 생각하시면 됩니다.

## 필드(Field) 정의하기

새로운 타입은 여러 다른 타입들을 **필드(Field)**로 결합하여 만들어집니다. 각 필드는 이름과 타입을 가져야 하며, 그 사이를 콜론 `:`으로 구분합니다. 필드가 여러 개라면 쉼표 `,`로 각각을 나열합니다.

아래 `Configuration` 구조체 예시처럼, 모든 필드가 같은 타입일 필요는 없습니다:

```rust
struct Configuration {
   version: u32,
   active: bool
}
```

## 인스턴스화(Instantiation)

각 필드에 구체적인 값을 지정해 주면 구조체의 인스턴스(Instance)를 생성할 수 있습니다:

```rust
// 구문: <구조체이름> { <필드_이름>: <값>, ... }
let ticket = Ticket {
    title: "Build a ticket system".into(),
    description: "A Kanban board".into(),
    status: "Open".into()
};
```

## 필드에 접근하기

마침표 `.` 연산자를 이용하면 구조체의 특정 필드 값에 접근할 수 있습니다:

```rust
// 필드 접근 let x = ticket.description;
```

## 메서드(Method)

**메서드(Method)**를 정의하면 구조체에 특정한 동작을 부여할 수 있습니다. `Ticket` 구조체를 예로 들어 보겠습니다:

```rust
impl Ticket {
    fn is_open(self) -> bool {
        self.status == "Open"
    }
}

// 구문:
// impl <구조체이름> {
//    fn <메서드_이름>(<매개변수>) -> <반환_타입> {
//        // 메서드 본문
//    }
// }
```

메서드는 함수와 매우 비슷하지만, 다음과 같은 두 가지 큰 차이점이 있습니다:

1. 메서드는 반드시 **`impl` 블록** 안에 정의해야 합니다.
2. 메서드는 첫 번째 매개변수로 `self`를 사용할 수 있습니다. `self`는 예약어(Keyword)로, 해당 메서드가 호출되는 구조체의 인스턴스 자신을 가리킵니다.

### `self`

메서드가 첫 번째 매개변수로 `self`를 사용하는 경우, **메서드 호출 구문**을 사용하여 호출할 수 있습니다:

```rust
// 메서드 호출 구문: <인스턴스>.<메서드_이름>(<매개변수>)
let is_open = ticket.is_open();
```

이것은 [이전 장](../02_basic_calculator/09_saturating.md)에서 `u32` 값에 대해 포화 산술 연산을 수행할 때 사용했던 것과 동일한 호출 방식입니다.

### 정적 메서드(Static Method)

만약 메서드의 첫 번째 매개변수가 `self`가 아니라면, 이를 **정적 메서드(Static Method)**라고 부릅니다.

```rust
struct Configuration {
    version: u32,
    active: bool
}

impl Configuration {
    // `default`는 `Configuration`의 정적 메서드입니다.
    fn default() -> Configuration {
        Configuration { version: 0, active: false }
    }
}
```

정적 메서드는 **함수 호출 구문**을 통해서만 호출할 수 있습니다:

```rust
// 함수 호출 구문: <구조체이름>::<메서드_이름>(<매개변수>)
let default_config = Configuration::default();
```

### 호출 방식의 유연성

첫 번째 매개변수로 `self`를 사용하는 일반 메서드 역시 함수 호출 구문으로 호출할 수 있습니다:

```rust
// 함수 호출 구문:
//   <구조체이름>::<메서드_이름>(<인스턴스>, <매개변수>)
let is_open = Ticket::is_open(ticket);
```

함수 호출 구문을 쓰면 `ticket`이 메서드의 첫 번째 매개변수인 `self`로 전달된다는 점이 명확히 드러나지만, 코드가 다소 길어집니다. 따라서 특별한 이유가 없다면 **메서드 호출 구문**을 사용하는 것이 일반적입니다.
