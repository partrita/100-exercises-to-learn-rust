# 인덱싱

`TicketStore::get`은 주어진 `TicketId`에 대해 `Option<&Ticket>`을 반환합니다.
Rust의 인덱싱 구문을 사용하여 배열 및 벡터의 요소에 접근하는 방법을 이전에 보았습니다:

```rust
let v = vec![0, 1, 2];
assert_eq!(v[0], 0);
```

`TicketStore`에 대해 동일한 경험을 어떻게 제공할 수 있을까요?
맞습니다: `Index` 트레이트를 구현해야 합니다!

## `Index`

`Index` 트레이트는 Rust의 표준 라이브러리에 정의되어 있습니다:

```rust
// 약간 단순화됨
pub trait Index<Idx>
{
    type Output;

    // 필수 메소드
    fn index(&self, index: Idx) -> &Self::Output;
}
```

다음과 같은 것을 가집니다:

- 인덱스 타입을 나타내는 하나의 제네릭 매개변수 `Idx`
- 인덱스를 사용하여 검색한 타입을 나타내는 하나의 연관 타입 `Output`

`index` 메소드가 `Option`을 반환하지 않는다는 점에 주목하십시오. 배열 및 벡터 인덱싱에서 발생하는 것처럼, 존재하지 않는 요소에 접근하려고 하면 `index`가 패닉을 일으킬 것이라는 가정이 있습니다.