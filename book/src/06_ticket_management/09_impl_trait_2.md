# 인자 위치의 `impl Trait`

이전 섹션에서 `impl Trait`가 타입의 이름을 지정하지 않고 타입을 반환하는 데 어떻게 사용될 수 있는지 보았습니다.
동일한 구문은 **인자 위치**에서도 사용될 수 있습니다:

```rust
fn print_iter(iter: impl Iterator<Item = i32>) {
    for i in iter {
        println!("{}", i);
    }
}
```

`print_iter`는 `i32` 반복자를 받아 각 요소를 출력합니다.
**인자 위치**에서 사용될 때, `impl Trait`는 트레이트 바운드가 있는 제네릭 매개변수와 동일합니다:

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

경험상, 인자 위치에서는 `impl Trait`보다 제네릭을 선호하십시오.
제네릭은 호출자가 터보피시 구문(`::<>`)을 사용하여 인수의 타입을 명시적으로 지정할 수 있게 해주며, 이는 모호성을 해소하는 데 유용할 수 있습니다. `impl Trait`의 경우는 그렇지 않습니다.