# 인덱싱(Indexing)

지금까지의 `TicketStore::get` 메소드는 주어진 `TicketId`에 대해 `Option<&Ticket>`을 반환해 주었습니다. 그런데 이미 여러분은 Rust에서 배열이나 벡터의 요소에 접근할 때 흔히 쓰이는 **인덱싱(Indexing)** 구문을 익히 알고 계실 거예요.

```rust
let v = vec![0, 1, 2];
assert_eq!(v[0], 0);
```

이와 동일한 사용 경험을 `TicketStore`에서도 제공할 순 없을까요? 맞습니다! 바로 `Index` 트레이트를 구현하면 가능합니다.

## `Index` 트레이트

`Index` 트레이트는 Rust 표준 라이브러리에 다음과 같이 정의되어 있습니다.

```rust
// 약간 단순화된 정의입니다.
pub trait Index<Idx>
{
    type Output;

    // 필수 메소드
    fn index(&self, index: Idx) -> &Self::Output;
}
```

이 트레이트에는 두 가지 핵심 요소가 있습니다.

- **`Idx`**: 인덱스로 사용할 타입을 나타내는 제네릭(Generic) 매개변수입니다.
- **`Output`**: 인덱스를 통해 찾은 값의 타입을 나타내는 연관 타입(Associated type)입니다.

여기서 주의할 점은 `index` 메소드가 `Option`을 반환하지 않는다는 것입니다. 이는 배열이나 벡터 인덱싱과 마찬가지로, 존재하지 않는 인덱스에 접근하려고 하면 `index` 메소드가 **패닉(Panic)**을 일으킨다는 것을 전제로 하기 때문입니다. 이 점을 꼭 기억해 두세요!