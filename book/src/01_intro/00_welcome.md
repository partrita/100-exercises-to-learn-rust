# 환영합니다

**"100개의 연습 문제로 Rust 배우기"**에 오신 것을 환영합니다!

이 과정은 한 번에 한 연습 문제씩 Rust의 핵심 개념을 가르쳐줍니다.
Rust의 문법, 타입 시스템, 표준 라이브러리 및 생태계에 대해 배우게 될 것입니다.

저희는 Rust에 대한 사전 지식이 있다고 가정하지 않지만, 적어도 다른 프로그래밍 언어 하나는 알고 있다고 가정합니다. 또한 시스템 프로그래밍이나 메모리 관리에 대한 사전 지식도 가정하지 않습니다. 이러한 주제는 과정에서 다룰 것입니다.

다시 말해, 우리는 처음부터 시작할 것입니다!
작고 관리하기 쉬운 단계로 Rust 지식을 쌓아나갈 것입니다. 과정이 끝날 때쯤에는 약 100개의 연습 문제를 풀게 되며, 이는 중소 규모의 Rust 프로젝트에서 편안하게 작업할 수 있을 만큼 충분한 양입니다.

## 방법론

이 과정은 "하면서 배우는" 원칙에 기반합니다.
대화형이며 직접 해보는 방식으로 설계되었습니다.

[Mainmatter](https://mainmatter.com/rust-consulting/)는 이 과정을 4일 동안 교실 환경에서 진행하도록 개발했습니다. 각 참석자는 자신의 속도에 맞춰 강의를 진행하며, 숙련된 강사가 지침을 제공하고 질문에 답하며 필요에 따라 주제를 더 깊이 파고듭니다.
[저희 웹사이트](https://ti.to/mainmatter/rust-from-scratch-jan-2025)에서 다음 지도 세션에 등록할 수 있습니다. 회사를 위한 비공개 세션을 원하시면 [문의해 주세요](https://mainmatter.com/contact/).

혼자서 과정을 수강할 수도 있지만, 막히는 경우를 대비해 친구나 멘토를 찾아 도움을 받는 것을 권장합니다. 모든 연습 문제의 해답은 [GitHub 저장소의 `solutions` 브랜치](https://github.com/mainmatter/100-exercises-to-learn-rust/tree/solutions)에서 찾을 수 있습니다.

## 형식

과정 자료는 [브라우저에서](https://rust-exercises.com/100-exercises/) 보거나 오프라인 읽기를 위해 [PDF 파일로 다운로드](https://rust-exercises.com/100-exercises-to-learn-rust.pdf)할 수 있습니다.
과정 자료를 인쇄하고 싶다면 [Amazon에서 페이퍼백 사본을 구매](https://www.amazon.com/dp/B0DJ14KQQG/)하세요.

## 구조

화면 왼쪽에서 과정이 여러 섹션으로 나누어져 있는 것을 볼 수 있습니다.
각 섹션은 Rust 언어의 새로운 개념이나 기능을 소개합니다.
이해도를 확인하기 위해 각 섹션에는 풀어야 할 연습 문제가 함께 제공됩니다.

연습 문제는 [함께 제공되는 GitHub 저장소](https://github.com/mainmatter/100-exercises-to-learn-rust)에서 찾을 수 있습니다.
과정을 시작하기 전에 저장소를 로컬 컴퓨터에 복제해야 합니다:

```bash
# GitHub에 SSH 키가 설정된 경우
git clone git@github.com:mainmatter/100-exercises-to-learn-rust.git
# 그렇지 않은 경우 HTTPS URL을 사용하세요:
#   https://github.com/mainmatter/100-exercises-to-learn-rust.git
```

또한, 진행 상황을 쉽게 추적하고 필요한 경우 기본 저장소에서 업데이트를 가져올 수 있도록 브랜치에서 작업하는 것을 권장합니다:

```bash
cd 100-exercises-to-learn-rust
git checkout -b my-solutions
```

모든 연습 문제는 `exercises` 폴더에 있습니다.
각 연습 문제는 Rust 패키지로 구성되어 있습니다.
패키지에는 연습 문제 자체, 수행할 작업에 대한 지침(`src/lib.rs`에 있음) 및 해결책을 자동으로 확인하는 테스트 스위트가 포함되어 있습니다.

### 도구

이 과정을 진행하려면 다음이 필요합니다:

- [**Rust**](https://www.rust-lang.org/tools/install).
  시스템에 `rustup`이 이미 설치되어 있는 경우, `rustup update`를 실행하여(또는 시스템에 Rust를 설치한 방법에 따라 다른 적절한 명령을 실행하여) 최신 안정 버전을 실행하고 있는지 확인하세요.
- _(선택 사항이지만 권장)_ Rust 자동 완성 기능을 지원하는 IDE.
  다음 중 하나를 권장합니다:
  - [RustRover](https://www.jetbrains.com/rust/);
  - [`rust-analyzer`](https://marketplace.visualstudio.com/items?itemName=matklad.rust-analyzer) 확장 기능이 포함된 [Visual Studio Code](https://code.visualstudio.com).

### 워크숍 러너, `wr`

해결책을 확인하기 위해 과정을 안내하는 도구인 `wr` CLI("워크숍 러너"의 약자)도 제공했습니다.
[웹사이트](https://mainmatter.github.io/rust-workshop-runner/)의 지침에 따라 `wr`을 설치하세요.

`wr`을 설치한 후 새 터미널을 열고 저장소의 최상위 폴더로 이동합니다.
`wr` 명령을 실행하여 과정을 시작합니다:

```bash
wr
```

`wr`은 현재 연습 문제의 해결책을 확인합니다.
현재 섹션의 연습 문제를 해결할 때까지 다음 섹션으로 넘어가지 마세요.

> 과정을 진행하면서 Git에 해결책을 커밋하는 것을 권장합니다.
> 이렇게 하면 진행 상황을 쉽게 추적하고 필요한 경우 알려진 지점에서 "다시 시작"할 수 있습니다.

과정을 즐기세요!

## 저자

이 과정은 [Mainmatter](https://mainmatter.com/rust-consulting/)의 수석 엔지니어링 컨설턴트인 [Luca Palmieri](https://www.lpalmieri.com/)가 작성했습니다.
Luca는 2018년부터 Rust로 작업해왔으며, 처음에는 TrueLayer에서, 그 다음에는 AWS에서 근무했습니다.
Luca는 Rust로 백엔드 애플리케이션을 구축하는 방법을 배우기 위한 최고의 자료인 ["Zero to Production in Rust"](https://zero2prod.com)의 저자입니다.
그는 또한 [`cargo-chef`](https://github.com/LukeMathWalker/cargo-chef), [Pavex](https://pavex.dev) 및 [`wiremock`](https://github.com/LukeMathWalker/wiremock-rs)를 포함한 다양한 오픈 소스 Rust 프로젝트의 저자이자 유지 관리자입니다.
