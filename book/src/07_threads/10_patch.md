# 업데이트 작업

지금까지 우리는 데이터를 삽입하고 검색하는 기능만 구현했습니다. 이제 업데이트 기능을 추가하며 시스템을 어떻게 확장할 수 있을지 알아봅시다.

## 단일 스레드 시절의 업데이트

스레드를 사용하지 않던 초기 버전에서는 업데이트가 꽤 간단했습니다. `TicketStore`는 호출자가 티켓에 대한 가변 참조(`&mut Ticket`)를 받아 직접 수정할 수 있게 해주는 `get_mut` 메서드를 제공했죠.

## 다중 스레드(Multi-threaded) 업데이트

하지만 지금의 다중 스레드 환경에서는 같은 전략이 통하지 않습니다. 바로 **빌림 검사기(Borrow Checker)**가 앞길을 막아서기 때문입니다. `SyncSender<&mut Ticket>`을 통해 가변 참조를 보내려 해도, 이 참조는 `'static` 라이프타임(lifetime)을 만족하지 않습니다. 따라서 `std::thread::spawn`으로 생성된 클로저 안으로 안전하게 넘겨질(capture) 수 없는 것이죠.

이런 제한을 해결하기 위해 여러 방법이 존재하는데, 다음 연습 문제에서 몇 가지를 살펴보겠습니다.

### 패치(Patch)

채널을 통해 가변 참조(`&mut Ticket`)를 보낼 수 없으니 클라이언트 측에서 직접 수정하는 것은 불가능합니다. 그렇다면 서버 측에서 대신 수정해 줄 수 없을까요?

서버에게 **어떤 부분을 바꿔야 하는지** 알려주면 가능합니다. 즉, 서버에 **패치(Patch)**를 보내는 것이죠.

```rust
struct TicketPatch {
    id: TicketId,
    title: Option<TicketTitle>,
    description: Option<TicketDescription>,
    status: Option<TicketStatus>,
}
```

업데이트할 티켓을 찾아야 하므로 `id` 필드는 필수입니다. 다른 필드들은 선택 사항(`Option`)으로 만듭니다.

- 필드 값이 `None`이면 해당 필드는 수정하지 않겠다는 뜻입니다.
- 필드 값이 `Some(value)`이면 해당 필드를 `value`로 변경하겠다는 뜻입니다.
