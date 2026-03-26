# 마무리

Rust의 비동기 모델은 매우 강력하지만, 그만큼 복잡하기도 합니다. 도구의 특성을 잘 파악하는 데 시간을 투자하세요. 특히 `tokio` 문서를 깊이 읽어보고 제공되는 프리미티브들에 익숙해진다면 비동기 프로그래밍의 잠재력을 최대한 끌어낼 수 있을 것입니다.

또한 Rust의 비동기 관련 기능들은 현재도 언어 차원과 표준 라이브러리(`std`) 수준에서 "완성"을 향해 계속 다듬어지고 있는 과정에 있다는 점을 기억해 두세요. 이 과정에서 가끔은 매끄럽지 않은 부분을 마주할 수도 있습니다.

즐겁고 고통 없는 비동기 프로그래밍을 위한 몇 가지 권장 사항을 전해드립니다:

- **런타임을 하나 정했다면 일관성 있게 사용하세요.**
  타이머나 I/O 같은 일부 프리미티브들은 런타임 간에 서로 호환되지 않습니다. 여러 런타임을 섞어서 쓰려고 하면 예상치 못한 문제로 고생할 확률이 높습니다. 런타임에 구애받지 않는(Runtime-agnostic) 코드를 짜는 것은 매우 복잡한 작업이므로, 꼭 필요한 경우가 아니라면 피하는 것이 좋습니다.
- **아직 안정화된 `Stream`/`AsyncIterator` 인터페이스가 없습니다.**
  `AsyncIterator`는 개념적으로 새로운 항목을 비동기적으로 생성해 내는 반복자입니다. 현재 설계가 진행 중이지만 아직 표준으로 확정된 바는 없습니다. `tokio`를 사용 중이라면 [`tokio_stream`](https://docs.rs/tokio-stream/latest/tokio_stream/)을 기본 인터페이스로 활용하세요.
- **버퍼링(Buffering)에 주의하세요.**
  버퍼링은 때때로 미묘한 버그의 원인이 됩니다. 관심이 있다면 ["Barbara battles buffered streams"](https://rust-lang.github.io/wg-async/vision/submitted_stories/status_quo/barbara_battles_buffered_streams.html) 문서를 읽어보시기 바랍니다.
- **비동기 태스크에는 아직 '스코프 스레드(Scoped threads)'와 같은 기능이 없습니다.**
  이 문제에 대한 더 깊은 내용은 ["The scoped task trilemma"](https://without.boats/blog/the-scoped-task-trilemma/) 포스트를 참고하세요.

이런 주의 사항들 때문에 너무 겁먹을 필요는 없습니다. 비동기 Rust는 이미 AWS나 Meta와 같은 대형 기업에서 대규모 인프라 서비스를 구축하는 데 매우 효과적으로 사용되고 있습니다. 만약 여러분이 Rust로 네트워크 애플리케이션을 만들 계획이라면, 비동기 프로그래밍을 마스터하는 것은 분명 가치 있는 도전이 될 것입니다.
