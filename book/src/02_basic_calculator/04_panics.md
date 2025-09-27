# 패닉

["변수" 섹션](02_variables.md)에서 작성한 `speed` 함수로 돌아가 봅시다.
아마 다음과 같을 것입니다:

```rust
fn speed(start: u32, end: u32, time_elapsed: u32) -> u32 {
    let distance = end - start;
    distance / time_elapsed
}
```

예리한 눈을 가졌다면 한 가지 문제[^one]를 발견했을 것입니다: `time_elapsed`가 0이면 어떻게 될까요?

[Rust 플레이그라운드](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=36e5ddbe3b3f741dfa9f74c956622bac)에서 직접 시도해 볼 수 있습니다!\n프로그램은 다음 오류 메시지와 함께 종료됩니다:

```text
thread 'main' panicked at src/main.rs:3:5:
attempt to divide by zero
```

이것은 **패닉**으로 알려져 있습니다.\n패닉은 프로그램이 계속 실행될 수 없을 정도로 심각한 문제가 발생했음을 알리는 Rust의 방식이며, **복구 불가능한 오류**[^catching]입니다. 0으로 나누기는 이러한 오류로 분류됩니다.

## panic! 매크로

`panic!` 매크로[^macro]를 호출하여 의도적으로 패닉을 유발할 수 있습니다:

```rust
fn main() {
    panic!("This is a panic!");
    // 아래 줄은 절대 실행되지 않습니다
    let x = 1 + 2;
}
```

Rust에는 복구 가능한 오류를 처리하기 위한 다른 메커니즘이 있으며, 이는 [나중에 다룰 것입니다](../05_ticket_v2/06_fallibility.md).
당분간은 잔인하지만 간단한 임시방편으로 패닉을 사용할 것입니다.

## 추가 자료

- [panic! 매크로 문서](https://doc.rust-lang.org/std/macro.panic.html)

[^one]: `speed`에는 곧 다룰 또 다른 문제가 있습니다. 발견할 수 있나요?

[^catching]: 패닉을 잡으려고 시도할 수 있지만, 매우 특정한 상황에 예약된 최후의 수단이어야 합니다.

[^macro]: `!`가 뒤따르면 매크로 호출입니다. 지금은 매크로를 특별한 함수라고 생각하세요. 과정의 뒷부분에서 더 자세히 다룰 것입니다.