# 설정자 메서드(Setter)

이제 접근자 메서드는 아마 이런 모습이겠죠:

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

코드 곳곳에 참조 기호(`&`)를 더해주니 문제가 깔끔하게 해결되었습니다! 이제 `Ticket` 인스턴스를 통째로 써버리지 않고도 안전하게 필드 값에 접근할 수 있게 되었네요.

그럼 이제 한 걸음 더 나아가, `Ticket` 구조체에 값을 수정하는 **설정자 메서드(Setter)**를 추가해 볼까요?

## 설정자 메서드(Setter)

설정자 메서드(Setter)를 이용하면, 비공개 필드 값을 외부에서 수정할 수 있게 하면서도 우리가 정한 규칙(불변성)을 엄격히 지킬 수 있습니다. 예를 들어, 제목을 빈 문자열로 바꾸려는 시도를 막을 수 있죠.

Rust에서 설정자(Setter)를 구현하는 데는 보통 두 가지 방법이 쓰입니다:

- `self`를 직접 인자로 받기
- `&mut self`(가변 참조)를 인자로 받기

### 1. `self`를 직접 인자로 받기

첫 번째 방식은 다음과 같습니다:

```rust
impl Ticket {
    pub fn set_title(mut self, new_title: String) -> Self {
        // 새 제목 유효성 검사 [...] 
        self.title = new_title;
        self
    }
}
```

이 방식은 `self`의 소유권을 완전히 가져와서 값을 수정한 뒤, 다시 수정된 `Ticket` 인스턴스를 반환합니다. 실제 사용법은 이렇습니다:

```rust
let ticket = Ticket::new(
    "Title".into(), 
    "Description".into(), 
    "To-Do".into()
);
let ticket = ticket.set_title("New title".into());
```

`set_title` 메서드가 호출될 때 `self`의 소유권을 가져가기(소비하기) 때문에, 결과물을 반드시 변수에 다시 대입해 줘야 합니다. 위 예시에서는 **변수 섀도잉(Variable Shadowing)** 기법을 썼네요. 기존 변수와 똑같은 이름으로 새 변수를 선언해서 이전 변수를 '가리는' 방식인데, Rust에서는 아주 흔히 볼 수 있는 패턴입니다.

`self`를 사용하는 설정자는 여러 필드를 한꺼번에 바꿀 때 빛을 발합니다. 메서드 호출을 줄줄이 엮는 **메서드 체이닝(Method Chaining)**이 가능하거든요!

```rust
let ticket = ticket
    .set_title("New title".into())
    .set_description("New description".into())
    .set_status("In Progress".into());
```

### 2. `&mut self`(가변 참조)를 인자로 받기

두 번째 방식인 `&mut self`를 사용하는 경우를 볼까요?

```rust
impl Ticket {
    pub fn set_title(&mut self, new_title: String) {
        // 새 제목 유효성 검사 [...] 
        
        self.title = new_title;
    }
}
```

이번에는 메서드가 `self`에 대한 가변 참조를 받아서 내부 값을 직접 수정합니다. 별도의 반환 값은 없죠.

사용 방법은 이렇습니다:

```rust
let mut ticket = Ticket::new(
    "Title".into(),
    "Description".into(),
    "To-Do".into()
);
ticket.set_title("New title".into());

// 수정된 티켓을 그대로 사용합니다.
```

소유권이 여전히 호출한 쪽에 남아있기 때문에 원래 `ticket` 변수를 그대로 쓸 수 있습니다. 결과를 다시 대입할 필요도 없고요. 다만, `ticket` 내부를 수정해야 하므로 변수를 선언할 때 `let mut`으로 가변임을 명시해야 합니다.

`&mut self`를 쓰는 방식에도 아쉬운 점은 있습니다. 바로 메서드 체이닝이 안 된다는 거죠. 수정된 인스턴스를 반환하지 않기 때문에, 아래처럼 각 메서드를 하나씩 따로 불러줘야 합니다:

```rust
ticket.set_title("New title".into());
ticket.set_description("New description".into());
ticket.set_status("In Progress".into());
```
