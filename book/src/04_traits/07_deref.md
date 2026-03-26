# Deref 트레이트 (Deref Trait)

이전 연습 문제에서 코드를 조금 수정하셨을 텐데요:

```rust
impl Ticket {
    pub fn title(&self) -> &String {
        &self.title
    }
}
```

위 코드를 아래처럼 고쳤더니:

```rust
impl Ticket {
    pub fn title(&self) -> &str {
        &self.title
    }
}
```

별다른 문제 없이 컴파일이 되고 테스트도 통과했습니다. 그런데 곰곰이 생각해보면 조금 이상하지 않나요?

## 왜 작동하는 걸까요?

상황을 한 번 짚어봅시다:

- `self.title`은 `String`입니다.
- 그러므로 `&self.title`은 `&String`이 됩니다.
- 하지만 새로 바꾼 `title` 메서드의 반환 타입은 `&str`입니다.

원래라면 `Expected &String, found &str` 같은 컴파일 오류가 나야 할 것 같은데 말이죠. 대체 왜 문제없이 작동하는 걸까요?

## `Deref`가 도와줍니다 (Deref to the Rescue)

비결은 `Deref` 트레이트에 있습니다. 이 트레이트는 [**역참조 강제 변환(Deref coercion)**](https://doc.rust-lang.org/std/ops/trait.Deref.html#deref-coercion)이라는 멋진 언어 기능을 가능케 하는 핵심 메커니즘입니다. 표준 라이브러리의 `std::ops` 모듈에 다음과 같이 정의되어 있습니다:

```rust
// 구성을 조금 단순화한 모습입니다.
// 실제 정의는 조금 뒤에서 살펴볼 거예요.
pub trait Deref {
    type Target;
    
    fn deref(&self) -> &Self::Target;
}
```

여기서 `type Target`은 **연관 타입(Associated types)**입니다. 나중에 트레이트를 실제로 구현할 때 어떤 타입으로 바꿀지 미리 표시해두는 자리 표시자(Placeholder)라고 생각하시면 됩니다.

## 역참조 강제 변환 (Deref Coercion)

타입 `T`에 대해 `Deref<Target = U>`가 구현되어 있으면, 컴파일러에게 `&T`와 `&U`가 어느 정도 서로 호환된다는 신호를 줍니다. 구체적으로는 다음과 같은 효과가 생깁니다:

1. `T`의 참조가 필요할 때 자동으로 `U`의 참조로 바뀝니다 (즉, `&T`가 `&U`로 변신합니다).
2. `&T`에서 `&self`를 인자로 받는 `U` 타입의 모든 메서드를 직접 호출할 수 있습니다.

역참조 연산자 `*`와 관련된 기능도 하나 더 있지만, 지금은 당장 몰라도 괜찮습니다. (궁금하신 분은 공식 문서를 참고해 보세요!)

## `String`은 `Deref`를 구현하고 있습니다

실제로 `String`은 `Target = str`로 `Deref` 트레이트를 구현하고 있습니다:

```rust
impl Deref for String {
    type Target = str;
    
    fn deref(&self) -> &str {
        // [...]
    }
}
```

이 구현 덕분에 `&String`은 필요한 곳에서 자동으로 `&str`로 변환됩니다. 그래서 아까 우리 예제 코드가 성공적으로 컴파일되었던 것입니다!

## 주의: 남용은 금물입니다 (Don't Overdo It)

역참조 강제 변환은 매우 편리하지만, 남용하면 코드가 읽기 힘들어질 수 있습니다. 타입이 자동으로 변환되면 실제로 어떤 일이 벌어지는지 한눈에 파악하기 어렵기 때문이죠. 특히 `T`와 `U`에 똑같은 이름의 메서드가 있다면 어떤 것이 호출될지 헷갈릴 수도 있습니다.

나중에 우리는 이 기능의 가장 대표적이고 안전한 사례인 **스마트 포인터(Smart pointers)**에 대해 배워볼 것입니다.
