# 데이터를 가질 수 있는 베리언트(Variants)

```rust
enum Status {
    ToDo,
    InProgress,
    Done,
}
```

우리가 만든 `Status` 열거형은 흔히 **C 스타일 열거형**이라고 부르는 형태입니다. 각 베리언트는 이름이 붙은 상수처럼 단순한 레이블 역할을 하죠. C, C++, Java, Python 등 많은 언어에서 볼 수 있는 방식입니다.

하지만 Rust의 열거형은 여기서 한 걸음 더 나아갑니다. 바로 **각 베리언트에 데이터를 담을 수 있다**는 점입니다.

## 베리언트 데이터(Variant Data)

예를 들어, 현재 티켓을 담당하고 있는 사람의 이름을 저장하고 싶다고 가정해 봅시다. 이 정보는 티켓이 '진행 중'일 때만 필요하며, '할 일'이나 '완료' 상태일 때는 필요하지 않습니다. 이때 `InProgress` 베리언트에 `String` 필드를 추가하여 이를 모델링할 수 있습니다.

```rust
enum Status {
    ToDo,
    InProgress {
        assigned_to: String,
    },
    Done,
}
```

이제 `InProgress`는 **구조체 형태의 베리언트(Struct-like variant)**가 되었습니다. 문법도 구조체를 정의할 때와 비슷하죠? 단지 열거형 내부에 '인라인'으로 정의되었다는 점만 다릅니다.

## 베리언트 데이터 접근하기

`Status` 인스턴스에서 바로 `assigned_to` 필드에 접근하려고 하면 어떻게 될까요?

```rust
let status: Status = /* */;

// 이 코드는 컴파일되지 않습니다.
println!("담당자: {}", status.assigned_to);
```

컴파일러는 다음과 같은 에러를 발생시킵니다.

```text
error[E0609]: no field `assigned_to` on type `Status`
 --> src/main.rs:5:40
  |
5 |     println!("Assigned to: {}", status.assigned_to);
  |                                        ^^^^^^^^^^^ unknown field
```

`assigned_to`는 **특정 베리언트(InProgress)**에만 속한 필드이기 때문에, 모든 `Status` 인스턴스에서 이 필드가 존재한다고 보장할 수 없기 때문입니다. 따라서 이 데이터에 접근하려면 반드시 **패턴 매칭**을 사용해야 합니다.

```rust
match status {
    Status::InProgress { assigned_to } => {
        println!("담당자: {}", assigned_to);
    },
    Status::ToDo | Status::Done => {
        println!("할 일 또는 완료된 상태입니다.");
    }
}
```

## 바인딩(Binding)

매치 패턴 `Status::InProgress { assigned_to }`에서 `assigned_to`는 **바인딩(Binding)** 역할을 합니다. `Status::InProgress` 베리언트를 **구조 분해(Destructuring)**하여, 그 안의 필드 값을 `assigned_to`라는 이름의 새로운 변수에 담는 것이죠. 원한다면 필드 이름을 다른 변수 이름으로 바꿀 수도 있습니다.

```rust
match status {
    Status::InProgress { assigned_to: person } => {
        println!("담당자: {}", person);
    },
    Status::ToDo | Status::Done => {
        println!("할 일 또는 완료된 상태입니다.");
    }
}
```
