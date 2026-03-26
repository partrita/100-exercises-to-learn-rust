# 한 번에 한 연습 문제씩 Rust 배우기

Rust에 대해 들어봤지만, 한 번도 사용해 볼 기회가 없으셨나요?
이 과정이 바로 당신을 위한 것입니다!

100개의 연습 문제를 풀면서 Rust를 배우게 됩니다.
Rust에 대해 아무것도 모르는 상태에서 시작하여, 한 번에 한 연습 문제씩 자신만의 프로그램을 작성할 수 있게 될 것입니다.

> [!NOTE]
> 이 과정은 [Mainmatter](https://mainmatter.com/rust-consulting/)에 의해 작성되었습니다.
> 이것은 [저희 Rust 워크숍 포트폴리오](https://mainmatter.com/services/workshops/rust/)에 있는 교육 중 하나입니다.
> Rust 컨설팅이나 교육을 찾고 계신다면 저희 [랜딩 페이지](https://mainmatter.com/rust-consulting/)를 확인해 보세요!

## 시작하기

[rust-exercises.com](https://rust-exercises.com)으로 이동하여 지침에 따라 과정을 시작하세요.

## 학습 내용

이 과정은 다음과 같은 내용을 다룹니다:

- [환영합니다](book/src/01_intro/00_welcome.md)
  - [문법](book/src/01_intro/01_syntax.md)
- [기본 계산기](book/src/02_basic_calculator/00_intro.md)
  - [정수](book/src/02_basic_calculator/01_integers.md)
  - [변수](book/src/02_basic_calculator/02_variables.md)
  - [분기: `if`/`else`](book/src/02_basic_calculator/03_if_else.md)
  - [패닉](book/src/02_basic_calculator/04_panics.md)
  - [팩토리얼](book/src/02_basic_calculator/05_factorial.md)
  - [루프: `while`](book/src/02_basic_calculator/06_while.md)
  - [루프: `for`](book/src/02_basic_calculator/07_for.md)
  - [오버플로우와 언더플로우](book/src/02_basic_calculator/08_overflow.md)
  - [포화 연산](book/src/02_basic_calculator/09_saturating.md)
  - [변환: `as` 캐스팅](book/src/02_basic_calculator/10_as_casting.md)
- [티켓 v1](book/src/03_ticket_v1/00_intro.md)
  - [구조체](book/src/03_ticket_v1/01_struct.md)
  - [유효성 검사](book/src/03_ticket_v1/02_validation.md)
  - [모듈](book/src/03_ticket_v1/03_modules.md)
  - [가시성](book/src/03_ticket_v1/04_visibility.md)
  - [캡슐화](book/src/03_ticket_v1/05_encapsulation.md)
  - [소유권](book/src/03_ticket_v1/06_ownership.md)
  - [세터](book/src/03_ticket_v1/07_setters.md)
  - [스택](book/src/03_ticket_v1/08_stack.md)
  - [힙](book/src/03_ticket_v1/09_heap.md)
  - [메모리 내 참조](book/src/03_ticket_v1/10_references_in_memory.md)
  - [소멸자](book/src/03_ticket_v1/11_destructor.md)
- [트레이트](book/src/04_traits/00_intro.md)
  - [트레이트](book/src/04_traits/01_trait.md)
  - [연산자 오버로딩](book/src/04_traits/03_operator_overloading.md)
  - [Derive 매크로](book/src/04_traits/04_derive.md)
  - [트레이트 바운드](book/src/04_traits/05_trait_bounds.md)
  - [문자열 슬라이스](book/src/04_traits/06_str_slice.md)
  - [`Deref` 트레이트](book/src/04_traits/07_deref.md)
  - [`Sized` 트레이트](book/src/04_traits/08_sized.md)
  - [`From` 트레이트](book/src/04_traits/09_from.md)
  - [`Clone` 트레이트](book/src/04_traits/11_clone.md)
  - [`Copy` 트레이트](book/src/04_traits/12_copy.md)
  - [`Drop` 트레이트](book/src/04_traits/13_drop.md)
- [티켓 v2](book/src/05_ticket_v2/00_intro.md)
- [티켓 관리](book/src/06_ticket_management/00_intro.md)
- [스레드](book/src/07_threads/00_intro.md)
- [퓨처](book/src/08_futures/00_intro.md)

전체 목록은 [SUMMARY.md](book/src/SUMMARY.md)에서 확인하실 수 있습니다.

## 요구 사항

- **Rust** ([여기](https://www.rust-lang.org/tools/install)의 지침을 따르세요).
  시스템에 `rustup`이 이미 설치되어 있다면, `rustup update`를 실행하여 (또는 시스템에 Rust를 설치한 방법에 따라 다른 적절한 명령을 실행하여)
  최신 안정 버전을 실행하고 있는지 확인하세요.
- _(선택 사항이지만 권장)_ Rust 자동 완성 기능을 지원하는 IDE.
  다음 중 하나를 권장합니다:
  - [RustRover](https://www.jetbrains.com/rust/);
  - [`rust-analyzer`](https://marketplace.visualstudio.com/items?itemName=matklad.rust-analyzer) 확장 기능이 포함된 [Visual Studio Code](https://code.visualstudio.com).

## 해답

연습 문제의 해답은 이 저장소의 [`solutions` 브랜치](https://github.com/mainmatter/100-exercises-to-learn-rust/tree/solutions)에서 찾을 수 있습니다.

# 라이선스

Copyright © 2024- Mainmatter GmbH (https://mainmatter.com), [Creative Commons Attribution-NonCommercial 4.0 국제 라이선스](https://creativecommons.org/licenses/by-nc/4.0/)에 따라 배포됩니다.