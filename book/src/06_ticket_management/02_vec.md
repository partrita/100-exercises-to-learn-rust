# 벡터

배열의 강점은 동시에 약점입니다: 크기는 컴파일 타임에 미리 알려져야 합니다.
런타임에만 알려진 크기로 배열을 만들려고 하면 컴파일 오류가 발생합니다:

```rust
let n = 10;
let numbers: [u32; n];
```

```text
error[E0435]: attempt to use a non-constant value in a constant
 --> src/main.rs:3:20
  |
2 | let n = 10;
3 | let numbers: [u32; n];
  |                    ^ non-constant value
```

배열은 우리의 티켓 관리 시스템에는 작동하지 않을 것입니다. 컴파일 타임에 얼마나 많은 티켓을 저장해야 할지 모르기 때문입니다.
이때 `Vec`이 등장합니다.

## `Vec`

`Vec`은 표준 라이브러리에서 제공하는 확장 가능한 배열 타입입니다.
`Vec::new` 함수를 사용하여 빈 배열을 만들 수 있습니다:

```rust
let mut numbers: Vec<u32> = Vec::new();
```

그런 다음 `push` 메소드를 사용하여 벡터에 요소를 푸시할 수 있습니다:

```rust
numbers.push(1);
numbers.push(2);
numbers.push(3);
```

새로운 값은 벡터의 끝에 추가됩니다.
생성 시 값을 알고 있다면 `vec!` 매크로를 사용하여 초기화된 벡터를 만들 수도 있습니다:

```rust
let numbers = vec![1, 2, 3];
```

## 요소 접근

요소에 접근하는 구문은 배열과 동일합니다:

```rust
let numbers = vec![1, 2, 3];
let first = numbers[0];
let second = numbers[1];
let third = numbers[2];
```

인덱스는 `usize` 타입이어야 합니다.
`Option<&T>`를 반환하는 `get` 메소드를 사용할 수도 있습니다:

```rust
let numbers = vec![1, 2, 3];
assert_eq!(numbers.get(0), Some(&1));
// 범위를 벗어난 인덱스에 접근하려고 하면 패닉 대신
// `None`을 얻게 됩니다.
assert_eq!(numbers.get(3), None);
```

접근은 배열의 요소 접근과 마찬가지로 경계 검사가 수행됩니다. `O(1)` 복잡도를 가집니다.

## 메모리 레이아웃

`Vec`은 힙 할당 데이터 구조입니다.
`Vec`을 생성하면 요소를 저장하기 위해 힙에 메모리를 할당합니다.

다음 코드를 실행하면:

```rust
let mut numbers = Vec::with_capacity(3);
numbers.push(1);
numbers.push(2);
```

다음과 같은 메모리 레이아웃을 얻게 됩니다:

```text
      +---------+--------+----------+
스택  | 포인터  | 길이   | 용량     | 
      |  |      |   2    |    3     |
      +--|------+--------+----------+
         |
         |
         v
       +---+---+---+
힙:   | 1 | 2 | ? |
       +---+---+---+
```

`Vec`은 세 가지를 추적합니다:

- 예약한 힙 영역에 대한 **포인터**.
- 벡터의 **길이**, 즉 벡터에 있는 요소의 수.
- 벡터의 **용량**, 즉 힙에 예약된 공간에 들어갈 수 있는 요소의 수.

이 레이아웃은 익숙하게 보일 것입니다: `String`과 정확히 동일합니다!
이것은 우연이 아닙니다: `String`은 내부적으로 바이트 벡터, 즉 `Vec<u8>`로 정의됩니다:

```rust
pub struct String {
    vec: Vec<u8>,
}
```