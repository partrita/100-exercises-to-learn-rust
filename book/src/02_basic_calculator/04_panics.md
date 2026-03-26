# 패닉(Panics)

["변수" 섹션](02_variables.md)에서 구현한 `speed` 함수를 다시 한 번 살펴볼까요? 아마 코드는 다음과 같을 것입니다.

```rust
fn speed(start: u32, end: u32, time_elapsed: u32) -> u32 {
    let distance = end - start;
    distance / time_elapsed
}
```

혹시 눈썰미가 좋으신 분이라면 한 가지 문제점[^one]을 발견하셨을지도 모릅니다. 만약 `time_elapsed`가 0이라면 어떻게 될까요?

[Rust 플레이그라운드](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=36e5ddbe3b3f741dfa9f74c956622bac)에서 직접 실행해 보세요! 그러면 프로그램은 다음과 같은 오류 메시지를 남기며 즉시 종료됩니다.

```text
thread 'main' panicked at src/main.rs:3:5:
attempt to divide by zero
```

이것을 바로 **패닉(Panic)**이라고 부릅니다. 패닉은 프로그램이 더 이상 정상적으로 실행될 수 없을 정도로 심각한 상황이 발생했음을 알리는 Rust의 신호이자, **복구 불가능한 오류**[^catching]를 처리하는 방식입니다. '0으로 나누기'가 바로 이런 오류에 해당하죠.

## `panic!` 매크로

우리가 직접 `panic!` 매크로[^macro]를 호출해서 의도적으로 패닉을 일으킬 수도 있습니다.

```rust
fn main() {
    panic!("여기는 패닉 지점입니다!");
    // 아래 줄은 절대 실행되지 않습니다.
    let x = 1 + 2;
}
```

Rust에는 복구 가능한 오류를 세련되게 처리하는 별도의 메커니즘이 있으며, 이는 [나중에](../05_ticket_v2/06_fallibility.md) 자세히 다룰 예정입니다. 지금은 조금 거칠더라도 확실한 오류 알림 수단인 패닉을 사용해 보겠습니다.

## 더 읽어보기

- [`panic!` 매크로 공식 문서](https://doc.rust-lang.org/std/macro.panic.html)

[^one]: 사실 `speed` 함수에는 아직 다루지 않은 또 다른 잠재적인 문제가 있습니다. 무엇인지 눈치채셨나요?

[^catching]: 패닉을 잡아내어 복구하려고 시도할 수도 있지만, 이는 매우 특수한 상황에서만 제한적으로 사용되는 최후의 수단입니다.

[^macro]: 이름 뒤에 느낌표(`!`)가 붙으면 함수가 아닌 매크로 호출을 의미합니다. 지금은 매크로를 아주 똑똑하고 특별한 함수 정도로 이해하셔도 좋습니다. 과정 뒷부분에서 더 자세히 배울 것입니다.
