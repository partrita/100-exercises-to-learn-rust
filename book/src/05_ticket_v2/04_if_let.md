# 간결한 제어 흐름

이전 연습 문제에서 작성한 코드는 아마 다음과 비슷한 모습일 것입니다.

```rust
impl Ticket {
    pub fn assigned_to(&self) -> &str {
        match &self.status {
            Status::InProgress { assigned_to } => assigned_to,
            Status::Done | Status::ToDo => {
                panic!(
                    "진행 중(`In-Progress`)인 티켓만 담당자를 가질 수 있습니다."
                )
            }
        }
    }
}
```

여기서 우리는 오직 `Status::InProgress` 베리언트에만 관심이 있습니다. 그런데도 나머지 모든 베리언트를 일일이 매칭해야 할까요?

이런 상황을 위해 Rust는 더 간결한 구문을 제공합니다.

## if let

`if let` 구문을 사용하면 다른 베리언트들을 일일이 처리할 필요 없이, 관심 있는 **단 하나의 베리언트**에 대해서만 패턴 매칭을 수행할 수 있습니다.

`if let`을 사용하여 `assigned_to` 메서드를 단순하게 고쳐보겠습니다.

```rust
impl Ticket {
    pub fn assigned_to(&self) -> &str {
        if let Status::InProgress { assigned_to } = &self.status {
            assigned_to
        } else {
            panic!(
                "진행 중(`In-Progress`)인 티켓만 담당자를 가질 수 있습니다."
            );
        }
    }
}
```

## let-else

만약 `else` 분기에서 조기 반환(Early return)을 해야 하는 경우라면(패닉도 조기 반환의 일종입니다), `let-else` 구문을 사용하는 것이 가장 깔끔합니다.

```rust
impl Ticket {
    pub fn assigned_to(&self) -> &str {
        let Status::InProgress { assigned_to } = &self.status else {
            panic!(
                "진행 중(`In-Progress`)인 티켓만 담당자를 가질 수 있습니다."
            );
        };
        assigned_to
    }
}
```

`let-else`를 사용하면 구조 분해된 변수를 들여쓰기 수준의 변화 없이(오른쪽으로 밀리지 않고) 그대로 사용할 수 있어 가독성이 좋아집니다.

## 스타일 팁

`if let`과 `let-else`는 모두 관용적인(Idiomatic) Rust 표현입니다. 코드의 가독성을 높이기 위해 상황에 맞게 적절히 사용하세요. 다만, 로직이 복잡해진다면 언제나 우리에겐 든든한 `match`가 있다는 사실을 잊지 마세요!
