# 실패 가능성

이전 연습 문제의 `Ticket::new` 함수를 다시 살펴봅시다:

```rust
impl Ticket {
    pub fn new(
        title: String, 
        description: String, 
        status: Status
    ) -> Ticket {
        if title.is_empty() {
            panic!("Title cannot be empty");
        }
        if title.len() > 50 {
            panic!("Title cannot be longer than 50 bytes");
        }
        if description.is_empty() {
            panic!("Description cannot be empty");
        }
        if description.len() > 500 {
            panic!("Description cannot be longer than 500 bytes");
        }

        Ticket {
            title,
            description,
            status,
        }
    }
}
```

검사 중 하나라도 실패하면 함수는 패닉을 일으킵니다.
이것은 호출자에게 **오류를 처리**할 기회를 주지 않기 때문에 이상적이지 않습니다.

Rust의 주요 오류 처리 메커니즘인 `Result` 타입을 소개할 시간입니다.

## `Result` 타입

`Result` 타입은 표준 라이브러리에 정의된 열거형입니다:

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

두 가지 베리언트가 있습니다:

- `Ok(T)`: 성공적인 작업을 나타냅니다. 작업의 출력인 `T`를 가집니다.
- `Err(E)`: 실패한 작업을 나타냅니다. 발생한 오류인 `E`를 가집니다.

`Ok`와 `Err`는 모두 제네릭이므로 성공 및 오류 케이스에 대해 자신만의 타입을 지정할 수 있습니다.

## 예외 없음

Rust의 복구 가능한 오류는 **값으로 표현**됩니다.
다른 값과 마찬가지로 전달되고 조작되는 타입의 인스턴스일 뿐입니다.
이것은 Python이나 C#과 같은 다른 언어와 큰 차이점입니다. 이러한 언어에서는 오류를 알리기 위해 **예외**를 사용합니다.

예외는 추론하기 어려운 별도의 제어 흐름 경로를 만듭니다.
함수의 시그니처만 보고는 예외를 던질 수 있는지 여부를 알 수 없습니다.
함수의 시그니처만 보고는 **어떤** 예외 타입을 던질 수 있는지 알 수 없습니다.
알아내려면 함수의 문서를 읽거나 구현을 봐야 합니다.

예외 처리 로직은 지역성이 매우 낮습니다: 예외를 던지는 코드는 예외를 잡는 코드와 멀리 떨어져 있으며, 둘 사이에는 직접적인 연결이 없습니다.

## 실패 가능성은 타입 시스템에 인코딩됩니다

Rust는 `Result`를 사용하여 **함수의 시그니처에 실패 가능성을 인코딩**하도록 강제합니다.
함수가 실패할 수 있고(그리고 호출자가 오류를 처리할 기회를 갖기를 원한다면), `Result`를 반환해야 합니다.

```rust
// 시그니처만 보고도 이 함수가 실패할 수 있다는 것을 알 수 있습니다. 
// 또한 `ParseIntError`를 검사하여 어떤 
// 종류의 실패를 예상해야 하는지 알 수 있습니다.
fn parse_int(s: &str) -> Result<i32, ParseIntError> {
    // ...
}
```

이것이 `Result`의 큰 장점입니다: 실패 가능성을 명시적으로 만듭니다.

하지만 패닉이 존재한다는 것을 명심하십시오. 다른 언어의 예외처럼 타입 시스템에 의해 추적되지 않습니다. 하지만 **복구 불가능한 오류**를 위한 것이며 드물게 사용해야 합니다.
