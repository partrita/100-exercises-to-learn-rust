# 언래핑(Unwrap)

이제 `Ticket::new`는 잘못된 입력이 들어와도 패닉을 일으키는 대신 `Result`를 반환합니다. 그렇다면 이 함수를 호출하는 쪽에서는 어떻게 대응해야 할까요?

## 실패를 무시할 수 없습니다

예외와 달리 Rust의 `Result`는 호출하는 쪽에서 **반드시 오류를 처리**하도록 강제합니다. `Result`를 반환하는 함수를 호출할 때, 오류 발생 가능성을 은근슬쩍 무시하고 지나가는 것은 허용되지 않습니다.

```rust
fn parse_int(s: &str) -> Result<i32, ParseIntError> {
    // ...
}

// 이 코드는 컴파일되지 않습니다. 오류 처리를 빠뜨렸기 때문입니다.
// 성공한 값을 꺼내거나(Unwrap) 오류를 처리하려면, `match` 문을 사용하거나 
// `Result`가 제공하는 유용한 메서드들을 활용해야 합니다.
let number = parse_int("42") + 2;
```

## Result를 처리하는 두 가지 방법

`Result`를 반환하는 함수를 만났을 때, 주로 다음과 같은 두 가지 방법을 선택합니다.

- **실패하면 바로 패닉 일으키기**:
  작업이 실패했을 때 더 이상 진행할 의미가 없다면 `unwrap`이나 `expect` 메서드를 사용합니다.
  ```rust
  // `parse_int`가 `Err`를 반환하면 즉시 패닉이 발생합니다.
  let number = parse_int("42").unwrap();
  
  // `expect`를 사용하면 패닉이 발생했을 때 보여줄 커스텀 메시지를 지정할 수 있습니다.
  let number = parse_int("42").expect("정수를 파싱하는 데 실패했습니다.");
  ```

- **명시적으로 오류 처리하기**:
  `match` 표현식을 사용해 `Result`를 분해하고, 성공(`Ok`)과 실패(`Err`) 케이스를 각각 나누어 처리합니다.
  ```rust
  match parse_int("42") {
      Ok(number) => println!("파싱된 숫자: {}", number),
      Err(err) => eprintln!("에러 발생: {}", err),
  }
  ```
