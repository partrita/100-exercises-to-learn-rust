# 정렬과 `BTreeMap`

`Vec` 대신 `HashMap`을 사용하면서 티켓 관리 시스템의 성능도 좋아지고 코드도 훨씬 간결해졌습니다. 하지만 세상에 공짜는 없죠. `Vec` 기반 저장소에서는 티켓이 추가된 순서대로 반환된다는 보장이 있었지만, `HashMap`은 그렇지 않습니다. 해시맵은 요소들을 반복(iterate)할 수는 있지만, 그 순서는 무작위로 결정됩니다.

만약 일관된 순서가 필요하다면 `HashMap` 대신 `BTreeMap`을 사용하는 것이 좋은 대안이 될 수 있습니다.

## `BTreeMap`

`BTreeMap`은 데이터가 키(Key)를 기준으로 항상 정렬된 상태를 유지하도록 보장합니다. 따라서 특정 순서대로 데이터를 훑어보거나, 범위 쿼리(예: "ID가 10번부터 20번 사이인 티켓을 모두 보여줘")를 수행할 때 매우 유용합니다.

`HashMap`과 마찬가지로 `BTreeMap` 구조체 정의 자체에는 특별한 제약이 없지만, 데이터를 넣는 `insert` 같은 메소드에는 조건이 붙습니다.

```rust
// `K`와 `V`는 각각 키와 값의 타입을 나타냅니다.
impl<K, V> BTreeMap<K, V> {
    pub fn insert(&mut self, key: K, value: V) -> Option<V>
    where
        K: Ord,
    {
        // 구현부
    }
}
```

재미있는 점은 `BTreeMap`에서는 `Hash` 트레이트가 필요하지 않다는 것입니다. 대신 키 타입이 반드시 **`Ord`** 트레이트를 구현하고 있어야 합니다.

## `Ord` 트레이트

`Ord` 트레이트는 값들 사이의 선후 관계를 비교하는 데 사용됩니다. `PartialEq`가 '동등성'을 따진다면, `Ord`는 '순서'를 따지는 것이죠.

이 트레이트는 `std::cmp` 모듈에 정의되어 있습니다.

```rust
pub trait Ord: Eq + PartialOrd {
    fn cmp(&self, other: &Self) -> Ordering;
}
```

`cmp` 메소드는 `Less`(작음), `Equal`(같음), `Greater`(큼) 중 하나의 값을 가지는 `Ordering` 열거형을 반환합니다. 또한 `Ord`를 구현하려면 반드시 `Eq`와 `PartialOrd` 트레이트도 함께 구현되어 있어야 합니다.

## `PartialOrd` 트레이트

`PartialOrd`는 `PartialEq`가 `Eq`보다 느슨한 조건인 것처럼, `Ord`보다 조금 더 완화된 형태의 순서 비교 트레이트입니다. 정의를 살펴보면 그 이유를 알 수 있습니다.

```rust
pub trait PartialOrd: PartialEq {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering>;
}
```

`PartialOrd::partial_cmp`는 `Option`을 반환합니다. 즉, 두 값을 비교할 수 없는 경우가 있을 수도 있다는 뜻입니다. 예를 들어 `f32` 타입은 `NaN`(Not a Number) 값이 포함될 수 있는데, `NaN`은 다른 값과 크기를 비교할 수 없기 때문에 `Ord`를 구현하지 못하고 `PartialOrd`만 구현합니다.

## `Ord` 및 `PartialOrd` 구현하기

`Ord`와 `PartialOrd` 역시 대부분의 경우 `derive`를 통해 간편하게 구현할 수 있습니다.

```rust
// `Ord`가 `Eq`를 요구하므로 `Eq`와 `PartialEq`도 함께 추가해야 합니다.
#[derive(Eq, PartialEq, Ord, PartialOrd)]
struct TicketId(u64);
```

만약 직접(수동으로) 구현해야 한다면 다음 사항에 주의해야 합니다.

- `Ord`와 `PartialOrd`는 반드시 `Eq` 및 `PartialEq`와 일관된 결과를 내야 합니다.
- `Ord`와 `PartialOrd` 사이에도 서로 모순이 없어야 합니다.