# 소유권

이전 연습 문제를 지금까지 배운 내용으로 해결했다면, 접근자 메소드는 아마 다음과 같을 것입니다:

```rust
impl Ticket {
    pub fn title(self) -> String {
        self.title
    }

    pub fn description(self) -> String {
        self.description
    }

    pub fn status(self) -> String {
        self.status
    }
}
```

이 메소드들은 컴파일되고 테스트를 통과하기에 충분하지만, 실제 시나리오에서는 그다지 유용하지 않습니다.
이 코드 조각을 고려해 보세요:

```rust
if ticket.status() == "To-Do" {
    // `println!` 매크로는 아직 다루지 않았지만,
    // 지금은 콘솔에 (템플릿화된) 메시지를 출력한다는 것만 알아두면 충분합니다.
    println!("Your next task is: {}", ticket.title());
}
```

컴파일하려고 하면 오류가 발생합니다:

```text
error[E0382]: use of moved value: `ticket`
  --> src/main.rs:30:43
   |
25 |     let ticket = Ticket::new(/* */);
   |         ------ move occurs because `ticket` has type `Ticket`, 
   |                which does not implement the `Copy` trait
26 |     if ticket.status() == "To-Do" {
   |               -------- `ticket` moved due to this method call
...
30 |         println!("Your next task is: {}", ticket.title());
   |                                           ^^^^^^ 
   |                                value used here after move
   |
note: `Ticket::status` takes ownership of the receiver `self`, 
      which moves `ticket`
  --> src/main.rs:12:23
   |
12 |         pub fn status(self) -> String {
   |                       ^^^^
```

축하합니다, 이것이 여러분의 첫 번째 빌림 검사기 오류입니다!

## Rust의 소유권 시스템의 장점

Rust의 소유권 시스템은 다음을 보장하도록 설계되었습니다:

- 데이터가 읽히는 동안에는 절대 변경되지 않습니다.
- 데이터가 변경되는 동안에는 절대 읽히지 않습니다.
- 데이터가 파괴된 후에는 절대 접근되지 않습니다.

이러한 제약 조건은 Rust 컴파일러의 하위 시스템인 **빌림 검사기**에 의해 강제되며, 종종 Rust 커뮤니티에서 농담과 밈의 대상이 됩니다.

소유권은 Rust의 핵심 개념이며, 언어를 독특하게 만드는 요소입니다.
소유권은 Rust가 **성능 저하 없이 메모리 안전성**을 제공할 수 있도록 합니다.
Rust에 대해 다음 모든 사항이 동시에 사실입니다:

1. 런타임 가비지 컬렉터가 없습니다.
2. 개발자로서 메모리를 직접 관리할 필요가 거의 없습니다.
3. 댕글링 포인터, 이중 해제 및 기타 메모리 관련 버그를 유발할 수 없습니다.

Python, JavaScript, Java와 같은 언어는 2번과 3번을 제공하지만 1번은 제공하지 않습니다.\
C나 C++과 같은 언어는 1번을 제공하지만 2번이나 3번은 제공하지 않습니다.

배경에 따라 3번은 약간 난해하게 들릴 수 있습니다: "댕글링 포인터"란 무엇인가요?
"이중 해제"란 무엇인가요? 왜 위험한가요?\
걱정하지 마세요. 과정의 나머지 부분에서 이러한 개념을 더 자세히 다룰 것입니다.

하지만 지금은 Rust의 소유권 시스템 내에서 작업하는 방법을 배우는 데 집중합시다.

## 소유자

Rust에서 각 값에는 컴파일 타임에 정적으로 결정되는 **소유자**가 있습니다.
언제든지 각 값에 대해 단 하나의 소유자만 있습니다.

## 이동 의미론

소유권은 이전될 수 있습니다.

예를 들어, 값을 소유하고 있다면 다른 변수로 소유권을 이전할 수 있습니다:

```rust
let a = "hello, world".to_string(); // <- `a`는 String의 소유자입니다.
let b = a;  // <- `b`는 이제 String의 소유자입니다.
```

Rust의 소유권 시스템은 타입 시스템에 내장되어 있습니다. 각 함수는 시그니처에서 인자와 어떻게 상호 작용할지를 선언해야 합니다.

지금까지 우리의 모든 메소드와 함수는 인자를 **소비**했습니다. 즉, 소유권을 가져갔습니다.
예를 들어:

```rust
impl Ticket {
    pub fn description(self) -> String {
        self.description
    }
}
```

`Ticket::description`은 호출된 `Ticket` 인스턴스의 소유권을 가져갑니다.\
이것은 **이동 의미론**으로 알려져 있습니다. 값(`self`)의 소유권은 호출자에서 피호출자로 **이동**되며, 호출자는 더 이상 사용할 수 없습니다.

이것이 바로 이전에 본 오류 메시지에서 컴파일러가 사용한 언어입니다:

```text
error[E0382]: use of moved value: `ticket`
  --> src/main.rs:30:43
   |
25 |     let ticket = Ticket::new(/* */);
   |         ------ move occurs because `ticket` has type `Ticket`, 
   |                which does not implement the `Copy` trait
26 |     if ticket.status() == "To-Do" {
   |               -------- `ticket` moved due to this method call
...
30 |         println!("Your next task is: {}", ticket.title());
   |                                           ^^^^^^ 
   |                                 value used here after move
   |
note: `Ticket::status` takes ownership of the receiver `self`, 
      which moves `ticket`
  --> src/main.rs:12:23
   |
12 |         pub fn status(self) -> String {
   |                       ^^^^
```

특히, `ticket.status()`를 호출할 때 발생하는 이벤트 순서는 다음과 같습니다:

- `Ticket::status`는 `Ticket` 인스턴스의 소유권을 가져갑니다.
- `Ticket::status`는 `self`에서 `status`를 추출하고 `status`의 소유권을 호출자에게 다시 이전합니다.
- 나머지 `Ticket` 인스턴스(`title` 및 `description`)는 버려집니다.

`ticket.title()`을 통해 `ticket`을 다시 사용하려고 하면 컴파일러가 불평합니다. `ticket` 값은 이제 사라졌고, 더 이상 소유하지 않으므로 더 이상 사용할 수 없습니다.

_유용한_ 접근자 메소드를 만들려면 **참조**로 작업해야 합니다.

## 빌림

소유권을 가져가지 않고 변수의 값을 읽을 수 있는 메소드를 갖는 것이 바람직합니다.\
그렇지 않으면 프로그래밍이 상당히 제한될 것입니다. Rust에서는 **빌림**을 통해 이를 수행합니다.

값을 빌릴 때마다 해당 값에 대한 **참조**를 얻습니다.\
참조에는 권한이 태그됩니다[^refine]:

- 불변 참조(`&`)는 값을 읽을 수는 있지만 변경할 수는 없습니다.
- 가변 참조(`&mut`)는 값을 읽고 변경할 수 있습니다.

Rust의 소유권 시스템의 목표로 돌아가서:

- 데이터가 읽히는 동안에는 절대 변경되지 않습니다.
- 데이터가 변경되는 동안에는 절대 읽히지 않습니다.

이 두 속성을 보장하기 위해 Rust는 참조에 몇 가지 제한을 도입해야 합니다:

- 동일한 값에 대해 가변 참조와 불변 참조를 동시에 가질 수 없습니다.
- 동일한 값에 대해 둘 이상의 가변 참조를 가질 수 없습니다.
- 소유자는 값이 빌려지는 동안 값을 변경할 수 없습니다.
- 가변 참조가 없는 한 원하는 만큼 많은 불변 참조를 가질 수 있습니다.

어떤 면에서 불변 참조는 값에 대한 "읽기 전용" 잠금으로 생각할 수 있고, 가변 참조는 "읽기-쓰기" 잠금과 같습니다.

이러한 모든 제한은 컴파일 타임에 빌림 검사기에 의해 강제됩니다.

### 구문

실제로 값을 어떻게 빌리나요?\
**변수 앞에** `&` 또는 `&mut`를 추가하여 값을 빌립니다.
주의하세요! **타입 앞에** 동일한 기호(`&` 및 `&mut`)는 다른 의미를 가집니다.
원래 타입에 대한 참조인 다른 타입을 나타냅니다.

예를 들어:

```rust
struct Configuration {
    version: u32,
    active: bool,
}

fn main() {
    let config = Configuration {
        version: 1,
        active: true,
    };
    // `b`는 `config`의 `version` 필드에 대한 참조입니다.
    // `b`의 타입은 `&u32`입니다. 왜냐하면 `u32` 값에 대한 참조를 포함하기 때문입니다.
    // `&` 연산자를 사용하여 `config.version`을 빌려서 참조를 만듭니다.
    // 동일한 기호(`&`), 컨텍스트에 따라 다른 의미!
    let b: &u32 = &config.version;
    //     ^ 타입 어노테이션은 필요하지 않습니다.
    //       무슨 일이 일어나고 있는지 명확히 하기 위해 있을 뿐입니다.
}
```

동일한 개념이 함수 인자와 반환 타입에도 적용됩니다:

```rust
// `f`는 `number`라는 이름에 바인딩된 `u32`에 대한 가변 참조를 인자로 받습니다.
fn f(number: &mut u32) -> &u32 {
    // [...]
}
```

## 숨을 들이쉬고 내쉬세요

Rust의 소유권 시스템은 처음에는 약간 압도적일 수 있습니다.\
하지만 걱정하지 마세요. 연습을 통해 제2의 천성이 될 것입니다.\
그리고 이 장의 나머지 부분과 과정의 나머지 부분에서 많은 연습을 하게 될 것입니다! 각 개념을 여러 번 다시 방문하여 익숙해지고 어떻게 작동하는지 진정으로 이해할 수 있도록 할 것입니다.

이 장의 끝 부분에서 Rust의 소유권 시스템이 왜 그렇게 설계되었는지 설명할 것입니다.
지금은 _어떻게_에 집중하세요. 각 컴파일러 오류를 학습 기회로 삼으세요!

[^refine]: 이것은 시작하기에 좋은 정신 모델이지만, _전체_ 그림을 포착하지는 않습니다.
[과정의 뒷부분](../07_threads/06_interior_mutability.md)에서 참조에 대한 이해를 구체화할 것입니다.