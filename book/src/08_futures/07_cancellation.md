# 취소

대기 중인 퓨처가 삭제되면 어떻게 될까요?
런타임은 더 이상 이를 폴링하지 않으므로 더 이상 진행되지 않습니다.
즉, 실행이 **취소**되었습니다.

실제로 이는 타임아웃과 함께 작업할 때 자주 발생합니다.
예를 들어:

```rust
use tokio::time::timeout;
use tokio::sync::oneshot;
use std::time::Duration;

async fn http_call() {
    // [...]
}

async fn run() {
    // 퓨처를 10밀리초 후에 만료되도록 설정된 `Timeout`으로 래핑합니다.
    let duration = Duration::from_millis(10);
    if let Err(_) = timeout(duration, http_call()).await {
        println!("10ms 이내에 값을 받지 못했습니다");
    }
}
```

타임아웃이 만료되면 `http_call`이 반환하는 퓨처는 취소됩니다.
이것이 `http_call`의 본문이라고 상상해 봅시다:

```rust
use std::net::TcpStream;

async fn http_call() {
    let (stream, _) = TcpStream::connect(/* */).await.unwrap();
    let request: Vec<u8> = /* */;
    stream.write_all(&request).await.unwrap();
}
```

각 양보 지점은 **취소 지점**이 됩니다.
`http_call`은 런타임에 의해 선점될 수 없으므로 `.await`를 통해 실행기에 제어를 양보한 후에만 폐기될 수 있습니다.
이것은 재귀적으로 적용됩니다. 예를 들어, `stream.write_all(&request)`는 구현에 여러 양보 지점을 가질 가능성이 높습니다. `http_call`이 취소되기 전에 _부분적인_ 요청을 푸시하여 연결을 끊고 본문 전송을 완료하지 못하는 것이 완벽하게 가능합니다.

## 정리

Rust의 취소 메커니즘은 매우 강력합니다. 호출자가 태스크 자체의 협력 없이 진행 중인 태스크를 취소할 수 있도록 합니다.
동시에 이것은 매우 위험할 수 있습니다. 작업을 중단하기 전에 일부 정리 작업을 수행하도록 **우아한 취소**를 수행하는 것이 바람직할 수 있습니다.

예를 들어, SQL 트랜잭션에 대한 가상의 API를 고려해 봅시다:

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

취소 시에는 보류 중인 트랜잭션을 매달아 두는 대신 명시적으로 중단하는 것이 이상적일 것입니다.
불행히도 Rust는 이러한 종류의 **비동기** 정리 작업을 위한 완벽한 메커니즘을 제공하지 않습니다.

가장 일반적인 전략은 `Drop` 트레이트에 의존하여 필요한 정리 작업을 예약하는 것입니다. 이는 다음을 통해 수행될 수 있습니다:

- 런타임에 새 태스크 생성
- 채널에 메시지 큐에 넣기
- 백그라운드 스레드 생성

최적의 선택은 상황에 따라 다릅니다.

## 생성된 태스크 취소

`tokio::spawn`을 사용하여 태스크를 생성하면 더 이상 삭제할 수 없습니다.
런타임에 속합니다.
그럼에도 불구하고, 필요한 경우 `JoinHandle`을 사용하여 취소할 수 있습니다:

```rust
async fn run() {
    let handle = tokio::spawn(/* 일부 비동기 태스크 */);
    // 생성된 태스크 취소
    handle.abort();
}
```

## 추가 자료

- `tokio`의 `select!` 매크로를 사용하여 두 가지 다른 퓨처를 "경쟁"시킬 때는 극도로 주의하십시오.
  **취소 안전성**을 보장할 수 없는 한 루프에서 동일한 태스크를 재시도하는 것은 위험합니다.
  자세한 내용은 [`select!` 문서](https://tokio.rs/tokio/tutorial/select)를 확인하십시오.
  두 개의 비동기 데이터 스트림(예: 소켓 및 채널)을 인터리빙해야 하는 경우, 대신 [`StreamExt::merge`](https://docs.rs/tokio-stream/latest/tokio_stream/trait.StreamExt.html#method.merge)를 사용하는 것을 선호하십시오.
- 경우에 따라 [`CancellationToken`](https://docs.rs/tokio-util/latest/tokio_util/sync/struct.CancellationToken.html)이 `JoinHandle::abort`보다 선호될 수 있습니다.