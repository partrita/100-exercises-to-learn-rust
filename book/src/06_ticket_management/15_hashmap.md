# 해시맵(`HashMap`)

지금까지 `Index` 및 `IndexMut`을 구현해 보았지만, 성능 관점에서 보면 아직 한계가 있습니다. 특정 ID로 티켓을 찾기 위해 매번 `Vec` 전체를 훑어야 하기 때문이죠. 이 경우의 시간 복잡도는 저장소에 있는 티켓의 수 `n`에 비례하는 **`O(n)`**입니다.

이보다 더 효율적인 방법은 없을까요? 바로 `HashMap<K, V>`라는 새로운 데이터 구조를 사용하면 이 문제를 멋지게 해결할 수 있습니다.

```rust
use std::collections::HashMap;

// 타입 추론 덕분에 아래 예제처럼 명시적인 타입 표기를 생략할 수 있습니다.
// 여기서는 `HashMap<String, String>` 타입이 됩니다.
let mut book_reviews = HashMap::new();

book_reviews.insert(
    "Adventures of Huckleberry Finn".to_string(),
    "My favorite book.".to_string(),
);
```

해시맵은 **키(Key)**와 **값(Value)** 쌍으로 데이터를 저장합니다. 제네릭 매개변수 `K`는 키의 타입을, `V`는 값의 타입을 나타내죠.

해시맵을 쓰면 데이터를 추가하거나 찾고 삭제하는 데 걸리는 예상 시간(expected cost)이 상수에 가까운 **`O(1)`**에 불과합니다. 우리의 티켓 관리 시스템에 딱 맞는 선택이 아닐까요?

## 키(Key)의 요구 조건

`HashMap` 구조체 자체의 정의에는 트레이트 바운드(Trait bound)가 명시되어 있지 않지만, `insert` 같은 실제 메소드를 보면 제약 사항이 있습니다.

```rust
// 약간 단순화된 시그니처입니다.
impl<K, V> HashMap<K, V>
where
    K: Eq + Hash,
{
    pub fn insert(&mut self, k: K, v: V) -> Option<V> {
        // [...]
    }
}
```

위에서 볼 수 있듯이, 키로 사용할 타입은 반드시 `Eq`와 `Hash` 트레이트를 구현하고 있어야 합니다. 이 두 가지가 무엇인지 자세히 알아보도록 하죠.

## `Hash` 트레이트

해싱(Hashing) 함수(또는 해셔, Hasher)는 이론적으로 무한한 값의 집합(예: 모든 가능한 문자열)을 유한한 범위(예: `u64` 값)로 매핑해 줍니다. 시중에는 속도나 충돌 위험, 가역성(reversibility) 등 각기 다른 특성을 가진 다양한 해싱 함수가 존재합니다.

`HashMap`은 이름 그대로 내부에서 해싱 함수를 사용합니다. 키 값을 해싱한 다음, 그 해시 값을 인덱스로 활용해 해당 데이터를 저장하거나 찾아냅니다. 키 타입이 반드시 해싱 가능해야 하므로 `K`에 `Hash` 트레이트 바운드가 필요한 것이죠.

`Hash` 트레이트는 `std::hash` 모듈에서 찾아볼 수 있습니다.

```rust
pub trait Hash {
    // 필수 메소드
    fn hash<H>(&self, state: &mut H)
       where H: Hasher;
}
```

보통 `Hash` 트레이트를 직접 구현할 일은 거의 없습니다. 대부분 아래처럼 `derive` 매크로를 통해 자동으로 생성하게 됩니다.

```rust
#[derive(Hash)]
struct Person {
    id: u32,
    name: String,
}
```

## `Eq` 트레이트

해시맵은 키들을 서로 비교할 수 있어야 합니다. 특히 **해시 충돌(hash collision)**, 즉 서로 다른 두 키가 동일한 해시 값을 가질 때 이를 구분하기 위해 꼭 필요합니다.

"그건 `PartialEq` 트레이트로 해결되는 거 아닌가요?"라고 질문하실 수도 있습니다. 거의 그렇긴 합니다! 하지만 해시맵 입장에서는 `a == a`가 항상 참이라는 **반사성(reflexivity)**이 보장되어야 하기에 `PartialEq`만으로는 부족합니다. 예를 들어, 부동 소수점 타입인 `f32`나 `f64`는 `PartialEq`를 구현하고 있지만, `f32::NAN == f32::NAN`이 **`false`**이므로 반사성을 만족하지 못합니다. 이런 타입을 해시맵의 키로 쓰면 나중에 똑같은 키를 가져와도 값을 찾지 못하는 대참사가 일어날 수 있습니다.

`Eq` 트레이트는 바로 이 반사성까지 보장하도록 `PartialEq`를 확장한 것입니다.

```rust
pub trait Eq: PartialEq {
    // 추가되는 메소드는 없습니다.
}
```

이는 단순히 컴파일러에게 "이 타입의 동등성 로직은 반사적이다"라고 알려주는 **마커 트레이트(Marker trait)**일 뿐입니다. `PartialEq`를 `derive`할 때 `Eq`도 함께 추가하면 간편합니다.

```rust
#[derive(PartialEq, Eq)]
struct Person {
    id: u32,
    name: String,
}
```

## `Eq`와 `Hash`의 불가분 관계

`Eq`와 `Hash` 트레이트 사이에는 아주 중요한 약속이 하나 있습니다. 바로 **"두 키가 같다면(`Eq`), 그 해시 값(`Hash`)도 반드시 같아야 한다"**는 것입니다. 이 약속을 어기면 해시맵이 제대로 동작하지 않아 도무지 이해할 수 없는 결과를 마주하게 될 것입니다. 꼭 기억해 두세요!
