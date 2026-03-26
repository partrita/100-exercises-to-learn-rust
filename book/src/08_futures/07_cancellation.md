# 취소 (Cancellation)

대기 중이던 퓨처가 드롭(Drop)되면 어떻게 될까요? 런타임은 더 이상 그 퓨처를 폴링하지 않게 되고, 따라서 작업도 더 이상 진행되지 않습니다. 즉, 실행이 **취소(Cancellation)**된 것입니다.

실제로 이런 일은 타임아웃(Timeout) 기능을 사용할 때 자주 일어납니다. 예를 들어 보겠습니다:

```rust
use tokio::time::timeout;
use tokio::sync::oneshot;
use std::time::Duration;

async fn http_call() {
    // [...]
}

async fn run() {
    // 퓨처를 10밀리초 후에 만료되도록 설정된 `timeout`으로 감쌉니다.
    let duration = Duration::from_millis(10);
    if let Err(_) = timeout(duration, http_call()).await {
        println!("10ms 이내에 응답을 받지 못했습니다.");
    }
}
```

타임아웃 시간이 지나면 `http_call`이 반환한 퓨처는 취소됩니다. 만약 `http_call`의 본문이 다음과 같다고 상상해 봅시다:

```rust
use std::net::TcpStream;

async fn http_call() {
    let (stream, _) = TcpStream::connect(/* */).await.unwrap();
    let request: Vec<u8> = /* */;
    stream.write_all(&request).await.unwrap();
}
```

비동기 함수 내의 모든 양보 지점(Yield point)은 곧 **취소 지점(Cancellation point)**이 됩니다.
`http_call`은 런타임에 의해 강제로 중단될 수 없으므로, 오직 `.await`를 통해 실행기에게 제어권을 넘긴 시점에서만 폐기될 수 있습니다. 이 원리는 재귀적으로 적용됩니다. 예를 들어 `stream.write_all(&request)` 내부에도 여러 양보 지점이 있을 가능성이 높죠. 따라서 `http_call`이 취소될 때, 요청 본문 중 일부만 전송된 채로 연결이 끊어져 버릴 수도 있다는 점을 유의해야 합니다.

## 정리 작업

Rust의 취소 메커니즘은 매우 강력합니다. 호출자가 태스크의 협력 없이도 진행 중인 작업을 중단시킬 수 있게 해주니까요. 하지만 동시에 매우 위험할 수도 있습니다. 작업을 멈추기 전에 뒷정리를 해야 하는 **우아한 취소(Graceful cancellation)**가 필요할 때가 있기 때문입니다.

예를 들어 SQL 트랜잭션을 처리하는 가상의 API를 생각해 봅시다:

```rust
async fn transfer_money(
    connection: SqlConnection,
    payer_id: u64,
    payee_id: u64,
    amount: u64
) -> Result<(), anyhow::Error> {
    let transaction = connection.begin_transaction().await?;
    update_balance(payer_id, amount, &transaction).await?;
    decrease_balance(payee_id, amount, &transaction).await?;
    transaction.commit().await?;
}
```

만약 중간에 취소된다면, 보류 중인 트랜잭션을 그대로 두는 대신 명시적으로 롤백(Aborting)하는 것이 이상적일 것입니다. 안타깝게도 Rust는 현재 이러한 **비동기** 정리 작업을 위한 완벽한 메커니즘을 제공하지 않습니다.

가장 흔한 전략은 `Drop` 트레이트를 활용해 정리 작업을 예약하는 것입니다. 예를 들어 다음과 같은 방법을 씁니다:

- 런타임에 새로운 태스크를 스폰하여 정리 수행
- 채널을 통해 정리 메시지 전송
- 백그라운드 스레드 활용

상황에 맞는 최선의 선택을 해야 합니다.

## 스폰된 태스크의 취소

`tokio::spawn`으로 생성된 태스크는 드롭한다고 해서 취소되지 않습니다. 이제 런타임의 소유가 되었기 때문이죠. 그럼에도 불구하고 필요하다면 `JoinHandle`을 사용해 강제로 취소할 수 있습니다:

```rust
async fn run() {
    let handle = tokio::spawn(/* 어떤 비동기 태스크 */);
    // 스폰된 태스크를 취소합니다.
    handle.abort();
}
```

## 더 읽어보기

- `tokio`의 `select!` 매크로를 사용해 두 퓨처를 경쟁(Race)시킬 때는 극도로 주의해야 합니다.
  **취소 안전성(Cancellation safety)**이 보장되지 않는다면 루프 내에서 동일한 태스크를 재시도하는 것이 위험할 수 있습니다.
  자세한 내용은 [`select!` 공식 문서](https://tokio.rs/tokio/tutorial/select)를 참고하세요.
  두 비동기 데이터 스트림(예: 소켓과 채널)을 하나로 합쳐야 한다면 대신 [`StreamExt::merge`](https://docs.rs/tokio-stream/latest/tokio_stream/trait.StreamExt.html#method.merge)를 사용하는 것이 좋습니다.
- 어떤 경우에는 `JoinHandle::abort`보다 [`CancellationToken`](https://docs.rs/tokio-util/latest/tokio_util/sync/struct.CancellationToken.html)을 사용하는 것이 더 나은 대안이 될 수 있습니다.
