# 정렬

`Vec`에서 `HashMap`으로 이동함으로써 티켓 관리 시스템의 성능을 향상시키고 코드도 단순화했습니다.
하지만 모든 것이 장밋빛은 아닙니다. `Vec` 기반 저장소를 반복할 때, 티켓이 추가된 순서대로 반환될 것이라고 확신할 수 있었습니다.
`HashMap`의 경우는 그렇지 않습니다: 티켓을 반복할 수는 있지만 순서는 무작위입니다.

`HashMap`에서 `BTreeMap`으로 전환하여 일관된 순서를 복구할 수 있습니다.

## `BTreeMap`

`BTreeMap`은 항목이 키별로 정렬되도록 보장합니다.
이는 특정 순서로 항목을 반복해야 하거나 범위 쿼리(예: "ID가 10에서 20 사이인 모든 티켓을 줘")를 수행해야 할 때 유용합니다.

`HashMap`과 마찬가지로 `BTreeMap`의 정의에는 트레이트 바운드가 없습니다.
하지만 메소드에는 트레이트 바운드가 있습니다. `insert`를 살펴봅시다:

```rust
// `K`와 `V`는 `HashMap`과 마찬가지로 각각 키와 값 타입을 나타냅니다.
impl<K, V> BTreeMap<K, V> {
    pub fn insert(&mut self, key: K, value: V) -> Option<V>
    where
        K: Ord,
    {
        // 구현
    }
}
```

`Hash`는 더 이상 필요하지 않습니다. 대신 키 타입은 `Ord` 트레이트를 구현해야 합니다.

## `Ord`

`Ord` 트레이트는 값을 비교하는 데 사용됩니다.
`PartialEq`가 동등성을 비교하는 데 사용되는 반면, `Ord`는 순서를 비교하는 데 사용됩니다.

`std::cmp`에 정의되어 있습니다:

```rust
pub trait Ord: Eq + PartialOrd {
    fn cmp(&self, other: &Self) -> Ordering;
}
```

`cmp` 메소드는 `Less`, `Equal`, `Greater` 중 하나인 `Ordering` 열거형을 반환합니다.
`Ord`는 `Eq`와 `PartialOrd`라는 두 가지 다른 트레이트가 구현되어야 합니다.

## `PartialOrd`

`PartialOrd`는 `PartialEq`가 `Eq`의 약한 버전인 것처럼 `Ord`의 약한 버전입니다.
정의를 보면 그 이유를 알 수 있습니다:

```rust
pub trait PartialOrd: PartialEq {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering>;
}
```

`PartialOrd::partial_cmp`는 `Option`을 반환합니다. 두 값이 비교될 수 있다는 보장은 없습니다.
예를 들어, `f32`는 `NaN` 값이 비교할 수 없기 때문에 `Ord`를 구현하지 않습니다. `f32`가 `Eq`를 구현하지 않는 것과 같은 이유입니다.

## `Ord` 및 `PartialOrd` 구현하기

`Ord`와 `PartialOrd`는 모두 타입에 대해 derive할 수 있습니다:

```rust
// `Ord`가 필요로 하므로 `Eq`와 `PartialEq`도 추가해야 합니다.
#[derive(Eq, PartialEq, Ord, PartialOrd)]
struct TicketId(u64);
```

수동으로 구현하기로 선택하거나(또는 필요하다면) 주의하십시오:

- `Ord`와 `PartialOrd`는 `Eq`와 `PartialEq`와 일관되어야 합니다.
- `Ord`와 `PartialOrd`는 서로 일관되어야 합니다.