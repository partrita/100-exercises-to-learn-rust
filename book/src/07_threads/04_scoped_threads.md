# 스코프 스레드

지금까지 논의한 모든 라이프타임 문제는 공통된 원인을 가집니다:
생성된 스레드가 부모 스레드보다 오래 살 수 있다는 것입니다.
**스코프 스레드**를 사용하여 이 문제를 피할 수 있습니다.

```rust
let v = vec![1, 2, 3];
let midpoint = v.len() / 2;

std::thread::scope(|scope| {
    scope.spawn(|| {
        let first = &v[..midpoint];
        println!("Here's the first half of v: {first:?}");
    });
    scope.spawn(|| {
        let second = &v[midpoint..];
        println!("Here's the second half of v: {second:?}");
    });
});

println!("Here's v: {v:?}");
```

무슨 일이 일어나고 있는지 풀어봅시다.

## `scope`

`std::thread::scope` 함수는 새로운 **스코프**를 생성합니다.
`std::thread::scope`는 단일 인수인 `Scope` 인스턴스를 가진 클로저를 입력으로 받습니다.

## 스코프 생성

`Scope`는 `spawn` 메소드를 노출합니다.
`std::thread::spawn`과 달리, `Scope`를 사용하여 생성된 모든 스레드는
스코프가 끝날 때 **자동으로 조인**됩니다.

이전 예제를 `std::thread::spawn`으로 "번역"한다면,
다음과 같을 것입니다:

```rust
let v = vec![1, 2, 3];
let midpoint = v.len() / 2;

let handle1 = std::thread::spawn(|| {
    let first = &v[..midpoint];
    println!("Here's the first half of v: {first:?}");
});
let handle2 = std::thread::spawn(|| {
    let second = &v[midpoint..];
    println!("Here's the second half of v: {second:?}");
});

handle1.join().unwrap();
handle2.join().unwrap();

println!("Here's v: {v:?}");
```

## 환경에서 빌림

하지만 번역된 예제는 컴파일되지 않을 것입니다: 컴파일러는
`&v`의 라이프타임이 `'static`이 아니므로 생성된 스레드에서 사용할 수 없다고 불평할 것입니다.

`std::thread::scope`의 문제는 아닙니다. **환경에서 안전하게 빌릴 수 있습니다**.

우리 예제에서 `v`는 생성 지점 이전에 생성됩니다.
`scope`가 반환된 _후에야_ 삭제됩니다. 동시에,
`scope` 내에서 생성된 모든 스레드는 `scope`가 반환되기 _전에_ 완료되는 것이 보장되므로,
댕글링 참조가 발생할 위험이 없습니다.

컴파일러는 불평하지 않을 것입니다!