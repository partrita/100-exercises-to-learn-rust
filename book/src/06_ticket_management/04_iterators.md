# 반복

가장 첫 번째 연습 문제에서 Rust는 `for` 루프를 사용하여 컬렉션을 반복할 수 있다는 것을 배웠습니다.
그때는 범위(예: `0..5`)를 보고 있었지만, 배열 및 벡터와 같은 컬렉션에도 동일하게 적용됩니다.

```rust
// `Vec`에도 작동합니다
let v = vec![1, 2, 3];
for n in v {
    println!("{}", n);
}

// 배열에도 작동합니다
let a: [u32; 3] = [1, 2, 3];
for n in a {
    println!("{}", n);
}
```

이제 이것이 내부적으로 어떻게 작동하는지 이해할 시간입니다.

## `for` desugaring

Rust에서 `for` 루프를 작성할 때마다 컴파일러는 이를 다음 코드로 _desugar_합니다:

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

`loop`는 `for` 및 `while` 외에 또 다른 루핑 구문입니다.
`loop` 블록은 명시적으로 `break`하지 않는 한 영원히 실행됩니다.

## `Iterator` 트레이트

이전 코드 스니펫의 `next` 메소드는 `Iterator` 트레이트에서 가져온 것입니다.
`Iterator` 트레이트는 Rust의 표준 라이브러리에 정의되어 있으며, 값 시퀀스를 생성할 수 있는 타입에 대한 공유 인터페이스를 제공합니다:

```rust
trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}
```

`Item` 연관 타입은 반복자가 생성하는 값의 타입을 지정합니다.

`next`는 시퀀스의 다음 값을 반환합니다.
반환할 값이 있으면 `Some(value)`를 반환하고, 없으면 `None`을 반환합니다.

주의하십시오: 반복자가 `None`을 반환할 때 반복이 소진되었다는 보장은 없습니다. 이는 반복자가 (더 제한적인) [`FusedIterator`](https://doc.rust-lang.org/std/iter/trait.FusedIterator.html) 트레이트를 구현하는 경우에만 보장됩니다.

## `IntoIterator` 트레이트

모든 타입이 `Iterator`를 구현하는 것은 아니지만, 많은 타입이 `Iterator`를 구현하는 타입으로 변환될 수 있습니다.
이때 `IntoIterator` 트레이트가 등장합니다:

```rust
trait IntoIterator {
    type Item;
    type IntoIter: Iterator<Item = Self::Item>;
    fn into_iter(self) -> Self::IntoIter;
}
```

`into_iter` 메소드는 원본 값을 소비하고 해당 요소에 대한 반복자를 반환합니다.
타입은 `IntoIterator`의 구현을 하나만 가질 수 있습니다: `for`가 무엇으로 desugar되어야 하는지에 대한 모호함이 있을 수 없습니다.

한 가지 세부 사항: `Iterator`를 구현하는 모든 타입은 `IntoIterator`도 자동으로 구현합니다.
`into_iter`에서 자신을 반환할 뿐입니다!

## 경계 검사

반복자를 통해 반복하는 것은 좋은 부작용이 있습니다: 설계상 범위를 벗어날 수 없습니다.
이를 통해 Rust는 생성된 기계 코드에서 경계 검사를 제거하여 반복을 더 빠르게 만듭니다.

즉,

```rust
let v = vec![1, 2, 3];
for n in v {
    println!("{}", n);
}
```

은 일반적으로 다음보다 빠릅니다:

```rust
let v = vec![1, 2, 3];
for i in 0..v.len() {
    println!("{}", v[i]);
}
```

이 규칙에는 예외가 있습니다: 컴파일러는 수동 인덱싱을 사용하더라도 범위를 벗어나지 않는다는 것을 때때로 증명할 수 있으므로 경계 검사를 제거합니다. 하지만 일반적으로 가능한 경우 인덱싱보다 반복을 선호하십시오.