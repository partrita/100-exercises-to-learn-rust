# 티켓 ID

티켓 관리 시스템에 대해 다시 생각해 봅시다.
현재 티켓 모델은 다음과 같습니다:

```rust
pub struct Ticket {
    pub title: TicketTitle,
    pub description: TicketDescription,
    pub status: Status
}
```

여기서 한 가지 빠진 것이 있습니다: 티켓을 고유하게 식별하는 **식별자**입니다.
이 식별자는 각 티켓에 대해 고유해야 합니다. 이는 새 티켓이 생성될 때 자동으로 생성하여 보장할 수 있습니다.

## 모델 개선

ID는 어디에 저장해야 할까요?
`Ticket` 구조체에 새 필드를 추가할 수 있습니다:

```rust
pub struct Ticket {
    pub id: TicketId,
    pub title: TicketTitle,
    pub description: TicketDescription,
    pub status: Status
}
```

하지만 티켓을 생성하기 전에는 ID를 알 수 없습니다. 따라서 처음부터 거기에 있을 수는 없습니다.
선택 사항이어야 합니다:

```rust
pub struct Ticket {
    pub id: Option<TicketId>,
    pub title: TicketTitle,
    pub description: TicketDescription,
    pub status: Status
}
```

이것도 이상적이지 않습니다. 티켓이 생성된 후에는 ID가 항상 있어야 한다는 것을 알면서도, 저장소에서 티켓을 검색할 때마다 `None` 케이스를 처리해야 합니다.

가장 좋은 해결책은 두 가지 다른 티켓 **상태**를 두 개의 별도 타입으로 나타내는 것입니다:
`TicketDraft`와 `Ticket`입니다.

```rust
pub struct TicketDraft {
    pub title: TicketTitle,
    pub description: TicketDescription
}

pub struct Ticket {
    pub id: TicketId,
    pub title: TicketTitle,
    pub description: TicketDescription,
    pub status: Status
}
```

`TicketDraft`는 아직 생성되지 않은 티켓입니다. ID가 없고 상태도 없습니다.
`Ticket`은 생성된 티켓입니다. ID와 상태를 가집니다.
`TicketDraft`와 `Ticket`의 각 필드가 자체 제약 조건을 포함하므로, 두 타입 간에 로직을 중복할 필요가 없습니다.