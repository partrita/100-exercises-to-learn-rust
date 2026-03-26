# 소유권(Ownership)

지금까지 배운 내용을 바탕으로 이전 연습 문제를 풀었다면, 아마도 접근자 메서드를 다음과 같이 작성하셨을 겁니다:

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

이 코드는 컴파일도 잘 되고 테스트도 통과하겠지만, 실제 상황에서 쓰기에는 큰 문제가 하나 있습니다. 다음 코드를 한번 볼까요?

```rust
if ticket.status() == "To-Do" {
    // `println!` 매크로는 아직 정식으로 배우지 않았지만,
    // 지금은 콘솔 창에 메시지를 출력하는 도구라고만 이해하셔도 충분합니다.
    println!("Your next task is: {}", ticket.title());
}
```

이 코드를 컴파일하려고 하면 다음과 같은 에러가 발생할 거예요:

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

축하드립니다! 여러분의 첫 번째 **빌림 검사기(Borrow Checker)** 에러를 마주하셨네요.

## Rust 소유권 시스템의 강력함

Rust의 **소유권(Ownership)** 시스템은 다음 세 가지를 철저히 보장하도록 설계되었습니다:

- 데이터를 읽는 중에는 절대 값이 변하지 않습니다.
- 데이터를 변경하는 중에는 절대 값을 읽을 수 없습니다.
- 데이터가 메모리에서 사라진 후에는 절대 접근할 수 없습니다.

이 엄격한 규칙들은 Rust 컴파일러의 핵심 부품인 **빌림 검사기(Borrow Checker)**가 감시합니다. 가끔은 너무 깐깐해서 Rust 개발자들 사이에서 농담이나 밈의 소재가 되기도 하죠.

소유권은 Rust를 다른 언어와 차별화하는 가장 핵심적인 개념입니다. 덕분에 Rust는 **성능을 희생하지 않으면서도 메모리 안전성**을 확보할 수 있습니다. Rust에서는 다음 사항들이 모두 동시에 가능합니다:

1. 런타임에 작동하는 가비지 컬렉터(Garbage Collector)가 필요 없습니다.
2. 개발자가 직접 메모리를 할당하고 해제하는 수고를 덜어줍니다.
3. 댕글링 포인터(Dangling Pointer)나 이중 해제(Double Free) 같은 고질적인 메모리 버그를 원천 차단합니다.

Python, JavaScript, Java 같은 언어는 2번과 3번의 편의성을 주지만 1번(성능)을 포기해야 합니다. 반면 C나 C++은 1번의 성능은 챙겼지만 2번과 3번의 위험을 개발자가 온전히 떠안아야 하죠.

혹시 3번에 나온 용어들이 낯설게 느껴지시나요? '댕글링 포인터'가 뭐지? '이중 해제'는 왜 위험할까? 걱정 마세요. 앞으로 차근차근 자세히 배우게 될 테니까요. 지금은 우선 Rust의 소유권 시스템 안에서 어떻게 코드를 짜는지 익히는 데 집중해 봅시다.

## 소유자(Owner)

Rust에서 모든 값에는 컴파일 시점에 결정되는 **소유자(Owner)**가 반드시 존재합니다. 그리고 어떤 순간에도 소유자는 오직 단 한 명뿐입니다.

## 이동 의미론(Move Semantics)

소유권은 다른 곳으로 넘겨줄 수 있습니다. 예를 들어, 내가 가진 값의 소유권을 다른 변수에게 넘겨줄 수 있죠:

```rust
let a = "hello, world".to_string(); // <- `a`가 String의 소유자입니다.
let b = a;  // <- 이제 `b`가 String의 소유자입니다.
```

Rust의 소유권 시스템은 타입 시스템에 녹아 있습니다. 모든 함수는 자신이 전달받은 인자와 어떻게 상호작용할지 시그니처를 통해 명시해야 합니다.

지금까지 우리가 작성한 메서드와 함수들은 인자를 **소비(Consume)**해 왔습니다. 즉, 인자의 소유권을 완전히 가져가 버린 거죠. 예를 들어 볼까요?

```rust
impl Ticket {
    pub fn description(self) -> String {
        self.description
    }
}
```

`Ticket::description`은 호출된 `Ticket` 인스턴스의 소유권을 가져갑니다. 이를 **이동 의미론(Move Semantics)**이라고 부릅니다. 값(`self`)의 소유권이 호출한 쪽에서 함수 안으로 **이동(Move)**하기 때문에, 함수를 부른 쪽에서는 더 이상 그 값을 쓸 수 없게 됩니다.

앞서 보았던 에러 메시지가 바로 이 상황을 설명하고 있습니다:

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

구체적으로 `ticket.status()`를 호출할 때 어떤 일이 일어나는지 살펴볼까요?

1. `Ticket::status`가 `Ticket` 인스턴스의 소유권을 가져갑니다.
2. `Ticket::status`는 `self`에서 `status` 필드만 쏙 빼내어 그 소유권을 다시 호출한 쪽으로 돌려줍니다.
3. 이때 남겨진 `Ticket` 인스턴스의 나머지 부분(`title`, `description`)은 메모리에서 사라지게(버려지게) 됩니다.

그래서 그 다음에 `ticket.title()`을 불러 `ticket`을 다시 쓰려고 하면 컴파일러가 화를 내는 겁니다. `ticket`이라는 값은 이미 분해되어 사라졌고, 소유권도 없으니 더 이상 쓸 수 없다는 거죠.

정말로 쓸모 있는 접근자 메서드를 만들려면, 이제 **참조(Reference)**를 배워야 합니다.

## 빌림(Borrowing)

매번 소유권을 뺏어가는 게 아니라, 잠시 값을 빌려서 읽기만 할 수 있다면 얼마나 좋을까요? 그렇지 않으면 코딩하기가 너무 힘들겠죠. Rust에서는 이를 **빌림(Borrowing)**이라고 부릅니다.

값을 빌려올 때마다 우리는 그 값에 대한 **참조(Reference)**를 얻게 됩니다. 참조에는 두 가지 종류의 권한이 따라붙습니다[^refine]:

- **불변 참조(`&`)**: 값을 읽을 수는 있지만, 수정할 수는 없습니다.
- **가변 참조(`&mut`)**: 값을 읽을 수도 있고, 수정할 수도 있습니다.

Rust 소유권 시스템의 대원칙을 다시 떠올려 봅시다:

- 데이터를 읽는 중에는 절대 값이 변하지 않습니다.
- 데이터를 변경하는 중에는 절대 값을 읽을 수 없습니다.

이 두 가지 원칙을 지키기 위해 Rust는 참조 사용에 몇 가지 제약을 둡니다:

- 한 값에 대해 가변 참조와 불변 참조를 동시에 가질 수 없습니다.
- 한 값에 대해 가변 참조를 두 개 이상 동시에 가질 수 없습니다.
- 누군가 값을 빌려 가 쓰고 있는 동안(참조가 활성 상태일 때) 소유자는 값을 변경할 수 없습니다.
- 가변 참조가 없다면, 불변 참조는 원하는 만큼 마음껏 만들 수 있습니다.

불변 참조는 '읽기 전용(Read-only) 잠금', 가변 참조는 '읽기-쓰기(Read-Write) 잠금'과 비슷하다고 생각하면 이해가 빠르실 겁니다. 이 모든 제약 사항은 컴파일 시점에 빌림 검사기에 의해 엄격히 관리됩니다.

### 구문(Syntax)

그럼 실제로 어떻게 빌려올까요? 방법은 간단합니다. **변수 이름 앞에** `&`나 `&mut`를 붙여주면 됩니다. 여기서 주의할 점! **타입 이름 앞에** 붙는 `&`와 `&mut`는 조금 다른 의미를 가집니다. 이는 '어떤 타입에 대한 참조'라는 새로운 타입을 나타내는 표시거든요.

예를 들어 보겠습니다:

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
    // `b`의 타입은 `&u32`가 됩니다. `u32` 값에 대한 참조를 담고 있기 때문이죠.
    // `&` 연산자를 변수 앞에 붙여서 `config.version`을 빌려와 참조를 만듭니다.
    // 똑같은 `&` 기호지만, 문맥에 따라 의미가 달라진다는 점에 유의하세요!
    let b: &u32 = &config.version;
}
```

이 개념은 함수의 인자나 반환 타입에도 똑같이 적용됩니다:

```rust
// `f` 함수는 `number`라는 이름의 `u32` 타입에 대한 '가변 참조'를 인자로 받습니다.
fn f(number: &mut u32) -> &u32 {
    // [...]
}
```

## 한숨 돌리고 가실까요?

Rust의 소유권 시스템을 처음 접하면 조금 당황스러울 수 있습니다. 하지만 너무 걱정하지 마세요! 연습하다 보면 어느새 숨 쉬듯 자연스럽게 익숙해질 테니까요. 이번 장의 나머지 부분과 전체 과정에서 충분히 연습할 기회를 드릴 겁니다.

이 장의 마지막 부분에서 왜 Rust가 이렇게 설계되었는지 그 이유를 설명해 드릴게요. 지금은 우선 '어떻게 사용하는지'에 집중해 봅시다. 컴파일 에러가 날 때마다 실력이 쑥쑥 늘어날 거예요!

[^refine]: 이 방식은 이해를 돕기 위한 모델이며, 모든 세부 사항을 다 담고 있지는 않습니다. [나중에](../07_threads/06_interior_mutability.md) 참조에 대해 더 깊이 있게 다루며 이해를 완성해 나갈 예정입니다.
