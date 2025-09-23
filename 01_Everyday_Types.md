# Ôn tập TypeScript: Các Kiểu Dữ Liệu Cơ Bản

## 1. Primitives (Kiểu Nguyên Thủy)

### 1.1. string, number, boolean

1.  **Giải thích cơ bản**
    *   `string`: dùng để biểu diễn chuỗi ký tự.
        *   Ví dụ: `"Hello"`, `'TypeScript'`
    *   `number`: biểu diễn số (cả số nguyên và số thực, không phân biệt `int`/`float` như trong Java).
        *   Ví dụ: `42`, `3.14`, `-7`
    *   `boolean`: chỉ có 2 giá trị `true` hoặc `false`.

    ⚠️ **Lưu ý**:
    Đừng nhầm `string` với `String` (hay `number` với `Number`) vì chữ hoa là wrapper object trong JavaScript, gần như không bao giờ dùng khi khai báo type.
    👉 Luôn dùng chữ thường: `string`, `number`, `boolean`.

2.  **Ví dụ code cơ bản**

    ```typescript
    let myName: string = "Taro";
    let age: number = 25;
    let isStudent: boolean = true;

    console.log(`${myName} is ${age} years old. Student: ${isStudent}`);
    ```

3.  **Câu hỏi suy nghĩ 🤔**
    *   Nếu em viết:
        ```typescript
        let count: number = "5";
        ```
        👉 Kết quả sẽ thế nào? Tại sao?
    *   Khi nào nên dùng template string (`` `Hello ${name}` ``) thay vì concatenation (`"Hello " + name`)?
    *   Em có thể cho ví dụ một tình huống thực tế trong frontend mà em dùng `boolean` không?

4.  **Use case thực tế trong frontend**
    *   `string`: lưu username, email, message từ form.
    *   `number`: lưu số lượng sản phẩm, giá tiền, điểm số.
    *   `boolean`: lưu trạng thái đăng nhập (`isLoggedIn`), loading (`isLoading`), hoặc toggle bật/tắt dark mode (`isDarkMode`).

    Ví dụ nhỏ:

    ```typescript
    let isDarkMode: boolean = false;
    let username: string = "it-nippon";
    let itemsInCart: number = 3;

    if (isDarkMode) {
      console.log(`Welcome ${username}, your cart has ${itemsInCart} items (dark mode ON).`);
    } else {
      console.log(`Welcome ${username}, your cart has ${itemsInCart} items (light mode).`);
    }
    ```

5.  **Bug thường gặp 🐞**
    *   Nhầm lẫn giữa type thường và object wrapper
        ```typescript
        let str: String = new String("hello"); // ❌ hiếm khi dùng
        let str2: string = "hello";           // ✅ chuẩn
        ```
    *   Gán sai kiểu
        ```typescript
        let isDone: boolean = "true"; // ❌ Error: Type 'string' is not assignable to type 'boolean'
        ```
    *   Quên khai báo type (TypeScript sẽ tự suy luận, nhưng đôi khi không đúng như ta muốn).

6.  **Bài tập nhỏ 🎯**
    *   Khai báo các biến sau với đúng type:
        *   Tên của em (`string`)
        *   Tuổi (`number`)
        *   Có phải học viên của lớp TypeScript này không (`boolean`)
    *   Viết hàm:
        ```typescript
        function greet(name: string, age: number, isStudent: boolean): string {
          // trả về chuỗi giới thiệu
        }
        ```
        👉 Ví dụ: `greet("Lan", 20, true)` → `"Lan is 20 years old. Student: true"`

### 1.2. Template String vs Concatenation

1.  **Concatenation (nối chuỗi bằng `+`)**
    ```typescript
    let name: string = "Lan";
    let message: string = "Hello " + name + ", welcome!";
    ```
    👉 **Ưu điểm**: đơn giản, dễ hiểu, quen thuộc từ JavaScript cũ.
    👉 **Nhược điểm**: nếu chuỗi dài hoặc có nhiều biến thì dễ rối và khó đọc.

2.  **Template string (backtick + `${}`)**
    ```typescript
    let name: string = "Lan";
    let message: string = `Hello ${name}, welcome!`;
    ```
    👉 **Ưu điểm**:
    *   Đọc dễ hơn nhiều khi chèn nhiều biến.
    *   Hỗ trợ xuống dòng trực tiếp mà không cần `\n`.
    *   Viết nội suy giá trị (`${...}`) gọn gàng.
    👉 **Nhược điểm**: chỉ có từ ES6 trở đi (nhưng TypeScript compile ngược lại được nên thực tế không vấn đề).

3.  **Khi nào nên dùng?**
    *   Nếu chỉ nối một biến ngắn → có thể dùng cả hai, không khác biệt lớn.
    *   Nếu có nhiều biến, chuỗi phức tạp, hoặc cần xuống dòng → nên dùng template string.

    Ví dụ thực tế:

    ```typescript
    let productName: string = "MacBook Pro";
    let price: number = 2500;
    let isAvailable: boolean = true;

    let description: string = `Product: ${productName}
    Price: $${price}
    Available: ${isAvailable ? "Yes" : "No"}`;
    ```
    👉 Với concatenation, viết đoạn trên sẽ cực kỳ rối.

    ⚡ **Câu hỏi ngược cho em**:
    Giả sử em cần tạo một câu thông báo:
    `"User [username] has [n] new messages"`
    Với `username: string = "Taro"` và `n: number = 5`, em sẽ viết bằng concatenation và bằng template string như thế nào?

## 2. Arrays và `any`

### 2.1. Arrays

1.  **Định nghĩa Arrays**
    Trong TypeScript, để định nghĩa một mảng ta có 2 cách chính:

    *   **Cách 1: `type[]`**
        ```typescript
        let numbers: number[] = [1, 2, 3];
        let names: string[] = ["Lan", "Taro", "John"];
        ```
    *   **Cách 2: `Array<type>`**
        ```typescript
        let numbers: Array<number> = [1, 2, 3];
        let names: Array<string> = ["Lan", "Taro", "John"];
        ```
    👉 Hai cách này giống nhau, chỉ khác về cú pháp.
    👉 Thường thì `type[]` gọn hơn, nên được dùng nhiều hơn.

    ⚠️ **Lưu ý**: `[number]` không phải là mảng, mà là Tuple (một kiểu dữ liệu cố định số lượng phần tử).
    Ví dụ:
    ```typescript
    let tuple: [string, number] = ["Age", 20]; // luôn có đúng 2 phần tử: string rồi number
    ```

### 2.2. `any`

1.  **`any` là gì?**
    `any` là “lối thoát” của TypeScript: khi ta khai báo biến với `any`, TypeScript sẽ bỏ qua kiểm tra type cho biến đó.

    Ví dụ:
    ```typescript
    let obj: any = { x: 0 };

    obj.foo();   // OK
    obj();       // OK
    obj.bar = 100; // OK
    obj = "hello"; // OK
    const n: number = obj; // OK (nhưng nguy hiểm)
    ```
    👉 Dùng `any` tức là biến đó có thể trở thành bất kỳ kiểu gì, TypeScript sẽ không cảnh báo.
    👉 Nhưng nếu lạm dụng `any`, ta mất hết lợi ích của TypeScript.

### 2.3. `noImplicitAny`

1.  **`noImplicitAny`**
    Nếu ta không khai báo type, TypeScript sẽ cố gắng suy luận.
    Nhưng nếu nó không đoán được, mặc định sẽ cho là `any`.

    Ví dụ:
    ```typescript
    function add(x, y) {
      return x + y;
    }
    ```
    👉 Ở đây `x` và `y` mặc định là `any`.
    👉 Nếu bật `noImplicitAny`, compiler sẽ báo lỗi và yêu cầu ta chỉ rõ:
    ```typescript
    function add(x: number, y: number): number {
      return x + y;
    }
    ```
    ✅ Đây là cách tốt để giữ code an toàn, rõ ràng.

### 2.4. Câu hỏi suy nghĩ 🤔

*   Khai báo một mảng `string[]` chứa tên 3 người bạn của em.
*   Nếu ta viết:
    ```typescript
    let list: any[] = [1, "two", true];
    ```
    Theo em, điều này có lợi hay có hại?
*   Khi nào `any` là hữu ích (ví dụ: khi nhận dữ liệu JSON từ API chưa biết cấu trúc)?

### 2.5. Use case thực tế

*   `Array`: danh sách sản phẩm (`Product[]`), danh sách user (`User[]`).
*   `any`: dữ liệu chưa rõ type, ví dụ khi parse JSON từ server chưa định nghĩa interface.

    Ví dụ:
    ```typescript
    function parseData(data: any) {
      console.log(data.id); // có thể chạy, nhưng dễ bug nếu data không có id
    }
    ```

### 2.6. Bug thường gặp 🐞

*   **Dùng `any` quá nhiều**
    Làm code khó bảo trì, không tận dụng sức mạnh của TypeScript.
*   **Nhầm array với tuple**
    ```typescript
    let arr: [number] = [1, 2, 3]; // ❌ Lỗi vì tuple [number] chỉ cho 1 phần tử
    ```

### 2.7. Bài tập nhỏ 🎯

*   Khai báo mảng số nguyên `scores: number[]` với giá trị `[90, 85, 100]`.
*   Viết hàm:
    ```typescript
    function getFirst<T>(arr: T[]): T {
      // trả về phần tử đầu tiên trong mảng
    }
    ```
    👉 Gợi ý: Đây là lúc đầu tiên em chạm vào generic (`<T>`).
*   Viết hàm nhận vào `any` và in ra kiểu của nó bằng `typeof`.

## 3. Type Annotations on Variables

### 3.1. Type Annotation là gì?

Khi khai báo biến bằng `let`, `const`, hoặc `var`, em có thể chỉ định rõ kiểu dữ liệu của biến đó bằng cú pháp:

```typescript
let myName: string = "Alice";
let age: number = 25;
let isStudent: boolean = true;
```
👉 Đây gọi là type annotation (ghi chú kiểu dữ liệu).

### 3.2. So sánh với Java / C / C#

*   Trong Java/C# ta hay viết kiểu type ở bên trái:
    ```java
    int x = 0;
    String name = "Alice";
    ```
*   Trong TypeScript, type annotation luôn ở bên phải tên biến:
    ```typescript
    let x: number = 0;
    let name: string = "Alice";
    ```

### 3.3. Type Inference (Suy luận kiểu)

TypeScript thông minh: nếu em khởi tạo biến ngay khi khai báo, nó sẽ tự động suy ra kiểu dữ liệu.
👉 Thường thì ta không cần annotation thủ công.

Ví dụ:
```typescript
let myName = "Alice"; // TS tự hiểu myName: string
let age = 30;         // TS tự hiểu age: number
let isAdmin = false;  // TS tự hiểu isAdmin: boolean
```
Nếu em thử gán kiểu khác:
```typescript
myName = 123; // ❌ Error: number is not assignable to string
```

### 3.4. Khi nào nên dùng Type Annotation?

*   **Khi không có giá trị khởi tạo**
    ```typescript
    let result: number; // cần annotation vì chưa gán giá trị
    result = 10;        // sau này gán
    ```
*   **Khi TS không thể suy luận chính xác**
    ```typescript
    let data: any; // (tạm thời khi chưa biết type rõ ràng)
    ```
*   **Khi muốn code rõ ràng hơn cho người đọc**
    ```typescript
    let userId: number = 123; // có thể infer được, nhưng annotation giúp dễ đọc hơn
    ```

### 3.5. Câu hỏi suy nghĩ 🤔

*   Trong ví dụ này:
    ```typescript
    let score = 100;
    ```
    Theo em `score` có type gì?
    Nếu sau đó em gán `score = "excellent";` thì điều gì xảy ra?
*   Có khi nào việc ghi chú type lại thừa thãi không? Em cho ví dụ.

### 3.6. Use case thực tế

*   Khi viết API client, có thể khai báo trước type để tránh sai sót:
    ```typescript
    let response: string;
    response = await fetchData();
    ```
*   Trong React + TypeScript, khi khai báo state mà chưa biết giá trị ban đầu:
    ```typescript
    const [user, setUser] = useState<User | null>(null);
    ```

### 3.7. Bug thường gặp 🐞

*   **Quên khai báo type khi không khởi tạo biến** → biến thành `any`.
    ```typescript
    let value; // implicit any (nếu không bật noImplicitAny)
    ```
*   **Lạm dụng annotation khi không cần thiết**
    ```typescript
    let count: number = 5; // annotation thừa vì TS infer được rồi
    ```

### 3.8. Bài tập nhỏ 🎯

*   Khai báo 3 biến với type annotation rõ ràng:
    *   `username: string`
    *   `points: number`
    *   `isOnline: boolean`
*   Khai báo biến `temperature` mà không có type annotation, gán giá trị `36.5`, sau đó thử gán `"hot"` xem TS phản ứng thế nào.
*   (Nâng cao) Viết hàm:
    ```typescript
    function doubleValue(x: number): number {
      // trả về x nhân đôi
    }
    ```
    👉 Sau đó thử bỏ `: number` ở tham số và ở return xem TS có đoán đúng không.

## 4. Functions

### 4.1. Functions là gì?

Trong JavaScript (và TypeScript), function là cách chính để đóng gói logic, truyền dữ liệu, và tái sử dụng code.
Trong TypeScript, function trở nên mạnh mẽ hơn nhờ có type annotations cho tham số (parameters) và giá trị trả về (return value).

### 4.2. Parameter Type Annotations

Ta có thể gắn type sau tên tham số:

```typescript
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase() + "!!");
}

greet("Alice");  // ✅ OK
greet(42);       // ❌ Error: number is not assignable to string
```
👉 Điều này giúp ngăn bug runtime như gọi `toUpperCase()` trên số.

### 4.3. Return Type Annotations

Type của giá trị trả về viết sau danh sách tham số:

```typescript
function getFavoriteNumber(): number {
  return 26;
}
```
👉 Thường thì TypeScript tự infer return type, nhưng thêm annotation giúp:
*   Rõ ràng cho người đọc code
*   Bảo vệ nếu ta vô tình thay đổi logic

Ví dụ:
```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

### 4.4. Functions trả về Promise

Nếu function là `async`, ta phải annotate với `Promise<type>`:

```typescript
async function fetchUserName(): Promise<string> {
  return "Taro";
}
```

### 4.5. Anonymous Functions (Hàm ẩn danh)

TypeScript có contextual typing: nó sẽ tự suy luận type tham số từ ngữ cảnh.

```typescript
const names = ["Alice", "Bob", "Eve"];

// function bình thường
names.forEach(function (s) {
  console.log(s.toUpperCase()); // TS biết s: string
});

// arrow function
names.forEach((s) => {
  console.log(s.toUpperCase());
});
```
👉 Không cần annotation thủ công (`s: string`), vì TypeScript biết `names` là `string[]`.

### 4.6. Câu hỏi suy nghĩ 🤔

*   Viết function `multiply(a: number, b: number): number` và thử trả về `a + b`. TypeScript có bắt lỗi không? Vì sao?
*   Nếu ta viết:
    ```typescript
    function greet(name) {
      return "Hello " + name;
    }
    ```
    Type của `name` là gì khi không khai báo?
    *   **Trả lời**: Là `any`.
*   Khi nào thì nên ghi rõ return type cho function?

### 4.7. Use Case thực tế

*   Frontend (React): handler click button
    ```typescript
    const handleClick = (event: MouseEvent): void => {
      console.log(event.clientX, event.clientY);
    };
    ```
*   API call:
    ```typescript
    async function fetchProducts(): Promise<Product[]> {
      const res = await fetch("/api/products");
      return res.json();
    }
    ```

### 4.8. Bug thường gặp 🐞

*   **Quên return trong function mà có return type**:
    ```typescript
    function getAge(): number {
      // ❌ Lỗi: không return gì
    }
    ```
*   **Trả về sai type**:
    ```typescript
    function getName(): string {
      return 123; // ❌ number is not assignable to string
    }
    ```
*   **Lạm dụng `any` trong function params**
    ```typescript
    function printData(data: any) { console.log(data); }
    // Dễ gây bug, vì data có thể là bất cứ gì
    ```

### 4.9. Bài tập nhỏ 🎯

*   Viết function:
    ```typescript
    function square(n: number): number {
      // trả về bình phương của n
    }
    ```
*   Viết function `async`:
    ```typescript
    async function getRandomNumber(): Promise<number> {
      // trả về số ngẫu nhiên 0-100
    }
    ```
*   Dùng `forEach` với array `["TypeScript", "JavaScript", "React"]` để in ra tất cả chữ in hoa.
    👉 Em thử viết với arrow function trước.

## 5. Object Types

### 5.1. Định nghĩa Object Type cơ bản

TypeScript cho phép em mô tả cấu trúc của object bằng cách khai báo các property và type của chúng:

```typescript
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 3, y: 7 });
```
👉 Ở đây, parameter `pt` được annotate với type:
`{ x: number; y: number }`
tức là object phải có hai property: `x` và `y`, đều là `number`.

### 5.2. Cách viết properties

Có thể dùng dấu chấm phẩy (`;`) hoặc dấu phẩy (`,`) để ngăn cách các property.
Dấu cuối cùng có thể bỏ qua:

```typescript
{ x: number, y: number }
{ x: number; y: number }
{ x: number; y: number; }
```
👉 Tất cả đều hợp lệ.

### 5.3. Optional Properties (Thuộc tính tuỳ chọn)

Thêm dấu `?` sau tên property để chỉ ra rằng property đó có thể có hoặc không có.

Ví dụ:
```typescript
function printName(obj: { first: string; last?: string }) {
  console.log("First:", obj.first);

  if (obj.last !== undefined) {
    console.log("Last:", obj.last.toUpperCase());
  }

  // Hoặc dùng optional chaining:
  console.log("Last (safe):", obj.last?.toUpperCase());
}

printName({ first: "Bob" });                      // OK
printName({ first: "Alice", last: "Alisson" });  // OK
```
👉 Vì `last` là optional, nếu không kiểm tra `undefined` trước khi dùng method (`toUpperCase()`), TS sẽ báo lỗi.

### 5.4. Câu hỏi suy nghĩ 🤔

*   Nếu khai báo:
    ```typescript
    function showUser(user: { id: number; name: string; isAdmin?: boolean }) {
      console.log(user.name, user.isAdmin);
    }
    ```
    Khi gọi `showUser({ id: 1, name: "Taro" })` → `isAdmin` có giá trị gì?
*   Tại sao TypeScript không cho phép em gọi trực tiếp `obj.last.toUpperCase()` khi `last` là optional?

### 5.5. Use Case thực tế

*   Frontend:
    Object `User` với các property optional như `avatarUrl?`, `bio?`.
    Khi gọi API, dữ liệu có thể thiếu field nào đó.

    Ví dụ:
    ```typescript
    type User = {
      id: number;
      username: string;
      email?: string; // Có thể có hoặc không
    };

    function displayUser(user: User) {
      console.log("User:", user.username);
      console.log("Email:", user.email ?? "No email provided");
    }

    displayUser({ id: 1, username: "it-nippon" });
    ```

### 5.6. Bug thường gặp 🐞

*   **Quên kiểm tra optional property**
    ```typescript
    obj.last.toUpperCase(); // ❌ Error
    ```
*   **Khai báo thiếu property bắt buộc**
    ```typescript
    printCoord({ x: 3 }); // ❌ Lỗi: thiếu y
    ```
*   **Thêm property không được khai báo**
    ```typescript
    printCoord({ x: 3, y: 7, z: 9 }); // ❌ TS báo "object literal may only specify known properties"
    ```

### 5.7. Bài tập nhỏ 🎯

*   Viết type `Product` gồm:
    *   `id: number`
    *   `name: string`
    *   `price?: number` (có thể không có)
    Sau đó viết function `printProduct(product: Product)` để in ra thông tin. Nếu `price` không có, in `"Price: unknown"`.
*   Viết function:
    ```typescript
    function getFullName(user: { first: string; middle?: string; last: string }): string {
      // trả về "first middle last" (nếu middle có), còn nếu không có middle thì trả về "first last"
    }
    ```

## 6. Union Types

### 6.1. Định nghĩa Union Type

Union type = một biến / tham số / giá trị có thể thuộc nhiều loại type khác nhau.
👉 Viết bằng dấu gạch đứng `|` (OR).

Ví dụ:
```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}

printId(101);    // ✅ OK (number)
printId("202");  // ✅ OK (string)
printId({ myID: 22342 }); // ❌ Error (không phải number hay string)
```

### 6.2. Union với nhiều loại hơn

```typescript
function printTextOrNumberOrBool(
  value: string | number | boolean
) {
  console.log("Value:", value);
}

printTextOrNumberOrBool("Hello");
printTextOrNumberOrBool(123);
printTextOrNumberOrBool(true);
```

### 6.3. Làm việc với Union Type (Narrowing)

⚠️ Nếu em có union, TS chỉ cho phép những thao tác chung của tất cả các type.

Ví dụ:
```typescript
function printId(id: number | string) {
  console.log(id.toUpperCase()); // ❌ Error
}
```
👉 Vì `toUpperCase()` chỉ có trong `string`, không có trong `number`.

**Cách giải quyết: Type Narrowing**
Dùng điều kiện (`typeof`, `Array.isArray`, …) để thu hẹp type:

```typescript
function printId(id: number | string) {
  if (typeof id === "string") {
    // ✅ ở đây id: string
    console.log(id.toUpperCase());
  } else {
    // ✅ ở đây id: number
    console.log(id);
  }
}
```
Với Array vs String
```typescript
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // ✅ x là string[]
    console.log("Hello, " + x.join(" and "));
  } else {
    // ✅ x là string
    console.log("Welcome lone traveler " + x);
  }
}
```

### 6.4. Trường hợp chung (common properties)

Nếu các type trong union đều có cùng property/method, em có thể dùng trực tiếp mà không cần narrowing.

Ví dụ:
```typescript
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3); // OK vì cả string và array đều có slice()
}

console.log(getFirstThree("TypeScript")); // "Typ"
console.log(getFirstThree([10, 20, 30, 40])); // [10, 20, 30]
```
👉 Ở đây, return type được TS infer: `string | number[]`.

### 6.5. Câu hỏi suy nghĩ 🤔

*   Trong function này:
    ```typescript
    function formatInput(input: string | number) {
      return input.toFixed(2);
    }
    ```
    Vì sao TS báo lỗi? Em sửa thế nào?
*   Nếu ta viết:
    ```typescript
    function showLength(x: string | string[]) {
      console.log(x.length);
    }
    ```
    Theo em, tại sao code này không báo lỗi, dù `string` và `string[]` là khác nhau?

### 6.6. Use Case thực tế

*   Frontend form input: giá trị có thể là `string` hoặc `number`
    ```typescript
    function handleChange(value: string | number) {
      console.log("New value:", value);
    }
    ```
*   API response: dữ liệu có thể là một object hoặc một mảng
    ```typescript
    type User = { id: number; name: string };
    type ApiResponse = User | User[];

    function processResponse(res: ApiResponse) {
      if (Array.isArray(res)) {
        console.log("Users:", res.map(u => u.name));
      } else {
        console.log("Single user:", res.name);
      }
    }
    ```

### 6.7. Bug thường gặp 🐞

*   **Quên narrowing trước khi gọi method**
    ```typescript
    function printLen(id: string | number) {
      console.log(id.length); // ❌ Error
    }
    ```
*   **Lạm dụng `any` thay vì union**
    ```typescript
    function printAnything(id: any) { console.log(id); } // ❌ mất type safety
    ```
*   **Nhầm lẫn giữa union và intersection (`&`)**
    ```typescript
    let a: string | number; // string HOẶC number
    let b: string & number; // ❌ gần như không tồn tại, vì không thể vừa là string vừa là number
    ```

### 6.8. Bài tập nhỏ 🎯

*   Viết function:
    ```typescript
    function describeId(id: number | string): string {
      // nếu id là number -> "ID is number: X"
      // nếu id là string -> "ID is string: X"
    }
    ```
*   Viết function:
    ```typescript
    function getLength(x: string | string[]): number {
      // trả về độ dài (string.length hoặc array.length)
    }
    ```
*   Viết function:
    ```typescript
    function processInput(input: string | number | boolean) {
      // nếu string: in hoa
      // nếu number: nhân đôi
      // nếu boolean: đảo ngược giá trị
    }
    ```

## 7. Type Aliases

### 7.1. Type Alias là gì?

👉 Là cách đặt tên mới (alias) cho một type đã có.
Giúp code dễ đọc hơn, tái sử dụng type, và tránh lặp lại nhiều lần.

Cú pháp:
```typescript
type TênAlias = KiểuDữLiệu;
```

### 7.2. Alias cho Object Type

Ví dụ ban đầu:

```typescript
type Point = {
  x: number;
  y: number;
};

function printCoord(pt: Point) {
  console.log("x:", pt.x);
  console.log("y:", pt.y);
}

printCoord({ x: 100, y: 100 });
```
👉 Giống hệt như viết thẳng `{ x: number; y: number }`, nhưng gọn và có thể tái sử dụng.

### 7.3. Alias cho Union Type

```typescript
type ID = number | string;

function printId(id: ID) {
  console.log("Your ID:", id);
}

printId(123);
printId("abc123");
```

### 7.4. Alias cho Primitive Type

Có thể alias luôn cả type primitive:

```typescript
type MyString = string;
type Age = number;

let name: MyString = "Alice";
let age: Age = 25;
```
⚠️ Nhưng lưu ý: không tạo ra type mới tách biệt – chỉ là tên gọi khác.
Ví dụ:

```typescript
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
  return str.trim();
}

let userInput = sanitizeInput("   hello   ");

// vẫn có thể gán lại với string
userInput = "new input"; // ✅ OK
```
👉 Khác với type branding (thường dùng với `& { __brand: ... }`) nếu muốn tạo type “riêng biệt”.

### 7.5. Alias trong code thực tế

*   **Định nghĩa dữ liệu domain**
    ```typescript
    type User = {
      id: number;
      name: string;
      email?: string;
    };

    function createUser(user: User) {
      console.log("User created:", user.name);
    }
    ```
*   **API Response**
    ```typescript
    type ApiResponse = { status: number; data: any } | { error: string };

    function handleResponse(res: ApiResponse) {
      if ("error" in res) {
        console.error("API Error:", res.error);
      } else {
        console.log("Data:", res.data);
      }
    }
    ```

### 7.6. So sánh với Interface

*   **Giống nhau**: Đều có thể định nghĩa object type.
*   **Khác nhau**:
    *   `interface`: thường dùng cho object, có thể mở rộng (`extends`, `implements`).
    *   `type`: dùng được cho mọi loại (object, union, primitive, function…).

Ví dụ:
```typescript
// Interface (object only)
interface PointI {
  x: number;
  y: number;
}

// Type Alias (đa năng)
type PointT = {
  x: number;
  y: number;
};
type ID = string | number;
```
👉 Nhiều team chọn:
*   `interface` cho object cấu trúc dữ liệu
*   `type` cho union/alias chung

### 7.7. Bảng so sánh Interface và Type

| Đặc điểm              | `type`                               | `interface`                               |
| :-------------------- | :----------------------------------- | :---------------------------------------- |
| Định nghĩa object     | ✅                                   | ✅                                        |
| Union / Primitive alias | ✅                                   | ❌                                        |
| Extend (kế thừa)      | `&` (intersection)                   | `extends`                                 |
| Merge lại nhiều lần   | ❌                                   | ✅ (có thể khai báo thêm fields cho cùng 1 interface) |

**Ví dụ về Kế thừa:**

*   **Với `interface` → dùng `extends`**
    ```typescript
    interface Animal {
      name: string;
    }

    interface Bear extends Animal {
      honey: boolean;
    }

    const bear: Bear = { name: "Winnie", honey: true };
    // Bear kế thừa Animal, có thêm field honey.
    ```
*   **Với `type` → dùng intersection (`&`)**
    ```typescript
    type Animal = {
      name: string;
    };

    type Bear = Animal & {
      honey: boolean;
    };

    const bear: Bear = { name: "Pooh", honey: true };
    // Bear = hợp nhất Animal và { honey: boolean }.
    ```
    ✅ Kết quả giống nhau, chỉ khác cú pháp.

**Ví dụ về Mở rộng định nghĩa sau khi đã tạo:**

*   **`interface` có thể merge declarations**
    ```typescript
    interface Window {
      title: string;
    }

    interface Window {
      ts: string;
    }

    const myWindow: Window = {
      title: "Hello",
      ts: "TypeScript API",
    };
    // 2 lần khai báo interface Window sẽ tự động gộp thành:
    // interface Window {
    //   title: string;
    //   ts: string;
    // }
    ```
*   **`type` thì không thể merge**
    ```typescript
    type Window = {
      title: string;
    };

    type Window = {
      ts: string;
    };

    // ❌ Error: Duplicate identifier 'Window'
    // Một type đã được định nghĩa thì không thể thay đổi thêm.
    ```

### 7.8. Khi nào chọn `interface` vs `type`?

*   **Dùng `interface` khi**:
    *   Muốn mô tả object shapes (cấu trúc object).
    *   Cần mở rộng/merge trong tương lai (ví dụ `Window`, `HTMLElement`).
    *   Làm việc với class (`implements`).
*   **Dùng `type` khi**:
    *   Cần mô tả union, tuple, function signatures, primitive alias.
    *   Muốn tạo type phức tạp, generic, hoặc kết hợp nhiều type.
    *   Khi không cần merge sau này.

### 7.9. Bài tập 🎯

*   Tạo alias `FullName` cho `{ first: string; last: string }` và viết function:
    ```typescript
    function printFullName(name: FullName): void
    ```
*   Tạo alias `Pet` cho union `"dog" | "cat" | "bird"`, viết function:
    ```typescript
    function feed(pet: Pet): void
    ```
*   Tạo alias `ApiResponse<T>` (generic), cho phép dùng như:
    ```typescript
    type ApiResponse<T> = { status: "ok"; data: T } | { status: "error"; message: string };

    const res1: ApiResponse<number> = { status: "ok", data: 123 };
    const res2: ApiResponse<string> = { status: "error", message: "Not found" };
    ```

## 8. Type Assertions

### 8.1. Type Assertion là gì?

👉 Khi TypeScript không chắc chắn type, nhưng em biết rõ hơn compiler.
Khi đó, em có thể "ép" giá trị thành type mình mong muốn.

Ví dụ với DOM:
```typescript
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```
`getElementById` trả về `HTMLElement | null`.
Nhưng em biết chắc nó là `<canvas>`, nên dùng `as HTMLCanvasElement`.

⚡ Type Assertion chỉ tồn tại ở compile-time, không thay đổi runtime.
Nghĩa là nếu element không tồn tại, code vẫn crash ở runtime.

### 8.2. Cú pháp

Có 2 cách viết (giống nhau):

*   **Cách 1: `as`**
    ```typescript
    const el = document.getElementById("app") as HTMLDivElement;
    ```
*   **Cách 2: angle bracket (`<>`)**
    ```typescript
    const el2 = <HTMLDivElement>document.getElementById("app");
    ```
⚠️ **Lưu ý**: trong file `.tsx` (React), không dùng được angle bracket vì dễ nhầm với JSX.

### 8.3. Giới hạn ép kiểu

TypeScript chỉ cho phép:
*   ép từ type rộng → hẹp
*   hoặc từ hẹp → rộng

Ví dụ:
```typescript
const x = "hello" as string; // ✅ OK
const y = "hello" as number; // ❌ Error
```
Lỗi vì `"hello"` không có quan hệ gì với `number`.

### 8.4. Ép kiểu “bẻ lái 2 bước”

Khi TS quá "bảo thủ", em có thể qua trung gian `any` hoặc `unknown`:

```typescript
const a = "hello" as any as number; // ✅ TS cho phép, nhưng nguy hiểm
```
👉 Nên hạn chế dùng trừ khi thật sự cần.

### 8.5. Thực tế hay gặp

*   **DOM manipulation**
    ```typescript
    const input = document.querySelector("input#username") as HTMLInputElement;
    console.log(input.value);
    ```
*   **Dữ liệu từ API**
    ```typescript
    type User = { id: number; name: string };

    const res = JSON.parse('{"id":1,"name":"Alice"}') as User;
    ```
*   **Type narrowing không đủ**
    ```typescript
    function getLength(val: string | number) {
      return (val as string).length ?? val.toString().length;
    }
    ```

### 8.6. Bug thường gặp ⚠️

*   **Nhầm type → code compile được nhưng crash runtime.**
    ```typescript
    const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
    // Nếu element thật sự là <div>, runtime sẽ nổ khi gọi API của <canvas>
    ```
*   **Quên check null**
    ```typescript
    const el = document.getElementById("id") as HTMLDivElement;
    el.innerHTML = "hi";
    // ❌ Nếu element không tồn tại => runtime error
    ```
    👉 Cách an toàn hơn:
    ```typescript
    const el = document.getElementById("id");
    if (el) {
      (el as HTMLDivElement).innerHTML = "hi";
    }
    ```

### 8.7. Bài tập 🎯

*   Lấy element có id `"password"`, assert nó là `HTMLInputElement`, sau đó log ra `.value`.
*   Parse JSON `{"success":true,"data":["A","B"]}` và assert thành type:
    ```typescript
    type ApiResponse = { success: boolean; data: string[] };
    ```
*   Viết function nhận tham số `value: string | number`, nếu là `string` thì ép kiểu để gọi `.toUpperCase()`, nếu là `number` thì in ra bình thường.

## 9. Literal Types

### 9.1. Literal Types là gì?

👉 Ngoài type tổng quát `string`, `number`, `boolean`…
TypeScript cho phép ta khai báo giá trị cụ thể làm type, ví dụ:

```typescript
const greeting: "Hello" = "Hello";
// chỉ có thể nhận đúng giá trị "Hello"
```
Nó giống như "biến chỉ được phép giữ đúng một giá trị".

### 9.2. Ví dụ cơ bản

```typescript
let x: "hello" = "hello";
x = "hello"; // ✅ OK
x = "hi";    // ❌ Error
```
*   Với `let` → biến có thể đổi giá trị, nên TS sẽ infer type chung (`string`, `number`).
*   Với `const` → biến cố định, TS sẽ infer luôn là literal type.

```typescript
let changing = "Hello"; // type: string
const constant = "Hello"; // type: "Hello"
```

### 9.3. Union với Literal Types

👉 Literal chỉ một giá trị thì ít hữu ích.
Nhưng khi kết hợp với union, nó trở nên mạnh mẽ.

```typescript
function printText(s: string, alignment: "left" | "right" | "center") {
  console.log(`Text: ${s}, align: ${alignment}`);
}

printText("Hello", "left");   // ✅ OK
printText("Hi", "centre");    // ❌ Error ("centre" không nằm trong union)
```

### 9.4. Literal Numbers và Booleans

*   **Numeric literal types**:
    ```typescript
    function compare(a: string, b: string): -1 | 0 | 1 {
      return a === b ? 0 : a > b ? 1 : -1;
    }
    ```
*   **Boolean literal types**: chỉ có `true` hoặc `false`
    ```typescript
    type YesOrNo = true | false;
    let answer: YesOrNo = true;
    answer = false; // ✅
    answer = "yes"; // ❌
    ```

### 9.5. Literal Inference & `as const`

Một vấn đề hay gặp:

```typescript
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };

handleRequest(req.url, req.method);
// ❌ Error: req.method inferred as string, không phải "GET"
```
👉 Vì TS nghĩ `req.method` có thể đổi thành `"GUESS"`, nên nó không infer thành `"GET"`.

**Cách fix**:
*   **Cách 1: ép type riêng cho field**
    ```typescript
    const req = { url: "https://example.com", method: "GET" as "GET" };
    handleRequest(req.url, req.method);
    ```
*   **Cách 2: ép lúc gọi**
    ```typescript
    handleRequest(req.url, req.method as "GET");
    ```
*   **Cách 3: `as const` (hay nhất)**
    ```typescript
    const req = { url: "https://example.com", method: "GET" } as const;
    // toàn bộ object thành literal type
    handleRequest(req.url, req.method);
    ```

### 9.6. Thực tế hay dùng Literal Types ở đâu?

*   **API Methods**
    ```typescript
    type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
    function request(url: string, method: HttpMethod) { /* ... */ }
    ```
*   **State Machines**
    ```typescript
    type State = "loading" | "success" | "error";
    let currentState: State = "loading";
    ```
*   **Config Options**
    ```typescript
    type Theme = "light" | "dark";
    function setTheme(t: Theme) { /* ... */ }
    ```

### 9.7. Bug thường gặp ⚠️

*   Quên `as const` → field bị infer thành type tổng quát (`string`), gây lỗi khi truyền.
*   Sai chính tả khi dùng literal union (`"centre"` vs `"center"`).
*   Không kiểm soát được giá trị khi dùng string tự do, dẫn tới lỗi runtime. Literal giúp hạn chế điều này.

### 9.8. Bài tập 🎯

*   Viết type `Direction = "up" | "down" | "left" | "right"`
    → viết function `move(dir: Direction)` và test gọi với `"left"`, `"up"`, `"forward"`.
*   Viết function `setVolume(level: 0 | 1 | 2 | 3 | 4 | 5)`
    → test với `3` và `10`.
*   Viết object:
    ```typescript
    const config = {
      theme: "dark",
      layout: "grid"
    } as const;
    ```
    → Tạo function `applyConfig(cfg: { theme: "light" | "dark"; layout: "grid" | "list" })`
    và truyền `config` vào.

## 10. `null` và `undefined`

### 10.1. `null` và `undefined` trong JS/TS

*   `undefined`: giá trị mặc định khi một biến được khai báo nhưng chưa gán.
    ```typescript
    let a;
    console.log(a); // undefined
    ```
*   `null`: giá trị "có chủ đích" để nói rằng "không có gì".
    ```typescript
    let b = null;
    ```
👉 Trong TypeScript, cả hai cũng có kiểu riêng: `null` và `undefined`.

### 10.2. `strictNullChecks`

*   🔴 **Khi `strictNullChecks = false` (tắt)**
    `null` và `undefined` có thể gán cho bất kỳ type nào.
    Dễ gây bug.
    ```typescript
    let str: string = "hello";
    str = null;        // ✅ Không lỗi
    str = undefined;   // ✅ Không lỗi

    console.log(str.toUpperCase()); // ❌ Runtime error nếu là null
    ```
    👉 Đây giống như Java/C# khi không kiểm tra null.

*   🟢 **Khi `strictNullChecks = true` (bật - khuyến nghị)**
    `null` và `undefined` chỉ có thể gán nếu ta cho phép trong type.
    Bắt buộc phải check trước khi dùng.
    ```typescript
    function doSomething(x: string | null) {
      if (x === null) {
        // xử lý trường hợp null
      } else {
        console.log(x.toUpperCase()); // ✅ OK
      }
    }
    ```

### 10.3. Non-null Assertion (`!`)

Dùng dấu `!` sau biến để nói với TypeScript: "Tao chắc chắn biến này không null/undefined đâu."
Nó không thay đổi runtime, chỉ bỏ check type thôi.

```typescript
function liveDangerously(x?: number | null) {
  console.log(x!.toFixed()); // ✅ TS không báo lỗi
}

liveDangerously(3);    // OK
liveDangerously(null); // ❌ Runtime error (vẫn crash!)
```
👉 Rất nguy hiểm nếu lạm dụng → chỉ dùng khi chắc chắn giá trị tồn tại.

### 10.4. Best Practices 💡

*   Luôn bật `strictNullChecks` để tránh bug.
*   Dùng union types để khai báo rõ ràng:
    ```typescript
    let name: string | null = null;
    ```
*   Dùng optional chaining (`?.`) để tránh null-check dài dòng:
    ```typescript
    user?.address?.city
    ```
*   Dùng nullish coalescing (`??`) để set default value:
    ```typescript
    let input = userInput ?? "default";
    ```
*   Chỉ dùng `!` khi chắc chắn giá trị không null/undefined.

### 10.5. Ví dụ thực tế

```typescript
type User = {
  id: number;
  name?: string | null;
};

function greet(user: User) {
  // optional chaining + nullish coalescing
  const username = user.name?.toUpperCase() ?? "ANONYMOUS";
  console.log("Hello, " + username);
}

greet({ id: 1, name: "Alice" }); // Hello, ALICE
greet({ id: 2 });                // Hello, ANONYMOUS
greet({ id: 3, name: null });    // Hello, ANONYMOUS
```

## 11. Enums

### 11.1. Enums là gì?

`enum` = tập hợp các hằng số có tên, giúp code dễ đọc và quản lý hơn.
Khác với type hoặc union, enum được compile xuống JavaScript thật sự (có object được tạo ra).

### 11.2. Numeric Enums (mặc định)

```typescript
enum Direction {
  Up,     // 0
  Down,   // 1
  Left,   // 2
  Right   // 3
}

let move: Direction = Direction.Up;
console.log(move); // 0
```
👉 Nếu không gán giá trị, các member mặc định bắt đầu từ 0 và tăng dần.

Có thể gán thủ công:
```typescript
enum Direction {
  Up = 1,
  Down = 2,
  Left = 4,
  Right = 8
}
```

### 11.3. String Enums

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

let move: Direction = Direction.Left;
console.log(move); // "LEFT"
```
👉 Thường được dùng nhiều hơn vì dễ debug/log.

### 11.4. Heterogeneous Enums (ít dùng)

Có thể mix số và string (không khuyến khích):

```typescript
enum BooleanLike {
  No = 0,
  Yes = "YES"
}
```

### 11.5. Reverse Mapping (chỉ với numeric enum)

```typescript
enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}

console.log(Direction.Up);    // 1
console.log(Direction[1]);    // "Up" (reverse mapping)
```
👉 Với string enum thì không có reverse mapping.

### 11.6. Const Enums

Nếu muốn enum nhanh, nhẹ và không tạo object thật sự trong JS → dùng `const enum`.

```typescript
const enum Direction {
  Up,
  Down,
  Left,
  Right
}

let move = Direction.Up;
console.log(move); // 0
```
👉 Khi compile, TypeScript thay trực tiếp bằng số/literal → performance tốt hơn.

### 11.7. So sánh với Union Literal Types

Ví dụ ta cũng có thể viết bằng union thay cho enum:

```typescript
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

let move: Direction = "UP"; // an toàn
```
✅ **Ưu điểm**: nhẹ, không cần runtime object.
❌ **Nhược điểm**: không có reverse mapping, khó gán giá trị tùy chỉnh (như 1,2,4,8).

👉 Trong nhiều dự án modern TypeScript, người ta thích dùng union literals hơn là enum.

📌 **Khi nào nên dùng enum?**
*   Cần giá trị numeric (bitmask, flag).
*   Cần reverse mapping.
*   Cần runtime object để log/iterate.

📌 **Khi nào nên dùng union types?**
*   Chỉ cần tập hợp giá trị string hằng.
*   Code frontend hiện đại (React, Angular, Vue) → thường dùng union literal.

## 12. Less Common Primitives

### 12.1. `bigint`

1.  **Đặc điểm**:
    *   Xuất hiện từ ES2020.
    *   Dùng để biểu diễn số nguyên rất lớn mà `number` (64-bit float) không chính xác.
    *   Khác với `number`, `bigint` không thể trộn trực tiếp trong phép toán với `number`.

2.  **Ví dụ**:
    ```typescript
    // Tạo bằng hàm BigInt()
    const oneHundred: bigint = BigInt(100);

    // Tạo bằng literal syntax
    const anotherHundred: bigint = 100n;

    console.log(oneHundred + anotherHundred); // 200n

    // ❌ Lỗi: không thể trộn number và bigint
    // const badMix = 100n + 5;
    // Error: Cannot mix BigInt and other types
    ```

3.  **Use case thực tế**
    *   Làm việc với số tiền cực lớn (ví dụ hệ thống ngân hàng, blockchain).
    *   Xử lý ID hoặc timestamp 64-bit vượt quá khả năng `number`.

### 12.2. `symbol`

1.  **Đặc điểm**:
    *   Dùng để tạo giá trị duy nhất (unique identifier).
    *   Dù có cùng mô tả, 2 symbol khác nhau thì không bao giờ bằng nhau.
    *   Hay dùng để tạo key bí mật trong object.

2.  **Ví dụ**:
    ```typescript
    const firstName = Symbol("name");
    const secondName = Symbol("name");

    console.log(firstName === secondName); // false

    const user = {
      id: 1,
      [firstName]: "Alice"
    };

    console.log(user[firstName]); // "Alice"
    // console.log(user["name"]); ❌ không lấy được
    ```

3.  **Use case thực tế**
    *   Định nghĩa property ẩn trong object (không bị ghi đè).
    *   Dùng trong frameworks (React sử dụng `Symbol(react.element)` để đánh dấu JSX element).
    *   Làm enum-like unique constants.

### 12.3. Bài tập thực hành 📝

*   **Bài 1 (BigInt)**:
    Viết hàm `addBigNumbers(a: bigint, b: bigint)` trả về tổng của 2 số rất lớn.
    👉 Gợi ý: thử cộng `123456789012345678901234567890n + 987654321098765432109876543210n`.
*   **Bài 2 (Symbol)**:
    Tạo một object `user` có `id: number` và một thuộc tính ẩn bằng `Symbol` để lưu mật khẩu.
    👉 Viết function `checkPassword(user, password)` để so sánh đúng/sai.

💡 **Câu hỏi suy nghĩ cho em**:
*   Em nghĩ trong thực tế frontend (React, Angular, Vue) thì `bigint` có hay được dùng không? Tại sao?
*   Nếu muốn tạo ra một enum-like mà đảm bảo các giá trị là unique 100%, em sẽ chọn enum hay symbol?

## 13. Tổng hợp kiến thức TypeScript cơ bản về kiểu dữ liệu

### 13.1. Primitives (Kiểu nguyên thủy)

| Kiểu dữ liệu | Ví dụ             | Mô tả                 | Ghi chú                                  |
| :----------- | :---------------- | :-------------------- | :--------------------------------------- |
| `string`     | `"Hello"`         | Chuỗi ký tự           | Dùng nhiều nhất                          |
| `number`     | `42`, `3.14`      | Số (integer + float)  | Giống JS `number`                        |
| `boolean`    | `true`, `false`   | Đúng/Sai              | Cơ bản                                   |
| `null`       | `null`            | Giá trị rỗng cố ý     | Bị ảnh hưởng bởi `strictNullChecks`     |
| `undefined`  | `undefined`       | Chưa được gán giá trị | Cũng bị ảnh hưởng bởi `strictNullChecks` |
| `bigint`     | `100n`, `BigInt(50)` | Số nguyên siêu lớn    | Không trộn được với `number`             |
| `symbol`     | `Symbol("id")`    | Tạo ra giá trị duy nhất | Thường dùng làm key đặc biệt             |

### 13.2. Arrays và Tuples

| Loại            | Ví dụ         | Ý nghĩa                                  |
| :-------------- | :------------ | :--------------------------------------- |
| `string[]`      | `["a","b"]`   | Mảng chuỗi                               |
| `Array<number>` | `[1,2,3]`     | Cú pháp khác của `number[]`              |
| `[string, number]` | `["age", 25]` | Tuple (mảng với thứ tự và loại cố định) |

### 13.3. Object Types

```typescript
function printCoord(pt: { x: number; y: number }) {
  console.log(pt.x, pt.y);
}
```
*   Có thể khai báo property optional (`last?: string`).
*   Nếu không khai báo type → mặc định `any`.

### 13.4. Union Types

Cho phép một biến/hàm nhận nhiều kiểu khác nhau:

```typescript
function printId(id: number | string) {
  console.log(id);
}
```
🔑 **Quy tắc**: chỉ thao tác được trên những thuộc tính/methods mà mọi member trong union đều có.

### 13.5. Type Aliases vs Interface

| Đặc điểm              | `type`                               | `interface`                               |
| :-------------------- | :----------------------------------- | :---------------------------------------- |
| Định nghĩa object     | ✅                                   | ✅                                        |
| Union / Primitive alias | ✅                                   | ❌                                        |
| Extend (kế thừa)      | `&` (intersection)                   | `extends`                                 |
| Merge lại nhiều lần   | ❌                                   | ✅ (có thể khai báo thêm fields cho cùng 1 interface) |

Ví dụ:
```typescript
type ID = number | string;
interface User { name: string }
```

### 13.6. Type Assertions

```typescript
const canvas = document.getElementById("c") as HTMLCanvasElement;
```
*   Dùng khi lập trình viên biết rõ hơn compiler.
*   Không đổi runtime, chỉ đổi cách TypeScript kiểm tra.
*   Có thể dùng `as any as T` khi cần ép kiểu “khó”.

### 13.7. Literal Types

```typescript
const str: "Hello" = "Hello";
```
Dùng nhiều với union để giới hạn giá trị hợp lệ:
```typescript
function alignText(s: string, align: "left" | "right" | "center") {}
```

### 13.8. Null & Undefined (`strictNullChecks`)

*   Khi bật `strictNullChecks`: phải check trước khi dùng.
*   Có toán tử non-null assertion `!`:
    ```typescript
    function foo(x?: string | null) {
      console.log(x!.toUpperCase());
    }
    ```

### 13.9. Enums (ít dùng hơn)

```typescript
enum Direction { Up, Down, Left, Right }
```
*   Sinh ra JS thật, không chỉ ở type-level.
*   Nên cân nhắc → nhiều khi union literal `"Up" | "Down"` là đủ.

### 13.10. Sơ đồ tư duy (Mindmap)

```
Types
│
├─ Primitives
│   ├─ string, number, boolean
│   ├─ null, undefined
│   ├─ bigint, symbol
│
├─ Object Types
│   ├─ plain object
│   ├─ array / tuple
│   ├─ union types
│   ├─ literal types
│
├─ Aliases & Interfaces
│   ├─ type alias
│   ├─ interface
│
├─ Special
│   ├─ type assertions (as)
│   ├─ enums
│   ├─ null handling (strictNullChecks, !)
```

### 13.11. 🍳 Góc nhìn bếp núc (hài hước)

*   `string` → giống gia vị: bỏ vào món nào cũng hợp.
*   `number` → như gạo: ăn hàng ngày, không thể thiếu.
*   `boolean` → như nêm muối hay không: chỉ có 2 lựa chọn, mặn hoặc nhạt.
*   `null` / `undefined` → như chảo rỗng hoặc nồi chưa nấu: nhìn thì có nhưng chẳng ăn được.
*   `bigint` → như nồi phở khổng lồ: chỉ cần khi đãi cả làng.
*   `symbol` → như gia vị bí truyền của đầu bếp: mỗi hũ pha 1 lần, không hũ nào giống hũ nào.
*   `union types` → như menu combo: khách chọn phở hoặc bún hoặc mì.
*   `type alias` → như đặt tên công thức để dùng lại, đỡ phải viết lại từ đầu.
*   `interface` → như công thức chuẩn chỉnh trong sách dạy nấu ăn, ai cũng có thể kế thừa và thêm biến tấu.
*   `type assertion` → như đầu bếp tự tin bảo "tin tôi đi, nếm thử là ngon" (dù có thể sai 🤭).

## 14. Ôn tập TypeScript Types – Hỏi & Đáp

### 14.1. Primitives

*   **Q1**: Trong TypeScript, khác biệt giữa `string` và `String` là gì?
    *   **A1**:
        *   `string` → kiểu dữ liệu nguyên thủy, nên dùng.
        *   `String` → object wrapper (hiếm dùng).
*   **Q2**: Khi khai báo `let n: number = 42;` thì TS hiểu `number` bao gồm những giá trị nào?
    *   **A2**: Tất cả số: integer, float, `Infinity`, `NaN`. Không có phân biệt `int` hay `float`.
*   **Q3**: `bigint` khác `number` như thế nào?
    *   **A3**:
        *   `number`: chính xác tối đa 53 bit.
        *   `bigint`: lưu số nguyên cực lớn, viết bằng hậu tố `n` (ví dụ: `100n`).
        *   Không cộng trực tiếp `number + bigint`.
*   **Q4**: `symbol` để làm gì?
    *   **A4**: Để tạo giá trị duy nhất, thường dùng làm key trong object để tránh trùng.

### 14.2. Arrays & Tuples

*   **Q5**: Khác biệt giữa `number[]` và `[number]`?
    *   **A5**:
        *   `number[]`: mảng nhiều phần tử số (`[1,2,3]`).
        *   `[number]`: tuple chỉ có đúng 1 phần tử kiểu `number`.
*   **Q6**: Viết cú pháp cho một tuple chứa `[string, number, boolean]`.
    *   **A6**:
        ```typescript
        let info: [string, number, boolean] = ["Alice", 25, true];
        ```

### 14.3. Object Types

*   **Q7**: Nếu không chỉ định type cho property trong object type thì mặc định là gì?
    *   **A7**: `any`.
*   **Q8**: Cách khai báo một property optional trong object type?
    *   **A8**: Thêm dấu `?` sau tên property:
        ```typescript
        { first: string; last?: string }
        ```

### 14.4. Union & Literal Types

*   **Q9**: `string | number` nghĩa là gì?
    *   **A9**: Biến có thể là chuỗi hoặc số, TS sẽ giới hạn hành động hợp lệ cho cả 2 loại.
*   **Q10**: Tại sao function `printId(id: number | string) { console.log(id.toUpperCase()) }` báo lỗi?
    *   **A10**: Vì `toUpperCase` chỉ có trên `string`, không phải `number`. Cần narrowing bằng `typeof`.
*   **Q11**: Literal type `"left" | "right" | "center"` dùng để làm gì?
    *   **A11**: Giới hạn giá trị hợp lệ, ví dụ cho tham số function chỉ được truyền các chuỗi cố định.

### 14.5. Type Alias vs Interface

*   **Q12**: Khi nào dùng `type`, khi nào dùng `interface`?
    *   **A12**:
        *   `interface`: khi mô tả object shape, có khả năng mở rộng/merge.
        *   `type`: khi cần alias cho bất kỳ type (union, primitive, tuple).
*   **Q13**: Có thể khai báo `interface` nhiều lần cho cùng tên không?
    *   **A13**: Có → chúng sẽ merge. `type` thì không được.

### 14.6. Type Assertions

*   **Q14**: Khác biệt giữa type annotation và type assertion?
    *   **A14**:
        *   Annotation (`: T`): gán type từ đầu.
        *   Assertion (`as T`): ép kiểu ở một biểu thức khi compiler không biết rõ.
*   **Q15**: Khi nào nên dùng `expr as any as T`?
    *   **A15**: Khi ép kiểu “khó” mà TS không cho phép trực tiếp. Nhưng cần thận trọng vì có thể sai logic.

### 14.7. Null & Undefined

*   **Q16**: Với `strictNullChecks: true`, có thể gán `null` vào `string` không?
    *   **A16**: Không. Phải khai báo `string | null`.
*   **Q17**: Dấu `!` (non-null assertion) có ý nghĩa gì?
    *   **A17**: Nói với compiler: “Tin tôi đi, giá trị này chắc chắn không null/undefined”.

### 14.8. Enums

*   **Q18**: Khác biệt chính giữa `enum` và union literal type?
    *   **A18**:
        *   `enum`: sinh ra code JS thật (runtime).
        *   Union literal: chỉ tồn tại ở compile-time (không sinh thêm code).

### 14.9. Mini Test (tự làm)

*   Viết một function nhận tham số `direction` chỉ có thể là `"up" | "down" | "left" | "right"`.
*   Khai báo một type alias `Point3D` với `{x:number, y:number, z:number}` và viết function in ra tọa độ.
*   Cho đoạn code:
    ```typescript
    let req = { url: "abc.com", method: "GET" };
    handleRequest(req.url, req.method);
    ```
    Vì sao TS báo lỗi? Cách sửa?
