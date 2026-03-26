# 환영합니다!

**'100개의 연습 문제로 배우는 Rust'**에 오신 것을 환영합니다!

이 과정은 연습 문제를 하나씩 풀어나가며 Rust의 핵심 개념을 자연스럽게 익힐 수 있도록 설계되었습니다. Rust의 문법부터 타입 시스템, 표준 라이브러리와 생태계까지 폭넓게 다룰 예정입니다.

Rust를 전혀 모르셔도 괜찮습니다. 다만, 최소한 하나 이상의 다른 프로그래밍 언어를 접해본 경험이 있다고 가정하고 내용을 구성했습니다. 시스템 프로그래밍이나 메모리 관리에 대한 지식이 없어도 걱정하지 마세요. 과정 진행 중에 차근차근 배우게 될 것입니다.

한마디로, 우리는 **기초부터 시작합니다!**
작고 관리하기 쉬운 단계부터 차근차근 Rust 지식을 쌓아나갈 것입니다. 과정을 마칠 때쯤이면 약 100개의 연습 문제를 풀게 되며, 이는 중소 규모의 Rust 프로젝트를 자신 있게 다룰 수 있는 실력이 될 것입니다.

## 학습 방법

이 과정은 **"직접 해보며 배운다"**는 원칙을 따릅니다. 단순히 읽는 것이 아니라, 대화형 방식으로 직접 코드를 짜보며 체득하도록 설계되었습니다.

[Mainmatter](https://mainmatter.com/rust-consulting/)는 이 과정을 4일간의 오프라인 강의용으로 개발했습니다. 원래는 각자가 자신의 속도에 맞춰 진행하되, 숙련된 강사가 곁에서 가이드를 주고 질문에 답하며 필요에 따라 주제를 깊이 있게 설명하는 방식입니다.
[저희 웹사이트](https://ti.to/mainmatter/rust-from-scratch-jan-2025)에서 다음 교육 세션 일정을 확인하고 등록할 수 있습니다. 기업용 맞춤형 세션이 필요하시다면 [별도로 문의해 주세요](https://mainmatter.com/contact/).

혼자서도 충분히 수강할 수 있지만, 혹시 막히는 부분이 있다면 주변 동료나 멘토에게 도움을 받는 것도 좋은 방법입니다. 모든 연습 문제의 정답은 [GitHub 저장소의 `solutions` 브랜치](https://github.com/mainmatter/100-exercises-to-learn-rust/tree/solutions)에서 확인하실 수 있습니다.

## 제공 형식

과정 자료는 [웹 브라우저](https://rust-exercises.com/100-exercises/)에서 바로 보실 수 있습니다. 종이책으로 소장하고 싶다면 [Amazon에서 페이퍼백 버전](https://www.amazon.com/dp/B0DJ14KQQG/)을 구매하실 수도 있습니다.

## 과정 구성

화면 왼쪽 메뉴를 보면 과정이 여러 섹션으로 나뉘어 있는 것을 알 수 있습니다. 각 섹션에서는 Rust의 새로운 개념이나 기능을 소개하며, 이해도를 확인할 수 있는 연습 문제가 포함되어 있습니다.

연습 문제는 [함께 제공되는 GitHub 저장소](https://github.com/mainmatter/100-exercises-to-learn-rust)에서 내려받을 수 있습니다. 시작하기 전에 먼저 저장소를 로컬 컴퓨터로 복제(Clone)해 주세요.

```bash
# GitHub에 SSH 키가 설정되어 있는 경우 git clone git@github.com:partrita/100-exercises-to-learn-rust.git
# 그렇지 않다면 HTTPS URL을 사용하세요.
#   https://github.com/partrita/100-exercises-to-learn-rust.git
# GitHub CLI를 사용하는 경우 gh repo clone partrita/100-exercises-to-learn-rust
```

진행 상황을 관리하고 나중에 원본 저장소의 업데이트를 쉽게 반영할 수 있도록, 별도의 브랜치를 만들어 작업하시는 것을 추천합니다.

```bash
cd 100-exercises-to-learn-rust
git checkout -b my-solutions
```

모든 연습 문제는 `exercises` 폴더 안에 있습니다. 각 문제는 하나의 Rust 패키지로 구성되어 있으며, `src/lib.rs` 파일에 문제 설명과 지침이 들어 있습니다. 코드를 작성한 후 함께 포함된 테스트 스위트를 실행하여 정답 여부를 자동으로 확인할 수 있습니다.

### 준비물

과정을 진행하려면 다음 도구들이 필요합니다.

- [**Rust**](https://www.rust-lang.org/tools/install)
  이미 `rustup`이 설치되어 있다면 `rustup update`를 실행해 최신 안정 버전(stable)인지 확인해 주세요.
- **IDE (권장)**
  코드 자동 완성 기능을 지원하는 편집기를 사용하면 훨씬 편합니다. 다음 중 하나를 추천합니다.
  - [RustRover](https://www.jetbrains.com/rust/)
  - [`rust-analyzer`](https://marketplace.visualstudio.com/items?itemName=matklad.rust-analyzer) 확장 프로그램이 설치된 [Visual Studio Code](https://code.visualstudio.com)

### 워크숍 러너 `wr`

연습 문제 풀이를 돕고 정답을 확인해 주는 전용 도구인 `wr` CLI(Workshop Runner)를 제공합니다.
[웹사이트](https://mainmatter.github.io/rust-workshop-runner/)의 안내에 따라 `wr`을 설치해 주세요.

설치가 끝났다면 터미널에서 저장소 폴더로 이동한 뒤, 다음 명령어를 실행해 과정을 시작합니다.

```bash
wr
```

`wr`은 현재 풀고 있는 연습 문제의 정답 여부를 확인해 줍니다. 현재 섹션의 문제를 완벽히 이해하고 해결한 뒤에 다음 섹션으로 넘어가시는 것이 좋습니다.

> **팁:** 문제를 풀 때마다 Git에 커밋해 두는 습관을 들여보세요.
> 진행 상황을 한눈에 볼 수 있고, 나중에 특정 지점부터 다시 시작하고 싶을 때 유용합니다.

자, 이제 Rust의 세계를 즐겨보세요!

## 저자 소개

이 과정은 [Mainmatter](https://mainmatter.com/rust-consulting/)의 수석 엔지니어링 컨설턴트인 [Luca Palmieri](https://www.lpalmieri.com/)가 만들었습니다.
Luca는 2018년부터 TrueLayer와 AWS 등에서 Rust 전문가로 활동해 왔습니다. 또한 Rust 백엔드 개발의 필독서로 꼽히는 ["Zero to Production in Rust"](https://zero2prod.com)의 저자이기도 합니다. 오픈 소스 생태계에서도 [`cargo-chef`](https://github.com/LukeMathWalker/cargo-chef), [Pavex](https://pavex.dev), [`wiremock`](https://github.com/LukeMathWalker/wiremock-rs) 등 다양한 프로젝트를 만들고 유지 관리하고 있습니다.
