# 마무리

도메인 모델링(Domain Modeling)에 있어서는 아주 작은 세부 사항이 큰 차이를 만듭니다.
Rust는 여러분이 설계한 도메인의 제약 조건을 타입 시스템에 직접 표현할 수 있는 강력한 도구들을 제공합니다. 다만, 이를 올바르고 관용적(Idiomatic)으로 사용하려면 약간의 연습이 필요하죠.

`Ticket` 모델을 마지막으로 한 번 더 개선하며 이번 챕터를 마칩니다. 우리는 `Ticket`의 각 필드에 새로운 타입을 도입하여 각각의 제약 조건을 **캡슐화(Encapsulation)**할 것입니다. 이제 누군가 `Ticket`의 필드에 접근할 때마다, 단순한 `String`이 아니라 이미 유효성이 검증된 `TicketTitle`과 같은 타입을 받게 됩니다. 덕분에 코드의 다른 곳에서 "제목이 비어 있으면 어쩌지?" 같은 걱정을 할 필요가 없죠. 여러분의 손에 `TicketTitle`이 있다는 것 자체가 이미 **구조상** 유효하다는 증거니까요.

이것은 Rust의 타입 시스템을 활용해 코드를 더 안전하고 표현력 있게 만드는 아주 좋은 예시입니다.

## 더 읽어보기 (영문 자료)

- [유효성 검사하지 말고 파싱하세요 (Parse, don't validate)](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)
- [타입을 사용하여 도메인 불변성 보장하기 (Guaranteeing domain invariants with types)](https://www.lpalmieri.com/posts/2020-12-11-zero-to-production-6-domain-modelling/)