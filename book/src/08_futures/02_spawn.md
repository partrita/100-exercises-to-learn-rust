# 태스크 스폰 (Task Spawn)

이전 연습 문제에 대한 여러분의 해결책은 아마 다음과 비슷할 것입니다:

```rust
pub async fn echo(listener: TcpListener) -> Result<(), anyhow::Error> {
    loop {
        let (mut socket, _) = listener.accept().await?;
        let (mut reader, mut writer) = socket.split();
        tokio::io::copy(&mut reader, &mut writer).await?;
    }
}
```

나쁘지 않은 코드입니다! 두 연결 사이에 공백 시간이 길어지면 `echo` 함수는 유휴(Idle) 상태가 됩니다. `TcpListener::accept`가 비동기 함수이기 때문에, 기다리는 동안 실행기가 다른 태스크를 수행할 수 있도록 제어권을 넘겨주죠.

하지만 실제로 여러 태스크를 **동시에** 실행하려면 어떻게 해야 할까요? 위 코드처럼 비동기 함수를 항상 완료될 때까지 기다리면(`.await`), 한 번에 하나의 태스크밖에 처리할 수 없습니다.

이때 필요한 것이 바로 **태스크 스폰(Spawn)**입니다.

## `tokio::spawn`

`tokio::spawn`을 사용하면 태스크를 실행기에 넘겨줄 수 있으며, 그 태스크가 **완료될 때까지 기다리지 않아도 됩니다**.
`tokio::spawn`을 호출하는 것은 `tokio`에게 "이 태스크를 백그라운드에서 실행해 줘. 그리고 원래 하던 일(태스크를 만든 태스크)과 **동시에** 진행해 줘"라고 부탁하는 것과 같습니다.

여러 연결을 동시에 처리하기 위해 사용하는 방법은 다음과 같습니다:

```rust
use tokio::net::TcpListener;

pub async fn echo(listener: TcpListener) -> Result<(), anyhow::Error> {
    loop {
        let (mut socket, _) = listener.accept().await?;
        // 연결을 처리하기 위해 백그라운드 태스크를 생성(Spawn)합니다.
        // 덕분에 메인 태스크는 즉시 다음 연결을 수락할 준비를 할 수 있습니다.
        tokio::spawn(async move {
            let (mut reader, mut writer) = socket.split();
            tokio::io::copy(&mut reader, &mut writer).await?;
        });
    }
}
```

### 비동기 블록 (Async Blocks)

위 예제에서는 `tokio::spawn`에 **비동기 블록**을 전달했습니다: `async move { /* */ }`
비동기 블록은 별도의 비동기 함수를 정의하지 않고도 특정 코드 영역을 비동기로 표시할 수 있는 간편한 방법입니다.

### `JoinHandle`

`tokio::spawn`은 `JoinHandle`을 반환합니다. 스레드에서 `join`을 사용해 결과를 기다리는 것처럼, `JoinHandle`을 사용해 백그라운드 태스크의 종료를 기다릴(`.await`) 수 있습니다.

```rust
pub async fn run() {
    // 원격 서버로 텔레메트리 데이터를 보내는 백그라운드 태스크를 생성합니다.
    let handle = tokio::spawn(emit_telemetry());
    // 그동안 다른 유용한 작업을 수행합니다.
    do_work().await;
    // 하지만 텔레메트리 데이터가 성공적으로 전달될 때까지는
    // 호출자에게 결과를 반환하지 않고 기다립니다.
    handle.await;
}

pub async fn emit_telemetry() {
    // [...]
}

pub async fn do_work() {
    // [...]
}
```

### 패닉 경계 (Panic Boundary)

`tokio::spawn`으로 생성된 태스크에서 패닉이 발생하면, 그 패닉은 실행기가 잡아냅니다(Catch). 만약 해당 `JoinHandle`을 `.await`하지 않는다면 패닉은 생성자(Parent task)에게 전파되지 않습니다.
`JoinHandle`을 기다리더라도 패닉이 자동으로 전파되는 것은 아닙니다.
`JoinHandle`을 기다리면 `Result`를 반환하며, 오류 발생 시 타입은 [`JoinError`](https://docs.rs/tokio/latest/tokio/task/struct.JoinError.html)입니다. `JoinError::is_panic`을 사용해 태스크가 패닉으로 종료되었는지 확인하고,
패닉을 어떻게 처리할지(로그 기록, 무시, 혹은 다시 전파) 결정할 수 있습니다.

```rust
use tokio::task::JoinError;

pub async fn run() {
    let handle = tokio::spawn(work());
    if let Err(e) = handle.await {
        if let Ok(reason) = e.try_into_panic() {
            // 태스크가 패닉을 일으켰습니다.
            // 패닉 상태를 현재 태스크로 전파하여 다시 발생시킵니다.
            panic::resume_unwind(reason);
        }
    }
}

pub async fn work() {
    // [...]
}
```

### `std::thread::spawn` vs `tokio::spawn`

`tokio::spawn`은 `std::thread::spawn`의 비동기 버전이라고 생각하면 이해하기 쉽습니다.

하지만 중요한 차이점이 하나 있습니다. `std::thread::spawn`을 사용하면 제어권이 OS 스케줄러에게 넘어갑니다. 스레드가 어떻게 스케줄링되는지 우리가 직접 제어할 수 없죠.

반면 `tokio::spawn`은 사용자 공간(User space)에서 완전히 돌아가는 비동기 실행기에게 제어권을 넘깁니다. 이제 어떤 태스크를 다음에 실행할지는 OS 스케줄러가 아니라 우리가 선택한 실행기가 결정하게 됩니다.
