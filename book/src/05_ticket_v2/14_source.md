# `Error::source`

`Error` 트레이트에 대한 설명을 완료하기 위해 이야기해야 할 것이 하나 더 있습니다: `source` 메소드입니다.

```rust
// 이번에는 전체 정의입니다!
pub trait Error: Debug + Display {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        None
    }
}
```

`source` 메소드는 **오류 원인**이 있는 경우 이에 접근하는 방법입니다.
오류는 종종 연쇄적으로 발생합니다. 즉, 한 오류가 다른 오류의 원인이 됩니다: 하위 수준 오류(예: 데이터베이스 호스트 이름을 확인할 수 없음)로 인해 발생하는 상위 수준 오류(예: 데이터베이스에 연결할 수 없음)가 있습니다.
`source` 메소드를 사용하면 전체 오류 체인을 "따라갈" 수 있으며, 이는 종종 로그에서 오류 컨텍스트를 캡처할 때 사용됩니다.

## `source` 구현하기

`Error` 트레이트는 항상 `None`(즉, 근본 원인 없음)을 반환하는 기본 구현을 제공합니다. 이것이 이전 연습 문제에서 `source`에 대해 신경 쓸 필요가 없었던 이유입니다.
이 기본 구현을 재정의하여 오류 타입에 대한 원인을 제공할 수 있습니다.

```rust
use std::error::Error;

#[derive(Debug)]
struct DatabaseError {
    source: std::io::Error
}

impl std::fmt::Display for DatabaseError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "Failed to connect to the database")
    }
}

impl std::error::Error for DatabaseError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        Some(&self.source)
    }
}
```

이 예에서 `DatabaseError`는 `std::io::Error`를 소스로 래핑합니다.
그런 다음 `source` 메소드를 재정의하여 호출될 때 이 소스를 반환합니다.

## `&(dyn Error + 'static)`

이 `&(dyn Error + 'static)` 타입은 무엇일까요?
분해해 봅시다:

- `dyn Error`는 **트레이트 객체**입니다. `Error` 트레이트를 구현하는 모든 타입을 참조하는 방법입니다.
- `'static`은 특별한 **라이프타임 지정자**입니다.
  `'static`은 참조가 "필요한 만큼 오래", 즉 전체 프로그램 실행 기간 동안 유효함을 의미합니다.

결합하면: `&(dyn Error + 'static)`은 `Error` 트레이트를 구현하고 전체 프로그램 실행 기간 동안 유효한 트레이트 객체에 대한 참조입니다.

지금은 이 두 개념에 대해 너무 걱정하지 마십시오. 향후 챕터에서 더 자세히 다룰 것입니다.

## `thiserror`를 사용하여 `source` 구현하기

`thiserror`는 오류 타입에 대해 `source`를 자동으로 구현하는 세 가지 방법을 제공합니다:

- `source`라는 이름의 필드는 자동으로 오류의 소스로 사용됩니다.
  ```rust
  use thiserror::Error;

  #[derive(Error, Debug)]
  pub enum MyError {
      #[error("Failed to connect to the database")]
      DatabaseError {
          source: std::io::Error
      }
  }
  ```
- `#[source]` 속성으로 주석이 달린 필드는 자동으로 오류의 소스로 사용됩니다.
  ```rust
  use thiserror::Error;

  #[derive(Error, Debug)]
  pub enum MyError {
      #[error("Failed to connect to the database")]
      DatabaseError {
          #[source]
          inner: std::io::Error
      }
  }
  ```
- `#[from]` 속성으로 주석이 달린 필드는 자동으로 오류의 소스로 사용되며 **그리고** `thiserror`는 주석이 달린 타입을 오류 타입으로 변환하는 `From` 구현을 자동으로 생성합니다.
  ```rust
  use thiserror::Error;

  #[derive(Error, Debug)]
  pub enum MyError {
      #[error("Failed to connect to the database")]
      DatabaseError {
          #[from]
          inner: std::io::Error
      }
  }
  ```

## `?` 연산자

`?` 연산자는 오류를 전파하는 약어입니다.
`Result`를 반환하는 함수에서 사용될 때, `Result`가 `Err`이면 오류와 함께 조기 반환됩니다.

예를 들어:

```rust
use std::fs::File;

fn read_file() -> Result<String, std::io::Error> {
    let mut file = File::open("file.txt")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}
```

는 다음과 같습니다:

```rust
use std::fs::File;

fn read_file() -> Result<String, std::io::Error> {
    let mut file = match File::open("file.txt") {
        Ok(file) => file,
        Err(e) => {
            return Err(e);
        }
    };
    let mut contents = String::new();
    match file.read_to_string(&mut contents) {
        Ok(_) => (),
        Err(e) => {
            return Err(e);
        }
    }
    Ok(contents)
}
```

`?` 연산자를 사용하여 오류 처리 코드를 크게 단축할 수 있습니다.
특히, `?` 연산자는 변환이 가능한 경우(즉, 적절한 `From` 구현이 있는 경우) 실패 가능한 작업의 오류 타입을 함수의 오류 타입으로 자동으로 변환합니다.