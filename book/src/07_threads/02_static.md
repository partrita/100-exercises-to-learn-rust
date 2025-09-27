# `'static`

이전 연습 문제에서 벡터에서 슬라이스를 빌리려고 했다면,
아마 다음과 같은 컴파일 오류가 발생했을 것입니다:

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

`argument requires that v is borrowed for 'static`, 이것은 무엇을 의미할까요?

`'static` 라이프타임은 Rust의 특별한 라이프타임입니다.
이는 값이 프로그램의 전체 기간 동안 유효하다는 것을 의미합니다.

## 분리된 스레드

`thread::spawn`을 통해 시작된 스레드는 스레드를 생성한 스레드보다 **오래 살 수 있습니다**.
예를 들어:

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

이 예제에서 첫 번째로 생성된 스레드는
매초 메시지를 출력하는 자식 스레드를 생성할 것입니다.
첫 번째 스레드는 완료되고 종료됩니다. 이때,
그 자식 스레드는 전체 프로세스가 실행되는 동안 **계속 실행**될 것입니다.
Rust 용어로, 자식 스레드가 부모 스레드보다 **오래 살았다**고 말합니다.

## `'static` 라이프타임

생성된 스레드는 다음을 수행할 수 있으므로:

- 스레드를 생성한 스레드(부모 스레드)보다 오래 살 수 있습니다.
- 프로그램이 종료될 때까지 실행됩니다.

프로그램이 종료되기 전에 삭제될 수 있는 값을 빌려서는 안 됩니다.
이 제약 조건을 위반하면 해제 후 사용 버그에 노출될 수 있습니다.
이것이 `std::thread::spawn`의 시그니처가 전달되는 클로저가
`'static` 라이프타임을 가지도록 요구하는 이유입니다:

```rust
pub fn spawn<F, T>(f: F) -> JoinHandle<T> 
where
    F: FnOnce() -> T + Send + 'static,
    T: Send + 'static
{
    // [..]
}
```

## `'static`은 (단지) 참조에 관한 것이 아닙니다

Rust의 모든 값은 참조뿐만 아니라 라이프타임을 가집니다.

특히, 데이터를 소유하는 타입(예: `Vec` 또는 `String`)
`'static` 제약 조건을 만족합니다: 소유하고 있다면, 원래 생성한 함수가
반환된 후에도 원하는 만큼 계속 작업할 수 있습니다.

따라서 `'static`을 다음과 같이 해석할 수 있습니다:

- 소유된 값을 주세요.
- 프로그램의 전체 기간 동안 유효한 참조를 주세요.

첫 번째 접근 방식은 이전 연습 문제에서 문제를 해결한 방법입니다:
원본 벡터의 왼쪽 및 오른쪽 부분을 담을 새 벡터를 할당한 다음,
생성된 스레드로 이동했습니다.

## `'static` 참조

두 번째 경우, 즉 프로그램의 전체 기간 동안 유효한 참조에 대해 이야기해 봅시다.

### 정적 데이터

가장 일반적인 경우는 문자열 리터럴과 같은 **정적 데이터**에 대한 참조입니다:

```rust
let s: &'static str = "Hello world!";
```

문자열 리터럴은 컴파일 타임에 알려져 있으므로, Rust는 이를 실행 파일 _내부_에
**읽기 전용 데이터 세그먼트**라고 알려진 영역에 저장합니다.
따라서 해당 영역을 가리키는 모든 참조는 프로그램이 실행되는 동안 유효합니다.
이들은 `'static` 계약을 만족합니다.

## 추가 자료

- [데이터 세그먼트](https://en.wikipedia.org/wiki/Data_segment)