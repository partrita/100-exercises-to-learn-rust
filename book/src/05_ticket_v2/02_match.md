# 패턴 매칭(Match)

"열거형을 정의했으니, 이제 이걸로 뭘 할 수 있을까?"라는 의문이 생길 수 있습니다. 열거형을 활용하는 가장 대표적인 방법은 바로 **패턴 매칭(Matching)**입니다.

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
            // `|` 연산자를 사용하면 여러 패턴을 한꺼번에 매칭할 수 있습니다.
            // 여기서는 "`Status::ToDo` 또는 `Status::InProgress`인 경우"로 해석합니다.
            Status::InProgress | Status::ToDo => false
        }
    }
}
```

`match` 문을 사용하면 Rust의 값을 여러 **패턴(Patterns)**과 비교할 수 있습니다. 타입 수준에서 작동하는 `if` 문이라고 생각하면 이해하기 쉽습니다. 예를 들어 `status`가 `Done` 베리언트라면 첫 번째 블록을 실행하고, `InProgress`나 `ToDo` 베리언트라면 두 번째 블록을 실행합니다.

## 완전성(Exhaustiveness)

여기서 꼭 기억해야 할 핵심은 `match` 문이 **완전(Exhaustive)**해야 한다는 점입니다. 즉, 열거형의 모든 베리언트를 빠짐없이 처리해야 합니다. 만약 하나라도 빠뜨린다면 Rust는 **컴파일 시점**에 에러를 발생시켜 여러분을 도와줄 것입니다.

예를 들어, `ToDo` 베리언트 처리를 깜빡했다면 다음과 같이 작성하게 될 텐데요.

```rust
match self {
    Status::Done => true,
    Status::InProgress => false,
}
```

이 경우 컴파일러는 다음과 같은 에러 메시지를 보여주며 경고합니다.

```text
error[E0004]: non-exhaustive patterns: `ToDo` not covered
 --> src/main.rs:5:9
  |
5 |     match status {
  |     ^^^^^^^^^^^^ pattern `ToDo` not covered
```

이것은 매우 강력한 기능입니다! 프로젝트가 커지면서 새로운 상태(예: `Blocked`)를 추가해야 할 때가 올 것입니다. 이때 Rust 컴파일러는 새로운 상태에 대한 처리가 누락된 모든 `match` 문을 찾아내 에러를 발생시킵니다.

Rust 개발자들이 "컴파일러 주도 리팩토링"을 선호하는 이유가 바로 여기에 있습니다. 컴파일러가 다음에 무엇을 고쳐야 할지 정확히 짚어주므로, 여러분은 그 보고를 따라 수정하기만 하면 됩니다.

## 나머지 패턴 처리(Catch-all)

모든 베리언트를 개별적으로 처리할 필요가 없을 때는 `_` 패턴을 사용하여 나머지를 한꺼번에 처리할 수 있습니다.

```rust
match status {
    Status::Done => true,
    _ => false
}
```

`_` 패턴은 앞의 패턴들과 매칭되지 않은 모든 경우를 의미합니다.

<div class="warning">
나머지 패턴(`_`)을 사용하면 컴파일러 주도 리팩토링의 이점을 얻기 어렵습니다. 
새로운 열거형 베리언트가 추가되어도 컴파일러는 여러분이 그 베리언트를 놓치고 있다는 사실을 알려주지 않기 때문입니다.

코드의 정확성이 중요하다면 가급적 나머지 패턴 사용을 피하세요. 대신 모든 베리언트를 명시적으로 매칭하여, 새로운 베리언트가 추가될 때마다 컴파일러의 도움을 받아 관련 로직을 검토하는 것이 좋습니다.
</div>
