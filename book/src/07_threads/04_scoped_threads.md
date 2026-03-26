# 스코프 스레드(Scoped threads)

지금까지 우리가 겪었던 모든 라이프타임 문제의 원인은 결국 하나였습니다. 바로 생성된 스레드가 부모 스레드보다 **더 오래 살 가능성**이 있다는 점이죠.

이를 해결해 주는 마법 같은 기능이 바로 **스코프 스레드(Scoped threads)**입니다.

```rust
let v = vec![1, 2, 3];
let midpoint = v.len() / 2;

std::thread::scope(|scope| {
    scope.spawn(|| {
        let first = &v[..midpoint];
        println!("벡터 v의 전반부: {first:?}");
    });
    scope.spawn(|| {
        let second = &v[midpoint..];
        println!("벡터 v의 후반부: {second:?}");
    });
});

println!("원본 벡터 v: {v:?}");
```

코드가 어떻게 동작하는지 자세히 들여다볼까요?

## `scope` 함수

`std::thread::scope` 함수는 새로운 **스코프(Scope)**를 생성합니다. 이 함수는 인자로 클로저를 받으며, 그 클로저 내부에서 `Scope` 인스턴스를 활용할 수 있게 해줍니다.

## 자동 조인(Auto-join)

`Scope` 인스턴스는 `spawn` 메서드를 제공합니다. 일반적인 `std::thread::spawn`과 결정적으로 다른 점은, **스코프 안에서 생성된 모든 스레드는 스코프가 끝나는 시점에 자동으로 조인(Join)된다**는 것입니다.

위 예제 코드를 `std::thread::spawn`을 사용하는 방식으로 "번역"해 보면 다음과 같은 형태가 됩니다.

```rust
let v = vec![1, 2, 3];
let midpoint = v.len() / 2;

let handle1 = std::thread::spawn(|| {
    let first = &v[..midpoint];
    println!("벡터 v의 전반부: {first:?}");
});
let handle2 = std::thread::spawn(|| {
    let second = &v[midpoint..];
    println!("벡터 v의 후반부: {second:?}");
});

// 명시적으로 조인합니다.
handle1.join().unwrap();
handle2.join().unwrap();

println!("원본 벡터 v: {v:?}");
```

## 환경에서 빌려오기(Borrowing from the environment)

하지만 위와 같이 번역한 코드는 컴파일되지 않습니다! 컴파일러는 `&v`의 라이프타임이 `'static`이 아니므로 다른 스레드에서 안전하게 사용할 수 없다고 경고할 것입니다.

반면, `std::thread::scope`는 다릅니다. 이 안에서는 **주변 환경의 데이터를 안전하게 빌려올 수 있습니다**.

우리 예제에서 `v`는 `scope`가 만들어지기 전에 생성되었습니다. 그리고 `v`가 메모리에서 사라지는(Drop) 시점은 `scope`가 실행을 마치고 반환된 **이후**입니다. 동시에 `scope` 내에서 생성된 모든 스레드는 `scope`가 끝나기 전에 반드시 완료됨이 보장됩니다. 따라서 **댕글링 참조(Dangling reference)**가 발생할 위험이 원천적으로 차단되는 것이죠.

컴파일러는 이러한 안전성을 이해하고 기꺼이 통과시켜 줍니다!
