# 태스크 생성

이전 연습 문제에 대한 여러분의 해결책은 다음과 같을 것입니다:

```rust
pub async fn echo(listener: TcpListener) -> Result<(), anyhow::Error> {
    loop {
        let (mut socket, _) = listener.accept().await?;
        let (mut reader, mut writer) = socket.split();
        tokio::io::copy(&mut reader, &mut writer).await?;
    }
}
```

나쁘지 않습니다!
두 개의 들어오는 연결 사이에 오랜 시간이 지나면 `echo` 함수는 유휴 상태가 되어( `TcpListener::accept`가 비동기 함수이므로) 실행기가 그 동안 다른 태스크를 실행할 수 있도록 합니다.

하지만 실제로 여러 태스크를 동시에 실행하려면 어떻게 해야 할까요?
비동기 함수를 항상 완료될 때까지 실행하면(`.await`를 사용하여), 한 번에 하나 이상의 태스크가 실행되지 않을 것입니다.

이때 `tokio::spawn` 함수가 등장합니다.

## `tokio::spawn`

`tokio::spawn`을 사용하면 태스크를 실행기에 넘겨줄 수 있으며, **완료될 때까지 기다리지 않습니다**.
`tokio::spawn`을 호출할 때마다 `tokio`에게 생성된 태스크를 백그라운드에서, 태스크를 생성한 태스크와 **동시에** 계속 실행하도록 지시하는 것입니다.

다음은 여러 연결을 동시에 처리하는 데 사용하는 방법입니다:

```rust
use tokio::net::TcpListener;

pub async fn echo(listener: TcpListener) -> Result<(), anyhow::Error> {
    loop {
        let (mut socket, _) = listener.accept().await?;
        // 연결을 처리하기 위해 백그라운드 태스크 생성
        // 따라서 메인 태스크가 즉시 새로운 연결을 수락할 수 있도록 합니다
        tokio::spawn(async move {
            let (mut reader, mut writer) = socket.split();
            tokio::io::copy(&mut reader, &mut writer).await?;
        });
    }
}
```

### 비동기 블록

이 예제에서는 `tokio::spawn`에 **비동기 블록**을 전달했습니다: `async move { /* */ }`
비동기 블록은 별도의 비동기 함수를 정의할 필요 없이 코드 영역을 비동기로 표시하는 빠른 방법입니다.

### `JoinHandle`

`tokio::spawn`은 `JoinHandle`을 반환합니다.
`JoinHandle`을 사용하여 백그라운드 태스크를 `.await`할 수 있습니다. 이는 생성된 스레드에 `join`을 사용한 것과 동일한 방식입니다.

```rust
pub async fn run() {
    // 원격 서버로 텔레메트리 데이터를 전송하기 위해 백그라운드 태스크 생성
    let handle = tokio::spawn(emit_telemetry());
    // 그 동안 다른 유용한 작업 수행
    do_work().await;
    // 하지만 텔레메트리 데이터가 성공적으로 전달될 때까지
    // 호출자에게 반환하지 않습니다
    handle.await;
}

pub async fn emit_telemetry() {
    // [...]
}

pub async fn do_work() {
    // [...]
}
```

### 패닉 경계

`tokio::spawn`으로 생성된 태스크가 패닉을 일으키면, 패닉은 실행기에 의해 잡힐 것입니다.
해당 `JoinHandle`을 `.await`하지 않으면 패닉은 생성자에게 전파되지 않습니다.
`JoinHandle`을 `.await`하더라도 패닉은 자동으로 전파되지 않습니다.
`JoinHandle`을 기다리면 `Result`를 반환하며, 오류 타입은 [`JoinError`](https://docs.rs/tokio/latest/tokio/task/struct.JoinError.html)입니다. 그런 다음 `JoinError::is_panic`을 호출하여 태스크가 패닉을 일으켰는지 확인할 수 있으며,
패닉을 어떻게 처리할지 선택할 수 있습니다. 로그에 기록하거나, 무시하거나, 전파할 수 있습니다.

```rust
use tokio::task::JoinError;

pub async fn run() {
    let handle = tokio::spawn(work());
    if let Err(e) = handle.await {
        if let Ok(reason) = e.try_into_panic() {
            // 태스크가 패닉을 일으켰습니다
            // 패닉을 다시 풀기 시작합니다
            // 따라서 현재 태스크로 전파합니다
            panic::resume_unwind(reason);
        }
    }
}

pub async fn work() {
    // [...]
}
```

### `std::thread::spawn` vs `tokio::spawn`

`tokio::spawn`을 `std::thread::spawn`의 비동기 형제라고 생각할 수 있습니다.

한 가지 중요한 차이점에 주목하십시오: `std::thread::spawn`을 사용하면 OS 스케줄러에게 제어를 위임하는 것입니다.
스레드가 어떻게 스케줄링되는지 제어할 수 없습니다.

`tokio::spawn`을 사용하면 사용자 공간에서 완전히 실행되는 비동기 실행기에게 위임하는 것입니다.
기본 OS 스케줄러는 다음에 어떤 태스크를 실행할지 결정하는 데 관여하지 않습니다. 이제 우리가 선택한 실행기를 통해 그 결정을 담당합니다.