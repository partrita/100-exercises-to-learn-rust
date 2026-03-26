# 열거형(Enums)

[이전 챕터](../03_ticket_v1/02_validation.md)에서 작성한 유효성 검사 로직을 떠올려 보세요. 티켓의 상태는 `To-Do`, `InProgress`, `Done` 중 하나여야만 유효합니다. 하지만 현재 `Ticket` 구조체의 `status` 필드나 `new` 메서드의 매개변수 타입을 보면 이 점이 명확히 드러나지 않습니다.

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

두 곳 모두 상태를 나타내기 위해 `String` 타입을 사용하고 있습니다. `String`은 너무 범용적인 타입이라, `status`가 가질 수 있는 값이 제한되어 있다는 정보를 전달하지 못합니다. 더 큰 문제는, `Ticket::new`를 호출하는 쪽에서 입력한 상태값이 유효한지 여부를 오직 **실행 시점(Runtime)**에만 알 수 있다는 점입니다.

**열거형(Enums)**을 사용하면 이 문제를 훨씬 더 깔끔하게 해결할 수 있습니다.

## enum

열거형(Enums)은 **베리언트(Variants)**라고 부르는 고정된 값들의 집합을 정의할 수 있는 타입입니다. Rust에서는 `enum` 키워드를 사용해 열거형을 정의합니다.

```rust
enum Status {
    ToDo,
    InProgress,
    Done,
}
```

`struct`와 마찬가지로, `enum`을 정의하면 **새로운 Rust 타입**이 만들어집니다.
