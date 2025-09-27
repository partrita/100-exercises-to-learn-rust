# 스레드

다중 스레드 코드를 작성하기 전에, 스레드가 무엇이며 왜 스레드를 사용하고 싶은지 잠시 이야기해 봅시다.

## 스레드란 무엇인가요?

**스레드**는 기본 운영 체제에서 관리하는 실행 컨텍스트입니다.
각 스레드는 자체 스택과 명령어 포인터를 가집니다.

단일 **프로세스**는 여러 스레드를 관리할 수 있습니다.
이러한 스레드는 동일한 메모리 공간을 공유하며, 이는 동일한 데이터에 접근할 수 있음을 의미합니다.

스레드는 **논리적인** 구성 요소입니다. 결국, CPU 코어(즉, **물리적인** 실행 단위)에서 한 번에 하나의 명령어 집합만 실행할 수 있습니다.
CPU 코어보다 훨씬 더 많은 스레드가 있을 수 있으므로, 운영 체제의 **스케줄러**는 처리량과 응답성을 최대화하기 위해 CPU 시간을 분할하여 주어진 시간에 어떤 스레드를 실행할지 결정하는 역할을 합니다.

## `main`

Rust 프로그램이 시작되면 단일 스레드인 **메인 스레드**에서 실행됩니다.
이 스레드는 운영 체제에 의해 생성되며 `main` 함수를 실행하는 역할을 합니다.

```rust
use std::thread;
use std::time::Duration;

fn main() {
    loop {
        thread::sleep(Duration::from_secs(2));
        println!("Hello from the main thread!");
    }
}
```

## `std::thread`

Rust의 표준 라이브러리는 스레드를 생성하고 관리할 수 있는 `std::thread` 모듈을 제공합니다.

### `spawn`

`std::thread::spawn`을 사용하여 새 스레드를 생성하고 해당 스레드에서 코드를 실행할 수 있습니다.

예를 들어:

```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        loop {
            thread::sleep(Duration::from_secs(1));
            println!("Hello from a thread!");
        }
    });
    
    loop {
        thread::sleep(Duration::from_secs(2));
        println!("Hello from the main thread!");
    }
}
```

[Rust 플레이그라운드](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=afedf7062298ca8f5a248bc551062eaa)에서 이 프로그램을 실행하면
메인 스레드와 생성된 스레드가 동시에 실행되는 것을 볼 수 있습니다.
각 스레드는 서로 독립적으로 진행됩니다.

### 프로세스 종료

메인 스레드가 완료되면 전체 프로세스가 종료됩니다.
생성된 스레드는 완료되거나 메인 스레드가 완료될 때까지 계속 실행됩니다.

```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        loop {
            thread::sleep(Duration::from_secs(1));
            println!("Hello from a thread!");
        }
    });

    thread::sleep(Duration::from_secs(5));
}
```

위 예제에서는 "Hello from a thread!" 메시지가 대략 5번 인쇄되는 것을 볼 수 있습니다.
그런 다음 메인 스레드가 완료되고(`sleep` 호출이 반환될 때), 전체 프로세스가 종료되므로 생성된 스레드는 종료됩니다.

### `join`

`spawn`이 반환하는 `JoinHandle`에서 `join` 메소드를 호출하여 생성된 스레드가 완료될 때까지 기다릴 수도 있습니다.

```rust
use std::thread;
fn main() {
    let handle = thread::spawn(|| {
        println!("Hello from a thread!");
    });

    handle.join().unwrap();
}
```

이 예제에서 메인 스레드는 종료되기 전에 생성된 스레드가 완료될 때까지 기다릴 것입니다.
이것은 두 스레드 간의 **동기화** 형태를 도입합니다: 메인 스레드가 생성된 스레드가 완료될 때까지 종료되지 않으므로, 프로그램이 종료되기 전에 "Hello from a thread!" 메시지가 인쇄되는 것을 보장합니다.