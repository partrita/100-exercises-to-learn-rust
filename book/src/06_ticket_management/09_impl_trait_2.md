# 인자(Argument) 위치에서의 `impl Trait`

이전 섹션에서 `impl Trait`를 사용해 타입 이름을 명시하지 않고도 특정 트레이트를 구현하는 타입을 반환하는 방법을 살펴보았습니다. 동일한 구문을 **인자(argument) 위치**에서도 사용할 수 있습니다.

```rust
fn print_iter(iter: impl Iterator<Item = i32>) {
    for i in iter {
        println!("{}", i);
    }
}
```

위의 `print_iter` 함수는 `i32` 타입 요소를 생성하는 반복자(iterator)를 인자로 받아 각 요소를 출력합니다.
**인자 위치**에서 사용되는 `impl Trait`는 트레이트 바운드(trait bound)가 지정된 제네릭(generic) 매개변수와 동일하게 작동합니다.

```rust
fn print_iter<T>(iter: T) 
where
    T: Iterator<Item = i32>
{
    for i in iter {
        println!("{}", i);
    }
}
```

## 단점

경험상, 인자 위치에서는 `impl Trait`보다 제네릭을 사용하는 것이 더 좋습니다. 제네릭을 사용하면 호출하는 쪽에서 터보피시(turbofish) 구문(`::<>`)을 통해 인자의 타입을 명시적으로 지정할 수 있어, 타입 모호성을 해결하는 데 유리하기 때문입니다. 반면 `impl Trait`는 이러한 명시적 타입 지정이 불가능합니다.