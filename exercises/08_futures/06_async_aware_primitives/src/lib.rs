/// TODO: 아래 코드는 std의 채널을 사용하기 때문에 교착 상태에 빠집니다.
///  std의 채널은 비동기를 인식하지 못합니다.
///  `tokio`의 채널 프리미티브를 사용하도록 다시 작성하세요
///  (네, 테스트 코드도 수정해야 합니다).
///
/// 교착 상태로 이어질 수 있는 이벤트 순서를 이해할 수 있나요?
use std::sync::mpsc;

pub struct Message {
    payload: String,
    response_channel: mpsc::Sender<Message>,
}

/// 수신하는 모든 메시지에 `pong`으로 회신하고,
/// 호출자와 계속 통신하기 위해 새 채널을 설정합니다.
pub async fn pong(mut receiver: mpsc::Receiver<Message>) {
    loop {
        if let Ok(msg) = receiver.recv() {
            println!("Pong received: {}", msg.payload);
            let (sender, new_receiver) = mpsc::channel();
            msg.response_channel
                .send(Message {
                    payload: "pong".into(),
                    response_channel: sender,
                })
                .unwrap();
            receiver = new_receiver;
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::{pong, Message};
    use std::sync::mpsc;

    #[tokio::test]
    async fn ping() {
        let (sender, receiver) = mpsc::channel();
        let (response_sender, response_receiver) = mpsc::channel();
        sender
            .send(Message {
                payload: "pong".into(),
                response_channel: response_sender,
            })
            .unwrap();

        tokio::spawn(pong(receiver));

        let answer = response_receiver.recv().unwrap().payload;
        assert_eq!(answer, "pong");
    }
}