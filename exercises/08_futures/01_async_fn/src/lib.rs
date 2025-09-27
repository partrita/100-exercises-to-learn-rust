use tokio::net::TcpListener;

// TODO: 들어오는 TCP 연결을 수락하고 수신된 데이터를 클라이언트에게 다시 에코하는 에코 서버를 작성하세요.
//  `echo`는 연결 처리를 마친 후에도 반환되지 않고 계속해서 새로운 연결을 수락해야 합니다.
//
// 힌트: 에코 서버를 구현하려면 `tokio`의 구조체와 메서드를 사용해야 합니다.
// 특히:
// - `tokio::net::TcpListener::accept`를 사용하여 다음 들어오는 연결을 처리합니다.
// - `tokio::net::TcpStream::split`을 사용하여 소켓에서 리더와 라이터를 얻습니다.
// - `tokio::io::copy`를 사용하여 리더에서 라이터로 데이터를 복사합니다.
pub async fn echo(listener: TcpListener) -> Result<(), anyhow::Error> {
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio::io::{AsyncReadExt, AsyncWriteExt};

    #[tokio::test]
    async fn test_echo() {
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        tokio::spawn(echo(listener));

        let requests = vec!["hello", "world", "foo", "bar"];

        for request in requests {
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
        }
    }
}