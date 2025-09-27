// TODO: `echo` 서버는 비동기 프리미티브를 사용하지 않습니다.
//  테스트를 실행하면 호출자와 서버 간의 교착 상태로 인해
//  서버가 멈추는 것을 관찰할 수 있습니다.
//  `echo` 내에서 `spawn_blocking`을 사용하여 이 문제를 해결하세요.
use std::io::{Read, Write};
use tokio::net::TcpListener;

pub async fn echo(listener: TcpListener) -> Result<(), anyhow::Error> {
    loop {
        let (socket, _) = listener.accept().await?;
        let mut socket = socket.into_std()?;
        socket.set_nonblocking(false)?;
        let mut buffer = Vec::new();
        socket.read_to_end(&mut buffer)?;
        socket.write_all(&buffer)?;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::net::SocketAddr;
    use std::panic;
    use tokio::io::{AsyncReadExt, AsyncWriteExt};
    use tokio::task::JoinSet;

    async fn bind_random() -> (TcpListener, SocketAddr) {
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        (listener, addr)
    }

    #[tokio::test]
    async fn test_echo() {
        let (listener, addr) = bind_random().await;
        tokio::spawn(echo(listener));

        let requests = vec![
            "hello here we go with a long message",
            "world",
            "foo",
            "bar",
        ];
        let mut join_set = JoinSet::new();

        for request in requests {
            join_set.spawn(async move {
                let mut socket = tokio::net::TcpStream::connect(addr).await.unwrap();
                let (mut reader, mut writer) = socket.split();

                // 요청 보내기
                writer.write_all(request.as_bytes()).await.unwrap();
                // 소켓의 쓰기 측 닫기
                writer.shutdown().await.unwrap();

                // 응답 읽기
                let mut buf = Vec::with_capacity(request.len());
                reader.read_to_end(&mut buf).await.unwrap();
                assert_eq!(&buf, request.as_bytes());
            });
        }

        while let Some(outcome) = join_set.join_next().await {
            if let Err(e) = outcome {
                if let Ok(reason) = e.try_into_panic() {
                    panic::resume_unwind(reason);
                }
            }
        }
    }
}