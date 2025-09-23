# 1. Object Types trong TypeScript

Trong JavaScript, cách cơ bản để nhóm và truyền dữ liệu là thông qua các đối tượng (objects). Trong TypeScript, chúng ta biểu diễn chúng thông qua các kiểu đối tượng (object types).

Trong JavaScript, chúng ta dùng objects để nhóm dữ liệu:
```typescript
const person = { name: "Alice", age: 25 };
console.log(person.name); // Alice
```
Trong TypeScript, chúng ta mô tả loại dữ liệu của object để đảm bảo tính an toàn khi lập trình.

## 1.1. Cách định nghĩa Object Type

### 1.1.1. Anonymous Type (Vô danh)
```typescript
function greet(person: { name: string; age: number }) {
  return "Hello " + person.name;
}

console.log(greet({ name: "Alice", age: 25 }));
```
*   **Ưu điểm:** Nhanh, không cần khai báo thêm type.
*   **Nhược điểm:** Khó tái sử dụng nếu object xuất hiện nhiều lần.

### 1.1.2. Interface (Đặt tên Type)
```typescript
interface Person {
  name: string;
  age: number;
}

function greet(person: Person) {
  return "Hello " + person.name;
}
```
*   **Ưu điểm:** Dễ đọc, tái sử dụng tốt. Có thể `extends` (kế thừa) từ interface khác.

### 1.1.3. Type Alias (Đặt tên Type nhưng dùng `type`)
```typescript
type Person = {
  name: string;
  age: number;
};

function greet(person: Person) {
  return "Hello " + person.name;
}
```
*   **Ưu điểm:** Giống interface nhưng linh hoạt hơn (có thể kết hợp union, tuple…).
*   **Nhược điểm:** Không hỗ trợ `implements` như interface.

## 1.2. Câu hỏi suy nghĩ

*   Khi nào bạn nên dùng `interface` và khi nào nên dùng `type alias`?
*   Nếu object có thêm một property `address` mà không muốn function `greet` biết, TypeScript sẽ báo lỗi hay không? Tại sao?
*   Làm sao để một property là tùy chọn (optional) trong TypeScript?

## 1.3. Use Case Thực tế

*   **Lập trình frontend với React:** Bạn thường nhận `props` là object:
    ```typescript
    interface UserProps {
      username: string;
      age?: number; // optional
    }

    const UserCard = ({ username, age }: UserProps) => (
      <div>
        <p>{username}</p>
        {age && <p>{age}</p>}
      </div>
    );
    ```
*   **Gọi API trả về JSON object:** Muốn chắc chắn type dữ liệu:
    ```typescript
    type ApiResponse = {
      id: number;
      title: string;
      completed: boolean;
    };

    async function fetchTodo(): Promise<ApiResponse> {
      const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
      return res.json();
    }
    ```

## 1.4. Bug Thường Gặp

*   **Sai type:**
    ```typescript
    // greet({ name: "Alice", age: "25" }); // ❌ Type 'string' is not assignable to type 'number'
    ```
*   **Thiếu property:**
    ```typescript
    // greet({ name: "Alice" }); // ❌ Property 'age' is missing
    ```
*   **Object có extra property:**
    ```typescript
    // greet({ name: "Alice", age: 25, gender: "female" }); // ❌ Object literal may only specify known properties
    ```
*   **Optional property chưa check null/undefined:**
    ```typescript
    interface Person {
      name: string;
      age?: number;
    }

    function greet(person: Person) {
      // return "Hello " + person.age.toString(); // ❌ Object is possibly 'undefined'
      return "Hello " + (person.age?.toString() || "unknown age"); // Cách fix: person.age?.toString() hoặc kiểm tra if (person.age)
    }
    ```

## 1.5. Bài tập thực hành

*   Tạo một interface tên `Product` có các property:
    *   `name: string`
    *   `price: number`
    *   `discount?: number` (tùy chọn)
*   Viết function `showPrice(product: Product)` trả về giá sau khi trừ discount (nếu có).
*   Tạo một object `laptop` và gọi `showPrice(laptop)`.
*   Thử truyền thêm property không tồn tại và xem TypeScript báo lỗi ra sao.

# 2. Property Modifiers

Mỗi thuộc tính trong một kiểu đối tượng có thể chỉ định một vài điều: kiểu, liệu thuộc tính có tùy chọn hay không, và liệu thuộc tính có thể được ghi vào hay không.

## 2.1. Optional Properties (?)

Khi một thuộc tính có thể không được cung cấp trong một đối tượng, bạn có thể đánh dấu nó là tùy chọn bằng cách thêm dấu chấm hỏi (?) vào cuối tên của nó.

```typescript
interface PaintOptions {
  shape: string; // Changed from 'Shape' to 'string' for simplicity, assuming Shape is a string literal type or similar.
  xPos?: number;
  yPos?: number;
}

function paintShape(opts: PaintOptions) {
  // ...
}

// Ví dụ sử dụng
// const shape = getShape(); // Assuming getShape() returns a string
paintShape({ shape: "circle" });
paintShape({ shape: "square", xPos: 100 });
paintShape({ shape: "triangle", yPos: 100 });
paintShape({ shape: "rectangle", xPos: 100, yPos: 100 });
```
Trong ví dụ này, cả `xPos` và `yPos` đều được coi là tùy chọn. Chúng ta có thể chọn cung cấp một trong số chúng, hoặc cả hai, hoặc không cung cấp gì cả.

Khi đọc các thuộc tính tùy chọn dưới chế độ `strictNullChecks`, TypeScript sẽ thông báo rằng chúng có thể là `undefined`.

```typescript
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos; // (property) PaintOptions.xPos?: number | undefined
  let yPos = opts.yPos; // (property) PaintOptions.yPos?: number | undefined
  // ...
}
```
Trong JavaScript, ngay cả khi thuộc tính chưa bao giờ được đặt, chúng ta vẫn có thể truy cập nó - nó sẽ trả về giá trị `undefined`. Chúng ta có thể xử lý `undefined` bằng cách kiểm tra nó.

```typescript
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos === undefined ? 0 : opts.xPos; // let xPos: number
  let yPos = opts.yPos === undefined ? 0 : opts.yPos; // let yPos: number
  console.log(`Drawing ${opts.shape} at (${xPos}, ${yPos})`);
}
```
Mẫu đặt giá trị mặc định cho các giá trị không được chỉ định rất phổ biến, JavaScript có cú pháp để hỗ trợ nó:

```typescript
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  console.log("x coordinate at", xPos); // (parameter) xPos: number
  console.log("y coordinate at", yPos); // (parameter) yPos: number
  // ...
}
```
Ở đây, chúng ta đã sử dụng mẫu destructuring cho tham số của `paintShape` và cung cấp giá trị mặc định cho `xPos` và `yPos`. Bây giờ `xPos` và `yPos` đều chắc chắn có mặt trong thân hàm `paintShape`, nhưng là tùy chọn đối với bất kỳ người gọi nào của `paintShape`.

**Lưu ý:** Hiện tại không có cách nào để đặt chú thích kiểu trong các mẫu destructuring theo cách sau:
```typescript
// function draw({ shape: Shape, xPos: number = 100 /*...*/ }) { // Đây là cú pháp JavaScript, không phải TypeScript type annotation
//   render(shape); // Cannot find name 'shape'. Did you mean 'Shape'?
//   render(xPos); // Cannot find name 'xPos'.
// }
```
Trong một mẫu destructuring đối tượng, `shape: Shape` có nghĩa là "lấy thuộc tính `shape` và định nghĩa lại nó cục bộ dưới dạng một biến có tên `Shape`." Tương tự, `xPos: number` tạo ra một biến có tên `number` mà giá trị của nó dựa trên `xPos` của tham số.

### 2.1.1. Tips thực tế:

*   Trong React, `props` thường là optional.
*   Khi nhận dữ liệu từ API, nhiều property có thể không có → đánh dấu `?`.

### 2.1.2. Bug phổ biến:

*   Quên kiểm tra `undefined` khi dùng property optional → lỗi `strictNullChecks`:
    ```typescript
    // let x = opts.xPos;
    // console.log(x + 1); // ❌ Object is possibly 'undefined'
    ```
    **Cách fix:** `let x = opts.xPos ?? 0;` (dùng nullish coalescing) hoặc kiểm tra `if (opts.xPos)`.

## 2.2. Readonly Properties

Các thuộc tính cũng có thể được đánh dấu là `readonly` trong TypeScript. Mặc dù nó sẽ không thay đổi bất kỳ hành vi nào trong thời gian chạy, một thuộc tính được đánh dấu là `readonly` không thể được ghi vào trong quá trình kiểm tra kiểu.

```typescript
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  // Chúng ta có thể đọc từ 'obj.prop'.
  console.log(`prop has the value '${obj.prop}'.`);

  // Nhưng chúng ta không thể gán lại nó.
  // obj.prop = "hello"; // ❌ Cannot assign to 'prop' because it is a read-only property.
}

const obj: SomeType = { prop: "hello" };
// obj.prop = "world"; // ❌ Cannot assign to 'prop' because it is a read-only property
```
**Chú ý:** `readonly` chỉ ngăn thay đổi tham chiếu (reference), không ngăn thay đổi nội dung đối tượng bên trong nếu đó là một đối tượng.

```typescript
interface Home {
  readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
  // Chúng ta có thể đọc và cập nhật các thuộc tính từ 'home.resident'.
  console.log(`Happy birthday ${home.resident.name}!`);
  home.resident.age++; // ✅ ok
}

function evict(home: Home) {
  // Nhưng chúng ta không thể ghi vào thuộc tính 'resident' trên một 'Home'.
  // home.resident = { // ❌ Cannot assign to 'resident' because it is a read-only property.
  //   name: "Victor the Evictor",
  //   age: 42,
  // };
}

const home: Home = { resident: { name: "Alice", age: 30 } };
home.resident.age++; // ✅ ok
// home.resident = { name: "Bob", age: 40 }; // ❌ error
```
Điều quan trọng là phải quản lý kỳ vọng về ý nghĩa của `readonly`. Nó hữu ích để báo hiệu ý định trong quá trình phát triển cho TypeScript về cách một đối tượng nên được sử dụng. TypeScript không tính đến việc các thuộc tính trên hai kiểu là `readonly` khi kiểm tra xem các kiểu đó có tương thích hay không, vì vậy các thuộc tính `readonly` cũng có thể thay đổi thông qua aliasing.

```typescript
interface Person {
  name: string;
  age: number;
}

interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

let writablePerson: Person = {
  name: "Person McPersonface",
  age: 42,
};

// works
let readonlyPerson: ReadonlyPerson = writablePerson;

console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'
```
Sử dụng các `mapping modifiers`, bạn có thể loại bỏ các thuộc tính `readonly`.

### 2.2.1. Use case thực tế:

*   Khi bạn muốn “đóng gói” object state trong Redux hoặc React state để tránh thay đổi trực tiếp.

## 2.3. Index Signatures

Đôi khi bạn không biết tất cả các tên thuộc tính của một kiểu trước, nhưng bạn biết hình dạng của các giá trị. Trong những trường hợp đó, bạn có thể sử dụng một `index signature` để mô tả các kiểu giá trị có thể có.

```typescript
interface StringArray {
  [index: number]: string;
}

// const myArray: StringArray = getStringArray(); // Assuming getStringArray() returns a StringArray
const myArray: StringArray = ["a", "b", "c"];
const secondItem = myArray[1]; // const secondItem: string
console.log(secondItem); // b
```
Ở trên, chúng ta có một interface `StringArray` có một `index signature`. `Index signature` này nói rằng khi một `StringArray` được lập chỉ mục bằng một số, nó sẽ trả về một chuỗi.

Chỉ một số kiểu được phép cho các thuộc tính `index signature`: `string`, `number`, `symbol`, `template string patterns`, và các kiểu `union` chỉ bao gồm các kiểu này.

Trong khi `string index signatures` là một cách mạnh mẽ để mô tả mẫu "dictionary", chúng cũng buộc tất cả các thuộc tính phải khớp với kiểu trả về của chúng. Điều này là do một `string index` khai báo rằng `obj.property` cũng có sẵn dưới dạng `obj["property"]`. Trong ví dụ sau, kiểu của `name` không khớp với kiểu của `string index`, và trình kiểm tra kiểu sẽ báo lỗi:

```typescript
interface NumberDictionary {
  [index: string]: number;

  length: number; // ok
  // name: string; // ❌ Property 'name' of type 'string' is not assignable to 'string' index type 'number'.
}
```
Tuy nhiên, các thuộc tính có kiểu khác nhau được chấp nhận nếu `index signature` là một `union` của các kiểu thuộc tính:

```typescript
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
}
```
Cuối cùng, bạn có thể làm cho `index signature` là `readonly` để ngăn việc gán cho các chỉ mục của chúng:

```typescript
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

// let myArray: ReadonlyStringArray = getReadOnlyStringArray(); // Assuming getReadOnlyStringArray() returns a ReadonlyStringArray
const arr2: ReadonlyStringArray = ["x", "y", "z"];
// arr2[0] = "a"; // ❌ Index signature in type 'ReadonlyStringArray' only permits reading.
```
Bạn không thể đặt `arr2[0]` vì `index signature` là `readonly`.

### 2.3.1. Bug thường gặp:

*   Gán value không đúng type.
*   Quên đánh dấu `readonly` → object bị thay đổi ngoài ý muốn.

## 2.4. Ví dụ kết hợp

```typescript
interface Config {
  readonly id: string;
  name?: string;
  [key: string]: string | number | undefined;
}

const cfg: Config = { id: "123", theme: "dark" };
// cfg.id = "456"; // ❌ error
cfg.theme = "light"; // ✅ ok
cfg.newProp = 42;    // ✅ ok
```

## 2.5. Bài tập thực hành

*   Tạo interface `User` với:
    *   `id: string` (`readonly`)
    *   `name: string`
    *   `age?: number` (optional)
    *   `[key: string]: string | number | undefined` (index signature)
*   Viết function `updateUser(user: User, updates: Partial<User>)`:
    *   Không được gán lại `id`.
    *   Cập nhật các property khác.
*   Tạo object `u1: User` và thử:
    *   `updateUser(u1, { name: "Alice" });`
    *   `updateUser(u1, { id: "newId" });` // ❌ phải báo lỗi
    *   `updateUser(u1, { age: 25 });`
*   Thử gán thêm property mới qua index signature, ví dụ `u1.country = "Japan"`.

# 3. Excess Property Checks và Extending Types

## 3.1. Excess Property Checks (Kiểm tra thuộc tính thừa)

TypeScript thực hiện kiểm tra các thuộc tính thừa khi bạn truyền một đối tượng literal vào một hàm hoặc gán trực tiếp cho một kiểu đối tượng trong quá trình tạo.

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || "red",
    area: config.width ? config.width * config.width : 20,
  };
}

// ❌ Lỗi do 'colour' không tồn tại trong SquareConfig
// let mySquare = createSquare({ colour: "red", width: 100 });
// Object literal may only specify known properties, but 'colour' does not exist in type 'SquareConfig'. Did you mean to write 'color'?
```
Lưu ý rằng đối số được cung cấp cho `createSquare` được viết là `colour` thay vì `color`. Trong JavaScript thuần túy, loại lỗi này sẽ thất bại một cách âm thầm. TypeScript cho rằng có thể có một lỗi trong mã này. Các đối tượng literal nhận được xử lý đặc biệt và trải qua kiểm tra thuộc tính thừa khi gán chúng cho các biến khác hoặc truyền chúng làm đối số. Nếu một đối tượng literal có bất kỳ thuộc tính nào mà "kiểu đích" không có, bạn sẽ nhận được lỗi.

### 3.1.1. Cách giải quyết

*   **Dùng type assertion (ít an toàn hơn):**
    ```typescript
    let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
    ```
*   **Thêm index signature (cho phép thuộc tính thừa):**
    ```typescript
    interface SquareConfig {
      color?: string;
      width?: number;
      [propName: string]: unknown; // Cho phép bất kỳ thuộc tính bổ sung nào
    }
    ```
    Ở đây, chúng ta đang nói rằng `SquareConfig` có thể có bất kỳ số lượng thuộc tính nào, và miễn là chúng không phải `color` hoặc `width`, kiểu của chúng không quan trọng.
*   **Gán đối tượng literal vào biến trung gian:**
    ```typescript
    let squareOptions = { colour: "red", width: 100 };
    let mySquare = createSquare(squareOptions); // ✅ không báo lỗi
    ```
    Cách giải quyết trên sẽ hoạt động miễn là bạn có một thuộc tính chung giữa `squareOptions` và `SquareConfig`. Trong ví dụ này, đó là thuộc tính `width`. Tuy nhiên, nó sẽ thất bại nếu biến không có bất kỳ thuộc tính đối tượng chung nào. Ví dụ:
    ```typescript
    let squareOptions = { colour: "red" };
    // let mySquare = createSquare(squareOptions); // ❌ Type '{ colour: string; }' has no properties in common with type 'SquareConfig'.
    ```
    **Tip thực tế:** Hãy sửa kiểu nếu muốn chấp nhận thuộc tính thừa, đừng cố “bỏ qua” `excess property check`. Nó giúp tránh lỗi chính tả thuộc tính sai.

## 3.2. Extending Types (Kế thừa kiểu/interface)

Thường thì bạn muốn tạo các kiểu mới có thể là các phiên bản cụ thể hơn của các kiểu khác. Thay vì lặp lại tất cả các trường từ kiểu cơ bản, chúng ta có thể mở rộng kiểu gốc và chỉ thêm các trường mới là duy nhất.

```typescript
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}

const myAddress: AddressWithUnit = {
  street: "123 Main St",
  city: "Tokyo",
  country: "Japan",
  postalCode: "100-0001",
  unit: "Apt 101",
};
```
Từ khóa `extends` trên một interface cho phép chúng ta sao chép các thành viên từ các kiểu được đặt tên khác và thêm bất kỳ thành viên mới nào chúng ta muốn. Điều này có thể hữu ích để giảm lượng mã khai báo kiểu mà chúng ta phải viết và để báo hiệu ý định rằng một số khai báo khác nhau của cùng một thuộc tính có thể liên quan.

Các interface cũng có thể mở rộng từ nhiều kiểu.

```typescript
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};
```
### 3.2.1. Tips thực tế:

*   Khi làm UI components, có thể extend `ButtonProps` để tạo `IconButtonProps`.
*   Khi thiết kế model cho API, extend giúp tránh lặp lại property chung.

## 3.3. Bug phổ biến

*   Sai chính tả property literal → lỗi `excess property check`.
*   Gán object có property không tồn tại trong type → lỗi.
*   Lặp lại field khi không dùng `extends` → dễ gây lỗi, khó maintain.
*   Extend nhiều interface mà trùng tên property → cần cùng type hoặc TypeScript báo lỗi.

## 3.4. Bài tập thực hành

*   Tạo interface `Product`:
    ```typescript
    interface Product {
      name: string;
      price: number;
    }
    ```
*   Tạo interface `DiscountedProduct` extends `Product`, thêm property `discount?: number`.
*   Viết function `applyDiscount(product: DiscountedProduct)`:
    *   Nếu `discount` có giá trị, trả về `price * (1 - discount / 100)`.
    *   Nếu không, trả về `price`.
*   Thử gọi:
    ```typescript
    applyDiscount({ name: "Laptop", price: 2000, discount: 10 }); // ok
    // applyDiscount({ name: "Phone", price: 1000, disount: 5 }); // ❌ sai chính tả → lỗi excess property
    ```
*   Sửa lỗi trên bằng cách nào bạn thấy hợp lý: type assertion, index signature, hoặc sửa chính tả.

# 4. Intersection Types

`Intersection types` là một cấu trúc trong TypeScript chủ yếu được sử dụng để kết hợp các kiểu đối tượng hiện có. Một `intersection type` được định nghĩa bằng cách sử dụng toán tử `&`.

## 4.1. Intersection Types (`&`)

Khi muốn một đối tượng đáp ứng tất cả các kiểu đã cho, chúng ta dùng `&` để tạo `intersection type`.

```typescript
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;

const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};
```
`ColorfulCircle` phải có cả `color` và `radius`. Dùng `intersection type` giúp kết hợp bất kỳ số lượng kiểu nào mà không cần kế thừa (`extends`).

## 4.2. Ví dụ sử dụng function

```typescript
function draw(circle: Colorful & Circle) {
  console.log(`Color: ${circle.color}`);
  console.log(`Radius: ${circle.radius}`);
}

// ✅ ok
draw({ color: "blue", radius: 42 });

// ❌ lỗi typo: raidus
// draw({ color: "red", raidus: 42 });
// Object literal may only specify known properties, but 'raidus' does not exist in type 'Colorful & Circle'. Did you mean to write 'radius'?
```
TypeScript sẽ báo lỗi `excess property check` nếu đối tượng literal có thuộc tính không khớp. `Intersection types` đảm bảo rằng tất cả các thuộc tính cần thiết đều có, và kiểu của chúng phải tương thích.

## 4.3. So sánh với `extends` trong `interface`

| Tính năng             | `Interface extends`                               | `Intersection type &`                               |
| :-------------------- | :------------------------------------------------ | :-------------------------------------------------- |
| Kế thừa properties    | ✅ kế thừa từ 1 hoặc nhiều interface              | ✅ kết hợp bất kỳ type nào                           |
| Sử dụng cho object    | ✅ interface object                               | ✅ bất kỳ type (object, union…)                     |
| Có thể merge interface | ✅ interface merge                                | ❌ intersection chỉ combine                         |

**Tip thực tế:**
*   `extends` → dùng khi bạn muốn tạo type mới dựa trên type cũ và biểu thị quan hệ `is-a`.
*   `&` → dùng khi bạn muốn kết hợp nhiều loại đặc tính mà không quan tâm đến quan hệ kế thừa.

## 4.4. Bug thường gặp

*   **Sai chính tả property** → `excess property check` lỗi.
*   **Type không tương thích:**
    ```typescript
    interface A { x: number; }
    interface B { x: string; }
    type C = A & B;

    // const obj: C = { x: 42 }; // ❌ Type 'number' is not assignable to type 'string & number'
    ```
    Khi `intersection` có cùng property nhưng type khác nhau, TypeScript sẽ báo lỗi vì không thể thỏa cả 2 type.
*   **Quên property bắt buộc** → lỗi khi truyền object literal.

## 4.5. Bài tập thực hành

*   Tạo 2 interface:
    ```typescript
    interface Movable {
      speed: number;
    }

    interface Stoppable {
      stop(): void;
    }
    ```
*   Tạo type mới `Vehicle` bằng `intersection`:
    ```typescript
    type Vehicle = Movable & Stoppable;
    ```
*   Viết function `operate(vehicle: Vehicle)`:
    ```typescript
    function operate(vehicle: Vehicle) {
      console.log(`Moving at speed ${vehicle.speed}`);
      vehicle.stop();
    }
    ```
*   Tạo object hợp lệ và gọi `operate`:
    ```typescript
    const car = {
      speed: 100,
      stop() { console.log("Stopped!"); },
    };

    operate(car); // ✅ ok
    ```
*   Thử tạo object thiếu property hoặc có typo, xem TypeScript báo lỗi ra sao.

# 5. Interface Extension vs. Intersection

Chúng ta vừa xem xét hai cách kết hợp kiểu tương tự nhau, nhưng thực tế lại có những khác biệt tinh tế. Với `interface`, chúng ta có thể sử dụng mệnh đề `extends` để mở rộng từ các kiểu khác, và chúng ta có thể làm điều tương tự với `intersection` và đặt tên kết quả bằng một `type alias`. Sự khác biệt chính giữa hai cách này là cách xử lý xung đột, và sự khác biệt đó thường là một trong những lý do chính để bạn chọn cách này hay cách khác giữa một `interface` và một `type alias` của một `intersection type`.

## 5.1. Interface Extension (`extends`)

Khi một `interface` mở rộng một `interface` khác, bạn kế thừa tất cả các thuộc tính từ `interface` gốc.

*   Nếu cùng tên thuộc tính xuất hiện nhiều lần và kiểu tương thích, TypeScript sẽ hợp nhất mà không báo lỗi.
*   Nếu cùng tên thuộc tính mà kiểu không tương thích, TypeScript sẽ báo lỗi.

**Ví dụ:**
```typescript
interface Person {
  name: string;
}

// Không lỗi, vì type tương thích
interface Employee extends Person {
  age: number;
}

// Lỗi nếu trùng tên property nhưng type khác
// interface Person { // Lỗi: Duplicate identifier 'Person'.
//   name: number; // ❌ Type 'number' is not assignable to type 'string'
// }
```
**Lưu ý:** Các interface có thể hợp nhất (merge) nếu chúng có cùng tên, TypeScript sẽ cố gắng kết hợp các thuộc tính.

## 5.2. Intersection Types (`&`)

`Intersection type` kết hợp tất cả các thuộc tính của các kiểu.

*   Nếu cùng tên thuộc tính nhưng kiểu khác nhau, TypeScript bắt buộc phải thỏa mãn cả hai kiểu cùng lúc, điều này thường dẫn đến kiểu `never`.

**Ví dụ:**
```typescript
interface Person1 {
  name: string;
}

interface Person2 {
  name: number;
}

// Intersection type
type Staff = Person1 & Person2;

declare const staffer: Staff;
// staffer.name; // (property) name: never
```
`Staff.name` là `never` vì không thể vừa là `string` vừa là `number` cùng lúc. Đây là lý do `intersection type` không hợp nhất thuộc tính như `interface`, mà bắt buộc phải thỏa mãn tất cả các kiểu.

## 5.3. Sự khác biệt chính

| Tính năng             | `Interface Extension (extends)`                 | `Intersection (&)`                                  |
| :-------------------- | :---------------------------------------------- | :-------------------------------------------------- |
| Hợp nhất properties   | ✅ Hợp nhất nếu type tương thích                | ❌ Không hợp nhất, property phải thỏa tất cả type    |
| Xung đột type         | ❌ Lỗi nếu type khác                            | ✅ Chuyển thành `never`                             |
| Dùng cho object       | ✅                                              | ✅                                                  |
| Kết hợp nhiều type    | ✅ `extends` nhiều interface                    | ✅ kết hợp bất kỳ type nào                           |

**Khi nào dùng cái gì:**
*   Muốn mở rộng interface hiện có, dùng `extends`.
*   Muốn kết hợp nhiều type khác nhau mà không cần quan hệ kế thừa → dùng `intersection (&)`.

## 5.4. Bug thường gặp

*   **Interface merge conflict:**
    ```typescript
    // interface A { prop: string; }
    // interface A { prop: number; } // ❌ error: Subsequent property declarations must have the same type.
    ```
*   **Intersection type conflict:**
    ```typescript
    type B = { prop: string } & { prop: number };
    // const b: B = { prop: "hello" }; // ❌ Type 'string' is not assignable to type 'never'.
    ```
*   Không nhận ra `never` → code runtime crash nếu không kiểm tra.

## 5.5. Bài tập thực hành

*   Tạo 2 interface:
    ```typescript
    interface Admin {
      accessLevel: number;
    }

    interface Manager {
      accessLevel: string;
    }
    ```
*   Thử tạo:
    *   **a) Extend:**
        ```typescript
        // interface AdminManager extends Admin, Manager {} // ❌ lỗi: Property 'accessLevel' of type 'string' is not assignable to type 'number' in type 'Admin'.
        ```
    *   **b) Intersection:**
        ```typescript
        type AdminManager2 = Admin & Manager;
        declare const am: AdminManager2;
        // am.accessLevel; // type never
        ```
*   Hãy giải thích:
    *   Tại sao `extends` báo lỗi?
    *   Tại sao `intersection` ra `never`?
*   Thử sửa lại type sao cho có thể combine property `accessLevel` thành `union type (number | string)` để `intersection` không bị `never`.

# 6. Generic Object Types, Readonly Arrays và Tuple Types

## 6.1. Generic Object Types

Hãy tưởng tượng một kiểu `Box` có thể chứa bất kỳ giá trị nào - chuỗi, số, v.v.

### 6.1.1. Vấn đề

Khi bạn muốn một `Box` có thể chứa bất kỳ giá trị gì, kiểu `any` hoặc `unknown` có thể dùng, nhưng dễ gây lỗi runtime hoặc phải dùng nhiều `type assertion`.

```typescript
interface Box {
  contents: any;
}
```
`any` → mất an toàn kiểu.
`unknown` → an toàn hơn nhưng cần kiểm tra hoặc `type assertion`.

```typescript
interface Box {
  contents: unknown;
}

let x: Box = {
  contents: "hello world",
};

// chúng ta có thể kiểm tra 'x.contents'
if (typeof x.contents === "string") {
  console.log(x.contents.toLowerCase());
}

// hoặc chúng ta có thể sử dụng một type assertion
console.log((x.contents as string).toLowerCase());
```
Một cách tiếp cận an toàn kiểu là tạo ra các kiểu `Box` khác nhau cho mỗi loại nội dung.
```typescript
interface NumberBox {
  contents: number;
}

interface StringBox {
  contents: string;
}

interface BooleanBox {
  contents: boolean;
}
```
Nhưng điều đó có nghĩa là chúng ta sẽ phải tạo các hàm khác nhau, hoặc các `overload` của hàm, để hoạt động trên các kiểu này.
```typescript
function setContents(box: StringBox, newContents: string): void;
function setContents(box: NumberBox, newContents: number): void;
function setContents(box: BooleanBox, newContents: boolean): void;
function setContents(box: { contents: any }, newContents: any) {
  box.contents = newContents;
}
```
Điều này tạo ra rất nhiều mã lặp lại. Hơn nữa, chúng ta có thể cần giới thiệu các kiểu và `overload` mới sau này. Điều này gây khó chịu, vì các kiểu `box` và `overload` của chúng ta đều giống nhau một cách hiệu quả.

### 6.1.2. Giải pháp: Generic

Thay vào đó, chúng ta có thể tạo một kiểu `Box` chung (generic) khai báo một tham số kiểu.

```typescript
interface Box<Type> {
  contents: Type;
}
```
Bạn có thể đọc điều này là "Một `Box` của `Type` là một cái gì đó mà nội dung của nó có kiểu `Type`". Sau này, khi chúng ta tham chiếu đến `Box`, chúng ta phải cung cấp một đối số kiểu thay cho `Type`.

```typescript
let box: Box<string>;
```
Hãy nghĩ về `Box` như một khuôn mẫu cho một kiểu thực, trong đó `Type` là một chỗ giữ chỗ sẽ được thay thế bằng một kiểu khác. Khi TypeScript thấy `Box<string>`, nó sẽ thay thế mọi trường hợp của `Type` trong `Box<Type>` bằng `string`, và cuối cùng làm việc với một cái gì đó như `{ contents: string }`. Nói cách khác, `Box<string>` và `StringBox` trước đó của chúng ta hoạt động giống hệt nhau.

```typescript
interface Box<Type> {
  contents: Type;
}
interface StringBox {
  contents: string;
}

let boxA: Box<string> = { contents: "hello" };
// boxA.contents; // (property) Box<string>.contents: string

let boxB: StringBox = { contents: "world" };
// boxB.contents; // (property) StringBox.contents: string
```
`Box` có thể tái sử dụng ở chỗ `Type` có thể được thay thế bằng bất cứ thứ gì. Điều đó có nghĩa là khi chúng ta cần một hộp cho một kiểu mới, chúng ta không cần khai báo một kiểu `Box` mới nào cả.

```typescript
interface Box<Type> {
  contents: Type;
}

interface Apple {
  // ....
}

// Tương tự như '{ contents: Apple }'.
type AppleBox = Box<Apple>;
```
Điều này cũng có nghĩa là chúng ta có thể tránh hoàn toàn các `overload` bằng cách sử dụng các hàm generic.

```typescript
function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}
```
Cần lưu ý rằng `type aliases` cũng có thể là generic. Chúng ta có thể định nghĩa interface `Box<Type>` bằng cách sử dụng một `type alias` thay thế:

```typescript
type Box<Type> = {
  contents: Type;
};
```
Vì `type aliases`, không giống như `interface`, có thể mô tả nhiều hơn các kiểu đối tượng, chúng ta cũng có thể sử dụng chúng để viết các kiểu trợ giúp generic khác.

```typescript
type OrNull<Type> = Type | null;
type OneOrMany<Type> = Type | Type[];
type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>; // type OneOrManyOrNull<Type> = OneOrMany<Type> | null
type OneOrManyOrNullStrings = OneOrManyOrNull<string>; // type OneOrManyOrNullStrings = OneOrMany<string> | null
```

## 6.2. Array Type (Generic)

Các kiểu đối tượng generic thường là một loại kiểu container hoạt động độc lập với kiểu của các phần tử mà chúng chứa. Điều này lý tưởng cho các cấu trúc dữ liệu để hoạt động theo cách này để chúng có thể tái sử dụng trên các kiểu dữ liệu khác nhau.

Hóa ra chúng ta đã làm việc với một kiểu như vậy trong suốt hướng dẫn này: kiểu `Array`. Bất cứ khi nào chúng ta viết các kiểu như `number[]` hoặc `string[]`, đó thực sự chỉ là một cách viết tắt cho `Array<number>` và `Array<string>`.

```typescript
function doSomething(value: Array<string>) {
  // ...
}

let myArray: string[] = ["hello", "world"];

// cả hai đều hoạt động!
doSomething(myArray);
doSomething(new Array("hello", "world"));
```
Giống như kiểu `Box` ở trên, `Array` tự nó là một kiểu generic.

```typescript
interface Array<Type> {
  /**
   * Lấy hoặc đặt độ dài của mảng.
   */
  length: number;

  /**
   * Xóa phần tử cuối cùng khỏi một mảng và trả về nó.
   */
  pop(): Type | undefined;

  /**
   * Thêm các phần tử mới vào một mảng và trả về độ dài mới của mảng.
   */
  push(...items: Type[]): number;

  // ...
}
```
JavaScript hiện đại cũng cung cấp các cấu trúc dữ liệu generic khác, như `Map<K, V>`, `Set<T>`, và `Promise<T>`. Tất cả điều này thực sự có nghĩa là do cách `Map`, `Set` và `Promise` hoạt động, chúng có thể hoạt động với bất kỳ tập hợp kiểu nào.

### 6.2.1. ReadonlyArray Type

`ReadonlyArray` là một kiểu đặc biệt mô tả các mảng không nên được thay đổi.

```typescript
function doStuff(values: ReadonlyArray<string>) {
  // Chúng ta có thể đọc từ 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);

  // ...nhưng chúng ta không thể thay đổi 'values'.
  // values.push("hello!"); // ❌ Property 'push' does not exist on type 'readonly string[]'.
}
```
Giống như `readonly modifier` cho các thuộc tính, nó chủ yếu là một công cụ chúng ta có thể sử dụng cho ý định. Khi chúng ta thấy một hàm trả về `ReadonlyArrays`, nó cho chúng ta biết rằng chúng ta không được thay đổi nội dung của nó, và khi chúng ta thấy một hàm tiêu thụ `ReadonlyArrays`, nó cho chúng ta biết rằng chúng ta có thể truyền bất kỳ mảng nào vào hàm đó mà không phải lo lắng rằng nó sẽ thay đổi nội dung của nó.

Không giống như `Array`, không có `ReadonlyArray constructor` mà chúng ta có thể sử dụng.
```typescript
// new ReadonlyArray("red", "green", "blue"); // ❌ 'ReadonlyArray' only refers to a type, but is being used as a value here.
```
Thay vào đó, chúng ta có thể gán các `Array` thông thường cho `ReadonlyArrays`.

```typescript
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
```
Cũng giống như TypeScript cung cấp cú pháp viết tắt cho `Array<Type>` với `Type[]`, nó cũng cung cấp cú pháp viết tắt cho `ReadonlyArray<Type>` với `readonly Type[]`.

```typescript
function doStuff(values: readonly string[]) {
  // Chúng ta có thể đọc từ 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);

  // ...nhưng chúng ta không thể thay đổi 'values'.
  // values.push("hello!"); // ❌ Property 'push' does not exist on type 'readonly string[]'.
}
```
Một điều cuối cùng cần lưu ý là không giống như `readonly property modifier`, khả năng gán không phải là hai chiều giữa các `Array` thông thường và `ReadonlyArrays`.

```typescript
let x: readonly string[] = [];
let y: string[] = [];

x = y; // ✅ ok
// y = x; // ❌ The type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.
```

## 6.3. Tuple Types

Một `tuple type` là một loại kiểu `Array` khác biết chính xác có bao nhiêu phần tử mà nó chứa, và chính xác những kiểu nào mà nó chứa ở các vị trí cụ thể.

```typescript
type StringNumberPair = [string, number];
```
Ở đây, `StringNumberPair` là một `tuple type` của `string` và `number`. Giống như `ReadonlyArray`, nó không có biểu diễn trong thời gian chạy, nhưng có ý nghĩa đối với TypeScript. Đối với hệ thống kiểu, `StringNumberPair` mô tả các mảng mà chỉ mục 0 chứa một chuỗi và chỉ mục 1 chứa một số.

```typescript
function doSomething(pair: [string, number]) {
  const a = pair[0]; // const a: string
  const b = pair[1]; // const b: number
  // ...
}

doSomething(["hello", 42]);
```
Nếu chúng ta cố gắng lập chỉ mục vượt quá số lượng phần tử, chúng ta sẽ nhận được lỗi.

```typescript
function doSomething(pair: [string, number]) {
  // ...
  // const c = pair[2]; // ❌ Tuple type '[string, number]' of length '2' has no element at index '2'.
}
```
Chúng ta cũng có thể `destructure` các `tuple` bằng cách sử dụng `array destructuring` của JavaScript.

```typescript
function doSomething(stringHash: [string, number]) {
  const [inputString, hash] = stringHash;

  console.log(inputString); // const inputString: string
  console.log(hash); // const hash: number
}
```
Các `tuple type` hữu ích trong các API dựa trên quy ước, nơi ý nghĩa của mỗi phần tử là "hiển nhiên". Điều này cho chúng ta sự linh hoạt trong việc đặt tên biến khi chúng ta `destructure` chúng.

Tuy nhiên, vì không phải mọi người dùng đều có cùng quan điểm về những gì là hiển nhiên, có thể đáng để xem xét lại liệu việc sử dụng các đối tượng với tên thuộc tính mô tả có thể tốt hơn cho API của bạn hay không.

Ngoài các kiểm tra độ dài đó, các `tuple type` đơn giản như thế này tương đương với các kiểu là các phiên bản của `Array` khai báo các thuộc tính cho các chỉ mục cụ thể, và khai báo độ dài với một kiểu literal số.

```typescript
interface StringNumberPair {
  // specialized properties
  length: 2;
  0: string;
  1: number;

  // Other 'Array<string | number>' members...
  slice(start?: number, end?: number): Array<string | number>;
}
```
Một điều khác bạn có thể quan tâm là các `tuple` có thể có các thuộc tính tùy chọn bằng cách viết dấu chấm hỏi (`?`) sau kiểu của một phần tử. Các phần tử `tuple` tùy chọn chỉ có thể nằm ở cuối, và cũng ảnh hưởng đến kiểu của `length`.

```typescript
type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord; // const z: number | undefined

  console.log(`Provided coordinates had ${coord.length} dimensions`); // (property) length: 2 | 3
}
```
Các `tuple` cũng có thể có các `rest elements`, phải là một kiểu `array/tuple`.

```typescript
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```
*   `StringNumberBooleans` mô tả một `tuple` có hai phần tử đầu tiên là `string` và `number` tương ứng, nhưng có thể có bất kỳ số lượng `boolean` nào theo sau.
*   `StringBooleansNumber` mô tả một `tuple` có phần tử đầu tiên là `string` và sau đó là bất kỳ số lượng `boolean` nào và kết thúc bằng một `number`.
*   `BooleansStringNumber` mô tả một `tuple` có các phần tử bắt đầu là bất kỳ số lượng `boolean` nào và kết thúc bằng một `string` sau đó là một `number`.

Một `tuple` với một `rest element` không có "độ dài" cố định - nó chỉ có một tập hợp các phần tử được biết rõ ở các vị trí khác nhau.

```typescript
const a: StringNumberBooleans = ["hello", 1];
const b: StringNumberBooleans = ["beautiful", 2, true];
const c: StringNumberBooleans = ["world", 3, true, false, true, false, true];
```
Tại sao các phần tử tùy chọn và `rest` có thể hữu ích? Chà, nó cho phép TypeScript tương ứng các `tuple` với danh sách tham số. Các `tuple type` có thể được sử dụng trong các `rest parameters` và `arguments`, do đó điều sau:

```typescript
function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
  // ...
}
```
Về cơ bản tương đương với:

```typescript
function readButtonInput(name: string, version: number, ...input: boolean[]) {
  // ...
}
```
Điều này tiện lợi khi bạn muốn lấy một số lượng đối số thay đổi với một `rest parameter`, và bạn cần một số lượng phần tử tối thiểu, nhưng bạn không muốn giới thiệu các biến trung gian.

### 6.3.1. Readonly Tuple Types

Một lưu ý cuối cùng về `tuple type` - `tuple type` có các biến thể `readonly`, và có thể được chỉ định bằng cách đặt một `readonly modifier` ở phía trước chúng - giống như với cú pháp viết tắt của mảng.

```typescript
function doSomething(pair: readonly [string, number]) {
  // ...
}
```
Như bạn có thể mong đợi, việc ghi vào bất kỳ thuộc tính nào của một `readonly tuple` không được phép trong TypeScript.

```typescript
function doSomething(pair: readonly [string, number]) {
  // pair[0] = "hello!"; // ❌ Cannot assign to '0' because it is a read-only property.
}
```
Các `tuple` có xu hướng được tạo và giữ nguyên trong hầu hết mã, vì vậy việc chú thích các kiểu là `readonly tuple` khi có thể là một mặc định tốt. Điều này cũng quan trọng vì các `array literal` với `const assertions` sẽ được suy luận với các `readonly tuple type`.

```typescript
let point = [3, 4] as const;

function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

// distanceFromOrigin(point); // ❌ Argument of type 'readonly [3, 4]' is not assignable to parameter of type '[number, number]'.
//   The type 'readonly [3, 4]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.
```
Ở đây, `distanceFromOrigin` không bao giờ sửa đổi các phần tử của nó, nhưng mong đợi một `tuple` có thể thay đổi. Vì kiểu của `point` được suy luận là `readonly [3, 4]`, nó sẽ không tương thích với `[number, number]` vì kiểu đó không thể đảm bảo các phần tử của `point` sẽ không bị thay đổi.

## 6.4. Bug thường gặp

*   **Generic với wrong type:**
    ```typescript
    // let box: Box<string> = { contents: 42 }; // ❌ type mismatch
    ```
*   **Readonly array:**
    ```typescript
    const arr: readonly string[] = ["a"];
    // arr.push("b"); // ❌ Property 'push' does not exist on type 'readonly string[]'.
    ```
*   **Tuple:**
    ```typescript
    type Pair = [string, number];
    // const p: Pair = ["x"]; // ❌ Type '[string]' is not assignable to type 'Pair'. Source has 1 element(s) but target requires 2.
    // const q: Pair = ["x", 1, 2]; // ❌ Type '[string, number, number]' is not assignable to type 'Pair'. Source has 3 element(s) but target requires 2.
    ```
*   **Rest/optional element:**
    ```typescript
    type Triple = [number, number, number?];
    const t: Triple = [1, 2]; // ✅ length = 2
    const t2: Triple = [1, 2, 3]; // ✅ length = 3
    ```

## 6.5. Bài tập thực hành

*   Tạo generic `Container<Type>` với property `value: Type`.
*   Tạo `numberContainer`, `stringContainer` và set giá trị.
*   Viết generic function `updateValue<Type>(c: Container<Type>, newValue: Type)`.
*   Tạo tuple type `[string, number, boolean?]` gọi là `RecordTuple`.
*   Tạo array hợp lệ, destructure và log các element.
*   Tạo `readonly tuple [number, number]` là `Point`.
*   Thử gán value → xem TypeScript báo lỗi.
*   Tạo `readonly string[]` → thử push → quan sát lỗi.

# 7. Tổng kết kiến thức

## 7.1. Bảng tóm tắt kiến thức

| Chủ đề                  | Cú pháp / Ví dụ                                   | Mục đích / Lưu ý                                     | Bug phổ biến                                         |
| :---------------------- | :------------------------------------------------ | :--------------------------------------------------- | :--------------------------------------------------- |
| Object Types            | `interface Person { name: string; age: number; }` | Định nghĩa cấu trúc object                           | Property thiếu, typo                                |
| Optional Properties     | `xPos?: number`                                   | Property có thể không có                             | Truy cập `undefined` khi `strictNullChecks`          |
| Readonly Properties     | `readonly prop: string`                           | Không được gán lại                                   | Nhầm tưởng immutable toàn bộ object                  |
| Index Signatures        | `[key: string]: number`                           | Cho phép property chưa biết trước                   | Property type không khớp                            |
| Excess Property Checks  | `{ colour: "red" }` ❌                            | Phát hiện property thừa khi dùng literal             | Typo property                                        |
| Interface Extends       | `interface B extends A {}`                        | Mở rộng type, kế thừa property                      | Conflict type → lỗi                                  |
| Intersection Type       | `type C = A & B`                                  | Kết hợp nhiều type                                   | Property trùng nhưng type khác → `never`             |
| Generic Types           | `interface Box<T> { contents: T }`                | Reusable cho nhiều loại                              | Truyền type sai                                      |
| ReadonlyArray           | `readonly string[]`                               | Mảng immutable                                       | Thử mutate → lỗi                                     |
| Tuple Types             | `[string, number]`                                | Array có length/type cố định                         | Index vượt → lỗi                                     |
| Optional / Rest Tuples  | `[number, number, number?]`, `[string, ...boolean[], number]` | Flexible tuple                                       | Sai thứ tự, thiếu/thừa element                      |
| Readonly Tuple          | `readonly [string, number]`                       | Tuple immutable                                      | Gán hoặc mutate → lỗi                                |

## 7.2. Sơ đồ trực quan (Mindmap)

```
TypeScript Object & Type System
│
├─ Object Types
│   ├─ Optional Properties (?)
│   ├─ Readonly Properties
│   └─ Index Signatures ([key: string]: Type)
│
├─ Combining Types
│   ├─ Interface Extension (extends)
│   └─ Intersection Type (&)
│
├─ Excess Property Checks
│   ├─ Object literals checked
│   ├─ Workaround: type assertion, variable assignment, index signature
│
├─ Generics
│   ├─ Generic Object Types: Box<T>, Container<T>
│   ├─ Generic Functions
│   └─ Type Aliases Generic: OrNull<T>, OneOrMany<T>
│
├─ Arrays
│   ├─ Generic Array<Type>
│   ├─ ReadonlyArray<Type>
│   └─ Tuples [T1, T2, ...]
│       ├─ Optional Elements
│       ├─ Rest Elements
│       └─ Readonly Tuples
```

## 7.3. Key Takeaways / Tips

*   **Object types:** Luôn cố gắng dùng `interface` hoặc `type` thay vì `any`.
*   **Modifiers:**
    *   `?` → optional
    *   `readonly` → bảo vệ property khỏi bị gán lại
*   **Combining types:**
    *   `extends` → kế thừa, merge compatible properties
    *   `&` → intersection, tất cả properties phải thỏa, conflict → `never`
*   **Generics:** Tránh tạo nhiều interface/function trùng lặp. `Box<T>` & `Container<T>` là pattern phổ biến.
*   **Arrays & Tuples:**
    *   Dùng `readonly` nếu không muốn mutate.
    *   Tuple: index + type cố định, optional/rest cho flexible API.

# 8. Bảng so sánh TypeScript Types & Features

| Tính năng               | Cú pháp / Ví dụ                                                               | Khi dùng                                     | Kết quả / Lưu ý                                     | Bug / Hạn chế phổ biến                                         |
| :---------------------- | :---------------------------------------------------------------------------- | :------------------------------------------- | :-------------------------------------------------- | :--------------------------------------------------- |
| Interface               | `interface Person { name: string; age: number }`                              | Định nghĩa object type                       | Có thể merge nếu cùng tên property                  | Conflict type → lỗi                                  |
| Type Alias              | `type Person = { name: string; age: number }`                                 | Object type, union, intersection             | Không merge, có thể dùng với union/intersection      | Không merge tự động                                  |
| Extends (Interface)     | `interface Employee extends Person { dept: string }`                          | Mở rộng type                                 | Kế thừa property                                    | Conflict property → lỗi                              |
| Intersection (`&`)      | `type Staff = Person & Employee`                                              | Kết hợp nhiều type                           | Phải thỏa tất cả type cùng lúc                      | Conflict property → `never`                          |
| Optional Property       | `xPos?: number`                                                               | Khi property có thể thiếu                   | `undefined` khi không cung cấp                      | Cần check hoặc default value                         |
| Readonly Property       | `readonly prop: string`                                                       | Khi không muốn property bị thay đổi         | Không thể gán lại                                   | Nhầm tưởng immutable toàn object                    |
| Index Signature         | `[key: string]: number`                                                       | Property chưa biết trước                     | Flexible                                            | Property type không khớp → lỗi                       |
| Excess Property Check   | `{ color: "red", width: 10 }`                                                 | Khi assign literal                           | Literal property thừa → lỗi                         | Typo property, cần type assertion hoặc biến trung gian |
| Generic Object Type     | `interface Box<T> { contents: T }`                                            | Reusable cho nhiều type                      | Không cần nhiều interface                           | Sai type argument → lỗi                              |
| Generic Function        | `function setContents<T>(box: Box<T>, newContents: T)`                       | Xử lý nhiều type object                      | Tránh overload                                      | Truyền type sai                                      |
| Array Type              | `string[] / Array<string>`                                                    | Chứa nhiều phần tử cùng type                | Type-safe                                           | Wrong element type → lỗi                             |
| ReadonlyArray           | `readonly string[]`                                                           | Không mutate array                           | Immutable                                           | Thử push → lỗi                                       |
| Tuple                   | `[string, number]`                                                            | Array index/type cố định                     | Fixed length + type                                 | Thiếu/thừa element → lỗi                             |
| Optional / Rest Tuple   | `[number, number, number?] / [string, ...boolean[], number]`                  | Flexible tuple                               | Optional ở cuối, rest array                         | Sai thứ tự / thiếu / thừa element                   |
| Readonly Tuple          | `readonly [string, number]`                                                   | Tuple immutable                              | Không thể mutate                                    | Assign → lỗi nếu không tương thích                   |
