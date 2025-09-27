# 언래핑

`Ticket::new`는 이제 유효하지 않은 입력에 대해 패닉을 일으키는 대신 `Result`를 반환합니다.
이것이 호출자에게 무엇을 의미할까요?

## 실패는 (암시적으로) 무시될 수 없습니다

예외와 달리, Rust의 `Result`는 **호출 사이트에서 오류를 처리**하도록 강제합니다.
`Result`를 반환하는 함수를 호출하면, Rust는 오류 케이스를 암시적으로 무시하는 것을 허용하지 않습니다.

```rust
fn parse_int(s: &str) -> Result<i32, ParseIntError> {
    // ...
}

// 이것은 컴파일되지 않습니다: 오류 케이스를 처리하지 않고 있습니다.
// 성공 값을 "언래핑"하거나 오류를 처리하려면 `match` 또는 `Result`가 
// 제공하는 조합자 중 하나를 사용해야 합니다.
let number = parse_int("42") + 2;
```

## `Result`를 얻었습니다. 이제 무엇을 할까요?

`Result`를 반환하는 함수를 호출할 때, 두 가지 주요 옵션이 있습니다:

- 작업이 실패하면 패닉을 일으킵니다.
  이것은 `unwrap` 또는 `expect` 메소드를 사용하여 수행됩니다.
  ```rust
  // `parse_int`가 `Err`를 반환하면 패닉을 일으킵니다.
  let number = parse_int("42").unwrap();
  // `expect`를 사용하면 사용자 정의 패닉 메시지를 지정할 수 있습니다.
  let number = parse_int("42").expect("Failed to parse integer");
  ```
- `match` 표현식을 사용하여 `Result`를 구조 분해하여 오류 케이스를 명시적으로 처리합니다.
  ```rust
  match parse_int("42") {
      Ok(number) => println!("Parsed number: {}", number),
      Err(err) => eprintln!("Error: {}", err),
  }
  ```