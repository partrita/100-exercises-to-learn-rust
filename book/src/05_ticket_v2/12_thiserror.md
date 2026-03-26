# `thiserror`

조금 돌아가는 길이었나요? 하지만 꼭 거쳐야 하는 과정이었습니다! 이제 다시 본론으로 돌아가서 **사용자 정의 오류 타입(Custom Error Type)**과 `thiserror` 라이브러리에 대해 이야기해 봅시다.

## 사용자 정의 오류 타입

우리는 사용자 정의 오류 타입에 대해 `Error` 트레이트를 "수동으로" 구현하는 방법을 배웠습니다. 하지만 프로젝트가 커지고 관리해야 할 오류 타입이 수십 개로 늘어난다면 어떨까요? 매번 똑같은 코드를 반복해서 작성하는 일은 무척 번거로울 것입니다.

이런 반복적인 코드, 즉 **상용구(Boilerplate)**를 줄여주는 도구가 바로 [`thiserror`](https://docs.rs/thiserror/latest/thiserror/)입니다. `thiserror`는 **절차적 매크로(Procedural macro)**를 통해 아주 간단하게 사용자 정의 오류 타입을 만들 수 있게 도와줍니다.

```rust
#[derive(thiserror::Error, Debug)]
enum TicketNewError {
    #[error("{0}")]
    TitleError(String),
    #[error("{0}")]
    DescriptionError(String),
}
```

## 여러분도 직접 매크로를 만들 수 있습니다

지금까지 우리가 사용한 `derive` 매크로들은 대부분 Rust 표준 라이브러리에서 제공한 것들이었습니다.
`thiserror::Error`는 **타사(Third-party)** 라이브러리에서 가져온 `derive` 매크로를 경험하는 첫 사례가 되겠네요.

`derive` 매크로는 컴파일 단계에서 Rust 코드를 생성해주는 **절차적 매크로(Procedural macro)**의 한 종류입니다. 이 책에서는 매크로를 직접 작성하는 복잡한 방법까지 다루지는 않지만, 원한다면 여러분도 자신만의 매크로를 만들 수 있다는 점을 기억해 두세요! 이건 나중에 중급 이상의 과정에서 만나게 될 흥미로운 주제입니다.

## 사용자 정의 구문 (Custom Syntax)

절차적 매크로는 저마다 독특한 구문을 사용할 수 있으며, 보통 라이브러리 문서에 자세히 설명되어 있습니다.
`thiserror`에서 자주 사용하는 구문은 다음과 같습니다.

- **`#[derive(thiserror::Error)]`**: `thiserror`의 기능을 빌려 내가 만든 타입에 `Error` 트레이트를 자동으로 부여하겠다는 선언입니다.
- **`#[error("{0}")]`**: 각 오류 케이스(베리언트)에 대한 `Display` 구현 내용을 적는 곳입니다.
  `{0}`은 오류가 출력될 때 해당 베리언트의 첫 번째 필드(여기서는 `String`)의 값으로 바뀌게 됩니다.