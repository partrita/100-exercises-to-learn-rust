# `'static` 라이프타임('static lifetime)

이전 연습 문제에서 벡터의 슬라이스를 빌려 스레드로 넘기려 했을 때, 아마 다음과 같은 컴파일 오류를 마주쳤을 겁니다.

```text
error[E0597]: `v` does not live long enough
   |
11 | pub fn sum(v: Vec<i32>) -> i32 {
   |            - binding `v` declared here
...
15 |     let right = &v[split_point..];
   |                  ^ borrowed value does not live long enough
16 |     let left_handle = spawn(move || left.iter().sum::<i32>());
   |                             -------------------------------- 
                     argument requires that `v` is borrowed for `'static`
19 | }
   |  - `v` dropped here while still borrowed
```

여기서 `argument requires that v is borrowed for 'static`이라는 문구는 정확히 무엇을 의미할까요?

**`'static` 라이프타임**은 Rust의 아주 특별한 라이프타임입니다. 어떤 값이 프로그램이 실행되는 **전체 기간** 동안 유효함을 보장한다는 뜻입니다.

## 분리된 스레드(Detached threads)

`thread::spawn`으로 생성된 스레드는 부모 스레드보다 **더 오래 살아남을 수 있습니다**. 이런 스레드를 부모로부터 독립했다는 의미에서 **분리된 스레드(Detached threads)**라고 부르기도 합니다.

예를 들어볼까요?

```rust
use std::thread;

fn f() {
    thread::spawn(|| {
        thread::spawn(|| {
            loop {
                thread::sleep(std::time::Duration::from_secs(1));
                println!("Hello from the detached thread!");
            }
        });
    });
}
```

이 예제에서 첫 번째로 생성된 스레드는 자식 스레드를 하나 더 만들고 곧바로 종료됩니다. 하지만 그 자식 스레드는 부모(첫 번째 스레드)가 죽어도 상관없이 프로세스가 끝날 때까지 **계속해서 메시지를 출력**합니다. Rust에서는 이를 자식 스레드가 부모 스레드보다 **오래 살았다(Outlived)**고 표현합니다.

## 왜 `'static`이 필요한가요?

스레드는 언제든 부모보다 오래 살 수 있기 때문에, 프로그램 도중에 메모리에서 사라질 가능성이 있는 데이터를 빌려 써서는 안 됩니다. 만약 이미 해제된 메모리를 참조하게 된다면 **해제 후 사용(Use-after-free)** 버그가 발생할 수 있기 때문이죠.

이것이 바로 `std::thread::spawn`이 인자로 받는 클로저에 `'static` 라이프타임을 요구하는 이유입니다.

```rust
pub fn spawn<F, T>(f: F) -> JoinHandle<T> 
where
    F: FnOnce() -> T + Send + 'static,
    T: Send + 'static
{
    // [..]
}
```

## `'static`은 참조에만 해당되는 것이 아닙니다

흔히 오해하기 쉽지만, Rust에서 라이프타임은 참조뿐만 아니라 모든 값이 가집니다.

특히 `Vec`이나 `String`처럼 데이터를 직접 **소유하는 타입(Owned types)**은 기본적으로 `'static` 제약 조건을 만족합니다. 데이터를 소유하고 있다면, 그 데이터를 만든 함수가 끝난 뒤에도 여러분이 원하는 만큼 데이터를 유지하고 사용할 수 있기 때문입니다.

따라서 `'static` 요구사항을 충족하려면 다음 두 가지 중 하나를 선택해야 합니다:

1. 데이터를 직접 **소유한 값(Owned value)**을 넘긴다.
2. 프로그램 종료 시까지 유효한 **`'static` 참조**를 넘긴다.

우리가 이전 연습 문제에서 문제를 해결한 방식이 바로 1번입니다. 슬라이스를 빌리는 대신 새로운 벡터를 할당해 데이터를 소유하게 만든 뒤, 이를 `move` 키워드로 스레드에 넘겨준 것이죠.

## `'static` 참조

이제 2번 경우인 프로그램 전체 기간 동안 유효한 참조에 대해 알아봅시다.

### 정적 데이터(Static data)

가장 대표적인 예는 문자열 리터럴과 같은 **정적 데이터(Static data)**에 대한 참조입니다.

```rust
let s: &'static str = "Hello world!";
```

문자열 리터럴은 컴파일 시점에 이미 값이 정해져 있으며, 실행 파일 내부의 **읽기 전용 데이터 세그먼트(Read-only data segment)**라는 영역에 저장됩니다. 프로그램이 실행되는 동안 이 영역은 항상 존재하므로, 이를 가리키는 모든 참조는 안전하게 `'static` 규칙을 따르게 됩니다.

## 더 읽어보기 (영문)

- [데이터 세그먼트(Data segment)](https://en.wikipedia.org/wiki/Data_segment)
