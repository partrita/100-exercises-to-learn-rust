# 스레드(Threads)

다중 스레드 코드를 직접 작성해 보기 전에, **스레드(Threads)**란 무엇인지 그리고 왜 사용하는지 먼저 가볍게 알아보겠습니다.

## 스레드란 무엇인가요?

스레드는 운영 체제(OS)에서 관리하는 가장 기본적인 실행 단위입니다. 각 스레드는 고유한 **스택(Stack)**과 **명령어 포인터(Instruction pointer)**를 가집니다.

하나의 **프로세스(Process)** 안에서는 여러 개의 스레드가 존재할 수 있습니다. 이 스레드들은 프로세스가 할당받은 동일한 메모리 공간을 공유하므로 서로 같은 데이터에 접근할 수 있다는 장점이 있습니다.

사실 스레드는 **논리적인** 개념입니다. 실제 물리적인 실행 단위인 **CPU 코어(CPU core)**는 한 번에 하나의 명령어 세트만 처리할 수 있죠. 하지만 시스템에는 CPU 코어 수보다 훨씬 많은 스레드가 돌아가는 경우가 많습니다. 이때 운영 체제의 **스케줄러(Scheduler)**가 CPU 시간을 아주 잘게 나누어 여러 스레드에 할당함으로써, 우리 눈에는 마치 여러 스레드가 동시에 실행되는 것처럼 보이게 만듭니다(이를 처리량과 응답성을 최대화하는 방식으로 관리합니다).

## `main` 함수와 메인 스레드

Rust 프로그램이 시작되면 가장 먼저 **메인 스레드(Main thread)**라는 단일 스레드 위에서 코드가 실행됩니다. 이 스레드는 운영 체제가 생성하며, 우리 프로그램의 시작점인 `main` 함수를 실행하는 중책을 맡습니다.

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

## `std::thread` 모듈

Rust의 표준 라이브러리는 스레드를 손쉽게 생성하고 관리할 수 있는 `std::thread` 모듈을 제공합니다.

### `spawn` 함수

새로운 스레드를 만들고 그 안에서 특정 코드를 실행하고 싶다면 `std::thread::spawn` 함수를 사용합니다.

아래 예시를 볼까요?

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

[Rust 플레이그라운드](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=afedf7062298ca8f5a248bc551062eaa)에서 이 코드를 실행해 보세요. 메인 스레드와 우리가 방금 만든 새 스레드가 각자 독립적으로 메시지를 출력하는 것을 볼 수 있습니다.

### 프로세스 종료(Process termination)

중요한 점이 하나 있습니다. **메인 스레드가 작업을 마치면 전체 프로세스가 즉시 종료된다**는 사실입니다. 만약 메인 스레드가 끝나버리면, 생성된 다른 스레드들이 아직 작업을 수행 중이더라도 강제로 함께 종료됩니다.

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

위의 예제에서는 약 5초 동안만 "Hello from a thread!" 메시지가 출력될 것입니다. 메인 스레드가 5초간의 `sleep`을 마치고 끝나면 프로그램 자체가 종료되기 때문이죠.

### `join` 메서드

생성한 스레드가 작업을 끝낼 때까지 메인 스레드가 기다려야 한다면 어떻게 할까요? `spawn` 함수가 반환하는 `JoinHandle`의 `join` 메서드를 사용하면 됩니다.

```rust
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        println!("Hello from a thread!");
    });

    // 스레드가 끝날 때까지 기다립니다.
    handle.join().unwrap();
}
```

이렇게 `join`을 호출하면 메인 스레드는 생성된 스레드가 완료될 때까지 대기 상태에 들어갑니다. 이는 두 스레드 간의 기본적인 **동기화(Synchronization)** 방식 중 하나로, 프로그램이 성급하게 종료되어 중요한 작업을 놓치는 것을 방지해 줍니다.
