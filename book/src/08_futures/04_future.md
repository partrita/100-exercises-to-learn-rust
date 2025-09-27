# `Future` 트레이트

## 로컬 `Rc` 문제

`tokio::spawn`의 시그니처로 돌아가 봅시다:

```rust
pub fn spawn<F>(future: F) -> JoinHandle<F::Output>
    where
        F: Future + Send + 'static,
        F::Output: Send + 'static,
{ /* */ }
```

`F`가 `Send`라는 것이 _실제로_ 무엇을 의미할까요?
이전 섹션에서 보았듯이, 생성 환경에서 캡처하는 모든 값은 `Send`여야 함을 의미합니다. 하지만 그 이상입니다.

`.await` 지점을 넘어 유지되는 모든 값은 `Send`여야 합니다.
예제를 살펴봅시다:

```rust
use std::rc::Rc;
use tokio::task::yield_now;

fn spawner() {
    tokio::spawn(example());
}

async fn example() {
    // `Send`가 아닌 값,
    // 비동기 함수 _내부_에서 생성됨
    let non_send = Rc::new(1);
    
    // 아무것도 하지 않는 `.await` 지점
    yield_now().await;

    // 로컬 `Send`가 아닌 값은
    // `.await` 후에도 여전히 필요합니다
    println!("{}", non_send);
}
```

컴파일러는 이 코드를 거부할 것입니다:

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
    |   `non_send`가 나중에 사용될 수 있으므로 여기서 await가 발생합니다
note: `tokio::spawn`의 바운드에 의해 요구됨
    |
164 |     pub fn spawn<F>(future: F) -> JoinHandle<F::Output>
    |            ----- 이 함수에서 바운드에 의해 요구됨
165 |     where
166 |         F: Future + Send + 'static,
    |                     ^^^^ `spawn`의 이 바운드에 의해 요구됨
```

이것이 왜 그런지 이해하려면 Rust의 비동기 모델에 대한 이해를 다듬어야 합니다.

## `Future` 트레이트

`async` 함수는 `Future` 트레이트를 구현하는 타입인 **퓨처**를 반환한다고 일찍이 언급했습니다. 퓨처를 **상태 머신**으로 생각할 수 있습니다.
두 가지 상태 중 하나에 있습니다:

- **대기 중**: 계산이 아직 완료되지 않았습니다.
- **준비 완료**: 계산이 완료되었으며, 여기에 출력이 있습니다.

이것은 트레이트 정의에 인코딩되어 있습니다:

```rust
trait Future {
    type Output;
    
    // 지금은 `Pin`과 `Context`를 무시하세요
    fn poll(
      self: Pin<&mut Self>, 
      cx: &mut Context<'_>
    ) -> Poll<Self::Output>;
}
```

### `poll`

`poll` 메소드는 `Future` 트레이트의 핵심입니다.
퓨처는 자체적으로 아무것도 하지 않습니다. 진행하려면 **폴링**되어야 합니다.
`poll`을 호출하면 퓨처에게 작업을 수행하도록 요청하는 것입니다.
`poll`은 진행하려고 시도한 다음 다음 중 하나를 반환합니다:

- `Poll::Pending`: 퓨처가 아직 준비되지 않았습니다. 나중에 다시 `poll`을 호출해야 합니다.
- `Poll::Ready(value)`: 퓨처가 완료되었습니다. `value`는 `Self::Output` 타입의 계산 결과입니다.

`Future::poll`이 `Poll::Ready`를 반환하면 다시 폴링해서는 안 됩니다: 퓨처가 완료되었으므로 더 이상 할 일이 없습니다.

### 런타임의 역할

`poll`을 직접 호출하는 경우는 거의 없을 것입니다.
그것은 비동기 런타임의 역할입니다: 퓨처가 가능할 때마다 진행되도록 보장하는 데 필요한 모든 정보(`poll`의 시그니처에 있는 `Context`)를 가지고 있습니다.

## `async fn`과 퓨처

우리는 고수준 인터페이스인 비동기 함수로 작업했습니다.
이제 저수준 프리미티브인 `Future` 트레이트를 살펴보았습니다.

이들은 어떻게 관련되어 있을까요?

함수를 비동기로 표시할 때마다 해당 함수는 퓨처를 반환합니다.
컴파일러는 비동기 함수의 본문을 **상태 머신**으로 변환합니다:
각 `.await` 지점마다 하나의 상태를 가집니다.

`Rc` 예제로 돌아가 봅시다:

```rust
use std::rc::Rc;
use tokio::task::yield_now;

async fn example() {
    let non_send = Rc::new(1);
    yield_now().await;
    println!("{}", non_send);
}
```

컴파일러는 이를 다음과 유사한 열거형으로 변환할 것입니다:

```rust
pub enum ExampleFuture {
    NotStarted,
    YieldNow(Rc<i32>),
    Terminated,
}
```

`example`이 호출되면 `ExampleFuture::NotStarted`를 반환합니다. 퓨처는 아직 폴링된 적이 없으므로 아무 일도 일어나지 않았습니다.
런타임이 처음 폴링하면 `ExampleFuture`는 다음 `.await` 지점까지 진행됩니다: 상태 머신의 `ExampleFuture::YieldNow(Rc<i32>)` 단계에서 멈추고 `Poll::Pending`을 반환합니다.
다시 폴링되면 나머지 코드(`println!`)를 실행하고
`Poll::Ready(())`를 반환합니다.

상태 머신 표현인 `ExampleFuture`를 보면,
`example`이 `Send`가 아닌 이유가 이제 명확합니다: `Rc`를 가지고 있으므로
`Send`가 될 수 없습니다.

## 양보 지점

`example`에서 보았듯이, 모든 `.await` 지점은 퓨처의 라이프사이클에서 새로운 중간 상태를 생성합니다.
이것이 `.await` 지점이 **양보 지점**이라고도 불리는 이유입니다: 퓨처는 자신을 폴링하던 런타임에게 제어를 _양보_하여 런타임이 이를 일시 중지하고 (필요한 경우)
다른 태스크를 실행하도록 스케줄링하여 여러 전선에서 동시에 진행할 수 있도록 합니다.

양보의 중요성에 대해서는 나중에 다시 다룰 것입니다.