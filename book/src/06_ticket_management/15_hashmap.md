# `HashMap`

`Index`/`IndexMut` 구현은 이상적이지 않습니다: ID로 티켓을 검색하기 위해 전체 `Vec`을 반복해야 합니다. 알고리즘 복잡도는 `O(n)`이며, 여기서 `n`은 저장소의 티켓 수입니다.

티켓을 저장하기 위해 다른 데이터 구조인 `HashMap<K, V>`를 사용하여 더 잘할 수 있습니다.

```rust
use std::collections::HashMap;

// 타입 추론을 통해 명시적인 타입 시그니처를 생략할 수 있습니다 (이 예에서는
// `HashMap<String, String>`이 될 것입니다).
let mut book_reviews = HashMap::new();

book_reviews.insert(
    "Adventures of Huckleberry Finn".to_string(),
    "My favorite book.".to_string(),
);
```

`HashMap`은 키-값 쌍으로 작동합니다. `K`는 키 타입의 제네릭 매개변수이고, `V`는 값 타입의 제네릭 매개변수입니다.

삽입, 검색 및 제거의 예상 비용은 **상수**, `O(1)`입니다.
우리의 사용 사례에 완벽하게 들리지 않나요?

## 키 요구 사항

`HashMap`의 구조체 정의에는 트레이트 바운드가 없지만, 메소드에는 일부가 있습니다. 예를 들어 `insert`를 살펴봅시다:

```rust
// 약간 단순화됨
impl<K, V> HashMap<K, V>
where
    K: Eq + Hash,
{
    pub fn insert(&mut self, k: K, v: V) -> Option<V> {
        // [...]
    }
}
```

키 타입은 `Eq` 및 `Hash` 트레이트를 구현해야 합니다.
이 두 가지에 대해 자세히 알아봅시다.

## `Hash`

해싱 함수(또는 해셔)는 잠재적으로 무한한 값 집합(예: 모든 가능한 문자열)을 제한된 범위(예: `u64` 값)에 매핑합니다.
속도, 충돌 위험, 가역성 등 각각 다른 속성을 가진 많은 해싱 함수가 있습니다.

`HashMap`은 이름에서 알 수 있듯이 내부적으로 해싱 함수를 사용합니다.
키를 해시한 다음 해당 해시를 사용하여 관련 값을 저장/검색합니다.
이 전략은 키 타입이 해시 가능해야 하므로 `K`에 `Hash` 트레이트 바운드가 필요합니다.

`Hash` 트레이트는 `std::hash` 모듈에서 찾을 수 있습니다:

```rust
pub trait Hash {
    // 필수 메소드
    fn hash<H>(&self, state: &mut H)
       where H: Hasher;
}
```

`Hash`를 수동으로 구현하는 경우는 거의 없습니다. 대부분의 경우 derive할 것입니다:

```rust
#[derive(Hash)]
struct Person {
    id: u32,
    name: String,
}
```

## `Eq`

`HashMap`은 키를 동등성으로 비교할 수 있어야 합니다. 이것은 해시 충돌을 처리할 때 특히 중요합니다. 즉, 두 개의 다른 키가 동일한 값으로 해시될 때입니다.

궁금할 수 있습니다: `PartialEq` 트레이트가 이를 위한 것이 아닌가요? 거의 그렇습니다!
`PartialEq`는 `HashMap`에 충분하지 않습니다. 왜냐하면 `a == a`가 항상 `true`라는 반사성을 보장하지 않기 때문입니다.
예를 들어, 부동 소수점 숫자(`f32` 및 `f64`)는 `PartialEq`를 구현하지만, 반사성 속성을 만족하지 않습니다: `f32::NAN == f32::NAN`은 `false`입니다.
반사성은 `HashMap`이 올바르게 작동하는 데 중요합니다: 없으면 값을 삽입하는 데 사용한 것과 동일한 키를 사용하여 맵에서 값을 검색할 수 없습니다.

`Eq` 트레이트는 `PartialEq`를 반사성 속성으로 확장합니다:

```rust
pub trait Eq: PartialEq {
    // 추가 메소드 없음
}
```

이것은 마커 트레이트입니다: 새로운 메소드를 추가하지 않고, `PartialEq`에 구현된 동등성 로직이 반사적이라는 것을 컴파일러에게 알려주는 방법일 뿐입니다.

`PartialEq`를 derive할 때 `Eq`를 자동으로 derive할 수 있습니다:

```rust
#[derive(PartialEq, Eq)]
struct Person {
    id: u32,
    name: String,
}
```

## `Eq`와 `Hash`는 연결되어 있습니다

`Eq`와 `Hash` 사이에는 암시적인 계약이 있습니다: 두 키가 같으면 해시도 같아야 합니다.
이것은 `HashMap`이 올바르게 작동하는 데 중요합니다. 이 계약을 위반하면 `HashMap`을 사용할 때 비합리적인 결과가 나옵니다.