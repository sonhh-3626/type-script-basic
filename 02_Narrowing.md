# TypeScript: Narrowing và Union Types

## 1. Union Types và Narrowing trong TypeScript

### 1.1. Khái niệm

*   **Union Type** (`number | string`): Cho phép một biến có thể nhận nhiều kiểu giá trị khác nhau.
*   **Narrowing**: Là quá trình TypeScript phân tích luồng điều khiển của code (ví dụ: `typeof`, `if`, `switch`,…) để thu hẹp kiểu của một biến về một loại cụ thể hơn tại một thời điểm nhất định.

### 1.2. Ví dụ với `padLeft`

#### Đề bài

Hãy viết một hàm `padLeft` nhận vào `padding` (kiểu `number | string`) và `input` (kiểu `string`).
Nếu `padding` là số, nó sẽ thêm số lượng khoảng trắng tương ứng vào đầu `input`.
Nếu `padding` là chuỗi, nó sẽ thêm chuỗi `padding` vào đầu `input`.

#### Triển khai ban đầu và lỗi

```typescript
function padLeft(padding: number | string, input: string): string {
  // Lỗi: Argument of type 'string | number' is not assignable to parameter of type 'number'.
  // Type 'string' is not assignable to type 'number'.
  return " ".repeat(padding) + input;
}
```

TypeScript báo lỗi vì `repeat` chỉ chấp nhận kiểu `number`, nhưng `padding` có thể là `string`.

#### Sử dụng Type Guard `typeof` để Narrowing

```typescript
function padLeft(padding: number | string, input: string): string {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input; // padding ở đây là number
  }
  return padding + input; // padding ở đây là string
}
```

**Giải thích:**
*   Khi `typeof padding === "number"`, TypeScript hiểu rõ `padding` lúc đó chỉ còn là `number`.
*   Khi không phải số, nó suy ra `padding` là `string`.
*   Đây chính là một **type guard**.

#### Câu hỏi tư duy

*   Nếu truyền vào `padLeft(true, "hello")`, chuyện gì sẽ xảy ra? Vì sao?
*   TypeScript sẽ báo lỗi nếu dùng `padding.repeat(3)` trong nhánh `if (typeof padding === "number")`. Tại sao?
*   Nếu muốn `padding` có thể là `boolean` nữa, bạn sẽ sửa code thế nào?

#### Ứng dụng thực tế

*   **UI/Frontend**: Thêm khoảng trắng hoặc ký tự padding cho username trong một danh sách để chúng đều nhau.
*   **CLI tool**: In log ra terminal, canh lề trái bằng dấu `-` hoặc `*`.
*   **Form Validation**: Khi nhận dữ liệu từ API, có thể là số (ví dụ: 3 spaces) hoặc chuỗi (ví dụ: "--").

**Ví dụ:**

```typescript
console.log(padLeft(5, "User"));   // "     User"
console.log(padLeft(">>", "User")); // ">>User"
```

#### Bug thường gặp

*   **Quên check kiểu**: Gọi `"".repeat(padding)` khi `padding` chưa chắc là số.
*   **So sánh sai**: Dùng `if (padding)` thay vì `if (typeof padding === "number")`. (Vì `"0"` vẫn là truthy).
*   **Không xử lý hết các loại**: Thêm `boolean` vào union type mà quên xử lý trong code.

#### Bài tập nhỏ

Viết hàm `formatId` với yêu cầu sau:
*   Nhận tham số `id`: `number | string`.
*   Nếu là số → thêm prefix `"ID-"` và đảm bảo có 5 chữ số (ví dụ: `7` → `"ID-00007"`).
*   Nếu là chuỗi → giữ nguyên nhưng ép về uppercase.

**Ví dụ:**

```typescript
formatId(7);         // "ID-00007"
formatId(123);       // "ID-00123"
formatId("abc123");  // "ABC123"
```

## 2. `typeof` và Type Guards

### 2.1. `typeof` trong JavaScript

Toán tử `typeof` trong JavaScript trả về một trong các chuỗi sau:

*   `"string"`
*   `"number"`
*   `"bigint"`
*   `"boolean"`
*   `"symbol"`
*   `"undefined"`
*   `"object"` (⚠️ bao gồm cả `null` và `Array`)
*   `"function"`

**Điều đáng chú ý:**
*   `typeof null === "object"`: Đây là một lỗi lịch sử trong JavaScript và không thể sửa vì lý do tương thích.
*   `typeof [] === "object"`: Mảng cũng là một kiểu đối tượng trong JavaScript.

### 2.2. TypeScript hiểu `typeof` như một Type Guard

#### Ví dụ lỗi với `printAll`

```typescript
function printAll(strs: string | string[] | null) {
  if (typeof strs === "object") {
    for (const s of strs) { // ❌ Lỗi: 'strs' is possibly 'null'.
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}
```

**Giải thích lỗi:**
Ở nhánh `if (typeof strs === "object")`, TypeScript thu hẹp kiểu của `strs` thành `string[] | null` (chứ không phải chỉ `string[]`). Do đó, khi lặp qua `strs`, TypeScript cảnh báo rằng `strs` có thể là `null`, dẫn đến lỗi runtime nếu `strs` thực sự là `null`.

#### Cách sửa đúng

##### Cách 1: Kiểm tra `null` rõ ràng

```typescript
function printAll(strs: string | string[] | null) {
  if (typeof strs === "object" && strs !== null) {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}
```

##### Cách 2: Dùng “Truthiness Check” (ngắn gọn hơn)

```typescript
function printAll(strs: string | string[] | null) {
  if (strs) { // truthy => loại trừ null và undefined
    if (typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else {
      console.log(strs);
    }
  }
}
```

### 2.3. Câu hỏi tư duy

*   Tại sao `typeof null` lại trả về `"object"` thay vì `"null"`?
*   Khi viết `if (strs)` trong ví dụ trên, có trường hợp nào `strs` là `"0"` hoặc `""` (chuỗi rỗng) mà bị coi là falsy không? Nó có ảnh hưởng đến kết quả không?
*   Nếu muốn kiểm tra riêng cho `Array`, bạn sẽ viết thế nào trong TypeScript?

### 2.4. Ứng dụng thực tế

*   **API Response**: Dữ liệu trả về có thể là `null`, `string`, hoặc một mảng kết quả.
*   **Form Input**: Người dùng có thể nhập một chuỗi, một danh sách nhiều giá trị, hoặc không nhập gì (`null`).
*   **Logging/Debug**: In ra dữ liệu bất kể nó là gì, nhưng phải tránh lỗi khi `null`.

### 2.5. Bug thường gặp

*   **Quên check `null`** khi dùng `typeof === "object"`.
*   **Dùng `if (strs)`** để loại trừ `null` nhưng quên rằng chuỗi rỗng `""` cũng là falsy.
*   **Nhầm lẫn giữa `Array.isArray()`** và `typeof arr === "array"` (lưu ý: không tồn tại `"array"` trong `typeof`).

### 2.6. Bài tập nhỏ

Viết hàm `processValue` nhận tham số `val: string | number[] | null`.
*   Nếu là `string` → in ra chữ in hoa.
*   Nếu là `number[]` → in ra tổng các số.
*   Nếu là `null` → in `"No value"`.

**Ví dụ:**

```typescript
processValue("hello");     // "HELLO"
processValue([1, 2, 3]);   // 6
processValue(null);        // "No value"
```

## 3. `Array.isArray` Type Guard

Để kiểm tra một biến có phải là `Array` hay không, ta không dùng `typeof` vì `typeof [] === "object"`, không phân biệt được mảng với các đối tượng thông thường. Thay vào đó, ta sử dụng `Array.isArray()` trong JavaScript/TypeScript chuẩn.

### 3.1. Ví dụ với `Array.isArray()`

```typescript
function printAll(strs: string | string[] | null) {
  if (Array.isArray(strs)) {
    // Lúc này TypeScript hiểu strs chắc chắn là string[]
    for (const s of strs) {
      console.log(s.toUpperCase());
    }
  } else if (typeof strs === "string") {
    console.log(strs.toUpperCase());
  } else {
    console.log("No value");
  }
}
```

**Giải thích:**
`Array.isArray(strs)` là một type guard giúp TypeScript thu hẹp kiểu của `strs` về `string[]`.

### 3.2. Câu hỏi tư duy

*   Nếu thay `Array.isArray(strs)` bằng `typeof strs === "object"`, thì TypeScript sẽ báo lỗi gì?
*   Nếu type là `string | number[] | null`, thì `Array.isArray(val)` sẽ thu hẹp type thành gì?

### 3.3. Ứng dụng thực tế

*   **API trả về dữ liệu**: Có thể trả về `"error"`, `null`, hoặc danh sách kết quả (`string[]`).
*   **Form Input**: Ô nhập có thể cho một chuỗi đơn hoặc nhiều giá trị (mảng).
*   **Search Filter**: Người dùng có thể chọn 1 từ khóa (`string`) hoặc nhiều từ khóa (`string[]`).

## 4. Truthiness Narrowing

### 4.1. Truthiness trong JavaScript

Trong JavaScript, bất kỳ giá trị nào khi đặt trong điều kiện (`if`, `&&`, `||`, `!`) đều sẽ được ép kiểu (coerce) thành `boolean`.

**Các giá trị falsy (bị coi là `false`):**
*   `0`
*   `NaN`
*   `""` (chuỗi rỗng)
*   `0n` (BigInt zero)
*   `null`
*   `undefined`

**Mọi giá trị khác là truthy (bị coi là `true`).**

**Ví dụ:**

```typescript
Boolean("hello"); // true
!!"world";        // true (và type: true trong TypeScript)
Boolean("");      // false
```

### 4.2. Truthiness Narrowing trong TypeScript

TypeScript theo dõi điều kiện và thu hẹp kiểu dựa trên giá trị truthy/falsy.

**Ví dụ:**

```typescript
function getUsersOnlineMessage(numUsersOnline: number) {
  if (numUsersOnline) {
    return `There are ${numUsersOnline} online now!`;
  }
  return "Nobody's here. :(";
}

getUsersOnlineMessage(0);   // "Nobody's here. :("
getUsersOnlineMessage(5);   // "There are 5 online now!"
```

*   Trong nhánh `if (numUsersOnline)`, TypeScript biết `numUsersOnline !== 0`.
*   Trong nhánh `else`, TypeScript hiểu `numUsersOnline === 0`.

### 4.3. Ứng dụng trong `printAll`

```typescript
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}
```

Kiểm tra `strs && ...` giúp loại bỏ `null`, tránh lỗi `TypeError: null is not iterable`.

### 4.4. Cạm bẫy của Truthiness

Nếu bạn viết:

```typescript
function printAll(strs: string | string[] | null) {
  if (strs) {
    if (typeof strs === "object") {
      // ...
    } else if (typeof strs === "string") {
      console.log(strs);
    }
  }
}
```

Lúc này `""` (chuỗi rỗng) cũng bị loại bỏ vì nó là falsy. Điều đó có nghĩa là `""` và `null` đều bị bỏ qua, dẫn đến mất trường hợp xử lý chuỗi rỗng.

**Kết luận:** Truthiness check không nên dùng bừa bãi cho mọi loại primitive (nhất là `string` và `number`) nếu bạn cần phân biệt giữa giá trị `0` hoặc `""` với `null`/`undefined`.

### 4.5. Ví dụ khác: Boolean negation

```typescript
function multiplyAll(values: number[] | undefined, factor: number) {
  if (!values) {
    return values; // undefined
  } else {
    return values.map((x) => x * factor);
  }
}
```

*   `!values` thu hẹp type thành `undefined`.
*   Nhánh `else` thu hẹp thành `number[]`.

### 4.6. Câu hỏi tư duy

*   Tại sao `if (strs)` có thể bỏ qua trường hợp `""` (chuỗi rỗng)?
*   Nếu `values: number[] | undefined | null`, code `if (!values)` có còn chính xác không?
*   Với `0` là falsy, có trường hợp nào `if (count)` gây bug logic không?

### 4.7. Ứng dụng thực tế

*   **Frontend Form Validation**: Kiểm tra input rỗng (`""`) khác với `null` (chưa nhập).
*   **API Response**: Có thể trả về `[]` (mảng rỗng, hợp lệ) hoặc `null` (không có dữ liệu).
*   **UI Rendering**: Nếu `users.length === 0` thì hiển thị `"No users"`, nhưng không muốn nhầm với `users = null`.

### 4.8. Bài tập nhỏ

Viết hàm `showLength` nhận tham số `data: string | any[] | null | undefined`.
*   Nếu là `string` → in ra `"Length: X"`.
*   Nếu là `array` → in ra `"Items: X"`.
*   Nếu là `null` hoặc `undefined` → in ra `"No data"`.
⚠️ Nhớ phân biệt `""` (chuỗi rỗng, `length = 0`) với `null`.

**Ví dụ:**

```typescript
showLength("hello");   // "Length: 5"
showLength("");        // "Length: 0"
showLength([1, 2, 3]);   // "Items: 3"
showLength([]);        // "Items: 0"
showLength(null);      // "No data"
```

## 5. Equality Narrowing

### 5.1. Nguyên tắc

TypeScript có thể thu hẹp kiểu khi ta dùng các phép so sánh:
*   `===` / `!==` (so sánh nghiêm ngặt)
*   `==` / `!=` (so sánh lỏng lẻo, nhưng TypeScript vẫn hiểu cách chúng hoạt động trong JavaScript)
*   `switch` statements cũng dựa trên cơ chế này.

### 5.2. Ví dụ cơ bản

```typescript
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // Chỉ có "string" là kiểu chung giữa x và y
    x.toUpperCase(); // x: string
    y.toLowerCase(); // y: string
  } else {
    console.log(x); // x: string | number
    console.log(y); // y: string | boolean
  }
}
```

**Giải thích:**
Trong nhánh `if (x === y)`, TypeScript hiểu rằng `x` và `y` chắc chắn phải có cùng kiểu. Kiểu chung duy nhất mà cả `x` và `y` có thể nhận là `string`. Do đó, TypeScript thu hẹp cả hai biến thành `string`.

### 5.3. Kiểm tra giá trị literal

Ví dụ `printAll` với kiểm tra `null`:

```typescript
function printAll(strs: string | string[] | null) {
  if (strs !== null) {
    if (typeof strs === "object") {
      for (const s of strs) {
        console.log(s); // strs: string[]
      }
    } else if (typeof strs === "string") {
      console.log(strs); // strs: string
    }
  }
}
```

Ở đây `if (strs !== null)` đã loại bỏ `null`. Trong nhánh `typeof strs === "object"`, `strs` được thu hẹp thành `string[]`. Trong nhánh `typeof strs === "string"`, `strs` được thu hẹp thành `string`.

### 5.4. Equality lỏng lẻo (`==`, `!=`)

JavaScript có những "quirks" với `==` và `!=`, nhưng TypeScript vẫn hiểu được cách thu hẹp kiểu.

**Ví dụ:**

```typescript
interface Container {
  value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
  if (container.value != null) {
    // Loại bỏ cả null và undefined
    console.log(container.value); // container.value: number
    container.value *= factor;
  }
}
```

Ở đây, `container.value != null` có nghĩa là `value` không phải `null` và không phải `undefined`. Do đó, trong nhánh này `container.value` được thu hẹp thành `number`.

### 5.5. Lưu ý khi dùng Equality Narrowing

*   Ưu tiên `===` / `!==` vì an toàn và rõ ràng hơn.
*   `== null` / `!= null` là ngoại lệ hữu ích, vì nó kiểm tra được cả `null` và `undefined`.
*   Tránh lạm dụng `==` / `!=` với các kiểu khác, vì dễ dính bug ép kiểu (ví dụ: `0 == false`, `"0" == 0`…).

### 5.6. Câu hỏi tư duy

*   Trong ví dụ `example(x, y)`, tại sao TypeScript không thu hẹp `x` thành `number` khi `y: boolean`?
*   Nếu ta viết `if (x !== y)` thì trong nhánh này TypeScript sẽ giữ type ban đầu hay thu hẹp?
*   Khi nào `== null` có lợi hơn `=== null`?

### 5.7. Ứng dụng thực tế

*   **API Data**: API có thể trả về `null` hoặc `undefined` cho một trường, nhưng khi chắc chắn khác `null` thì ta có thể xử lý luôn như `number`/`string`.
*   **Form Input**: Phân biệt `""` (chuỗi rỗng) với `null` (chưa nhập) hoặc `undefined` (chưa khởi tạo).
*   **Switch-case**: Xử lý nhiều giá trị literal của union type.

**Ví dụ với `switch`:**

```typescript
type ShapeKind = "circle" | "square" | "triangle";

function getArea(shape: ShapeKind, size: number) {
  switch (shape) {
    case "circle": return Math.PI * size * size;
    case "square": return size * size;
    case "triangle": return (size * size) / 2;
  }
}
```

### 5.8. Bài tập nhỏ

Viết hàm `handleInput` nhận tham số `input: string | number | null | undefined`.
*   Nếu `input === null` hoặc `input === undefined` → trả về `"No input"`.
*   Nếu là `string` → trả về `"STRING: <giá trị viết hoa>"`.
*   Nếu là `number` → trả về `"NUMBER: <giá trị * 2>"`.

**Ví dụ:**

```typescript
handleInput(null);       // "No input"
handleInput(undefined);  // "No input"
handleInput("hello");    // "STRING: HELLO"
handleInput(5);          // "NUMBER: 10"
```

## 6. `in` Operator Narrowing

### 6.1. Nguyên tắc

Trong JavaScript, toán tử `"prop" in obj` kiểm tra xem đối tượng `obj` (hoặc chuỗi prototype của nó) có thuộc tính `"prop"` hay không.

Trong TypeScript, toán tử `in` cũng được dùng để thu hẹp kiểu:
*   **Nhánh `true`**: Chỉ giữ lại những kiểu trong union có thuộc tính đó (bắt buộc hoặc tùy chọn).
*   **Nhánh `false`**: Giữ lại những kiểu còn lại.

### 6.2. Ví dụ cơ bản

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();  // animal: Fish
  }
  return animal.fly();     // animal: Bird
}
```

**Giải thích:**
*   Nếu `"swim" in animal` là `true` → TypeScript hiểu `animal` chắc chắn là `Fish`.
*   Ngược lại → `animal` chắc chắn là `Bird`.

### 6.3. Trường hợp thuộc tính tùy chọn (Optional Property)

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };

function move(animal: Fish | Bird | Human) {
  if ("swim" in animal) {
    // animal: Fish | Human
  } else {
    // animal: Bird | Human
  }
}
```

**Lý do:**
`Human` có cả `swim?` và `fly?`, nên nó nằm trong cả hai nhánh. Vì thuộc tính tùy chọn có thể tồn tại (hoặc không), TypeScript không thể loại bỏ hoàn toàn `Human` khỏi một nhánh nào.

### 6.4. Ứng dụng thực tế

*   **API Response**: Một đối tượng có thể chứa trường `"error"` hoặc `"data"`. Ta dùng `in` để phân biệt.
*   **UI Component**: Một `props` có thể chứa `"onClick"` hoặc `"href"` (ví dụ: `button` so với `link`).
*   **Polymorphism**: Các lớp khác nhau nhưng có thuộc tính đặc thù.

**Ví dụ:**

```typescript
type ErrorResponse = { error: string };
type SuccessResponse = { data: string };

function handleResponse(res: ErrorResponse | SuccessResponse) {
  if ("error" in res) {
    console.error(res.error);
  } else {
    console.log("Data:", res.data);
  }
}
```

### 6.5. Cạm bẫy

*   Nếu thuộc tính là tùy chọn trong nhiều kiểu → kiểu đó sẽ xuất hiện trong nhiều nhánh.
*   `in` check không xác nhận được kiểu dữ liệu của thuộc tính (chỉ kiểm tra sự tồn tại).
*   Với chuỗi prototype, `"toString" in obj` cũng đúng, vì nó tồn tại trong `Object.prototype`.

### 6.6. Câu hỏi tư duy

*   Tại sao trong ví dụ `Human`, TypeScript giữ `Human` ở cả hai nhánh?
*   Nếu có type `Robot = { fly: () => void, charge: () => void }`, thì `"fly" in animal` sẽ thu hẹp thế nào khi union gồm `Bird | Robot`?
*   Trong API, nếu response có thể là `{ ok: true, data: string }` hoặc `{ ok: false, error: string }`, bạn sẽ kiểm tra bằng `"data" in res` hay `"ok" in res`?

### 6.7. Bài tập nhỏ

Viết hàm `operate(vehicle: { drive: () => void } | { sail: () => void })`:
*   Nếu có `"drive"` → gọi `drive()`.
*   Nếu có `"sail"` → gọi `sail()`.

**Test thử:**

```typescript
operate({ drive: () => console.log("Driving...") });
operate({ sail: () => console.log("Sailing...") });
```

## 7. `instanceof` Narrowing

### 7.1. Nguyên tắc

Trong JavaScript, toán tử `x instanceof Foo` kiểm tra xem chuỗi prototype của `x` có chứa `Foo.prototype` hay không.

Trong TypeScript, `instanceof` được xem như một type guard:
*   **Nhánh `true`**: Kiểu được thu hẹp thành lớp tương ứng.
*   **Nhánh `false`**: Loại trừ lớp đó.

### 7.2. Ví dụ cơ bản

```typescript
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString()); // x: Date
  } else {
    console.log(x.toUpperCase()); // x: string
  }
}
```

**Giải thích:**
*   Trong nhánh `if`, TypeScript hiểu `x` là `Date`.
*   Trong nhánh `else`, TypeScript hiểu `x` là `string`.

### 7.3. Dùng với Custom Class

```typescript
class Car {
  drive() { console.log("Driving..."); }
}

class Boat {
  sail() { console.log("Sailing..."); }
}

function move(v: Car | Boat) {
  if (v instanceof Car) {
    v.drive(); // v: Car
  } else {
    v.sail();  // v: Boat
  }
}
```

`instanceof` rất tiện khi union type gồm nhiều class.

### 7.4. So sánh với `typeof` và `in`

*   `typeof`: Chỉ dùng cho kiểu nguyên thủy (`string`, `number`, `boolean`, …).
*   `in`: Kiểm tra thuộc tính tồn tại (phù hợp với object literal hoặc type shape).
*   `instanceof`: Kiểm tra chuỗi prototype (phù hợp với class hoặc built-in constructor).

### 7.5. Ứng dụng thực tế

*   **Xử lý input**: Có thể là đối tượng `Date` hoặc chuỗi ISO date → định dạng khác nhau.
*   **Polymorphic API**: API trả về instance của class `Error` hoặc `Response`.
*   **UI Component**: `prop` có thể là `HTMLElement` hoặc selector string.

### 7.6. Cạm bẫy

*   `instanceof` chỉ hoạt động với đối tượng tạo từ constructor, không dùng được cho kiểu nguyên thủy:
    ```typescript
    "hello" instanceof String;  // false
    new String("hello") instanceof String; // true
    ```
*   Khi làm việc cross-realm (nhiều iframe, nhiều context JS), `instanceof` có thể không đáng tin cậy.
*   Nếu type là union của plain object và class instance → nên dùng `in` hoặc type predicate thay vì `instanceof`.

### 7.7. Câu hỏi tư duy

*   Tại sao `"hello" instanceof String` lại trả về `false`, nhưng `new String("hello")` lại là `true`?
*   Nếu một API có thể trả về `Date | number`, bạn sẽ dùng `instanceof` hay `typeof` để phân biệt? Vì sao?
*   Trong code nhiều iframe, tại sao `instanceof Date` có thể không đáng tin cậy?

### 7.8. Bài tập nhỏ

Viết class `Dog` và `Cat`, mỗi class có method riêng:
*   `Dog.bark()` → `"Woof!"`
*   `Cat.meow()` → `"Meow!"`

Viết hàm `makeSound(animal: Dog | Cat)`:
*   Nếu `animal instanceof Dog` → gọi `bark()`.
*   Ngược lại → gọi `meow()`.

**Test thử:**

```typescript
makeSound(new Dog()); // "Woof!"
makeSound(new Cat()); // "Meow!"
```

## 8. Assignment Narrowing

### 8.1. Nguyên tắc

Khi khai báo biến với union type, kiểu ban đầu (declared type) sẽ là tập hợp của tất cả các khả năng. Khi gán giá trị, TypeScript sẽ thu hẹp kiểu tạm thời cho biến đó theo giá trị vừa gán. Tuy nhiên, TypeScript luôn kiểm tra tính hợp lệ dựa trên declared type gốc.

### 8.2. Ví dụ cơ bản

```typescript
let x = Math.random() < 0.5 ? 10 : "hello world!";
// x: string | number

x = 1;
// x: number (thu hẹp sau khi gán)

x = "goodbye!";
// x: string (thu hẹp lại)

x = true;
// ❌ Lỗi: Type 'boolean' is not assignable to type 'string | number'
```

**Giải thích:**
*   Ban đầu `x` là `string | number`.
*   Gán số → thu hẹp thành `number`.
*   Gán chuỗi → thu hẹp thành `string`.
*   Nhưng `boolean` không nằm trong declared type ban đầu → TypeScript báo lỗi.

### 8.3. Điểm quan trọng

*   Thu hẹp kiểu chỉ là tạm thời. TypeScript không “loại bỏ” union gốc, mà chỉ thu hẹp để hỗ trợ IntelliSense và kiểm tra kiểu trong ngữ cảnh hiện tại.
*   Bất kỳ gán mới nào cũng được phép miễn là thuộc `string | number`.

### 8.4. Ứng dụng thực tế

Khi khai báo biến có thể nhận nhiều loại input (từ API, user input, …), assignment narrowing giúp editor hiển thị method phù hợp tùy vào giá trị hiện tại.

**Ví dụ:**

```typescript
let data: string | string[];

// API trả về 1 giá trị string
data = "hello";
console.log(data.toUpperCase()); // OK vì data: string

// API trả về nhiều giá trị
data = ["a", "b", "c"];
console.log(data.map(s => s.toUpperCase())); // OK vì data: string[]
```

### 8.5. Cạm bẫy

*   Không thể thu hẹp kiểu ra ngoài declared type.
*   Nếu muốn “chốt” type hẹp vĩnh viễn, phải dùng type assertion hoặc khai báo biến mới.

### 8.6. Bài tập nhỏ

Viết đoạn code:

```typescript
let val = Math.random() > 0.5 ? [1, 2, 3] : "single";

// TODO:
// - Nếu val là string, in hoa nó.
// - Nếu val là number[], tính tổng các số.
```

Bạn sẽ dùng assignment narrowing + `typeof` check để giải quyết.

## 9. Control Flow Analysis

### 9.1. Định nghĩa

**Control Flow Analysis (CFA)** trong TypeScript là quá trình phân tích luồng thực thi code để xác định kiểu dữ liệu tại từng điểm trong chương trình. TypeScript không chỉ dựa vào khai báo ban đầu mà còn "đi theo dòng chảy" của chương trình (`if`, `else`, `return`, `loop`, `throw`, …).

**Kết quả:** Biến có thể thay đổi kiểu tại các nhánh khác nhau, và TypeScript sẽ hợp nhất lại khi luồng điều khiển hội tụ.

### 9.2. Ví dụ đơn giản

```typescript
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  // Ở đây, TypeScript hiểu padding: string (vì return đã loại bỏ trường hợp number)
  return padding + input;
}
```

TypeScript thấy rằng sau khi `if (typeof padding === "number") return ...`, phần còn lại của hàm chỉ có thể chạy khi `padding` là `string`.

### 9.3. Ví dụ nâng cao

```typescript
function example() {
  let x: string | number | boolean;

  x = Math.random() < 0.5;
  console.log(x); // x: boolean

  if (Math.random() < 0.5) {
    x = "hello";
    console.log(x); // x: string
  } else {
    x = 100;
    console.log(x); // x: number
  }

  return x; // x: string | number (union hợp nhất lại sau if/else)
}
```

TypeScript tự động "biết":
*   Trước `if`: `boolean`
*   Trong `if`: `string`
*   Trong `else`: `number`
*   Sau `if/else`: `string | number`

### 9.4. Ứng dụng thực tế

*   Làm việc với API response có nhiều nhánh dữ liệu.
*   Xử lý dữ liệu đầu vào chưa chắc chắn (union type).
*   Giúp tránh lỗi `null` / `undefined` bằng cách thu hẹp sau các guard.

**Ví dụ:**

```typescript
type Response =
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function handle(res: Response) {
  if (res.status === "success") {
    // res: { status: "success"; data: string[] }
    console.log(res.data.join(", "));
  } else {
    // res: { status: "error"; message: string }
    console.error(res.message);
  }
}
```

### 9.5. Cạm bẫy

*   Nếu không có `return`/`throw` trong một block, TypeScript sẽ hợp nhất lại union sau đó.
*   Nếu viết code "lỏng" mà không guard kỹ, TypeScript sẽ vẫn giữ union → bắt buộc xử lý thêm.

**Ví dụ sai:**

```typescript
function wrong(x: string | number) {
  if (typeof x === "string") {
    console.log(x.toUpperCase());
  }
  // ❌ TypeScript vẫn coi x: string | number ở đây
  // Lỗi nếu x là string: Property 'toFixed' does not exist on type 'string'.
  // Lỗi nếu x là number: Property 'toUpperCase' does not exist on type 'number'.
  console.log(x.toFixed(2));
}
```

**Cách sửa:** Dùng `else` hoặc `return`.

```typescript
function correct(x: string | number) {
  if (typeof x === "string") {
    console.log(x.toUpperCase());
    return; // Thoát khỏi hàm nếu là string
  }
  console.log(x.toFixed(2)); // Ở đây x chắc chắn là number
}
```

### 9.6. Bài tập nhỏ

Viết hàm `processInput` nhận `value: string | number | null`.
*   Nếu `null`, trả về `"No value"`.
*   Nếu là `string`, trả về độ dài chuỗi.
*   Nếu là `number`, trả về bình phương.

Bạn hãy viết code sao cho TypeScript tự thu hẹp được từng nhánh.

## 10. Type Predicates (User-Defined Type Guards) và Assertion Functions

### 10.1. Type Predicates (User-Defined Type Guards)

#### Định nghĩa

Một hàm trả về một **type predicate** giúp TypeScript hiểu rõ kiểu của một tham số sau khi kiểm tra.
**Cú pháp:** `function func(param: any): param is SomeType { ... }`
`param is SomeType` chính là type predicate.

#### Ví dụ cơ bản

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

let pet: Fish | Bird = Math.random() > 0.5
  ? { swim: () => console.log("swim") }
  : { fly: () => console.log("fly") };

if (isFish(pet)) {
  pet.swim(); // TypeScript hiểu pet: Fish
} else {
  pet.fly();  // TypeScript hiểu pet: Bird
}
```

**Giải thích:**
*   Tại nhánh `if`, `pet` được thu hẹp thành `Fish`.
*   Tại nhánh `else`, TypeScript biết chắc đó là `Bird`.

#### Ứng dụng thực tế

Khi làm việc với API có nhiều kiểu đối tượng khác nhau (union type), dùng type guard để tách dữ liệu theo loại.

**Ví dụ: phân biệt `User` vs `Admin`**

```typescript
type User = { role: "user"; name: string };
type Admin = { role: "admin"; permissions: string[] };

function isAdmin(account: User | Admin): account is Admin {
  return account.role === "admin";
}

function handleAccount(acc: User | Admin) {
  if (isAdmin(acc)) {
    console.log(acc.permissions.join(", "));
  } else {
    console.log(acc.name);
  }
}
```

#### Kết hợp với `.filter`

```typescript
const zoo: (Fish | Bird)[] = [
  { swim: () => {} },
  { fly: () => {} },
  { swim: () => {} },
];

const underwater: Fish[] = zoo.filter(isFish);
// underwater: Fish[]
```

### 10.2. Assertion Functions

#### Định nghĩa

Khác với type guard (trả về `boolean`), assertion function sẽ `throw error` nếu không thỏa điều kiện.
**Cú pháp:** `function assertIsString(value: unknown): asserts value is string { ... }`

#### Ví dụ

```typescript
function assertIsNumber(val: unknown): asserts val is number {
  if (typeof val !== "number") {
    throw new Error("Value is not a number");
  }
}

function double(input: unknown) {
  assertIsNumber(input);
  // Sau dòng trên, TypeScript hiểu input: number
  return input * 2;
}

console.log(double(10));   // 20
// console.log(double("hi")); // ❌ runtime error
```

Assertion function rất hữu ích trong input validation và runtime checks.

### 10.3. Cạm bẫy

*   Nếu logic trong `isFish` sai, TypeScript sẽ tin vào bạn → bug runtime khó phát hiện.
*   Assertion functions luôn tin tưởng vào developer. Nếu bạn kiểm tra thiếu trường hợp, TypeScript cũng không cảnh báo.

### 10.4. Bài tập nhỏ

Viết type guard và assertion function:
*   Type guard `isArrayOfStrings` để kiểm tra giá trị có phải `string[]` không.
    ```typescript
    function isArrayOfStrings(val: unknown): val is string[] { /* ... */ }
    ```
*   Assertion function `assertNonNull` để đảm bảo biến không phải `null` hoặc `undefined`.
    ```typescript
    function assertNonNull<T>(val: T): asserts val is NonNullable<T> { /* ... */ }
    ```

## 11. Discriminated Unions

### 11.1. Vấn đề ban đầu

Khi định nghĩa các kiểu dữ liệu có cấu trúc tương tự nhưng khác nhau ở một số trường, ví dụ:

```typescript
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```

`kind` giúp phân biệt đối tượng là `circle` hay `square`. Tuy nhiên, TypeScript không biết chắc `radius` hay `sideLength` có tồn tại hay không, dẫn đến việc phải dùng non-null assertion (`!`) hoặc gặp lỗi khi `strictNullChecks` được bật. Non-null assertion dễ gây lỗi nếu code thay đổi hoặc cấu hình kiểm tra kiểu bị tắt.

### 11.2. Giải pháp: Discriminated Union

Tách mỗi kiểu ra riêng với một kiểu literal cho thuộc tính chung (gọi là **discriminant property**).

**Ví dụ:**

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;
```

Ở đây, `kind` là discriminant property. `radius` và `sideLength` được khai báo là thuộc tính bắt buộc (`required`) trong các kiểu tương ứng.

### 11.3. Narrowing dựa vào Discriminant

```typescript
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2; // shape: Circle
  } else {
    return shape.sideLength ** 2;       // shape: Square
  }
}
```

Khi kiểm tra `kind`, TypeScript tự động thu hẹp kiểu:
*   `"circle"` → `Circle`
*   `"square"` → `Square`

### 11.4. Dùng với `switch` Statement

```typescript
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2; // shape: Circle
    case "square":
      return shape.sideLength ** 2;       // shape: Square
  }
}
```

`switch` statement cũng thu hẹp kiểu dựa vào discriminant, giúp tránh bug khi quên xử lý một nhánh.

### 11.5. Ứng dụng thực tế

*   **API Response**:
    ```typescript
    type Success = { status: "success"; data: string[] };
    type Error = { status: "error"; message: string };
    type Response = Success | Error;

    function handleResponse(res: Response) {
      switch (res.status) {
        case "success":
          console.log(res.data.join(", "));
          break;
        case "error":
          console.error(res.message);
          break;
      }
    }
    ```
*   **State Management**: Redux hoặc Zustand thường mã hóa mutation/state bằng discriminated unions.
    ```typescript
    type Action =
      | { type: "increment" }
      | { type: "decrement" }
      | { type: "reset"; value: number };
    ```
*   **Messaging Protocol**: Phân loại message từ client/server.

### 11.6. Ưu điểm

*   **Type-safe**: Không cần `!` hay type assertions.
*   **Hỗ trợ IntelliSense**: Giúp editor và TypeScript compiler tự động hỗ trợ IntelliSense.
*   **Giảm bug**: Giảm bug khi quên xử lý một nhánh.

### 11.7. Cạm bẫy

*   Phải dùng kiểu literal cho discriminant property (ví dụ: `"circle"` chứ không phải `string`).
*   Mỗi thành viên trong union phải có discriminant property.
*   Không dùng thuộc tính tùy chọn cho các trường cần xử lý trong mỗi nhánh.

### 11.8. Câu hỏi tư duy

*   Nếu dùng optional property như ví dụ ban đầu, TypeScript sẽ cần gì để tránh lỗi?
*   Discriminated union có thể kết hợp với type guard không? Ví dụ nào?
*   Khi `switch` trên discriminant property, nếu bỏ qua nhánh nào đó thì TypeScript có cảnh báo không?

### 11.9. Bài tập nhỏ

1.  Định nghĩa union type `Vehicle` gồm:
    ```typescript
    type Car = { type: "car"; wheels: 4 };
    type Bike = { type: "bike"; wheels: 2 };
    type Vehicle = Car | Bike;
    ```
    Viết hàm `getWheels(vehicle: Vehicle)` trả về số bánh dựa vào `type`.
    Viết hàm `isCar(vehicle: Vehicle): vehicle is Car` để dùng type guard.

2.  Viết union type `Message` cho:
    *   `TextMessage`: `{ type: "text"; content: string }`
    *   `ImageMessage`: `{ type: "image"; url: string }`
    Viết hàm `handleMessage(msg: Message)` dùng `switch` statement để xử lý từng type.

## 12. The `never` Type và Exhaustiveness Checking

### 12.1. `never` Type là gì?

`never` đại diện cho một giá trị không bao giờ xảy ra.
*   Không có giá trị nào có thể gán cho `never` (ngoại trừ chính `never`).
*   Nhưng `never` có thể gán cho bất kỳ kiểu nào.

**Ví dụ:**

```typescript
function fail(msg: string): never {
  throw new Error(msg); // Hàm này không bao giờ return
}
```

### 12.2. Exhaustiveness Checking trong `switch`

Trong discriminated union, ta thường dùng `switch` để xử lý từng nhánh. Để chắc chắn không bỏ sót trường hợp nào, ta thêm một `default` block gán vào biến kiểu `never`.

**Ví dụ:**

```typescript
type Shape = Circle | Square; // Giả sử Circle và Square đã được định nghĩa

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape; // Nếu tất cả các case đã được xử lý, shape là never
      return _exhaustiveCheck;
  }
}
```

*   Nếu tất cả các case đã được xử lý, thì `shape` trong `default` sẽ được thu hẹp thành `never` → không lỗi.
*   Nếu còn sót case, TypeScript sẽ báo lỗi vì `shape` không phải là `never`.

### 12.3. Khi thêm kiểu mới

Giả sử thêm `Triangle` vào `Shape`:

```typescript
interface Triangle {
  kind: "triangle";
  sideLength: number;
}

type Shape = Circle | Square | Triangle;
```

Bây giờ, hàm `getArea` chưa xử lý `"triangle"`. Ở `default` block, TypeScript sẽ báo lỗi:

```
Type 'Triangle' is not assignable to type 'never'.
```

**Giải thích:** Compiler ép bạn phải xử lý `Triangle` trong `switch` statement.

### 12.4. Lợi ích

*   Tránh bug khi quên xử lý một thành viên trong union.
*   Compiler nhắc nhở ngay khi thêm kiểu mới.
*   Dễ dàng bảo trì code dài hạn.

### 12.5. Thực tế thường gặp

*   **Redux reducer**:
    ```typescript
    type Action =
      | { type: "increment" }
      | { type: "decrement" }
      | { type: "reset"; value: number };

    function reducer(state: number, action: Action): number {
      switch (action.type) {
        case "increment": return state + 1;
        case "decrement": return state - 1;
        case "reset": return action.value;
        default:
          const _exhaustive: never = action; // Báo lỗi nếu có action.type mới chưa xử lý
          return _exhaustive;
      }
    }
    ```
*   Xử lý phản hồi API.
*   Máy trạng thái hữu hạn (Finite State Machines).

### 12.6. Best Practice

*   Luôn dùng `never` cho exhaustiveness checking trong `switch`.
*   Dùng biến `_exhaustiveCheck` hoặc `_never` để compiler cảnh báo khi quên nhánh.
*   Tránh `default` mà không có kiểm tra `never`, vì sẽ làm mất công dụng của exhaustiveness check.

## 13. Giải thích dưới góc độ nấu ăn

Để dễ hình dung, hãy tưởng tượng các khái niệm về TypeScript Narrowing và Unions như việc quản lý một nhà bếp:

1.  **Union Type = Thực đơn nhiều món**
    *   Ví dụ: `type Dish = "pizza" | "sushi" | "pho";`
    *   Tưởng tượng bạn có một thực đơn với 3 món chính: pizza, sushi, phở.

2.  **Narrowing = Chọn món ăn thật sự**
    *   Ban đầu, bạn chỉ biết "món ăn là một trong ba món". Nhưng khi bạn nhìn kỹ hơn vào nguyên liệu hoặc cách chế biến:
        *   Nếu thấy phô mai → chắc chắn là pizza.
        *   Nếu thấy cá sống → chắc chắn là sushi.
        *   Nếu thấy nước lèo → chắc chắn là phở.
    *   Đó chính là **narrowing** → quá trình thu hẹp loại món từ "pizza | sushi | pho" xuống chỉ còn một loại cụ thể.

3.  **Discriminated Union = Thực đơn có nhãn "kind"**
    *   Thay vì đoán mò, bạn gắn nhãn rõ ràng cho từng món:
        ```typescript
        interface Pizza { kind: "pizza"; cheese: boolean }
        interface Sushi { kind: "sushi"; fish: string }
        interface Pho { kind: "pho"; beef: boolean }

        type Dish = Pizza | Sushi | Pho;
        ```
    *   Mỗi món đều có một "nhãn" (`kind`) ghi rõ: "Đây là pizza" hay "Đây là sushi". Khi xem `dish.kind`, bạn biết ngay món đó là gì.

4.  **Exhaustiveness Checking = Bếp trưởng kiểm tra hết order**
    *   Giờ bạn viết hàm nấu ăn:
        ```typescript
        function cook(dish: Dish) {
          switch (dish.kind) {
            case "pizza":
              return "Nướng pizza với phô mai";
            case "sushi":
              return "Cuốn sushi với cá tươi";
            case "pho":
              return "Nấu phở với nước lèo";
            default:
              const _exhaustive: never = dish; // Nếu có món mới mà chưa xử lý
              return _exhaustive;
          }
        }
        ```
    *   Nếu thực đơn chỉ có pizza, sushi, phở → nhánh `default` không bao giờ chạy → `dish` lúc đó là `never`.
    *   Nếu bạn thêm món mới (ví dụ: "banhmi") vào `Dish` mà quên xử lý trong `switch`, TypeScript sẽ báo lỗi: "Ơ, còn bánh mì chưa nấu kìa!"

5.  **`never` Type = Tình huống không thể xảy ra**
    *   Trong bếp: nếu thực đơn chỉ có 3 món, thì không bao giờ có order "cơm tấm". TypeScript gọi món "không thể có" này là `never`.

**Tóm lại:**
*   **Union** = thực đơn nhiều món.
*   **Narrowing** = nhìn nguyên liệu để đoán món nào.
*   **Discriminant** = nhãn `kind` ghi rõ món gì.
*   **`never`** = món "không thể có" trên menu.
*   **Exhaustiveness checking** = bếp trưởng bắt buộc phải có công thức cho mọi món, nếu thiếu thì báo lỗi.

## 14. Tóm tắt kiến thức: Narrowing & Unions trong TypeScript

### 14.1. Union Types

*   Một biến có thể mang nhiều kiểu dữ liệu khác nhau.
*   **Ví dụ:** `let x: string | number;`

### 14.2. Type Guards (Các cách thu hẹp kiểu)

| Cách                     | Cú pháp                               | Ý nghĩa                                     | Ví dụ                                     |
| :----------------------- | :------------------------------------ | :------------------------------------------ | :---------------------------------------- |
| `typeof`                 | `typeof x === "string"`               | Kiểm tra kiểu nguyên thủy                   | `if (typeof x === "number") { ... }`      |
| Equality                 | `x === y` hoặc `x !== null`           | So sánh giá trị → thu hẹp kiểu             | `if (x === y) { ... }`                    |
| Truthiness               | `if (x)`                              | Kiểm tra giá trị có "truthy" không          | `if (strs) { ... }`                       |
| `in` operator            | `"prop" in obj`                       | Kiểm tra thuộc tính tồn tại                 | `if ("swim" in animal) { ... }`           |
| `instanceof`             | `x instanceof Date`                   | Kiểm tra prototype chain (class/constructor)| `if (x instanceof Date) { ... }`          |
| User-defined predicate   | `function isFish(pet): pet is Fish`   | Tự định nghĩa quy tắc thu hẹp               | `if (isFish(pet)) { ... }`                |

### 14.3. Control Flow Analysis

*   TypeScript phân tích luồng điều khiển của code (`if/else`, `return`, `assignment`, v.v.).
*   Ở mỗi nhánh, biến có thể mang kiểu khác nhau.
*   **Ví dụ:**
    ```typescript
    let x: string | number | boolean;

    if (Math.random() > 0.5) {
      x = "hello"; // x: string
    } else {
      x = 42;      // x: number
    }
    // Sau if/else, x: string | number
    ```

### 14.4. Assignment Narrowing

*   Khi gán giá trị, TypeScript thu hẹp kiểu tạm thời cho biến.
*   Tuy nhiên, kiểu khai báo ban đầu vẫn quyết định phạm vi hợp lệ.
*   **Ví dụ:**
    ```typescript
    let x: string | number = "hi";
    x = 10;   // OK, x: number
    x = true; // ❌ Lỗi: Type 'boolean' is not assignable to type 'string | number'
    ```

### 14.5. Discriminated Unions (Liên minh phân biệt)

*   Các kiểu trong union chia sẻ một trường chung (discriminant property) với kiểu literal để phân biệt.
*   **Ví dụ:**
    ```typescript
    interface Circle { kind: "circle"; radius: number; }
    interface Square { kind: "square"; sideLength: number; }
    type Shape = Circle | Square;

    function getArea(s: Shape) {
      switch (s.kind) {
        case "circle": return Math.PI * s.radius ** 2; // s: Circle
        case "square": return s.sideLength ** 2;       // s: Square
      }
    }
    ```

### 14.6. The `never` Type & Exhaustiveness Checking

*   Khi đã loại bỏ hết tất cả các khả năng của một union, ta nhận được kiểu `never`.
*   Dùng `never` trong `default` của `switch` để buộc phải xử lý tất cả các trường hợp của discriminated union. Nếu có trường hợp mới chưa được xử lý, TypeScript sẽ báo lỗi.
*   **Ví dụ:**
    ```typescript
    function getArea(shape: Shape) {
      switch (shape.kind) {
        case "circle": return Math.PI * shape.radius ** 2;
        case "square": return shape.sideLength ** 2;
        default:
          const _exhaustive: never = shape; // Nếu thiếu case → báo lỗi compile-time
          return _exhaustive;
      }
    }
    ```

### 14.7. Sơ đồ tư duy (Mindmap)

```
Union Types
   ├── Narrowing
   │    ├── typeof
   │    ├── equality (===, !==, ==, !=)
   │    ├── truthiness (if (x))
   │    ├── in operator
   │    ├── instanceof
   │    └── user-defined type guards (x is Y)
   ├── Control Flow Analysis
   ├── Assignments
   ├── Discriminated Unions
   │    └── Exhaustiveness Checking → never type
```

### 14.8. Ví dụ vui kiểu “nấu ăn” 🍕🍣🍜

*   **Union** = thực đơn nhiều món.
*   **Narrowing** = nhìn nguyên liệu để đoán món nào.
*   **Discriminant** = nhãn `kind` ghi rõ món gì.
*   **`never`** = món "không thể có" trên menu.
*   **Exhaustiveness checking** = bếp trưởng bắt buộc phải có công thức cho mọi món, nếu thiếu thì báo lỗi.

## 15. Q&A Recall – Narrowing & Unions

Đây là bộ câu hỏi và trả lời nhanh để bạn ôn tập và vận dụng kiến thức đã học.

### 15.1. Union Types

**Q:** Union type là gì trong TypeScript?
**A:** Là kiểu biến có thể nhận nhiều loại giá trị khác nhau.
**Ví dụ:** `let value: string | number;`

### 15.2. `typeof` Guard

**Q:** Làm sao để kiểm tra một biến có phải `string` hay `number`?
**A:** Dùng `typeof`.
**Ví dụ:** `if (typeof x === "string") { /* ... */ }`

### 15.3. Truthiness

**Q:** Trong `if (x)`, những giá trị nào bị coi là falsy?
**A:** `0`, `NaN`, `""` (chuỗi rỗng), `0n` (BigInt zero), `null`, `undefined`.

### 15.4. Equality Narrowing

**Q:** Sự khác nhau giữa `== null` và `=== null` là gì?
**A:**
*   `=== null`: Chỉ so sánh với `null`.
*   `== null`: `true` nếu giá trị là `null` hoặc `undefined`.

### 15.5. `in` Operator

**Q:** Khi nào dùng `"prop" in obj`?
**A:** Khi muốn kiểm tra một đối tượng có thuộc tính đó hay không (dùng để thu hẹp kiểu).
**Ví dụ:** `if ("swim" in animal) animal.swim();`

### 15.6. `instanceof`

**Q:** Dùng `instanceof` để làm gì?
**A:** Để kiểm tra một đối tượng có phải instance của class nào đó.
**Ví dụ:** `if (x instanceof Date) console.log(x.toUTCString());`

### 15.7. User-defined Type Guards

**Q:** Viết hàm kiểm tra `pet` có phải là `Fish`.
**A:**
```typescript
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

### 15.8. Control Flow Analysis

**Q:** Vì sao sau `return` TypeScript có thể thu hẹp kiểu?
**A:** Vì nhánh đó kết thúc rồi → các nhánh còn lại không còn chứa kiểu bị loại bỏ.

### 15.9. Assignment Narrowing

**Q:** Nếu `let x: string | number = "hi";` → sau khi `x = 42;`, kiểu của `x` là gì?
**A:** Tạm thời là `number`, nhưng về lâu dài vẫn thuộc `string | number`.

### 15.10. Discriminated Union

**Q:** Đặc điểm của discriminated union là gì?
**A:** Các kiểu có một trường chung (`kind`) mang kiểu literal, giúp TypeScript phân biệt được.

### 15.11. Exhaustiveness Check & `never`

**Q:** Tại sao dùng `never` trong `default` của `switch`?
**A:** Để TypeScript báo lỗi khi union có case mới chưa được xử lý.
**Ví dụ:**
```typescript
default:
  const _exhaustive: never = shape;
```

### 15.12. Bài tập vận dụng nhanh

1.  Viết hàm `printId(id: string | number)`:
    *   Nếu `id` là số → in ra `"ID number: ..."`
    *   Nếu `id` là `string` → in ra `"ID string: ..."`.

2.  Cho type:
    ```typescript
    interface Dog { kind: "dog"; bark: () => void }
    interface Cat { kind: "cat"; meow: () => void }
    type Pet = Dog | Cat;
    ```
    Viết hàm `makeSound(p: Pet)` dùng `switch` và có `never` để đảm bảo đủ case.

3.  Viết hàm `double(values?: number[])`:
    *   Nếu không có `values` → trả về `undefined`.
    *   Nếu có → trả về mảng gấp đôi mỗi số.

## 16. Câu hỏi phỏng vấn về TypeScript Narrowing & Unions

Đây là bộ câu hỏi phỏng vấn từ mức cơ bản đến nâng cao về TypeScript Narrowing, Union và Type Guards, kèm theo gợi ý trả lời ngắn gọn để bạn luyện tập.

### 16.1. Mức cơ bản

**Q:** Union type là gì trong TypeScript?
**A:** Là kiểu biến có thể nhận nhiều loại giá trị khác nhau.
**Ví dụ:** `string | number`.

**Q:** Type narrowing nghĩa là gì?
**A:** Là quá trình TypeScript thu hẹp một kiểu union về một kiểu cụ thể hơn dựa trên logic kiểm tra (ví dụ: `typeof`, `in`, `instanceof`…).

**Q:** Kể tên một số cách thu hẹp (narrow) trong TypeScript.
**A:** `typeof`, truthiness, equality, `in` operator, `instanceof`, user-defined type guards, control flow analysis.

**Q:** Điểm khác biệt giữa `== null` và `=== null` trong narrowing?
**A:**
*   `== null`: Bao gồm cả `null` và `undefined`.
*   `=== null`: Chỉ khớp với `null`.

### 16.2. Mức trung bình

**Q:** Giải thích tại sao `typeof null === "object"` trong JavaScript/TypeScript.
**A:** Đây là một lỗi lịch sử trong JavaScript. `null` không thật sự là đối tượng nhưng toán tử `typeof` trả về `"object"`.

**Q:** Truthiness check có thể gây bug thế nào?
**A:** Ví dụ: chuỗi rỗng `""` là falsy. Nếu dùng `if (value)` để kiểm tra sự tồn tại, nó có thể bỏ qua trường hợp chuỗi rỗng hợp lệ.

**Q:** So sánh `typeof` và `instanceof` khi thu hẹp kiểu.
**A:**
*   `typeof`: Dùng cho các kiểu nguyên thủy (`string`, `number`, `boolean`, v.v.).
*   `instanceof`: Dùng cho các đối tượng được tạo từ constructor/class.

**Q:** Khi nào nên dùng user-defined type guard (`pet is Fish`)?
**A:** Khi các cách built-in không đủ, cần logic kiểm tra chi tiết và tùy chỉnh hơn để thu hẹp kiểu.

### 16.3. Mức nâng cao

**Q:** Discriminated union là gì? Ưu điểm so với union thông thường?
**A:** Là một union type mà các thành viên có chung một trường (discriminant property) với kiểu literal, giúp TypeScript xác định chính xác nhánh nào.
**Ưu điểm:** Code an toàn hơn, dễ bảo trì, tránh các vấn đề với thuộc tính tùy chọn (`null`/`undefined`).

**Q:** Exhaustiveness checking với `never` hoạt động như thế nào?
**A:** Nếu một union type được mở rộng (thêm thành viên mới) mà `switch` statement chưa xử lý hết các trường hợp, TypeScript sẽ báo lỗi tại `default: const _: never = value;`, buộc developer phải xử lý trường hợp mới.

**Q:** Control flow analysis giúp ích gì cho type narrowing?
**A:** Nó phân tích luồng code (`return`, `if/else`, `assignment`) để thu hẹp kiểu tại từng điểm trong chương trình, giúp tránh lỗi runtime và cung cấp IntelliSense chính xác hơn.

**Q:** Tại sao sau khi `return` trong một nhánh `if`, TypeScript có thể bỏ bớt type còn lại?
**A:** Vì nhánh đó kết thúc luồng thực thi của hàm, nên các nhánh code còn lại không thể đạt được với kiểu đã `return` → kiểu trong phần còn lại được thu hẹp.

**Q:** Điểm khác biệt giữa optional property trong union và discriminated union?
**A:**
*   **Optional property trong union thông thường**: Khó kiểm soát `null`/`undefined`, dễ gây lỗi runtime.
*   **Discriminated union**: Mỗi kiểu thành viên có thuộc tính bắt buộc (`required property`) phù hợp với `kind` của nó → rõ ràng và an toàn hơn, TypeScript có thể tự động suy luận kiểu.

### 16.4. Câu hỏi thực tế (áp dụng)

**Q:** Giả sử bạn có API trả về `User | null`. Làm sao để in ra `user.name` an toàn?
**A:** Kiểm tra `if (user)` trước khi truy cập thuộc tính `name`.

**Q:** Viết nhanh hàm `handleResponse(res: { status: "ok"; data: string } | { status: "error"; message: string })`.
**A:** Dùng `switch(res.status)` để xử lý các trường hợp `"ok"` và `"error"`, đảm bảo exhaustiveness bằng `never` trong `default` nếu cần.
