# 가변 인덱싱(Mutable Indexing)

앞서 살펴본 `Index` 트레이트는 오직 읽기 전용 접근만을 허용합니다. 즉, 인덱싱을 통해 가져온 값을 직접 수정할 수는 없죠.

## `IndexMut` 트레이트

가변적으로 인덱싱한 값을 수정하고 싶다면 `IndexMut` 트레이트를 구현해야 합니다.

```rust
// 약간 단순화된 정의입니다.
pub trait IndexMut<Idx>: Index<Idx>
{
    // 필수 메소드
    fn index_mut(&mut self, index: Idx) -> &mut Self::Output;
}
```

한 가지 눈여겨볼 점은 `IndexMut`이 `Index` 트레이트를 상속받는다는 것입니다. 따라서 `IndexMut`을 구현하려면 먼저 `Index` 트레이트가 구현되어 있어야 합니다. 이는 가변 접근이라는 **추가적인** 기능을 제공하기 위한 것이기 때문입니다.