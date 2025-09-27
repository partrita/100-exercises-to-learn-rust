# 가변 인덱싱

`Index`는 읽기 전용 접근을 허용합니다. 검색한 값을 변경할 수 없습니다.

## `IndexMut`

가변성을 허용하려면 `IndexMut` 트레이트를 구현해야 합니다.

```rust
// 약간 단순화됨
pub trait IndexMut<Idx>: Index<Idx>
{
    // 필수 메소드
    fn index_mut(&mut self, index: Idx) -> &mut Self::Output;
}
```

`IndexMut`는 타입이 이미 `Index`를 구현하는 경우에만 구현될 수 있습니다.
이는 _추가적인_ 기능을 잠금 해제하기 때문입니다.