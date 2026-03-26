# 반복(Iteration)

가장 첫 번째 연습 문제에서 우리는 `for` 루프를 사용하여 컬렉션을 반복하는 방법을 배웠습니다. 그때는 `0..5`와 같은 범위를 다뤘지만, 배열이나 벡터와 같은 컬렉션도 똑같은 방식으로 다룰 수 있습니다.

```rust
// `Vec`에서도 잘 작동합니다 let v = vec![1, 2, 3];
for n in v {
    println!("{}", n);
}

// 배열에서도 마찬가지입니다 let a: [u32; 3] = [1, 2, 3];
for n in a {
    println!("{}", n);
}
```

이제 이 코드가 내부적으로 어떻게 돌아가는지 살펴볼까요?

## `for` 루프의 구문 설탕 제거(Desugaring)

Rust에서 `for` 루프를 작성하면 컴파일러는 이를 내부적으로 다음과 같은 코드로 변환(Desugaring)합니다:

```rust
let mut iter = IntoIterator::into_iter(v);
loop {
    match iter.next() {
        Some(n) => {
            println!("{}", n);
        }
        None => break,
    }
}
```

`loop`는 `for`나 `while`과 달리, 명시적으로 `break`를 호출하지 않는 한 영원히 반복되는 구문입니다.

## `Iterator` 트레이트

위 코드에서 사용한 `next` 메서드는 바로 `Iterator` 트레이트에서 정의된 것입니다. Rust 표준 라이브러리에 들어 있는 이 트레이트는 일련의 값을 차례대로 생성할 수 있는 모든 타입의 공통 인터페이스 역할을 합니다.

```rust
trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}
```

- **`Item`**: 반복자가 생성하는 값의 타입을 나타내는 **연관 타입(Associated type)**입니다.
- **`next`**: 시퀀스의 다음 값을 반환합니다. 더 줄 값이 있으면 `Some(value)`를, 끝에 도달하면 `None`을 반환합니다.

참고로, `next`가 `None`을 반환했다고 해서 반드시 모든 반복이 끝났다고 보장할 수 없는 경우도 있습니다. 다만 [`FusedIterator`](https://doc.rust-lang.org/std/iter/trait.FusedIterator.html)라는 특별한 트레이트를 구현한 경우에는 `None` 이후에도 계속 `None`이 나옴을 보장합니다.

## `IntoIterator` 트레이트

모든 타입이 그 자체로 `Iterator`인 것은 아니지만, 많은 타입이 `Iterator`로 변환될 수 있습니다. 이때 사용되는 것이 `IntoIterator` 트레이트입니다.

```rust
trait IntoIterator {
    type Item;
    type IntoIter: Iterator<Item = Self::Item>;
    fn into_iter(self) -> Self::IntoIter;
}
```

`into_iter` 메서드는 원본 값을 소비하여 해당 요소들을 훑을 수 있는 반복자를 반환합니다. 각 타입은 `IntoIterator`를 오직 한 가지 방식으로만 구현할 수 있으므로, `for` 루프가 어떻게 동작해야 하는지 헷갈릴 일이 없습니다.

흥미로운 점은, `Iterator`를 구현하는 모든 타입은 자동으로 `IntoIterator`도 구현된다는 것입니다. 그냥 `into_iter`를 호출했을 때 자기 자신을 반환할 뿐이죠!

## 성능과 경계 검사

반복자를 사용하면 아주 좋은 장점이 하나 더 있습니다. 바로 **설계상 범위를 벗어날 수 없다**는 점입니다. 덕분에 Rust 컴파일러는 런타임에 수행하는 경계 검사(Bounds checking)를 과감히 생략하여 코드를 더 빠르게 만듭니다.

즉, 아래 코드는:

```rust
let v = vec![1, 2, 3];
for n in v {
    println!("{}", n);
}
```

보통 다음과 같은 인덱스 기반 코드보다 더 빠릅니다:

```rust
let v = vec![1, 2, 3];
for i in 0..v.len() {
    println!("{}", v[i]);
}
```

물론 컴파일러가 아주 똑똑해서 수동 인덱싱 코드가 안전함을 증명하고 경계 검사를 직접 제거해 줄 때도 있지만, 되도록 인덱싱보다는 반복자를 사용하는 것이 Rust다운 방식입니다.