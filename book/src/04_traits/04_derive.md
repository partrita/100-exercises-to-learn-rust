# Derive 매크로 (Derive Macros)

`Ticket` 타입에 `PartialEq`를 직접 구현하는 것이 조금 번거롭지 않으셨나요? 구조체의 모든 필드를 일일이 비교해야 했죠.

## 구조 분해 구문 (Destructuring Syntax)

게다가 수동으로 구현하면 코드가 취약해집니다. 구조체 정의가 바뀌어 필드가 추가될 때마다 `PartialEq` 구현도 잊지 않고 업데이트해 주어야 하거든요.

이런 위험을 줄이기 위해 구조체를 필드로 나누는 **구조 분해(Destructuring)**를 사용할 수 있습니다:

```rust
impl PartialEq for Ticket {
    fn eq(&self, other: &Self) -> bool {
        let Ticket {
            title,
            description,
            status,
        } = self;
        // [...]
    }
}
```

이렇게 하면 `Ticket` 정의가 바뀌었을 때 컴파일러가 구조 분해가 불완전하다며 오류를 내주기 때문에 실수를 방지할 수 있습니다. 변수 이름 충돌(Shadowing)을 피하기 위해 필드 이름을 바꿀 수도 있죠:

```rust
impl PartialEq for Ticket {
    fn eq(&self, other: &Self) -> bool {
        let Ticket {
            title,
            description,
            status,
        } = self;
        let Ticket {
            title: other_title,
            description: other_description,
            status: other_status,
        } = other;
        // [...]
    }
}
```

구조 분해는 알아두면 매우 유용한 패턴이지만, 사실 이보다 훨씬 더 간편한 방법이 있습니다. 바로 **derive 매크로(Derive macros)**입니다.

## 매크로 (Macros)

이전 연습 문제에서도 이미 몇 가지 매크로를 접해보셨을 겁니다:

- 테스트 케이스의 `assert_eq!`, `assert!`
- 콘솔 출력을 위한 `println!`

Rust 매크로는 **코드 생성기(Code generators)**입니다. 입력받은 내용을 바탕으로 새로운 Rust 코드를 생성하고, 이렇게 생성된 코드는 나머지 프로그램과 함께 컴파일됩니다. 일부 매크로는 표준 라이브러리에 내장되어 있으며 직접 만들 수도 있습니다. 이 과정에서는 매크로를 직접 만들지는 않지만, 관심 있는 분들은 ["추가 자료"](#추가-자료) 섹션을 참고해 보세요.

### 매크로 검사

일부 IDE에서는 매크로가 생성한 코드를 직접 확인할 수 있습니다. 만약 불가능하다면 [`cargo-expand`](https://github.com/dtolnay/cargo-expand)라는 도구를 사용할 수도 있습니다.

### Derive 매크로

**Derive 매크로**는 특수한 종류의 Rust 매크로로, 구조체나 열거형 위에 **속성(Attributes)**으로 붙여 사용합니다.

```rust
#[derive(PartialEq)]
struct Ticket {
    title: String,
    description: String,
    status: String
}
```

이 매크로는 사용자 정의 타입에 대해 자주 쓰이는(그리고 구현이 뻔한) 트레이트들의 구현을 자동화해 줍니다. 위 예시에서는 `Ticket`에 대해 `PartialEq` 트레이트가 자동으로 구현됩니다. 매크로를 펼쳐보면 수동으로 짠 것과 기능적으로 동일하지만, 조금 복잡해 보이는 코드를 볼 수 있습니다:

```rust
#[automatically_derived]
impl ::core::cmp::PartialEq for Ticket {
    #[inline]
    fn eq(&self, other: &Ticket) -> bool {
        self.title == other.title 
            && self.description == other.description
            && self.status == other.status
    }
}
```

컴파일러가 가능한 경우 트레이트를 직접 구현하지 말고 `derive`하라고 유도할 것입니다.

## 추가 자료 (Further Reading)

- [The little book of Rust macros](https://veykril.github.io/tlborm/)
- [Proc macro workshop](https://github.com/dtolnay/proc-macro-workshop)
