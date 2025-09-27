# 가변 참조

이제 접근자 메소드는 다음과 같을 것입니다:

```rust
impl Ticket {
    pub fn title(&self) -> &String {
        &self.title
    }

    pub fn description(&self) -> &String {
        &self.description
    }

    pub fn status(&self) -> &String {
        &self.status
    }
}
```

여기저기 `&`를 뿌려주니 문제가 해결되었습니다!\n이제 `Ticket` 인스턴스를 소비하지 않고도 필드에 접근할 수 있는 방법이 생겼습니다.
다음으로 `Ticket` 구조체를 **setter 메소드**로 향상시키는 방법을 알아봅시다.

## Setters

Setter 메소드를 사용하면 사용자가 `Ticket`의 비공개 필드 값을 변경하면서도 불변성이 존중되도록 할 수 있습니다(즉, `Ticket`의 제목을 빈 문자열로 설정할 수 없습니다).

Rust에서 setter를 구현하는 두 가지 일반적인 방법이 있습니다:

- `self`를 입력으로 받기.
- `&mut self`를 입력으로 받기.

### `self`를 입력으로 받기

첫 번째 접근 방식은 다음과 같습니다:

```rust
impl Ticket {
    pub fn set_title(mut self, new_title: String) -> Self {
        // 새 제목 유효성 검사 [...] 
        self.title = new_title;
        self
    }
}
```

`self`의 소유권을 가져와서 제목을 변경하고 수정된 `Ticket` 인스턴스를 반환합니다.\n사용 방법은 다음과 같습니다:

```rust
let ticket = Ticket::new(
    "Title".into(), 
    "Description".into(), 
    "To-Do".into()
);
let ticket = ticket.set_title("New title".into());
```

`set_title`은 `self`의 소유권을 가져가므로(**소비**하므로) 결과를 변수에 다시 할당해야 합니다.
위 예에서는 **변수 섀도잉**을 활용하여 동일한 변수 이름을 재사용합니다. 기존 변수와 동일한 이름으로 새 변수를 선언하면 새 변수가 이전 변수를 **가립니다**. 이것은 Rust 코드에서 일반적인 패턴입니다.

`self`-setter는 한 번에 여러 필드를 변경해야 할 때 매우 잘 작동합니다. 여러 호출을 함께 연결할 수 있습니다!

```rust
let ticket = ticket
    .set_title("New title".into())
    .set_description("New description".into())
    .set_status("In Progress".into());
```

### `&mut self`를 입력으로 받기

`&mut self`를 사용하는 두 번째 setter 접근 방식은 다음과 같습니다:

```rust
impl Ticket {
    pub fn set_title(&mut self, new_title: String) {
        // 새 제목 유효성 검사 [...] 
        
        self.title = new_title;
    }
}
```

이번에는 메소드가 `self`에 대한 가변 참조를 입력으로 받아 제목을 변경하고 그것으로 끝입니다.
아무것도 반환되지 않습니다.

사용 방법은 다음과 같습니다:

```rust
let mut ticket = Ticket::new(
    "Title".into(),
    "Description".into(),
    "To-Do".into()
);
ticket.set_title("New title".into());

// 수정된 티켓 사용
```

소유권은 호출자에게 있으므로 원래 `ticket` 변수는 여전히 유효합니다. 결과를 다시 할당할 필요가 없습니다.
하지만 `ticket`에 대한 가변 참조를 사용하고 있으므로 `ticket`을 가변으로 표시해야 합니다.

`&mut`-setter에는 단점이 있습니다. 여러 호출을 함께 연결할 수 없습니다.
수정된 `Ticket` 인스턴스를 반환하지 않으므로 첫 번째 setter의 결과에 다른 setter를 호출할 수 없습니다.
각 setter를 개별적으로 호출해야 합니다:

```rust
ticket.set_title("New title".into());
ticket.set_description("New description".into());
ticket.set_status("In Progress".into());
```