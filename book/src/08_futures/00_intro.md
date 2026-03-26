# 비동기 Rust (Asynchronous Rust)

Rust에서 동시성(Concurrency) 프로그램을 작성하는 방법이 스레드(Threads)만 있는 것은 아닙니다. 이번 챕터에서는 또 다른 접근 방식인 **비동기 프로그래밍(Asynchronous Programming)**을 탐색해 보겠습니다.

특히 다음과 같은 핵심 개념들을 소개합니다:

- 비동기 코드를 손쉽게 작성할 수 있게 해주는 `async`/`.await` 키워드
- 아직 완료되지 않았을 수 있는 작업을 나타내는 **`Future` 트레이트**
- 비동기 코드를 실행하기 위한 가장 인기 있는 **런타임(Runtime)**인 `tokio`
- Rust 비동기 모델의 **협력적(Cooperative)** 특성과 이것이 여러분의 코드에 미치는 영향
