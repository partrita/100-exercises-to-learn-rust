# `Error::source` 메서드

`Error` 트레이트에 대한 설명을 마무리하기 위해 꼭 알아야 할 것이 하나 더 있습니다. 바로 `source` 메서드입니다.

```rust
// `Error` 트레이트의 전체 정의입니다!
pub trait Error: Debug + Display {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        None
    }
}
```

`source` 메서드는 **오류의 원인(Error source)**이 있는 경우, 그 원인에 접근할 수 있게 해주는 방법입니다. 오류는 종종 연쇄적으로 발생하곤 합니다. 예를 들어, "데이터베이스 호스트 이름을 확인할 수 없음"이라는 저수준 오류 때문에 "데이터베이스에 연결할 수 없음"이라는 고수준 오류가 발생할 수 있죠. 이럴 때 `source` 메서드를 사용하면 오류의 연결 고리를 "추적"할 수 있으며, 로그에서 오류의 맥락을 정확히 파악하고 싶을 때 무척 유용합니다.

## `source` 구현하기

`Error` 트레이트는 기본적으로 항상 `None`(원인 없음)을 반환하도록 설정되어 있습니다. 그래서 이전 연습 문제에서는 굳이 `source`를 신경 쓰지 않아도 됐던 것이죠. 하지만 필요하다면 직접 이 메서드를 재정의해 여러분이 만든 오류 타입에 원인을 포함시킬 수 있습니다.

```rust
use std::error::Error;

#[derive(Debug)]
struct DatabaseError {
    source: std::io::Error
}

impl std::fmt::Display for DatabaseError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "데이터베이스 연결에 실패했습니다")
    }
}

impl std::error::Error for DatabaseError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        Some(&self.source)
    }
}
```

위 예시에서 `DatabaseError`는 `std::io::Error`를 원인으로 품고 있습니다. 그다음 `source` 메서드를 직접 구현하여, 호출될 때 이 내부의 소스를 반환하도록 만든 것이죠.

## `&(dyn Error + 'static)`

여기서 `&(dyn Error + 'static)`이라는 타입이 무척 낯설게 느껴지실 텐데, 하나씩 분해해 보겠습니다.

- **`dyn Error`**: **트레이트 객체(Trait object)**라고 부릅니다. `Error` 트레이트를 구현한 어떤 타입이든 가리킬 수 있는 유연한 방식이죠.
- **`'static`**: **라이프타임(Lifetime)** 중에서도 특별한 녀석입니다.
  `'static`은 해당 참조가 프로그램이 실행되는 내내 유효하다는 것을 보장해 줍니다.

이를 합쳐보면, `&(dyn Error + 'static)`은 `Error` 트레이트를 구현했고, 프로그램이 끝날 때까지 유효한 어떤 객체를 가리키는 참조를 뜻합니다. 지금 당장 이 개념들을 완벽히 이해하지 못해도 괜찮습니다! 나중에 더 자세히 다룰 기회가 있을 거예요.

## `thiserror`로 `source` 구현하기

`thiserror`를 사용하면 `source`를 수동으로 구현할 필요 없이 자동으로 처리할 수 있는 세 가지 영리한 방법을 제공합니다.

- **`source`라는 이름의 필드**: 해당 필드를 자동으로 오류의 원인으로 사용합니다.
  ```rust
  use thiserror::Error;

  #[derive(Error, Debug)]
  pub enum MyError {
      #[error("데이터베이스 연결 실패")]
      DatabaseError {
          source: std::io::Error
      }
  }
  ```
- **`#[source]` 어트리뷰트**: 특정 필드를 원인으로 지정합니다.
  ```rust
  use thiserror::Error;

  #[derive(Error, Debug)]
  pub enum MyError {
      #[error("데이터베이스 연결 실패")]
      DatabaseError {
          #[source]
          inner: std::io::Error
      }
  }
  ```
- **`#[from]` 어트리뷰트**: 필드를 원인으로 지정함과 동시에, 해당 소스 타입을 내 오류 타입으로 쉽게 변환해주는 `From` 트레이트까지 자동으로 구현해 줍니다.
  ```rust
  use thiserror::Error;

  #[derive(Error, Debug)]
  pub enum MyError {
      #[error("데이터베이스 연결 실패")]
      DatabaseError {
          #[from]
          inner: std::io::Error
      }
  }
  ```

## `?` 연산자 (Question Mark Operator)

`?` 연산자는 오류를 상위 함수로 **전파(Propagate)**할 때 사용하는 아주 편리한 도구입니다.
`Result`를 반환하는 함수 안에서 사용하면, 만약 그 결과가 `Err`일 때 바로 함수를 끝내고 해당 오류를 밖으로 던져줍니다.

예를 들어 볼까요?

```rust
use std::fs::File;
use std::io::Read;

fn read_file() -> Result<String, std::io::Error> {
    let mut file = File::open("file.txt")?; // 실패 시 즉시 반환
    let mut contents = String::new();
    file.read_to_string(&mut contents)?; // 실패 시 즉시 반환
    Ok(contents)
}
```

이 코드는 실제로는 아래의 긴 코드와 똑같은 일을 합니다.

```rust
use std::fs::File;
use std::io::Read;

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

`?` 연산자를 쓰면 오류 처리 코드가 몰라보게 깔끔해집니다. 특히, `?` 연산자는 필요한 경우(즉, 적절한 `From` 구현이 있을 때) 발생한 오류를 함수가 반환하는 오류 타입으로 **자동으로 변환**해주기도 합니다.