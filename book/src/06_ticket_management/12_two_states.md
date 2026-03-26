# 티켓 ID(Ticket ID)

티켓 관리 시스템을 다시 한 번 설계해 봅시다. 현재 티켓 모델은 다음과 같은 구조로 되어 있습니다.

```rust
pub struct Ticket {
    pub title: TicketTitle,
    pub description: TicketDescription,
    pub status: Status
}
```

여기에 한 가지 빠진 중요한 정보가 있죠. 바로 티켓을 고유하게 식별할 수 있는 **식별자(ID)**입니다. 각 티켓은 고유한 ID를 가져야 하며, 이는 보통 새로운 티켓이 생성될 때 자동으로 할당되어 중복을 방지합니다.

## 모델 개선

그렇다면 이 ID는 어디에 저장하는 것이 좋을까요?
`Ticket` 구조체에 새로운 필드를 추가해 봅시다.

```rust
pub struct Ticket {
    pub id: TicketId,
    pub title: TicketTitle,
    pub description: TicketDescription,
    pub status: Status
}
```

그런데 문제가 하나 있습니다. 티켓이 생성되기 전에는 아직 ID를 알 수 없다는 것이죠. 따라서 처음부터 이 필드를 채울 수는 없습니다. 그렇다고 필드를 옵셔널(Optional)로 만드는 건 어떨까요?

```rust
pub struct Ticket {
    pub id: Option<TicketId>,
    pub title: TicketTitle,
    pub description: TicketDescription,
    pub status: Status
}
```

이 방법도 완벽하진 않습니다. 티켓이 일단 생성되고 나면 반드시 ID가 존재한다는 것을 알고 있음에도 불구하고, 저장소에서 티켓을 꺼내 올 때마다 매번 `None` 케이스를 처리해야 하는 번거로움이 생기기 때문입니다.

가장 깔끔한 해결책은 티켓의 두 가지 **상태(States)**를 서로 다른 타입으로 정의하는 것입니다. 바로 `TicketDraft`와 `Ticket`으로 나누는 것이죠.

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

- **`TicketDraft`**: 아직 데이터베이스 등에 저장되지 않은 임시 상태의 티켓입니다. ID와 상태(Status) 값이 아직 할당되지 않았습니다.
- **`Ticket`**: 성공적으로 생성되어 식별 가능한 상태의 티켓입니다. 고유한 ID와 현재 상태 값을 가집니다.

이렇게 타입을 분리하면 각 필드가 자체적인 검증 로직을 포함하고 있으므로, 두 타입 사이에 중복된 검증 로직을 작성할 필요가 없습니다. 아주 효율적이죠!