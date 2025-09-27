# Derive 매크로

`Ticket`에 대해 `PartialEq`를 구현하는 것은 좀 지루했습니다, 그렇지 않나요?
구조체의 각 필드를 수동으로 비교해야 했습니다.

## 구조 분해 구문

게다가, 구현이 취약합니다: 구조체 정의가 변경되면(예: 새 필드가 추가되면) `PartialEq` 구현을 업데이트해야 한다는 것을 기억해야 합니다.

구조체를 필드로 **구조 분해**하여 위험을 완화할 수 있습니다:

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

`Ticket`의 정의가 변경되면 컴파일러는 구조 분해가 더 이상 완전하지 않다고 불평하며 오류를 발생시킵니다.
변수 섀도잉을 피하기 위해 구조체 필드의 이름을 바꿀 수도 있습니다:

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

구조 분해는 도구 상자에 넣어두면 유용한 패턴이지만, 이보다 더 편리한 방법이 있습니다: **derive 매크로**입니다.

## 매크로

이전 연습 문제에서 이미 몇 가지 매크로를 접했습니다:

- 테스트 케이스의 `assert_eq!` 및 `assert!`
- 콘솔에 출력하기 위한 `println!`

Rust 매크로는 **코드 생성기**입니다.
제공한 입력을 기반으로 새로운 Rust 코드를 생성하고, 생성된 코드는 나머지 프로그램과 함께 컴파일됩니다. 일부 매크로는 Rust의 표준 라이브러리에 내장되어 있지만, 직접 작성할 수도 있습니다. 이 과정에서는 자신만의 매크로를 만들지 않지만, ["추가 자료" 섹션](#추가-자료)에서 유용한 포인터를 찾을 수 있습니다.

### 검사

일부 IDE에서는 매크로를 확장하여 생성된 코드를 검사할 수 있습니다. 이것이 불가능한 경우 [`cargo-expand`](https://github.com/dtolnay/cargo-expand)를 사용할 수 있습니다.

### Derive 매크로

A **derive 매크로**는 Rust 매크로의 특정 종류입니다. 구조체 위에 **속성**으로 지정됩니다.

```rust
#[derive(PartialEq)]
struct Ticket {
    title: String,
    description: String,
    status: String
}
```

Derive 매크로는 사용자 정의 타입에 대한 공통(그리고 "명백한") 트레이트의 구현을 자동화하는 데 사용됩니다.
위의 예에서 `PartialEq` 트레이트는 `Ticket`에 대해 자동으로 구현됩니다.
매크로를 확장하면 생성된 코드가 수동으로 작성한 코드와 기능적으로 동일하지만 읽기에는 약간 더 번거롭다는 것을 알 수 있습니다:

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

컴파일러는 가능할 때 트레이트를 derive하도록 유도할 것입니다.

## 추가 자료

- [The little book of Rust macros](https://veykril.github.io/tlborm/)
- [Proc macro workshop](https://github.com/dtolnay/proc-macro-workshop)