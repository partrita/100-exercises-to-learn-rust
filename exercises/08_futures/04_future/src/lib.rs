//! TODO: `example` 함수 안의 문장들의 **순서를 바꿔서** 코드가 컴파일되도록 하세요.
//!  `spawner` 함수나 `example` 안의 각 라인이 하는 일은 바꿀 수 없습니다.
//!   필요하다면 기존 문장들을 블록 `{}`으로 감쌀 수 있습니다.
use std::rc::Rc;
use tokio::task::yield_now;

fn spawner() {
    tokio::spawn(example());
}

async fn example() {
    let non_send = Rc::new(1);
    yield_now().await;
    println!("{}", non_send);
}