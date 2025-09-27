# `match`

궁금할 수 있습니다. 열거형으로 실제로 무엇을 **할 수** 있을까요?
가장 일반적인 작업은 **매칭**하는 것입니다.

```rust
enum Status {
    ToDo,
    InProgress,
    Done
}

impl Status {
    fn is_done(&self) -> bool {
        match self {
            Status::Done => true,
            // `|` 연산자를 사용하면 여러 패턴을 매칭할 수 있습니다.
            // "`Status::ToDo` 또는 `Status::InProgress`"로 읽습니다.
            Status::InProgress | Status::ToDo => false
        }
    }
}
```

A `match` 문은 Rust 값을 일련의 **패턴**과 비교할 수 있게 해줍니다.
타입 수준의 `if`라고 생각할 수 있습니다. `status`가 `Done` 베리언트이면 첫 번째 블록을 실행하고, `InProgress` 또는 `ToDo` 베리언트이면 두 번째 블록을 실행합니다.

## 완전성

여기에 한 가지 핵심 세부 사항이 있습니다: `match`는 **완전**합니다. 모든 열거형 베리언트를 처리해야 합니다.
베리언트 처리를 잊어버리면 Rust는 **컴파일 타임**에 오류로 여러분을 막을 것입니다.

예를 들어, `ToDo` 베리언트 처리를 잊어버리면:

```rust
match self {
    Status::Done => true,
    Status::InProgress => false,
}
```

컴파일러는 다음과 같이 불평할 것입니다:

```text
error[E0004]: non-exhaustive patterns: `ToDo` not covered
 --> src/main.rs:5:9
  |
5 |     match status {
  |     ^^^^^^^^^^^^ pattern `ToDo` not covered
```

이것은 큰 문제입니다!
코드베이스는 시간이 지남에 따라 진화합니다. 나중에 새로운 상태(예: `Blocked`)를 추가할 수 있습니다. Rust 컴파일러는 새로운 베리언트에 대한 로직이 누락된 모든 `match` 문에 대해 오류를 발생시킵니다.
이것이 Rust 개발자들이 종종 "컴파일러 주도 리팩토링"을 칭찬하는 이유입니다. 컴파일러가 다음에 무엇을 해야 할지 알려주고, 여러분은 보고된 것을 수정하기만 하면 됩니다.

## 모두 잡기

하나 이상의 베리언트에 신경 쓰지 않는 경우, `_` 패턴을 모두 잡는 용도로 사용할 수 있습니다:

```rust
match status {
    Status::Done => true,
    _ => false
}
```

`_` 패턴은 이전 패턴에서 매칭되지 않은 모든 것을 매칭합니다.

<div class="warning">
이 모두 잡기 패턴을 사용하면 컴파일러 주도 리팩토링의 이점을 얻을 수 _없습니다_.
새로운 열거형 베리언트를 추가하면 컴파일러는 여러분이 그것을 처리하지 않고 있다는 것을 알려주지 _않을_ 것입니다.

정확성에 관심이 있다면 모두 잡기를 피하십시오. 컴파일러를 활용하여 모든 매칭 사이트를 다시 검토하고 새로운 열거형 베리언트를 어떻게 처리해야 할지 결정하십시오.

</div>