# 열거형

[이전 챕터](../03_ticket_v1/02_validation.md)에서 작성한 유효성 검사 로직에 따르면, 티켓에 대한 유효한 상태는 `To-Do`, `InProgress`, `Done` 몇 가지뿐입니다.
`Ticket` 구조체의 `status` 필드나 `new` 메소드의 `status` 매개변수 타입을 보면 이것이 명확하지 않습니다:

```rust
#[derive(Debug, PartialEq)]
pub struct Ticket {
    title: String,
    description: String,
    status: String,
}

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

두 경우 모두 `status` 필드를 나타내기 위해 `String`을 사용하고 있습니다.
`String`은 매우 일반적인 타입이며, `status` 필드가 제한된 값 집합을 가지고 있다는 정보를 즉시 전달하지 않습니다. 더 나쁜 것은, `Ticket::new`의 호출자는 제공한 상태가 유효한지 여부를 **런타임에만** 알게 된다는 것입니다.

**열거형**을 사용하면 이보다 더 잘할 수 있습니다.

## `enum`

열거형은 **베리언트**라고 하는 고정된 값 집합을 가질 수 있는 타입입니다.
Rust에서는 `enum` 키워드를 사용하여 열거형을 정의합니다:

```rust
enum Status {
    ToDo,
    InProgress,
    Done,
}
```

`enum`은 `struct`와 마찬가지로 **새로운 Rust 타입**을 정의합니다.
