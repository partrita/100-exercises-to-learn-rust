# 데이터를 가질 수 있는 베리언트

```rust
enum Status {
    ToDo,
    InProgress,
    Done,
}
```

우리의 `Status` 열거형은 보통 **C-스타일 열거형**이라고 불리는 것입니다.
각 베리언트는 명명된 상수와 같이 간단한 레이블입니다. C, C++, Java, C#, Python 등 많은 프로그래밍 언어에서 이런 종류의 열거형을 찾을 수 있습니다.

하지만 Rust 열거형은 더 나아갈 수 있습니다. **각 베리언트에 데이터를 첨부**할 수 있습니다.

## 베리언트

티켓을 현재 작업 중인 사람의 이름을 저장하고 싶다고 가정해 봅시다.
이 정보는 티켓이 진행 중일 때만 가질 수 있습니다. 할 일 티켓이나 완료된 티켓에는 없을 것입니다.
`InProgress` 베리언트에 `String` 필드를 첨부하여 이를 모델링할 수 있습니다:

```rust
enum Status {
    ToDo,
    InProgress {
        assigned_to: String,
    },
    Done,
}
```

`InProgress`는 이제 **구조체와 유사한 베리언트**입니다.
실제로 구문은 구조체를 정의하는 데 사용한 것과 유사합니다. 단지 열거형 내부에 베리언트로 "인라인"되어 있을 뿐입니다.

## 베리언트 데이터 접근

`Status` 인스턴스에서 `assigned_to`에 접근하려고 하면,

```rust
let status: Status = /* */;

// 이것은 컴파일되지 않습니다
println!("Assigned to: {}", status.assigned_to);
```

컴파일러가 우리를 막을 것입니다:

```text
error[E0609]: no field `assigned_to` on type `Status`
 --> src/main.rs:5:40
  |
5 |     println!("Assigned to: {}", status.assigned_to);
  |                                        ^^^^^^^^^^^ unknown field
```

`assigned_to`는 **베리언트별**이며, 모든 `Status` 인스턴스에서 사용할 수 있는 것은 아닙니다.
`assigned_to`에 접근하려면 **패턴 매칭**을 사용해야 합니다:

```rust
match status {
    Status::InProgress { assigned_to } => {
        println!("Assigned to: {}", assigned_to);
    },
    Status::ToDo | Status::Done => {
        println!("ToDo or Done");
    }
}
```

## 바인딩

매치 패턴 `Status::InProgress { assigned_to }`에서 `assigned_to`는 **바인딩**입니다.
`Status::InProgress` 베리언트를 **구조 분해**하고 `assigned_to` 필드를 `assigned_to`라는 이름의 새 변수에 바인딩하고 있습니다.
원한다면 필드를 다른 변수 이름에 바인딩할 수 있습니다:

```rust
match status {
    Status::InProgress { assigned_to: person } => {
        println!("Assigned to: {}", person);
    },
    Status::ToDo | Status::Done => {
        println!("ToDo or Done");
    }
}
```