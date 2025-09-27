# 마무리

Rust의 비동기 모델은 매우 강력하지만, 추가적인 복잡성을 도입합니다. 도구를 아는 데 시간을 투자하십시오: `tokio` 문서에 깊이 파고들어 그 프리미티브에 익숙해져 최대한 활용하십시오.

또한, Rust의 비동기 스토리를 간소화하고 "완성"하기 위한 언어 및 `std` 수준의 작업이 진행 중이라는 점을 명심하십시오. 이러한 누락된 부분으로 인해 일상적인 작업에서 일부 거친 부분을 경험할 수 있습니다.

대부분 고통 없는 비동기 경험을 위한 몇 가지 권장 사항:

- **런타임을 선택하고 고수하십시오.**
  일부 프리미티브(예: 타이머, I/O)는 런타임 간에 이식할 수 없습니다. 런타임을 혼합하려고 하면 고통을 겪을 가능성이 높습니다. 런타임에 구애받지 않는 코드를 작성하려고 하면 코드베이스의 복잡성이 크게 증가할 수 있습니다. 가능하다면 피하십시오.
- **아직 안정적인 `Stream`/`AsyncIterator` 인터페이스가 없습니다.**
  `AsyncIterator`는 개념적으로 새 항목을 비동기적으로 생성하는 반복자입니다. 현재 설계 작업이 진행 중이지만, 아직 합의된 바는 없습니다.
  `tokio`를 사용하고 있다면 [`tokio_stream`](https://docs.rs/tokio-stream/latest/tokio_stream/)을 기본 인터페이스로 참조하십시오.
- **버퍼링에 주의하십시오.**
  미묘한 버그의 원인이 되는 경우가 많습니다. 자세한 내용은
  ["Barbara battles buffered streams"](https://rust-lang.github.io/wg-async/vision/submitted_stories/status_quo/barbara_battles_buffered_streams.html)을 확인하십시오.
- **비동기 태스크에 대한 스코프 스레드와 동등한 것이 없습니다.**
  자세한 내용은 ["The scoped task trilemma"](https://without.boats/blog/the-scoped-task-trilemma/)를 확인하십시오.

이러한 주의 사항에 겁먹지 마십시오: 비동기 Rust는 기초 서비스를 강화하기 위해 _대규모_로 (예: AWS, Meta) 효과적으로 사용되고 있습니다.
Rust에서 네트워크 애플리케이션을 구축할 계획이라면 이를 마스터해야 할 것입니다.