# `Drop` 트레이트

[소멸자](../03_ticket_v1/11_destructor.md)를 소개할 때, `drop` 함수가 다음을 수행한다고 언급했습니다:

1. 타입이 차지하는 메모리를 회수합니다 (즉, `std::mem::size_of` 바이트).
2. 값이 관리할 수 있는 추가 리소스(예: `String`의 힙 버퍼)를 정리합니다.

2단계가 바로 `Drop` 트레이트가 등장하는 부분입니다.

```rust
pub trait Drop {
    fn drop(&mut self);
}
```

`Drop` 트레이트는 컴파일러가 자동으로 수행하는 것 외에, 타입에 대한 _추가적인_ 정리 로직을 정의하기 위한 메커니즘입니다.
`drop` 메소드에 넣는 모든 것은 값이 범위를 벗어날 때 실행됩니다.

## `Drop`과 `Copy`

`Copy` 트레이트에 대해 이야기할 때, 타입이 메모리에서 차지하는 `std::mem::size_of` 바이트를 넘어서는 추가 리소스를 관리하는 경우 `Copy`를 구현할 수 없다고 말했습니다.

궁금할 수 있습니다: 컴파일러는 타입이 추가 리소스를 관리하는지 어떻게 알까요?
맞습니다: `Drop` 트레이트 구현입니다!
타입에 명시적인 `Drop` 구현이 있는 경우, 컴파일러는 해당 타입에 추가 리소스가 연결되어 있다고 가정하고 `Copy`를 구현하는 것을 허용하지 않습니다.

```rust
// 이것은 단위 구조체, 즉 필드가 없는 구조체입니다.
#[derive(Clone, Copy)]
struct MyType;

impl Drop for MyType {
    fn drop(&mut self) {
       // 여기서 아무것도 할 필요가 없습니다.
       // "빈" Drop 구현만 있으면 충분합니다.
    }
}
```

컴파일러는 다음 오류 메시지와 함께 불평할 것입니다:

```text
error[E0184]: the trait `Copy` cannot be implemented for this type; 
              the type has a destructor
 --> src/lib.rs:2:17
  |
2 | #[derive(Clone, Copy)]
  |                 ^^^^ `Copy` not allowed on types with destructors
```