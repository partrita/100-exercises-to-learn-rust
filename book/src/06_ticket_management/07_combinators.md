# 조합자(Combinators)

반복자(Iterator)는 단순한 `for` 루프 그 이상의 능력을 갖추고 있습니다! `Iterator` 트레이트 문서를 살펴보면 반복자를 변환하고, 필터링하고, 결합하는 데 사용할 수 있는 **엄청나게 많은** 메서드들을 발견할 수 있습니다.

자주 사용되는 몇 가지를 살펴볼까요?

- **`map`**: 반복자의 각 요소에 함수를 적용하여 변환합니다.
- **`filter`**: 특정 조건을 만족하는 요소만 남깁니다.
- **`filter_map`**: `filter`와 `map`을 한 번에 수행합니다.
- **`cloned`**: 참조를 반복하는 반복자를 값을 직접 다루는 반복자로 바꾸며 각 요소를 복제합니다.
- **`enumerate`**: `(인덱스, 값)` 쌍을 만들어 주는 새로운 반복자를 반환합니다.
- **`skip`**: 처음 `n`개의 요소를 건너뜁니다.
- **`take`**: `n`개의 요소만 가져오고 반복을 멈춥니다.
- **`chain`**: 두 개의 반복자를 하나로 이어 붙입니다.

이런 메서드들을 **조합자(Combinators)**라고 부릅니다. 이들은 보통 여러 개를 **연결(Chaining)**하여 복잡한 데이터 변환 과정을 아주 간결하고 읽기 좋게 만들어 줍니다.

```rust
let numbers = vec![1, 2, 3, 4, 5];
// 짝수만 골라내어 그 제곱의 합을 구합니다.
let outcome: u32 = numbers.iter()
    .filter(|&n| n % 2 == 0)
    .map(|&n| n * n)
    .sum();
```

## 클로저(Closures)

위 예제의 `filter`나 `map`에서 사용한 `|...|` 구문은 무엇일까요? 이들은 인수로 **클로저(Closures)**를 전달받습니다.

클로저는 **익명 함수(Anonymous functions)**, 즉 이름이 없는 함수입니다. 우리가 흔히 쓰는 `fn` 구문 대신 `|매개변수| 본문` 형식을 사용해 정의합니다. 본문은 코드 블록(`{}`)일 수도 있고 단일 표현식일 수도 있습니다.

```rust
// 매개변수에 1을 더하는 익명 함수 let add_one = |x| x + 1;

// 중괄호를 써서 블록으로 작성할 수도 있습니다.
let add_one = |x| { x + 1 };
```

클로저는 여러 개의 매개변수를 받을 수 있습니다:

```rust
let add = |x, y| x + y;
let sum = add(1, 2);
```

또한 클로저만의 특별한 능력은 **주변 환경의 변수를 가둘(Capture variables from the environment)** 수 있다는 점입니다.

```rust
let x = 42;
let add_x = |y| x + y; // 주변 변수인 x를 사용합니다.
let sum = add_x(1);
```

필요하다면 매개변수나 반환 타입을 직접 명시해 줄 수도 있습니다:

```rust
// 입력 타입만 지정 let add_one = |x: i32| x + 1;
// 입력과 출력 타입을 모두 지정 (fn 타입 문법 사용)
let add_one: fn(i32) -> i32 = |x| x + 1;
```

## `collect`

조합자를 써서 반복자를 변환했다면, 그다음엔 어떻게 해야 할까요? 변환된 값을 `for` 루프로 다시 돌릴 수도 있지만, 새로운 컬렉션으로 모으고 싶을 때가 많습니다.

이때 사용하는 메서드가 바로 `collect`입니다. `collect`는 반복자를 끝까지 실행하고 그 결과물들을 우리가 원하는 컬렉션(예: `Vec`)에 차곡차곡 담아줍니다.

```rust
let numbers = vec![1, 2, 3, 4, 5];
let squares_of_evens: Vec<u32> = numbers.iter()
    .filter(|&n| n % 2 == 0)
    .map(|&n| n * n)
    .collect();
```

`collect` 메서드는 매우 강력하지만, 어떤 타입의 컬렉션으로 만들지 정해줘야 하는 **제네릭(Generic)** 메서드입니다. 그래서 보통 위 예시처럼 변수 타입(`Vec<u32>`)을 명시해 주거나, 아래처럼 **터보피시 구문(Turbofish syntax)**을 사용하여 타입을 지정해 줍니다.

```rust
let squares_of_evens = numbers.iter()
    .filter(|&n| n % 2 == 0)
    .map(|&n| n * n)
    // 터보피시 구문: `::<타입>()` 
    // `::<>` 모양이 물고기처럼 생겨서 붙여진 이름입니다!
    .collect::<Vec<u32>>();
```

## 더 읽어보기

- [`Iterator` 문서](https://doc.rust-lang.org/std/iter/trait.Iterator.html): 표준 라이브러리에서 반복자에 사용할 수 있는 다양한 메서드들을 확인할 수 있습니다.
- [`itertools` 크레이트](https://docs.rs/itertools/): 기본 제공 기능보다 **더 많은** 강력한 조합자들을 제공하는 유명한 라이브러리입니다.