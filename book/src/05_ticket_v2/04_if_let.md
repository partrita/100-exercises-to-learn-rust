# 간결한 분기

이전 연습 문제에 대한 여러분의 해결책은 아마 다음과 같을 것입니다:

```rust
impl Ticket {
    pub fn assigned_to(&self) -> &str {
        match &self.status {
            Status::InProgress { assigned_to } => assigned_to,
            Status::Done | Status::ToDo => {
                panic!(
                    "Only `In-Progress` tickets can be \
                    assigned to someone"
                )
            }
        }
    }
}
```

여러분은 `Status::InProgress` 베리언트에만 관심이 있습니다.
정말로 다른 모든 베리언트를 매치해야 할까요?

새로운 구문이 구출에 나섭니다!

## `if let`

`if let` 구문은 다른 모든 베리언트를 처리할 필요 없이 열거형의 단일 베리언트에 대해 매치할 수 있게 해줍니다.

`if let`을 사용하여 `assigned_to` 메소드를 단순화하는 방법은 다음과 같습니다:

```rust
impl Ticket {
    pub fn assigned_to(&self) -> &str {
        if let Status::InProgress { assigned_to } = &self.status {
            assigned_to
        } else {
            panic!(
                "Only `In-Progress` tickets can be assigned to someone"
            );
        }
    }
}
```

## `let/else`

`else` 분기가 조기 반환을 의미하는 경우(패닉은 조기 반환으로 간주됩니다!),
`let/else` 구문을 사용할 수 있습니다:

```rust
impl Ticket {
    pub fn assigned_to(&self) -> &str {
        let Status::InProgress { assigned_to } = &self.status else {
            panic!(
                "Only `In-Progress` tickets can be assigned to someone"
            );
        };
        assigned_to
    }
}
```

구조 분해된 변수를 "오른쪽으로 밀림" 없이 할당할 수 있게 해줍니다. 즉, 변수는 그 앞의 코드와 동일한 들여쓰기 수준에서 할당됩니다.

## 스타일

`if let`과 `let/else`는 모두 관용적인 Rust 구문입니다.
코드의 가독성을 향상시키기 위해 적절하게 사용하되, 과용하지 마십시오: 필요할 때는 항상 `match`가 있습니다.

```