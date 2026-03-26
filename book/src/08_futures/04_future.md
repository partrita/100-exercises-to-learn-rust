# `Future` 트레이트

## 로컬 `Rc`의 문제

`tokio::spawn`의 시그니처를 다시 살펴봅시다:

```rust
pub fn spawn<F>(future: F) -> JoinHandle<F::Output>
    where
        F: Future + Send + 'static,
        F::Output: Send + 'static,
{ /* */ }
```

`F`가 `Send`여야 한다는 것은 *실제로* 무엇을 의미할까요? 이전 섹션에서 보았듯이, 생성 환경에서 캡처(Capture)하는 모든 값이 `Send`여야 한다는 뜻입니다. 하지만 그게 전부가 아닙니다.

`.await` 지점을 거쳐서 유지되는 모든 값 역시 `Send`여야 합니다. 다음 예제를 보겠습니다:

```rust
use std::rc::Rc;
use tokio::task::yield_now;

fn spawner() {
    tokio::spawn(example());
}

async fn example() {
    // 비동기 함수 *내부*에서 생성된 `Send`가 아닌 값
    let non_send = Rc::new(1);
    
    // 아무 일도 하지 않고 제어권만 넘기는 `.await` 지점
    yield_now().await;

    // 로컬의 `Send`가 아닌 값이 `.await` 이후에도 여전히 사용됩니다.
    println!("{}", non_send);
}
```

컴파일러는 이 코드를 거절할 것입니다:

```text
error: future cannot be sent between threads safely
    |
5   |     tokio::spawn(example());
    |                  ^^^^^^^^^ 
    | `example`가 반환하는 퓨처는 `Send`가 아닙니다
    |
note: 이 값이 await를 넘어 사용되므로 퓨처는 `Send`가 아닙니다
    |
11  |     let non_send = Rc::new(1);
    |         -------- `Rc<i32>` 타입이며 `Send`가 아닙니다
12  |     // `.await` 지점
13  |     yield_now().await;
    |                 ^^^^^ 
    |   `non_send`가 나중에 사용될 수 있으므로 여기서 await가 발생합니다 note: `tokio::spawn`의 바운드에 의해 요구됨
    |
164 |     pub fn spawn<F>(future: F) -> JoinHandle<F::Output>
    |            ----- 이 함수에서 바운드에 의해 요구됨
165 |     where
166 |         F: Future + Send + 'static,
    |                     ^^^^ `spawn`의 이 바운드에 의해 요구됨
```

이 현상을 이해하려면 Rust의 비동기 모델에 대한 지식을 좀 더 다듬어야 합니다.

## `Future` 트레이트

비동기 함수는 `Future` 트레이트를 구현하는 타입인 **퓨처(Future)**를 반환한다고 앞서 언급했습니다. 퓨처는 일종의 **상태 머신(State Machine)**으로 생각할 수 있습니다. 퓨처는 항상 다음 두 상태 중 하나에 놓여 있습니다:

- **대기 중 (Pending)**: 계산이 아직 완료되지 않았습니다.
- **준비 완료 (Ready)**: 계산이 완료되었으며 결과물이 준비되었습니다.

이 구조는 트레이트 정의에 그대로 녹아 있습니다:

```rust
trait Future {
    type Output;
    
    // 지금은 `Pin`과 `Context`는 무시하셔도 좋습니다.
    fn poll(
      self: Pin<&mut Self>, 
      cx: &mut Context<'_>
    ) -> Poll<Self::Output>;
}
```

### `poll` 메서드

`poll` 메서드는 `Future` 트레이트의 핵심입니다. 퓨처는 스스로 아무것도 하지 않습니다. 진행을 하려면 누군가 **폴링(Polling, 상태 확인)**을 해줘야 하죠.
`poll`을 호출하는 것은 퓨처에게 "작업을 좀 진행해 봐"라고 요청하는 것과 같습니다.
`poll`은 작업을 진행한 뒤 다음 중 하나를 반환합니다:

- `Poll::Pending`: 퓨처가 아직 준비되지 않았습니다. 나중에 다시 `poll`을 호출해야 합니다.
- `Poll::Ready(value)`: 퓨처가 작업을 완료했습니다. `value`는 `Self::Output` 타입의 계산 결과입니다.

중요한 점은 `Future::poll`이 `Poll::Ready`를 반환했다면, 그 퓨처를 다시 폴링해서는 안 된다는 것입니다. 이미 끝난 작업이니까요.

### 런타임의 역할

여러분이 `poll`을 직접 호출할 일은 거의 없습니다. 그건 비동기 런타임의 몫입니다. 런타임은 `poll` 시그니처에 있는 `Context`를 통해 퓨처를 언제 다시 진행시킬 수 있을지에 대한 정보를 모두 관리합니다.

## `async fn`과 퓨처

우리는 지금까지 비동기 함수라는 고수준 인터페이스를 사용해 왔고, 방금 `Future` 트레이트라는 저수준 프리미티브를 살펴보았습니다.

이 둘은 어떤 관계일까요?

함수를 `async`로 표시하면, 컴파일러는 그 함수가 퓨처를 반환하도록 만듭니다. 동시에 함수의 본문을 **상태 머신**으로 변환하죠. 각 `.await` 지점이 상태 머신의 한 단계가 됩니다.

`Rc` 예제로 다시 돌아가 봅시다:

```rust
use std::rc::Rc;
use tokio::task::yield_now;

async fn example() {
    let non_send = Rc::new(1);
    yield_now().await;
    println!("{}", non_send);
}
```

컴파일러는 대략 다음과 같은 열거형(Enum)으로 이를 변환합니다:

```rust
pub enum ExampleFuture {
    NotStarted,
    YieldNow(Rc<i32>),
    Terminated,
}
```

`example`이 호출되면 처음엔 `ExampleFuture::NotStarted` 상태의 퓨처를 반환합니다. 아직 폴링되지 않았으므로 아무 일도 일어나지 않죠. 런타임이 이를 처음 폴링하면, 퓨처는 다음 `.await` 지점까지 코드를 실행합니다. 그리고 `ExampleFuture::YieldNow(Rc<i32>)` 상태에서 멈춘 뒤 `Poll::Pending`을 반환합니다. 다시 폴링되면 나머지 코드(`println!`)를 실행하고 `Poll::Ready(())`를 반환하며 종료됩니다.

이렇게 상태 머신으로 변환된 `ExampleFuture`를 보면, 왜 `example`이 `Send`가 될 수 없는지 명확해집니다. 상태 머신이 `Rc`를 내부 데이터로 들고 있기 때문에 전체 퓨처 타입 자체가 `Send`가 아니게 되는 것이죠.

## 양보 지점 (Yield Points)

예제에서 보았듯이, 모든 `.await` 지점은 퓨처의 생애 주기에서 새로운 중간 상태를 만들어냅니다. 그래서 `.await` 지점을 **양보 지점(Yield Points)**이라고도 부릅니다. 퓨처가 자신을 폴링하던 런타임에게 제어권을 '양보'하여, 런타임이 잠시 이 태스크를 멈추고 다른 급한 일을 처리할 수 있게 해주기 때문입니다.

양보가 왜 중요한지에 대해서는 다음 섹션에서 더 자세히 다루겠습니다.
