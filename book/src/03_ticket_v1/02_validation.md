# 유효성 검사

티켓 정의로 돌아가 봅시다:

```rust
struct Ticket {
    title: String,
    description: String,
    status: String,
}
```

`Ticket` 구조체의 필드에 "원시" 타입을 사용하고 있습니다.
이는 사용자가 빈 제목, 엄청나게 긴 설명 또는 의미 없는 상태(예: "Funny")로 티켓을 만들 수 있음을 의미합니다.\
우리는 그보다 더 잘할 수 있습니다!

## 추가 자료

- [`String`의 문서](https://doc.rust-lang.org/std/string/struct.String.html)에서 제공하는 메소드에 대한 철저한 개요를 확인하세요. 연습 문제에 필요할 것입니다!