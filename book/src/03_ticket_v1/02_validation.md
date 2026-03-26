# 유효성 검사(Validation)

앞서 정의했던 티켓 구조체를 다시 살펴봅시다:

```rust
struct Ticket {
    title: String,
    description: String,
    status: String,
}
```

현재 `Ticket` 구조체의 필드들은 모두 '기본(Raw)' 타입을 사용하고 있습니다. 이대로라면 누군가 제목을 비워두거나, 설명이 감당할 수 없을 정도로 길어지거나, 혹은 "Funny"처럼 티켓 시스템에 어울리지 않는 상태값을 넣는 것을 막을 수 없습니다.

우리는 이보다 훨씬 더 꼼꼼하게 데이터를 관리할 수 있습니다!

## 참고 자료

- [`String` 공식 문서](https://doc.rust-lang.org/std/string/struct.String.html)에서 제공하는 다양한 메서드들을 꼼꼼히 살펴보세요. 이어지는 연습 문제를 풀 때 큰 도움이 될 겁니다!
