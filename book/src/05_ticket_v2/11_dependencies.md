# 의존성 (Dependencies)

Rust 프로젝트에서는 `Cargo.toml` 파일의 `[dependencies]` 섹션에 다른 패키지를 나열하여 도움을 받을 수 있습니다. 가장 일반적인 방법은 아래와 같이 이름과 버전을 적어주는 것입니다.

```toml
[dependencies]
thiserror = "1"
```

위의 예시는 `thiserror` 크레이트의 **최소** `1.0.0` 버전을 프로젝트의 의존성(Dependency)으로 추가하겠다는 뜻입니다.
Rust는 기본적으로 공식 패키지 저장소인 [crates.io](https://crates.io)에서 이 크레이트들을 가져옵니다.

`cargo build`를 실행하면 `cargo`는 다음과 같은 과정을 거칩니다.

- **의존성 해결(Dependency Resolution)**: 필요한 크레이트들의 버전을 맞추는 작업
- **다운로드**: 크레이트들을 가져오는 작업
- **컴파일**: 여러분의 코드와 가져온 의존성들을 함께 빌드하는 작업

만약 `Cargo.lock` 파일이 있고 `Cargo.toml` 파일의 의존성 정보가 바뀌지 않았다면, `cargo`는 의존성 해결 단계를 건너뜁니다.
**락파일(Lockfile)**인 `Cargo.lock`은 의존성 해결이 성공적으로 끝난 뒤 자동으로 생성됩니다. 여기에는 여러분의 프로젝트에서 사용되는 모든 의존성의 **정확한 버전**이 기록되어 있죠. 덕분에 다른 환경(예: 다른 개발자의 컴퓨터나 CI 서버)에서도 항상 똑같은 버전의 라이브러리를 사용해 빌드할 수 있게 됩니다. 따라서 협업할 때는 `Cargo.lock` 파일을 버전 관리 시스템(Git 등)에 꼭 포함시켜야 합니다.

의존성들을 최신 버전(호환 가능한 범위 내)으로 업데이트하고 싶다면 `cargo update` 명령어를 사용하세요.

### 경로 의존성 (Path Dependencies)

같은 컴퓨터에 있는 다른 로컬 패키지를 의존성으로 추가할 수도 있습니다. 여러 패키지로 구성된 프로젝트를 진행할 때 유용합니다.

```toml
[dependencies]
my-library = { path = "../my-library" }
```

여기서 경로는 `Cargo.toml` 파일의 위치를 기준으로 합니다.

### 기타 소스

의존성을 가져올 수 있는 더 다양한 방법은 [Cargo 공식 문서](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html)에서 확인해 보세요.

## 개발 의존성 (Dev Dependencies)

실제 프로그램 실행에는 필요 없지만, 개발 단계(특히 테스트)에서만 필요한 라이브러리들도 있습니다. 이런 것들은 `Cargo.toml`의 `[dev-dependencies]` 섹션에 적어줍니다.

```toml
[dev-dependencies]
static_assertions = "1.1.0"
```

이 섹션에 선언된 의존성들은 `cargo test`를 실행할 때만 불러옵니다. 이 책에서도 테스트 코드를 더 깔끔하게 작성하기 위해 일부 개발 의존성을 사용하고 있답니다.