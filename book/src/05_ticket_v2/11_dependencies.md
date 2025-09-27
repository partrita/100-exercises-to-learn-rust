# 의존성

패키지는 `Cargo.toml` 파일의 `[dependencies]` 섹션에 다른 패키지를 나열하여 의존할 수 있습니다.
의존성을 지정하는 가장 일반적인 방법은 이름과 버전을 제공하는 것입니다:

```toml
[dependencies]
thiserror = "1"
```

이렇게 하면 `thiserror`가 패키지에 **최소** 버전 `1.0.0`으로 의존성으로 추가됩니다.
`thiserror`는 Rust의 공식 패키지 레지스트리인 [crates.io](https://crates.io)에서 가져옵니다.
`cargo build`를 실행하면 `cargo`는 몇 가지 단계를 거칩니다:

- 의존성 해결
- 의존성 다운로드
- 프로젝트 컴파일 (자체 코드 및 의존성)

프로젝트에 `Cargo.lock` 파일이 있고 매니페스트 파일이 변경되지 않은 경우 의존성 해결은 건너뜁니다.
락파일은 성공적인 의존성 해결 라운드 후에 `cargo`에 의해 자동으로 생성됩니다. 여기에는 프로젝트에서 사용되는 모든 의존성의 정확한 버전이 포함되어 있으며, 다른 빌드(예: CI)에서 동일한 버전이 일관되게 사용되도록 보장하는 데 사용됩니다. 여러 개발자와 함께 프로젝트에서 작업하는 경우 `Cargo.lock` 파일을 버전 제어 시스템에 커밋해야 합니다.

`cargo update`를 사용하여 `Cargo.lock` 파일을 모든 의존성의 최신 (호환 가능한) 버전으로 업데이트할 수 있습니다.

### 경로 의존성

**경로**를 사용하여 의존성을 지정할 수도 있습니다. 이는 여러 로컬 패키지에서 작업할 때 유용합니다.

```toml
[dependencies]
my-library = { path = "../my-library" }
```

경로는 의존성을 선언하는 패키지의 `Cargo.toml` 파일을 기준으로 합니다.

### 다른 소스

의존성을 가져올 수 있는 위치와 `Cargo.toml` 파일에 지정하는 방법에 대한 자세한 내용은 [Cargo 문서](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html)를 확인하십시오.

## 개발 의존성

개발에만 필요한 의존성을 지정할 수도 있습니다. 즉, `cargo test`를 실행할 때만 가져옵니다.
`Cargo.toml` 파일의 `[dev-dependencies]` 섹션에 있습니다:

```toml
[dev-dependencies]
static_assertions = "1.1.0"
```

우리는 테스트를 단축하기 위해 책 전체에서 이들 중 일부를 사용해 왔습니다.