# 벡터(Vectors)

앞서 본 배열의 가장 큰 장점은 곧 단점이 되기도 합니다. 바로 **크기가 컴파일 시점에 미리 결정되어야 한다**는 점입니다. 런타임에 결정되는 크기로 배열을 만들려고 하면 컴파일 에러가 발생합니다.

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

우리가 만들 티켓 관리 시스템에서는 얼마나 많은 티켓이 저장될지 미리 알 수 없으므로, 배열은 적합하지 않습니다. 이때 필요한 것이 바로 `Vec`입니다.

## 벡터(`Vec`)

`Vec`은 표준 라이브러리에서 제공하는 **확장 가능한(Growable)** 배열 타입입니다.
`Vec::new` 함수를 사용하여 비어 있는 벡터를 만들 수 있습니다.

```rust
let mut numbers: Vec<u32> = Vec::new();
```

그다음 `push` 메서드를 사용하여 요소를 추가할 수 있습니다:

```rust
numbers.push(1);
numbers.push(2);
numbers.push(3);
```

새로 추가된 값은 벡터의 끝에 붙습니다. 만약 생성 시점에 이미 들어갈 값을 알고 있다면 `vec!` 매크로를 사용하는 것이 편리합니다:

```rust
let numbers = vec![1, 2, 3];
```

## 요소 접근

요소에 접근하는 방식은 배열과 동일합니다:

```rust
let numbers = vec![1, 2, 3];
let first = numbers[0];
let second = numbers[1];
let third = numbers[2];
```

인덱스는 `usize` 타입이어야 합니다. 배열과 마찬가지로 `Option<&T>`를 반환하는 `get` 메서드를 사용할 수도 있습니다:

```rust
let numbers = vec![1, 2, 3];
assert_eq!(numbers.get(0), Some(&1));

// 범위를 벗어나면 패닉 대신 `None`을 반환합니다.
assert_eq!(numbers.get(3), None);
```

벡터의 요소 접근 역시 경계 검사(Bounds checking)를 수행하며, 시간 복잡도는 `O(1)`입니다.

## 메모리 구조

`Vec`은 **힙 할당(Heap-allocated)** 데이터 구조입니다. `Vec`을 생성하면 요소들을 담기 위해 힙 메모리를 할당받습니다.

다음 코드를 실행했을 때:

```rust
let mut numbers = Vec::with_capacity(3);
numbers.push(1);
numbers.push(2);
```

메모리 레이아웃은 대략 다음과 같은 모습입니다:

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

벡터(`Vec`)는 내부적으로 다음 세 가지 정보를 관리합니다:

- **포인터(Pointer)**: 요소들이 저장된 힙 메모리 영역의 주소입니다.
- **길이(Length)**: 현재 벡터에 들어 있는 요소의 개수입니다.
- **용량(Capacity)**: 힙에 예약된 공간에 최대로 들어갈 수 있는 요소의 개수입니다.

이 구조, 어딘가 익숙하지 않나요? 맞습니다. 우리가 앞에서 본 `String`과 완전히 동일합니다! 사실 `String`은 내부적으로 바이트 벡터(`Vec<u8>`)를 감싸서 구현되어 있습니다.

```rust
pub struct String {
    vec: Vec<u8>,
}
```