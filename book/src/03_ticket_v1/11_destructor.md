# 소멸자

힙을 소개할 때, 할당한 메모리를 해제할 책임이 있다고 언급했습니다.\
차용 검사기를 소개할 때, Rust에서는 메모리를 직접 관리할 필요가 거의 없다고도 말했습니다.

이 두 진술은 처음에는 모순적으로 보일 수 있습니다.
**스코프**와 **소멸자**를 도입하여 어떻게 함께 맞는지 살펴봅시다.

## 스코프

변수의 **스코프**는 해당 변수가 유효하거나 **살아있는** Rust 코드 영역입니다.

변수의 스코프는 선언과 함께 시작됩니다.
다음 중 하나가 발생하면 끝납니다:

1. 변수가 선언된 블록(즉, `{}` 사이의 코드)이 끝날 때
   ```rust
   fn main() {
      // `x`는 아직 여기 범위에 없습니다
      let y = "Hello".to_string();
      let x = "World".to_string(); // <-- x의 범위는 여기서 시작됩니다...
      let h = "!".to_string(); //   |
   } //  <-------------- ...그리고 여기서 끝납니다
   ```
2. 변수의 소유권이 다른 사람(예: 함수 또는 다른 변수)에게 이전될 때
   ```rust
   fn compute(t: String) {
      // 무언가 수행 [...]
   }

   fn main() {
       let s = "Hello".to_string(); // <-- s의 범위는 여기서 시작됩니다...
                   //                    |
       compute(s); // <------------------- ..그리고 여기서 끝납니다
                   //   `s`가 `compute`로 이동되었기 때문입니다
   }
   ```

## 소멸자

값의 소유자가 범위를 벗어나면 Rust는 해당 **소멸자**를 호출합니다.\
소멸자는 해당 값이 사용한 리소스, 특히 할당한 모든 메모리를 정리하려고 시도합니다.

`std::mem::drop`에 전달하여 값의 소멸자를 수동으로 호출할 수 있습니다.\
이것이 Rust 개발자들이 값이 범위를 벗어나고 소멸자가 호출되었음을 나타내는 방법으로 "해당 값이 **삭제**되었습니다"라고 자주 말하는 이유입니다.

### 삭제 지점 시각화

컴파일러가 우리를 위해 수행하는 작업을 "명시"하기 위해 명시적인 `drop` 호출을 삽입할 수 있습니다. 이전 예제로 돌아가 보겠습니다:

```rust
fn main() {
   let y = "Hello".to_string();
   let x = "World".to_string();
   let h = "!".to_string();
}
```

다음과 같습니다:

```rust
fn main() {
   let y = "Hello".to_string();
   let x = "World".to_string();
   let h = "!".to_string();
   // 변수는 선언의 역순으로 삭제됩니다
   drop(h);
   drop(x);
   drop(y);
}
```

`s`의 소유권이 `compute`로 이전되는 두 번째 예제를 살펴봅시다:

```rust
fn compute(s: String) {
   // 무언가 수행 [...]
}

fn main() {
   let s = "Hello".to_string();
   compute(s);
}
```

다음과 같습니다:

```rust
fn compute(t: String) {
    // 무언가 수행 [...]
    drop(t); // <-- `t`가 이 지점 이전에 삭제되거나 이동되지 않았다고 가정하면,
             //     컴파일러는 범위를 벗어날 때 여기서 `drop`을 호출합니다
}

fn main() {
    let s = "Hello".to_string();
    compute(s);
}
```

차이점을 주목하십시오: `main`에서 `compute`가 호출된 후 `s`가 더 이상 유효하지 않더라도 `main`에는 `drop(s)`가 없습니다.
값의 소유권을 함수에 이전하면 **정리 책임도 이전**하는 것입니다.

이렇게 하면 값에 대한 소멸자가 **최대[^leak] 한 번** 호출되도록 보장하여 [이중 해제 버그](https://owasp.org/www-community/vulnerabilities/Doubly_freeing_memory)를 설계상 방지합니다.

### 삭제 후 사용

삭제된 값을 사용하려고 하면 어떻게 될까요?

```rust
let x = "Hello".to_string();
drop(x);
println!("{}", x);
```

이 코드를 컴파일하려고 하면 오류가 발생합니다:

```rust
error[E0382]: use of moved value: `x`
 --> src/main.rs:4:20
  | 
3 |     drop(x);
  |          - value moved here
4 |     println!("{}", x);
  |                    ^ value used here after move
```

Drop은 호출된 값을 **소비**합니다. 즉, 호출 후에는 값이 더 이상 유효하지 않습니다.\
따라서 컴파일러는 사용을 방지하여 [해제 후 사용 버그](https://owasp.org/www-community/vulnerabilities/Using_freed_memory)를 방지합니다.

### 참조 삭제

변수에 참조가 포함되어 있으면 어떻게 될까요?\n예를 들어:

```rust
let x = 42i32;
let y = &x;
drop(y);
```

`drop(y)`를 호출하면... 아무 일도 일어나지 않습니다.\
실제로 이 코드를 컴파일하려고 하면 경고가 발생합니다:

```text
warning: calls to `std::mem::drop` with a reference 
         instead of an owned value does nothing
 --> src/main.rs:4:5
  | 
4 |     drop(y);
  |     ^^^^^-^
  |          |
  |          argument has type `&i32`
  | 
```

이것은 우리가 이전에 말한 것으로 돌아갑니다: 우리는 소멸자를 한 번만 호출하고 싶습니다.\
동일한 값에 대한 여러 참조를 가질 수 있습니다. 그 중 하나가 범위를 벗어날 때 가리키는 값에 대한 소멸자를 호출하면 다른 참조는 어떻게 될까요?
더 이상 유효하지 않은 메모리 위치를 참조하게 됩니다. 소위 [**댕글링 포인터**](https://en.wikipedia.org/wiki/Dangling_pointer)는 [**해제 후 사용 버그**](https://owasp.org/www-community/vulnerabilities/Using_freed_memory)의 가까운 친척입니다.
Rust의 소유권 시스템은 이러한 종류의 버그를 설계상 배제합니다.

[^leak]: Rust는 소멸자가 실행될 것이라고 보장하지 않습니다. 예를 들어, 명시적으로 [메모리 누수](../07_threads/03_leak.md)를 선택하면 실행되지 않습니다.