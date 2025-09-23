# TypeScript Functions - Ôn tập chuyên sâu

## 1. Function Type Expressions

### 1.1. Lý thuyết
Trong TypeScript, hàm cũng là giá trị. Vì vậy, chúng ta cần định nghĩa kiểu dữ liệu của hàm để truyền, nhận hoặc xử lý nó như một biến.

Cú pháp để mô tả một hàm là với một biểu thức kiểu hàm, tương tự như arrow functions:
`(parameterName: ParameterType) => ReturnType`

Ví dụ: `(a: string) => void` nghĩa là: một hàm có tham số `a` kiểu `string` và không trả về giá trị (`void`).

Nếu một kiểu tham số không được chỉ định, nó sẽ ngầm định là `any`. Tên tham số là bắt buộc. Kiểu hàm `(string) => void` có nghĩa là "một hàm với tham số tên `string` có kiểu `any`".

Chúng ta có thể sử dụng một type alias để đặt tên cho một kiểu hàm:
```typescript
type GreetFunction = (a: string) => void;
function greeter(fn: GreetFunction) {
  // ...
}
```

### 1.2. Ví dụ cơ bản
```typescript
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);
```
Trong ví dụ trên:
- `fn` là một tham số hàm.
- `printToConsole` phù hợp với kiểu `(a: string) => void`.

### 1.3. Câu hỏi tư duy
Nếu viết thế này:
```typescript
function greeter(fn: (a: string) => void) {
  fn("Hello");
}

greeter((msg) => msg.toUpperCase());
```
Đoạn code trên có vấn đề gì không? (Hãy nghĩ về return type của hàm callback).

### 1.4. Use case thực tế
Trong frontend, callback function được sử dụng rất nhiều, ví dụ khi xử lý sự kiện click:
```typescript
type ClickHandler = (event: MouseEvent) => void;

function registerClick(handler: ClickHandler) {
  document.addEventListener("click", handler);
}

registerClick((e) => {
  console.log("Clicked at", e.clientX, e.clientY);
});
```
Cách này rất hay dùng trong React, Vue, hoặc Vanilla JS.

### 1.5. Bug thường gặp
- Quên khai báo return type → TypeScript suy luận sai.
- Dùng nhầm `any` vì không khai báo kiểu tham số.
  ```typescript
  // ❌ Sai - TypeScript hiểu tham số là any
  let fn: (string) => void;
  ```
  Ở đây `string` bị hiểu là tên tham số, không phải kiểu dữ liệu. Phải viết đúng:
  ```typescript
  let fn: (s: string) => void;
  ```
- Dùng `void` nhưng lại return giá trị (TypeScript có thể cảnh báo).

### 1.6. Bài tập thực hành
**Bài tập 1:**
Khai báo một type alias cho hàm `SumFunction` nhận vào 2 số (`number`) và trả về `number`.
Viết hàm `calculate` nhận vào một `SumFunction` và gọi nó với 2 số bất kỳ.

**Bài tập 2:**
Viết một hàm `filterStrings` nhận vào:
- Một mảng `string[]`
- Một hàm `predicate`: `(s: string) => boolean`
Hàm `filterStrings` sẽ trả về những phần tử thỏa điều kiện `predicate`.

Ví dụ:
```typescript
filterStrings(["apple", "banana", "kiwi"], (s) => s.length > 4);
// Kết quả mong muốn: ["apple", "banana"]
```

## 2. Call Signatures

### 2.1. Lý thuyết
Trong JavaScript, hàm có thể có các thuộc tính ngoài việc có thể gọi được. Tuy nhiên, cú pháp biểu thức kiểu hàm không cho phép khai báo thuộc tính. Nếu chúng ta muốn mô tả một thứ có thể gọi được với các thuộc tính, chúng ta có thể viết một `call signature` trong một kiểu đối tượng.

Cú pháp:
```typescript
type FunctionWithProp = {
  propName: Type;
  (arg: ArgType): ReturnType;
};
```
So sánh:
- Function type expression: `(a: string) => void`
- Call signature:
  ```typescript
  {
    description: string;
    (a: string): void;
  }
  ```
Lưu ý rằng cú pháp hơi khác so với biểu thức kiểu hàm - sử dụng `:` giữa danh sách tham số và kiểu trả về thay vì `=>`.

### 2.2. Ví dụ cơ bản
```typescript
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}

function myFunc(someArg: number) {
  return someArg > 3;
}
myFunc.description = "default description";

doSomething(myFunc);
```
Trong ví dụ này:
- `myFunc` vừa là hàm `(number) => boolean`.
- Vừa có thuộc tính `description: string`.

### 2.3. Câu hỏi tư duy
Nếu khai báo như sau:
```typescript
function myFunc(someArg: number) {
  return someArg > 3;
}
doSomething(myFunc);
```
Tại sao TypeScript sẽ báo lỗi ở đây? (Gợi ý: thiếu gì so với `DescribableFunction`?)

### 2.4. Use case thực tế
**Trường hợp: Validator function**
Trong frontend (React, Angular, Vue), chúng ta thường viết hàm validate input nhưng muốn lưu mô tả/metadata trong chính hàm đó.
```typescript
type Validator = {
  message: string;
  (value: string): boolean;
};

function runValidator(v: Validator, input: string) {
  console.log(`${v.message}: ${v(input)}`);
}

function isEmail(value: string) {
  return value.includes("@");
}
isEmail.message = "Email must contain '@'";

runValidator(isEmail, "test@example.com"); // Email must contain '@': true
```
Cách này giúp code dễ đọc và maintain hơn.

### 2.5. Bug thường gặp
- Quên gán property → TypeScript báo lỗi thiếu property.
- Khai báo sai cú pháp (dùng `=>` thay vì `:` trong call signature).
  ```typescript
  // ❌ Sai:
  type Wrong = {
    description: string;
    (a: number) => boolean; // không được
  };
  // ✅ Đúng:
  type Correct = {
    description: string;
    (a: number): boolean;
  };
  ```
- Sử dụng function expression mà không gán property → dễ miss khi refactor.

### 2.6. Bài tập nhỏ
**Bài tập 1:**
Khai báo một `LoggerFunction` có:
- thuộc tính `level`: `"info" | "warn" | "error"`
- có thể gọi được `(msg: string): void`
Viết hàm `logMessage(logger: LoggerFunction, message: string)` để in ra console: `[level] message`.

**Bài tập 2:**
Tạo một validator `isLongEnough` (nhận `string`, trả về `boolean`) và có thuộc tính `description: string = "Length must be > 5"`.
Viết hàm `testValidator` để chạy và in ra kết quả.

## 3. Generic Functions

### 3.1. Lý thuyết
Generic giúp chúng ta liên kết kiểu dữ liệu giữa input và output.
Nếu không có generic → TypeScript không biết return type chính xác.
Với generic → return type sẽ được suy luận (inferred) dựa trên tham số.

Khai báo generic function:
```typescript
function functionName<Type>(arg: Type): Type {
  return arg;
}
```
Ví dụ "first element":
```typescript
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```
- Nếu input là `string[]` → return `string | undefined`.
- Nếu input là `number[]` → return `number | undefined`.

Chúng ta có thể sử dụng nhiều type parameters. Ví dụ, một phiên bản độc lập của `map` sẽ trông như thế này:
```typescript
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
  return arr.map(func);
}

// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
```
Trong ví dụ này, TypeScript có thể suy luận cả kiểu của tham số kiểu `Input` (từ mảng chuỗi đã cho), cũng như tham số kiểu `Output` dựa trên giá trị trả về của biểu thức hàm (`number`).

### 3.2. Constraints
Đôi khi chúng ta muốn liên kết hai giá trị, nhưng chỉ có thể hoạt động trên một tập hợp con nhất định của các giá trị. Trong trường hợp này, chúng ta có thể sử dụng một `constraint` để giới hạn các loại kiểu mà một tham số kiểu có thể chấp nhận.

Ví dụ, một hàm trả về giá trị dài hơn trong hai giá trị. Để làm điều này, chúng ta cần một thuộc tính `length` là một số. Chúng ta ràng buộc tham số kiểu với kiểu đó bằng cách viết một mệnh đề `extends`:
```typescript
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
// Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
```
Lưu ý rằng TypeScript đã suy luận kiểu trả về của `longest`. Suy luận kiểu trả về cũng hoạt động trên các hàm generic.
Vì chúng ta đã ràng buộc `Type` thành `{ length: number }`, chúng ta được phép truy cập thuộc tính `.length` của các tham số `a` và `b`. Nếu không có ràng buộc kiểu, chúng ta sẽ không thể truy cập các thuộc tính đó vì các giá trị có thể là một kiểu khác không có thuộc tính `length`.

### 3.3. Working with Constrained Values
Đây là một lỗi phổ biến khi làm việc với các ràng buộc generic:
```typescript
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
// Type '{ length: number; }' is not assignable to type 'Type'.
//   '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.
  }
}
```
Vấn đề là hàm hứa sẽ trả về cùng loại đối tượng như đã được truyền vào, không chỉ một đối tượng phù hợp với ràng buộc. Nếu mã này hợp lệ, bạn có thể viết mã chắc chắn sẽ không hoạt động:
```typescript
// 'arr' gets value { length: 6 }
const arr = minimumLength([1, 2, 3], 6);
// and crashes here because arrays have
// a 'slice' method, but not the returned object!
console.log(arr.slice(0));
```

### 3.4. Specifying Type Arguments
TypeScript thường có thể suy luận các đối số kiểu dự định trong một lệnh gọi generic, nhưng không phải lúc nào cũng vậy. Ví dụ, một hàm để kết hợp hai mảng:
```typescript
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
```
Thông thường, sẽ là một lỗi khi gọi hàm này với các mảng không khớp:
```typescript
const arr = combine([1, 2, 3], ["hello"]);
// Type 'string' is not assignable to type 'number'.
```
Tuy nhiên, nếu bạn muốn làm điều này, bạn có thể chỉ định `Type` theo cách thủ công:
```typescript
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

### 3.5. Guidelines for Writing Good Generic Functions
- **Push Type Parameters Down**: Khi có thể, hãy sử dụng chính tham số kiểu thay vì ràng buộc nó.
  ```typescript
  function firstElement1<Type>(arr: Type[]) {
    return arr[0];
  }

  function firstElement2<Type extends any[]>(arr: Type) {
    return arr[0];
  }

  // a: number (good)
  const a = firstElement1([1, 2, 3]);
  // b: any (bad)
  const b = firstElement2([1, 2, 3]);
  ```
- **Use Fewer Type Parameters**: Luôn sử dụng ít tham số kiểu nhất có thể.
  ```typescript
  function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
    return arr.filter(func);
  }

  function filter2<Type, Func extends (arg: Type) => boolean>(
    arr: Type[],
    func: Func
  ): Type[] {
    return arr.filter(func);
  }
  ```
  `filter1` tốt hơn vì `Func` không liên quan đến hai giá trị.
- **Type Parameters Should Appear Twice**: Nếu một tham số kiểu chỉ được sử dụng một lần trong chữ ký hàm, nó không liên quan đến bất cứ điều gì.
  ```typescript
  function greet<Str extends string>(s: Str) {
    console.log("Hello, " + s);
  }
  greet("world");
  // Có thể viết đơn giản hơn:
  function greet(s: string) {
    console.log("Hello, " + s);
  }
  ```

### 3.6. Câu hỏi tư duy
Nếu viết hàm này:
```typescript
function identity<T>(value: T) {
  return value;
}

const x = identity(5);       // số
const y = identity("hello"); // chuỗi
```
Theo em: `identity<number>` và `identity<string>` có khác gì `identity<any>` không? (Hãy suy nghĩ về type safety khi gọi hàm.)

### 3.7. Use case thực tế
Trong frontend, generic thường dùng trong:
- **React hooks:**
  ```typescript
  function useState<T>(initial: T): [T, (v: T) => void] {
    let value = initial;
    const setValue = (newVal: T) => { value = newVal; };
    return [value, setValue];
  }

  const [count, setCount] = useState(0); // count: number
  const [name, setName] = useState("Alice"); // name: string
  ```
- **API response wrappers:**
  ```typescript
  type ApiResponse<T> = {
    success: boolean;
    data: T;
  };

  const userResponse: ApiResponse<{ id: number; name: string }> = {
    success: true,
    data: { id: 1, name: "Alice" },
  };
  ```

### 3.8. Bug thường gặp
- Dùng `any` thay vì generic → mất type safety.
  ```typescript
  function first(arr: any[]) { return arr[0]; } // ❌ mất type safety
  ```
  Sửa bằng generic.
- Quá nhiều type parameters không cần thiết.
  ```typescript
  function filter2<T, F extends (arg: T) => boolean>(arr: T[], f: F): T[] {
    return arr.filter(f);
  }
  // Thực ra chỉ cần:
  function filter<T>(arr: T[], f: (arg: T) => boolean): T[] {
    return arr.filter(f);
  }
  ```
- Constraint sai → gây lỗi.
  ```typescript
  function longest<T extends { length: number }>(a: T, b: T): T {
    return a.length > b.length ? a : b;
  }
  // Nếu truyền number, TS sẽ báo lỗi vì number không có .length.
  ```

### 3.9. Bài tập thực hành
**Bài tập 1:**
Viết một hàm generic `lastElement<T>(arr: T[]): T | undefined`
Trả về phần tử cuối của mảng.

**Bài tập 2:**
Viết một hàm generic `mergeObjects<A, B>(obj1: A, obj2: B): A & B`
Kết hợp hai object thành một.
```typescript
mergeObjects({ name: "Alice" }, { age: 25 });
// Kết quả mong muốn: { name: "Alice", age: 25 }
```

**Bài tập 3 (nâng cao – constraint):**
Viết hàm `getProp<T, K extends keyof T>(obj: T, key: K): T[K]`
Lấy giá trị của property trong object mà vẫn giữ type safety.
```typescript
const user = { id: 1, name: "Alice" };
const id = getProp(user, "id");   // id: number
const name = getProp(user, "name"); // name: string
```

## 4. Optional Parameters

### 4.1. Lý thuyết
Trong JavaScript:
- Nếu không truyền tham số → giá trị sẽ là `undefined`.
- Có thể cung cấp default value cho tham số → thay thế `undefined`.

Trong TypeScript:
- Tham số có dấu `?` là optional parameter.
- Kiểu dữ liệu sẽ được suy luận thành `T | undefined`.

Ví dụ:
```typescript
function f(x?: number) {
  console.log(x);
}

f();      // OK → x = undefined
f(10);    // OK → x = 10
f(undefined); // OK → x = undefined
```
Nếu cung cấp default parameter:
```typescript
function f(x = 10) {
  console.log(x);
}

f();          // 10
f(5);         // 5
f(undefined); // 10
```
Ở đây, `x` luôn có type là `number` (không còn `undefined`).

### 4.2. Optional Parameters trong Callback
Lỗi dễ gặp nhất là khi khai báo callback như sau:
```typescript
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
```
Người viết muốn cả hai đều chạy được:
```typescript
myForEach([1, 2, 3], (a) => console.log(a));      // chỉ 1 param
myForEach([1, 2, 3], (a, i) => console.log(a, i)); // có 2 param
```
⚠️ Nhưng TS hiểu khác: `index?` nghĩa là hàm có thể được gọi mà không truyền tham số `index`.
Do đó TS sẽ báo lỗi khi bên trong callback ta gọi `i.toFixed()`, vì `i` có thể là `undefined`.
```typescript
myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed());
// 'i' is possibly 'undefined'.
});
```
✅ Giải pháp: không dùng dấu `?` trong callback.
```typescript
function myForEach(arr: any[], callback: (arg: any, index: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
```
Trong TS, callback với ít tham số hơn có thể thay thế cho callback có nhiều tham số hơn → nên không cần `?`.

### 4.3. Câu hỏi tư duy
Giả sử em viết:
```typescript
type Callback = (a: string, b?: number) => void;

const cb: Callback = (a, b) => {
  console.log(b.toFixed());
};
```
Theo em, tại sao TypeScript báo lỗi ở `b.toFixed()`?

### 4.4. Use case thực tế
Trong frontend, optional parameters được dùng nhiều khi:
- **Viết hàm formatting:**
  ```typescript
  function formatPrice(price: number, currency?: string): string {
    return currency ? `${price} ${currency}` : `${price}`;
  }

  console.log(formatPrice(100));       // "100"
  console.log(formatPrice(100, "USD")); // "100 USD"
  ```
- **Viết API wrapper:**
  ```typescript
  function fetchData(url: string, timeout = 5000) {
    console.log(`Fetching ${url} with timeout ${timeout}`);
  }
  fetchData("/api/users");          // timeout = 5000
  fetchData("/api/users", 10000);   // timeout = 10000
  ```

### 4.5. Bug thường gặp
- Nhầm optional parameter với default value
  ```typescript
  function f(x?: number) { /* ... */ } // x: number | undefined
  function g(x = 10) { /* ... */ }     // x: number
  ```
  Dễ bug nếu không check `undefined`.
- Dùng optional parameter trong callback → dẫn tới lỗi type không mong muốn.
- Không xử lý `undefined` khi dùng optional parameter.

### 4.6. Bài tập
**Bài tập 1:**
Viết hàm `greet` với tham số:
- `name: string`
- `greeting?: string` (mặc định là "Hello")

Ví dụ:
```typescript
greet("Alice"); // "Hello, Alice"
greet("Bob", "Hi"); // "Hi, Bob"
```

**Bài tập 2:**
Viết lại `myForEach<T>` sao cho:
- Nếu callback chỉ có `(item: T)` → vẫn chạy được.
- Nếu callback có `(item: T, index: number)` → cũng chạy được.
- Tránh lỗi `index possibly undefined`.

## 5. Function Overloads

### 5.1. Lý thuyết
Trong JavaScript, một hàm có thể được gọi với nhiều cách khác nhau (argument count hoặc argument type khác).
Trong TypeScript, để mô tả điều đó:
- Viết nhiều `overload signatures` (khai báo).
- Sau đó viết một `implementation` (thực thi).

Ví dụ:
```typescript
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}

const d1 = makeDate(12345678); // OK
const d2 = makeDate(5, 5, 5);  // OK
const d3 = makeDate(1, 3);     // ❌ Error: No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
```
⚠️ `Implementation signature` (hàm thật) không được gọi trực tiếp từ bên ngoài. Người dùng chỉ thấy các `overload signatures`.

### 5.2. Overload Signatures and the Implementation Signature
Chữ ký được sử dụng để viết thân hàm không thể "nhìn thấy" từ bên ngoài. Khi viết một hàm quá tải, bạn nên luôn có hai hoặc nhiều chữ ký trên phần triển khai của hàm.

Chữ ký triển khai cũng phải tương thích với các chữ ký quá tải. Ví dụ, các hàm này có lỗi vì chữ ký triển khai không khớp với các quá tải một cách chính xác:
```typescript
function fn(x: boolean): void;
// Argument type isn't right
function fn(x: string): void;
// This overload signature is not compatible with its implementation signature.
function fn(x: boolean) {}
```
```typescript
function fn(x: string): string;
// Return type isn't right
function fn(x: number): boolean;
// This overload signature is not compatible with its implementation signature.
function fn(x: string | number) {
  return "oops";
}
```

### 5.3. Writing Good Overloads
- **Always prefer parameters with union types instead of overloads when possible**:
  ```typescript
  function len(s: string): number;
  function len(arr: any[]): number;
  function len(x: any) {
    return x.length;
  }
  ```
  Hàm này ổn; chúng ta có thể gọi nó với chuỗi hoặc mảng. Tuy nhiên, chúng ta không thể gọi nó với một giá trị có thể là chuỗi hoặc mảng, vì TypeScript chỉ có thể giải quyết một lệnh gọi hàm thành một quá tải duy nhất:
  ```typescript
  len(Math.random() > 0.5 ? "hello" : [0]);
  // No overload matches this call.
  //   Overload 1 of 2, '(s: string): number', gave the following error.
  //     Argument of type 'number[] | "hello"' is not assignable to parameter of type 'string'.
  //       Type 'number[]' is not assignable to type 'string'.
  //   Overload 2 of 2, '(arr: any[]): number', gave the following error.
  //     Argument of type 'number[] | "hello"' is not assignable to parameter of type 'any[]'.
  //       Type 'string' is not assignable to type 'any[]'.
  ```
  Thay vào đó, chúng ta có thể viết một phiên bản không quá tải của hàm:
  ```typescript
  function len(x: any[] | string) {
    return x.length;
  }
  ```
  Điều này tốt hơn nhiều! Người gọi có thể gọi hàm này với cả hai loại giá trị, và như một phần thưởng bổ sung, chúng ta không phải tìm ra một chữ ký triển khai chính xác.

### 5.4. Câu hỏi tư duy
Giả sử anh viết:
```typescript
function greet(name: string): string;
function greet(): string;
function greet(name?: string) {
  return name ? `Hello, ${name}` : "Hello!";
}
```
Em nghĩ TypeScript có cho phép gọi `greet()` không? Nếu có thì kết quả sẽ là gì?

### 5.5. Use case thực tế
a) **Date constructor clone**
```typescript
function parseDate(dateStr: string): Date;
function parseDate(timestamp: number): Date;
function parseDate(input: string | number): Date {
  return new Date(input);
}

parseDate("2025-01-01"); // Date
parseDate(1700000000000); // Date
```
b) **React hook giả lập**
```typescript
function useValue(initial: number): [number, () => void];
function useValue(initial: string): [string, () => void];
function useValue(initial: number | string): [number | string, () => void] {
  let value = initial;
  const reset = () => { value = initial; };
  return [value, reset];
}

const [count, resetCount] = useValue(0);     // count: number
const [name, resetName] = useValue("Alice"); // name: string
```

### 5.6. Bug thường gặp
- Nhầm lẫn giữa overload và implementation
  ```typescript
  function fn(x: string): void;
  function fn() { } // ❌ Error: thiếu overload cho trường hợp không có arg
  ```
- Overload signatures không khớp với implementation
  ```typescript
  function fn(x: string): string;
  function fn(x: number): number;
  function fn(x: string | number) {
    return true; // ❌ Error: boolean không khớp với string/number
  }
  ```
- Dùng overload khi có thể dùng union type
  ```typescript
  // ❌ Quá phức tạp:
  function len(s: string): number;
  function len(arr: any[]): number;
  // ✅ Đơn giản hơn:
  function len(x: string | any[]): number {
    return x.length;
  }
  ```
  Rule: Nếu có thể dùng union type, hãy dùng union thay vì overload.

### 5.7. Bài tập
**Bài tập 1:**
Viết hàm `reverse` với 2 overloads:
- `reverse(s: string): string` → đảo ngược string.
- `reverse(arr: number[]): number[]` → đảo ngược array.

**Bài tập 2:**
Viết hàm `combine` có 2 overloads:
- `combine(a: string, b: string): string` → nối chuỗi.
- `combine(a: number, b: number): number` → cộng số.

**Bài tập 3 (nâng cao):**
Viết hàm `find` với overloads:
- `find(arr: string[], search: string): number` → trả về index.
- `find(arr: number[], search: number): number` → trả về index.

## 6. Declaring `this` in a Function

### 6.1. Lý thuyết
Trong JavaScript:
- `this` trong function thông thường được xác định khi gọi hàm.
- `this` trong arrow function bắt scope từ bên ngoài (lexical `this`).

Trong TypeScript:
- Ta có thể khai báo kiểu cho `this` trong function để tăng type safety.
- Cú pháp: `function (this: Type, ...args) { ... }`
- Không được dùng arrow function, vì arrow function không có `this` riêng.

### 6.2. Ví dụ cơ bản
```typescript
interface User {
  id: number;
  admin: boolean;
}

interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

// Giả định getDB() trả về một đối tượng DB
declare function getDB(): DB;

const db: DB = getDB();

const admins = db.filterUsers(function (this: User) {
  return this.admin;
});
```
Trong ví dụ này:
- `filterUsers` muốn callback với `this` là `User`.
- TypeScript sẽ báo lỗi nếu `this` không phải `User`.
- Arrow function sẽ không hoạt động:
  ```typescript
  db.filterUsers(() => this.admin); // ❌ 'this' là globalThis
  // Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.
  ```

### 6.3. Câu hỏi tư duy
Giả sử em viết:
```typescript
const user = {
  id: 1,
  admin: false,
  becomeAdmin: () => {
    this.admin = true;
  }
};
```
Theo em, `this.admin = true` sẽ thay đổi thuộc tính nào?
Tại sao arrow function ở đây không sửa được `user.admin`?

### 6.4. Use case thực tế
**Callback-style API (ví dụ filter, map với thisArg)**
```typescript
interface Element {
  value: number;
  active: boolean;
}

function filterElements(filter: (this: Element) => boolean, elements: Element[]): Element[] {
  return elements.filter(e => filter.call(e));
}

const elements: Element[] = [
  { value: 1, active: true },
  { value: 2, active: false }
];

const activeElements = filterElements(function (this: Element) { return this.active; }, elements);
```
**DOM event handler (truy cập this là element DOM):**
```typescript
// Giả định button là một HTMLButtonElement
declare const button: HTMLButtonElement;

button.addEventListener("click", function (this: HTMLButtonElement) {
  this.disabled = true;
});
```

### 6.5. Bug thường gặp
- Dùng arrow function thay vì function → `this` không như mong đợi.
- Không khai báo type cho `this` trong callback → TypeScript suy luận `this: any` → mất type safety.
- Gán `this` cho biến và gọi ngoài context → `undefined` (strict mode).

### 6.6. Bài tập
**Bài tập 1:**
Viết một object `Counter`:
- Thuộc tính `value: number`
- Method `increment` nhận callback `(this: Counter) => void`
Khi gọi `increment`, callback được gọi với `this` là `Counter`.

Ví dụ:
```typescript
class Counter {
  value: number = 0;
  increment(callback: (this: Counter) => void) {
    callback.call(this);
  }
}

const counter = new Counter();
counter.increment(function() {
  this.value++;
});
console.log(counter.value); // 1
```

**Bài tập 2:**
Viết một function `forEachElement`:
- Nhận mảng `HTMLElement[]` và callback `(this: HTMLElement) => void`
- Gọi callback với `this` là mỗi element.
- Không dùng arrow function.

## 7. Other Types to Know About

### 7.1. `void`
`void` đại diện cho giá trị trả về của các hàm không trả về giá trị. Nó là kiểu được suy luận bất cứ khi nào một hàm không có bất kỳ câu lệnh `return` nào, hoặc không trả về bất kỳ giá trị rõ ràng nào từ các câu lệnh `return` đó:
```typescript
// The inferred return type is void
function noop() {
  return;
}
```
Trong JavaScript, một hàm không trả về bất kỳ giá trị nào sẽ ngầm định trả về giá trị `undefined`. Tuy nhiên, `void` và `undefined` không giống nhau trong TypeScript.

`void` không giống như `undefined`.

### 7.2. `object`
Kiểu đặc biệt `object` đề cập đến bất kỳ giá trị nào không phải là kiểu nguyên thủy (`string`, `number`, `bigint`, `boolean`, `symbol`, `null`, hoặc `undefined`). Điều này khác với kiểu đối tượng rỗng `{ }`, và cũng khác với kiểu toàn cục `Object`. Rất có thể bạn sẽ không bao giờ sử dụng `Object`.

`object` không phải `Object`. Luôn sử dụng `object`!

Lưu ý rằng trong JavaScript, các giá trị hàm là đối tượng: Chúng có thuộc tính, có `Object.prototype` trong chuỗi prototype của chúng, là `instanceof Object`, bạn có thể gọi `Object.keys` trên chúng, và do đó. Vì lý do này, các kiểu hàm được coi là đối tượng trong TypeScript.

### 7.3. `unknown`
Kiểu `unknown` đại diện cho bất kỳ giá trị nào. Điều này tương tự như kiểu `any`, nhưng an toàn hơn vì không hợp lệ để làm bất cứ điều gì với một giá trị `unknown`:
```typescript
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  // a.b(); // 'a' is of type 'unknown'.
}
```
Điều này hữu ích khi mô tả các kiểu hàm vì bạn có thể mô tả các hàm chấp nhận bất kỳ giá trị nào mà không có bất kỳ giá trị nào trong thân hàm của bạn.

Ngược lại, bạn có thể mô tả một hàm trả về một giá trị kiểu `unknown`:
```typescript
function safeParse(s: string): unknown {
  return JSON.parse(s);
}

// Need to be careful with 'obj'!
const obj = safeParse("someRandomString");
```

### 7.4. `never`
Một số hàm không bao giờ trả về giá trị:
```typescript
function fail(msg: string): never {
  throw new Error(msg);
}
```
Kiểu `never` đại diện cho các giá trị không bao giờ được quan sát. Trong một kiểu trả về, điều này có nghĩa là hàm ném một ngoại lệ hoặc chấm dứt thực thi chương trình.

`never` cũng xuất hiện khi TypeScript xác định không còn gì trong một union.
```typescript
function fn(x: string | number) {
  if (typeof x === "string") {
    // do something
  } else if (typeof x === "number") {
    // do something else
  } else {
    x; // has type 'never'!
  }
}
```

### 7.5. `Function`
Kiểu toàn cục `Function` mô tả các thuộc tính như `bind`, `call`, `apply`, và các thuộc tính khác có mặt trên tất cả các giá trị hàm trong JavaScript. Nó cũng có thuộc tính đặc biệt là các giá trị kiểu `Function` luôn có thể được gọi; các lệnh gọi này trả về `any`:
```typescript
function doSomething(f: Function) {
  return f(1, 2, 3);
}
```
Đây là một lệnh gọi hàm không được gõ kiểu và nói chung là tốt nhất nên tránh vì kiểu trả về `any` không an toàn.
Nếu bạn cần chấp nhận một hàm tùy ý nhưng không có ý định gọi nó, kiểu `() => void` nói chung là an toàn hơn.

### 7.6. Câu hỏi tư duy
- Khi nào nên dùng `unknown` thay vì `any`?
- Vì sao không nên dùng `Function` type trực tiếp cho callback?
- Sự khác biệt giữa `void` và `undefined` là gì?
- `never` thường dùng cho trường hợp nào?

### 7.7. Use case thực tế
- **Event handlers:** `void`
  ```typescript
  // Giả định button là một HTMLElement
  declare const button: HTMLElement;
  button.addEventListener("click", () => console.log("Clicked!")); // void
  ```
- **Parsing JSON từ API:** `unknown`
  ```typescript
  declare const response: string;
  const data: unknown = JSON.parse(response);
  ```
- **Exhaustive check union:** `never`
  ```typescript
  type Circle = { kind: "circle"; radius: number };
  type Square = { kind: "square"; size: number };
  type Shape = Circle | Square;

  function area(s: Shape) {
    switch(s.kind) {
      case "circle": return Math.PI * s.radius ** 2;
      case "square": return s.size ** 2;
      default: const _exhaustiveCheck: never = s; // Sẽ báo lỗi nếu có thêm loại Shape mới mà không được xử lý
    }
  }
  ```
- **Nhận bất kỳ object nào:** `object`
  ```typescript
  function printKeys(obj: object) {
    console.log(Object.keys(obj));
  }
  ```

### 7.8. Bug thường gặp
- Dùng `any` thay vì `unknown` → mất type safety.
- Dùng `Function` type → return `any`, dễ gây runtime error.
- Không khai báo return type `void` → TypeScript suy luận thành `any`.
- Dùng `object` nhưng truyền primitive → ❌ Error.

### 7.9. Bài tập
**Bài tập 1:**
Viết một hàm `logMessage`:
- Nhận callback `(msg: string) => void`
- Callback không trả về giá trị (`void`).

**Bài tập 2:**
Viết hàm `parseJsonSafe`:
- Nhận chuỗi JSON
- Trả về `unknown`
- Viết type guard để lấy `name: string` nếu có.

**Bài tập 3:**
Viết hàm `assertNever`:
- Nhận giá trị `x: never`
- Luôn throw error, dùng cho exhaustive checking union type.

## 8. Rest Parameters and Arguments

### 8.1. Lý thuyết
a) **Rest Parameters**
Dùng khi hàm nhận số lượng tham số không cố định.
- Cú pháp: `...paramName: Type[]`
- Luôn ở cuối danh sách tham số.
```typescript
function multiply(n: number, ...m: number[]): number[] {
  return m.map(x => n * x);
}

const a = multiply(10, 1, 2, 3, 4); // [10, 20, 30, 40]
```
`m` được TypeScript suy luận là `number[]`.

b) **Rest Arguments (Spread Syntax)**
Dùng khi truyền một iterable (array, tuple) vào hàm nhận nhiều tham số.
- Cú pháp: `...arrayOrTuple`
```typescript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2); // arr1 = [1,2,3,4,5,6]
```
Spread arguments phải là tuple hoặc rest parameter nếu dùng trong call:
```typescript
// Inferred as 2-length tuple
const args = [8, 5] as const;
// OK
const angle = Math.atan2(...args);
```
Sử dụng rest arguments có thể yêu cầu bật `downlevelIteration` khi nhắm mục tiêu các runtime cũ hơn.

### 8.2. Câu hỏi tư duy
- Tại sao rest parameter phải ở cuối trong danh sách tham số?
- Khi nào nên dùng `...args: number[]` vs dùng tuple `[number, number]`?
- Nếu truyền mảng động không phải tuple vào hàm có fixed arguments, TypeScript có báo lỗi không?

### 8.3. Use case thực tế
- **Hàm tính tổng nhiều số:**
  ```typescript
  function sum(...nums: number[]): number {
    return nums.reduce((a, b) => a + b, 0);
  }
  console.log(sum(1,2,3,4,5)); // 15
  ```
- **Wrapper cho console.log:**
  ```typescript
  function logAll(...args: unknown[]) {
    args.forEach(arg => console.log(arg));
  }
  logAll("Alice", 123, true);
  ```
- **Apply array to function expecting multiple args:**
  ```typescript
  const numbers = [3, 4];
  console.log(Math.max(...numbers)); // 4
  ```

### 8.4. Bug thường gặp
- Rest parameter không ở cuối danh sách tham số → ❌ Error.
  ```typescript
  // function f(...nums: number[], n: number) {} // ❌
  ```
- Truyền array thay vì tuple cho spread vào hàm cố định → TS có thể suy luận không chính xác.
  ```typescript
  const args = [8, 5]; // type number[]
  // Math.atan2(...args); // ❌ nếu compiler strict
  ```
- Không khai báo type cho rest parameter → mặc định `any[]` → mất type safety.

### 8.5. Bài tập
**Bài tập 1:**
Viết hàm `joinStrings(separator: string, ...strings: string[]): string`
Nối tất cả string với separator.
```typescript
joinStrings("-", "a","b","c"); // "a-b-c"
```

**Bài tập 2:**
Viết hàm `applyDiscount(base: number, ...discounts: number[]): number`
Áp dụng tuần tự các % discount lên giá base.

**Bài tập 3 (nâng cao):**
Cho hàm `calculateAngles(...args: [number, number] | [number, number, number])`
- Nếu 2 tham số → gọi `Math.atan2`
- Nếu 3 tham số → trả về trung bình
Dùng tuple types và spread syntax.

## 9. Parameter Destructuring

### 9.1. Lý thuyết
Parameter destructuring giúp lấy trực tiếp các thuộc tính từ object trong danh sách tham số.
Giúp code ngắn gọn, dễ đọc.
Trong TypeScript, cần khai báo type cho object sau cú pháp destructuring.
```typescript
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}

sum({ a: 10, b: 3, c: 9 }); // 22
```
Có thể dùng type alias để code gọn hơn:
```typescript
type ABC = { a: number; b: number; c: number };

function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```

### 9.2. Câu hỏi tư duy
- Nếu gọi `sum({ a: 1, b: 2 })` → TypeScript báo lỗi gì?
- Có thể destructure mảng trong tham số không? Ví dụ: `function first([x, y]: number[])`?

### 9.3. Use case thực tế
- **React props**
  ```typescript
  type ButtonProps = { text: string; color: string };

  function Button({ text, color }: ButtonProps) {
    console.log(`Button: ${text} - Color: ${color}`);
  }
  ```
- **API response**
  ```typescript
  type User = { id: number; name: string; admin: boolean };

  function logUser({ id, name }: User) {
    console.log(`User ${name} (ID: ${id})`);
  }
  ```
- **Default values trong destructuring**
  ```typescript
  function greet({ name = "Guest", age = 0 }: { name?: string; age?: number }) {
    console.log(`Hello ${name}, age ${age}`);
  }
  ```

### 9.4. Bug thường gặp
- Object không đủ thuộc tính → TypeScript báo lỗi.
  ```typescript
  // sum({ a: 1, b: 2 }); // ❌ thiếu c
  ```
- Tham số là `undefined` hoặc `null`
  ```typescript
  // sum(undefined); // ❌ lỗi runtime
  ```
- Không khai báo type → TypeScript suy luận `any` → mất type safety.

### 9.5. Bài tập
**Bài tập 1:**
Viết hàm `formatUser({ name, age }: { name: string; age: number })`
In ra "User: {name}, Age: {age}"

**Bài tập 2:**
Viết hàm `calculate({ x, y, z }: { x: number; y: number; z?: number })`
- Nếu `z` không có → mặc định 0
- Trả về tổng `x + y + z`

**Bài tập 3 (nâng cao):**
Viết hàm `configure({ host, port, protocol = "https" }: { host: string; port: number; protocol?: string })`
Trả về URL: "protocol://host:port"

## 10. Assignability of Functions (Return type `void`)

### 10.1. Lý thuyết
`void` là kiểu trả về của hàm không quan tâm giá trị trả về.

**Contextual typing**: khi một hàm được gán cho một type có return type `void`, hàm có thể trả về giá trị nhưng giá trị này sẽ bị bỏ qua.

Tuy nhiên, nếu `function literal` (cú pháp trực tiếp) khai báo `: void` → không được phép return bất kỳ giá trị nào.

### 10.2. Ví dụ
a) **Contextual typing**
```typescript
type voidFunc = () => void;

const f1: voidFunc = () => { return true; };
const f2: voidFunc = () => true;
const f3: voidFunc = function() { return true; };

const v1 = f1(); // v1: void
const v2 = f2(); // v2: void
const v3 = f3(); // v3: void
```
Giá trị `true` được ignore.

b) **Function literal khai báo `: void`**
```typescript
function f4(): void {
  // return true; // ❌ TS Error
}

const f5 = function(): void {
  // return true; // ❌ TS Error
}
```
Ở đây TypeScript bắt buộc hàm không return gì.

c) **Use case thực tế**
```typescript
const src = [1, 2, 3];
const dst: number[] = [];

// push trả về number nhưng forEach cần callback void
src.forEach(el => dst.push(el)); // ✅ OK
```
Đây là lý do vì sao `void` được flexible: để các callback ignore return value mà vẫn an toàn.

### 10.3. Câu hỏi tư duy
- Vì sao TypeScript lại cho phép return giá trị trong callback kiểu `void` nhưng ignore nó?
- Khi nào return trong function literal `: void` bị báo lỗi?
- Nếu gán hàm `() => number` vào type `() => void`, điều gì xảy ra?

### 10.4. Bug thường gặp
- Hiểu nhầm `void` = không thể return gì → thực tế trong contextual typing có thể return nhưng bị ignore.
- Trả về giá trị trong function literal `: void` → TypeScript báo lỗi.
- Gán callback trả về giá trị vào hàm expecting `void` → TS cho phép nhưng runtime bỏ qua, nếu không để ý có thể mất dữ liệu.

### 10.5. Bài tập
**Bài tập 1:**
Viết type `Logger = () => void`
Gán `Logger` cho một function return `true` hoặc `"ok"`
Quan sát TypeScript có báo lỗi không, in kiểu của return value.

**Bài tập 2:**
Viết function literal:
```typescript
function f(): void {
  // return 123; // ❌
}
```
Thử sửa lại sao cho TypeScript không báo lỗi.

**Bài tập 3:**
Viết hàm `forEachLog`:
- Nhận mảng `number[]`
- Callback `(n: number) => void`
- Trong callback, return giá trị khác (ví dụ `n*2`) → TS bỏ qua, in ra mảng kết quả của `forEach`.

## 11. Tổng hợp Câu hỏi Tư duy

### 11.1. Function Type Expressions & Call Signatures
- Nếu viết `function greeter(fn: (a: string) => void) { ... }`, liệu có thể truyền hàm trả về `number` không? Tại sao?
- Sự khác nhau giữa function type expression và call signature là gì?
- Khi nào nên dùng call signature thay vì function type?

### 11.2. Generic Functions
- Tại sao `function firstElement<Type>(arr: Type[]): Type | undefined` tốt hơn `function firstElement<Type extends any[]>(arr: Type)`?
- Nếu một type parameter chỉ xuất hiện một lần trong hàm, có nên dùng generic không?
- Khi nào cần dùng constraint (`extends`) trong generic?
- Nếu gọi `combine([1,2,3], ["a"])` mà không khai báo type union, TypeScript có báo lỗi không?

### 11.3. Optional Parameters
- Khi nào nên dùng `?` cho tham số optional, khi nào nên dùng default value?
- Nếu callback `(arg: any, index?: number) => void`, TypeScript sẽ hiểu gì về `index`?
- Tại sao optional parameter trong callback lại dễ gây lỗi `i is possibly undefined`?

### 11.4. Function Overloads
- Tại sao implementation signature không được gọi trực tiếp từ bên ngoài?
- Nếu hai overload có cùng số arguments và return type, có nên dùng union type thay cho overload không?
- Nếu gọi hàm overload với giá trị `string | number`, TypeScript sẽ báo lỗi gì?

### 11.5. Declaring `this` in a Function
- Arrow function và normal function khác nhau thế nào về `this`?
- Khi nào cần khai báo `this: Type` trong function?
- Nếu dùng arrow function cho callback nhận `this`, sẽ gặp vấn đề gì?

### 11.6. Other Types (`void`, `object`, `unknown`, `never`, `Function`)
- Khi nào nên dùng `unknown` thay cho `any`?
- Vì sao không nên dùng type `Function` trực tiếp cho callback?
- Khác biệt giữa `void` và `undefined` là gì?
- `never` thường dùng cho trường hợp nào?

### 11.7. Rest Parameters and Arguments
- Tại sao rest parameter phải ở cuối danh sách tham số?
- Khi nào nên dùng `...args: number[]` và khi nào dùng tuple `[number, number]`?
- Nếu truyền array động không phải tuple vào hàm có fixed arguments, TypeScript sẽ làm gì?

### 11.8. Parameter Destructuring
- Nếu gọi `sum({ a: 1, b: 2 })`, TypeScript báo lỗi gì?
- Có thể destructure mảng trong tham số không? Ví dụ `function first([x, y]: number[])`?
- Khi nào cần dùng default value trong destructuring parameters?

### 11.9. Assignability of Functions (Return type `void`)
- Vì sao TypeScript cho phép return giá trị trong callback kiểu `void` nhưng bỏ qua nó?
- Khi nào return trong function literal khai báo `: void` bị báo lỗi?
- Nếu gán hàm `() => number` vào type `() => void`, điều gì xảy ra?

## 12. Tổng hợp Nội dung Cô đọng & Sơ đồ Pipeline

### 12.1. Bảng tóm tắt Functions trong TypeScript
| Chủ đề | Cú pháp / Ví dụ | Lưu ý / Tips |
|---|---|---|
| Function Type Expressions | `(param: Type) => ReturnType` | Dùng để type một function, param name bắt buộc. |
| Call Signatures | `type Fn = { description: string; (x: number): boolean }` | Khi muốn function có property + callable. |
| Generic Functions | `function firstElement<T>(arr: T[]): T \| undefined` | Liên kết type input & output, constraint khi cần. |
| Optional Parameters | `function f(x?: number)`<br>`function f(x = 10)` | Optional param = `undefined`, default param = giá trị thay thế. |
| Function Overloads | `function makeDate(timestamp: number): Date;`<br>`function makeDate(m,d,y:number):Date;`<br>`function makeDate(mOrTimestamp:number,d?,y?) { ... }` | Overload signature + Implementation signature. Implementation không gọi trực tiếp từ bên ngoài. |
| Declaring `this` | `function (this: Type, param) {}` | Dùng với callback style, arrow function không có `this` riêng. |
| Other Types | `void`, `object`, `unknown`, `never`, `Function` | `void` bỏ qua return, `unknown` an toàn hơn `any`, `never` cho hàm không return. |
| Rest Parameters | `function f(...args: number[]) {}` | Luôn cuối param list, type array `T[]` hoặc tuple `[T, T]`. |
| Rest Arguments / Spread | `f(...array)` | Truyền iterable, cần tuple nếu call fixed args. |
| Parameter Destructuring | `function sum({a,b,c}: {a:number;b:number;c:number}) {}` | Có thể dùng default value cho optional. |
| Assignability / `void` | `type voidFunc = () => void`<br>`const f: voidFunc = () => true` | Contextual typing: return value bị ignore. Function literal `: void` không return gì. |

### 12.2. Sơ đồ nhớ Functions trong TypeScript
```
[Function Declaration / Expression]
          │
          ▼
[Function Type Expression] ←→ [Call Signature (callable + props)]
          │
          ▼
[Generic Functions] ──> [Constraints] ──> [Inference]
          │
          ▼
[Parameters]
   ├─ Optional / Default
   ├─ Rest Parameters (...args)
   └─ Destructuring ({a,b})
          │
          ▼
[Function Overloads]
          │
          ▼
[Return Types]
   ├─ void (ignore return)
   ├─ unknown (safe any)
   ├─ never (no return / exhaustive)
   └─ object / Function
          │
          ▼
[Assignability / Contextual Typing]
```

### 12.3. Tips tổng hợp
- **Generic** → liên kết type input & output, constraint khi cần.
- **Optional & Default param** → `x?: T` vs `x = default`.
- **Rest param & spread** → flexible, nhớ tuple khi cần.
- **Destructuring** → unpack trực tiếp, hỗ trợ default values.
- **Void return** → return value ignore trong contextual typing, không được return trong function literal.
- **`this`** → chỉ dùng function, không arrow, có thể khai báo type.
- **Overload** → signature rõ ràng, implementation chỉ nhìn thấy bên trong.
