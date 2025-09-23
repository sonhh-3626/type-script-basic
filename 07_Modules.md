# Modules trong TypeScript

## 1. Module vs Script trong TypeScript

Trong TypeScript, bất kỳ file nào chứa `import` hoặc `export` ở cấp cao nhất đều được coi là một module. Ngược lại, một file không có bất kỳ khai báo `import` hoặc `export` nào ở cấp cao nhất sẽ được coi là một script.

### Khái niệm cơ bản

-   **Module**:
    -   Được xác định bởi sự hiện diện của `import` hoặc `export` ở cấp cao nhất.
    -   Thực thi trong phạm vi riêng của nó (scope riêng), không trong phạm vi toàn cục (global scope).
    -   Các biến, hàm, lớp, v.v., được khai báo trong một module không hiển thị bên ngoài module trừ khi chúng được `export` rõ ràng.
    -   Để sử dụng một thành phần từ module khác, nó phải được `import`.
    -   **Tip**: Đây là một điểm khác biệt lớn so với script "truyền thống" trong JavaScript, nơi mọi thứ rơi vào `window` hoặc `global`.

-   **Script**:
    -   Được xác định khi không có bất kỳ khai báo `import` hoặc `export` nào ở cấp cao nhất.
    -   Nội dung của nó có sẵn trong phạm vi toàn cục (global scope).
    -   TypeScript giả định bạn sẽ sử dụng tùy chọn compiler `outFile` để gộp nhiều file đầu vào thành một file đầu ra, hoặc sử dụng nhiều thẻ `<script>` trong HTML để tải các file này (theo đúng thứ tự).

### Ép một file script thành module

Nếu bạn có một file hiện tại không có bất kỳ `import` hoặc `export` nào nhưng bạn muốn nó được coi là một module, hãy thêm dòng:

```ts
export {};
```

Dòng này sẽ biến file thành một module không export gì. Cú pháp này hoạt động bất kể `module target` của bạn.

### Ví dụ minh họa

**File: `mathUtils.ts` (Module)**
```ts
// Đây là module vì có export
export function add(a: number, b: number): number {
  return a + b;
}

export const PI = 3.1415;
```

**File: `app.ts` (Sử dụng Module)**
```ts
// import từ module khác
import { add, PI } from './mathUtils';

console.log("Sum:", add(2, 3)); // Sum: 5
console.log("PI:", PI);         // PI: 3.1415
```
`add` và `PI` chỉ có thể sử dụng trong `app.ts` vì chúng được export từ `mathUtils.ts`.

**File: `logger.ts` (Ban đầu là script)**
```ts
function logMessage(msg: string) {
  console.log(msg);
}
// Đây là script, logMessage ở global.
```

**File: `logger.ts` (Ép thành module)**
```ts
export {}; // biến file này thành module

function logMessage(msg: string) {
  console.log(msg);
}
// bây giờ logMessage không còn global nữa, chỉ có thể export để dùng
```
**Lưu ý**: `export {}` không export gì, nhưng TypeScript coi file là module và gán cho nó một scope riêng.

### Câu hỏi tư duy

-   Nếu tôi khai báo `let x = 10;` trong `mathUtils.ts` nhưng không export, `app.ts` có dùng được `x` không?
-   Nếu một file không có `import` hoặc `export`, biến trong đó có thể truy cập từ module khác không?
-   Tại sao TypeScript lại phân biệt module và script?
-   Thêm `export {};` có thay đổi code hiện tại không? (ví dụ: code dùng biến global)

### Use cases thực tế

-   **Chia nhỏ logic**: Module giúp tách biệt các tính năng (ví dụ: `user.ts` quản lý user, `auth.ts` quản lý đăng nhập).
-   **Tránh xung đột tên biến toàn cục**: TypeScript module luôn có scope riêng.
-   **Tái sử dụng code**: Có thể `import`/`export` giữa nhiều dự án.
-   **Chuyển file legacy TS sang module**: Thêm `export {}` là đủ khi chưa muốn export gì.
-   **Tương thích với `--module target`**: `export {}` giúp tương thích mà không thay đổi logic hiện tại.

### Những bug thường gặp

-   **Quên export**: Nếu quên `export` một hàm/biến, `import` từ file khác sẽ lỗi.
-   **Sai path khi import**: Đường dẫn `import` phải chính xác (ví dụ: `MathUtils.ts` vs `mathUtils.ts` → case-sensitive sẽ lỗi).
-   **Sử dụng biến global trong module**: Biến global được khai báo trong script sẽ không thể truy cập trực tiếp trong module nếu không được `import` hoặc `export`.
-   **Quên thêm `export {};`**: Khi muốn file trở thành module nhưng quên thêm dòng này, `import` file khác sẽ lỗi.
-   **Load script không đúng thứ tự trong HTML**: Biến global chưa khai báo mà đã dùng → lỗi runtime.

### Bài tập nhỏ thực hành ngay

1.  **Tạo một module `stringUtils.ts`**:
    -   `export function capitalize(str: string): string` → viết hoa chữ cái đầu.
    -   `export function reverse(str: string): string` → đảo ngược chuỗi.
2.  **Tạo `app.ts`**:
    -   `import` 2 function trên.
    -   Thử dùng `console.log` với một chuỗi bất kỳ.
3.  **Bonus bug check**:
    -   Tạo file `config.ts` chứa hằng số `const API_URL = "https://api.example.com";`.
    -   Trước khi thêm `export {};`, thử truy cập `API_URL` từ file khác. Xem có được không?
    -   Thêm `export {};` vào `config.ts`. Quan sát điều gì xảy ra với việc truy cập biến `API_URL` từ file khác.

## 2. ES Module Syntax

### Ba yếu tố chính khi viết module-based code trong TypeScript

1.  **Syntax (Cú pháp)**: Cách bạn `import` và `export` các giá trị, class, function, type.
2.  **Module Resolution**: TypeScript sẽ ánh xạ tên module/path thành file thực trên ổ cứng như thế nào.
3.  **Module Output Target**: JavaScript xuất ra sẽ là ES Module, CommonJS, AMD… tùy thuộc vào `tsconfig.json`.

### Cú pháp ES Module

#### Default Export

Một file có thể khai báo một export mặc định thông qua `export default`:

**File: `hello.ts`**
```ts
export default function helloWorld() {
  console.log("Hello, world!");
}
```

**File: `app.ts`**
```ts
import helloWorld from "./hello.js";
helloWorld();
```

#### Named Export

Ngoài export mặc định, bạn có thể có nhiều export của các biến và hàm bằng cách bỏ qua `default`:

**File: `maths.ts`**
```ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;

export class RandomNumberGenerator {}

export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
```

**File: `app.ts`**
```ts
import { pi, phi, absolute } from "./maths.js";

console.log(pi);
const absPhi = absolute(phi); // absPhi: 1.61
```

#### Cú pháp Import bổ sung

-   **Đổi tên import (`import { old as new }`)**:
    ```ts
    import { pi as π } from "./maths.js";
    console.log(π); // (alias) var π: number
    ```

-   **Kết hợp default và named export**:
    ```ts
    // maths.ts
    export const pi = 3.14;
    export default class RandomNumberGenerator {}

    // app.ts
    import RandomNumberGenerator, { pi as π } from "./maths.js";
    RandomNumberGenerator; // (alias) class RandomNumberGenerator
    console.log(π);         // (alias) const π: 3.14
    ```

-   **Import tất cả thành một namespace (`import * as name`)**:
    ```ts
    import * as math from "./maths.js";

    console.log(math.pi);
    const positivePhi = math.absolute(math.phi); // positivePhi: number
    ```

-   **Import file mà không bao gồm bất kỳ biến nào (`import "./file"`)**:
    ```ts
    import "./maths.js";
    console.log("3.14");
    ```
    Trong trường hợp này, `import` không đưa biến nào vào module hiện tại. Tuy nhiên, tất cả code trong `maths.ts` đã được đánh giá, có thể kích hoạt các side-effect ảnh hưởng đến các đối tượng khác.

### Cú pháp ES Module dành riêng cho TypeScript

-   **Export và import type**:
    ```ts
    // animal.ts
    export type Cat = { breed: string; yearOfBirth: number };
    export interface Dog {
      breeds: string[];
      yearOfBirth: number;
    }

    // app.ts
    import { Cat, Dog } from "./animal.js";
    type Animals = Cat | Dog;
    ```

-   **`import type`**: Một câu lệnh `import` chỉ có thể import các type:
    ```ts
    // animal.ts
    export type Cat = { breed: string; yearOfBirth: number };
    export type Dog = { breeds: string[]; yearOfBirth: number };
    export const createCatName = () => "fluffy";

    // valid.ts
    import type { Cat, Dog } from "./animal.js";
    export type Animals = Cat | Dog;

    // app.ts
    import type { createCatName } from "./animal.js";
    const name = createCatName(); // Lỗi: 'createCatName' cannot be used as a value because it was imported using 'import type'.
    ```

-   **Inline type imports (TypeScript 4.5+)**: Cho phép các import riêng lẻ được tiền tố bằng `type` để chỉ ra rằng tham chiếu được import là một type:
    ```ts
    // animal.ts
    export type Cat = { breed: string; yearOfBirth: number };
    export type Dog = { breeds: string[]; yearOfBirth: number };
    export const createCatName = () => "fluffy";

    // app.ts
    import { createCatName, type Cat, type Dog } from "./animal.js";

    export type Animals = Cat | Dog;
    const name = createCatName();
    ```
    **Lợi ích**: Cả hai cú pháp này cho phép các trình biên dịch non-TypeScript như Babel, swc hoặc esbuild biết những import nào có thể được loại bỏ một cách an toàn.

### Câu hỏi tư duy

-   Khi nào bạn nên dùng `export default` so với `named export`?
-   Tại sao `import type` lại hữu ích khi dùng với Babel hay swc?
-   Khi `import` một file chỉ để side-effect, điều gì sẽ xảy ra?

### Use cases thực tế

-   **Library lớn**: `export default` dùng cho class chính, `named export` cho helper functions.
-   **Side-effects**: Load polyfill hoặc config một lần khi app bắt đầu.
-   **Interop**: Dự án TypeScript + Node.js + npm packages CommonJS.

### Bug thường gặp

-   **Import type như value**: Sẽ gây lỗi runtime vì `import type` chỉ dùng cho type, không thể gọi value.
-   **Quên `esModuleInterop`**: Khi dùng CommonJS có thể dẫn đến lỗi default import.
-   **Nhầm đường dẫn file khi import**: Case-sensitive, thiếu `.js` khi target là ES Module.
-   **Side-effect import**: Code chạy nhưng không có giá trị export, dễ nhầm lẫn.

### Bài tập nhỏ thực hành

1.  **Tạo module `shapes.ts`**:
    -   `export default class Circle { constructor(radius: number) {} area() {} }`
    -   `export function square(x: number) { return x*x }`
    -   `export type Rectangle = { width: number; height: number }`
2.  **Tạo `app.ts`**:
    -   `Import` `Circle` mặc định, function `square` và type `Rectangle`.
    -   Tạo 1 instance `Circle`, tính `area`, log function `square`.
3.  **Bonus bug check**:
    -   Thử `import Rectangle` như value → TypeScript báo lỗi.
    -   Thử `import shapes.ts` mà không có `.js` → chạy target ES Module có vấn đề gì không?

## 3. CommonJS Syntax

CommonJS là định dạng mà hầu hết các module trên npm được phân phối. Ngay cả khi bạn đang viết bằng cú pháp ES Modules ở trên, việc hiểu sơ qua về cách CommonJS hoạt pháp sẽ giúp bạn debug dễ dàng hơn.

### Exporting

Các định danh được export thông qua việc thiết lập thuộc tính `exports` trên một global gọi là `module`.

```ts
function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}

module.exports = {
  pi: 3.14,
  squareTwo: 1.41,
  phi: 1.61,
  absolute,
};
```

### Importing

Sau đó, các file này có thể được import thông qua một câu lệnh `require`:

```ts
const maths = require("./maths");
maths.pi; // any
```

Hoặc bạn có thể đơn giản hóa một chút bằng cách sử dụng tính năng destructuring trong JavaScript:

```ts
const { squareTwo } = require("./maths");
squareTwo; // const squareTwo: any
```

### CommonJS và ES Modules interop

Có sự không khớp về tính năng giữa CommonJS và ES Modules liên quan đến sự phân biệt giữa `default import` và `module namespace object import`. TypeScript có một cờ compiler để giảm ma sát giữa hai bộ ràng buộc khác nhau với `esModuleInterop`.

### Bug thường gặp

-   **Không bật `esModuleInterop`**: Dẫn đến lỗi `default import` khi cố gắng import một module CommonJS bằng cú pháp ES Module.
-   **Nhầm CommonJS với ES Modules**: Gây ra lỗi cú pháp hoặc lỗi runtime.

## 4. Module Resolution

Module Resolution là quá trình mà TypeScript dùng để biết string trong `import` hoặc `require` tương ứng với file nào trên đĩa.

### Hai chiến lược chính

1.  **Classic**:
    -   Mặc định khi tùy chọn compiler `module` không phải `commonjs`.
    -   Chủ yếu để tương thích ngược với các dự án TypeScript cũ.
    -   Không mô phỏng Node.js, ít "tự động" tìm file hơn.

2.  **Node**:
    -   Mô phỏng cách Node.js tìm module trong chế độ CommonJS, với các kiểm tra bổ sung cho `.ts` và `.d.ts`.
    -   Tìm theo thứ tự:
        -   File `.ts`, `.tsx`, `.d.ts`.
        -   Nếu là folder, tìm `index.ts`, `index.d.ts`.
    -   Phù hợp khi viết ứng dụng Node hoặc front-end bundler như Webpack.

### Các TSConfig flags ảnh hưởng đến resolution

| Flag             | Chức năng                                                              |
| :--------------- | :--------------------------------------------------------------------- |
| `moduleResolution` | Chọn chiến lược: `classic` hoặc `node`                                |
| `baseUrl`        | Đặt thư mục gốc để giải quyết import không phải relative              |
| `paths`          | Ánh xạ các alias của module, ví dụ `@utils/*` → `src/utils/*`         |
| `rootDirs`       | Danh sách nhiều thư mục nguồn để TypeScript coi như cùng root         |

**Tip**: Khi dùng monorepo hoặc alias path, `baseUrl` + `paths` là cứu cánh để import gọn gàng.

### Ví dụ minh họa

**Cấu trúc thư mục:**
```
src/
 ├─ utils/
 │   └─ math.ts
 └─ app.ts
```

**`math.ts`**
```ts
export const pi = 3.14;
```

**`app.ts` (Relative path)**
```ts
import { pi } from "./utils/math"; // relative path
console.log(pi);
```

**Với `baseUrl` + `paths` trong `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@utils/*": ["utils/*"]
    }
  }
}
```

**`app.ts` (Alias path)**
```ts
import { pi } from "@utils/math"; // không cần ../../
```

### Câu hỏi tư duy

-   Tại sao Node resolution lại ưu tiên `.ts` trước `.js`?
-   Khi nào bạn nên dùng `classic` thay vì `node`?
-   `baseUrl` + `paths` giải quyết vấn đề gì trong dự án lớn?

### Use cases thực tế

-   **Monorepo**: Nhiều package, muốn import từ root mà không cần relative path dài.
-   **Node.js app**: Dùng Node resolution để đồng bộ với cách Node tìm module.
-   **Library TypeScript**: Muốn TS compiler hiểu alias paths nhưng vẫn generate JS chuẩn.

### Bug thường gặp

-   **Sai `moduleResolution`**: TypeScript không tìm thấy module, dù đường dẫn đúng.
-   **Quên thêm `.ts`**: Khi `moduleResolution` là `classic` có thể gây lỗi import.
-   **Alias path không khớp `baseUrl`**: Dẫn đến lỗi "Cannot find module".
-   **`rootDirs` + relative path nhầm**: Import đúng TS nhưng build ra JS lại lỗi.

### Bài tập nhỏ thực hành

1.  **Tạo folder structure**:
    ```
    project/
     └─ src/
         ├─ helpers/
         │   └─ logger.ts
         └─ main.ts
    ```
2.  **`logger.ts`**:
    ```ts
    export function log(msg: string) { console.log(msg); }
    ```
3.  **`main.ts`**:
    -   Import `log` dùng relative path và alias path (`@helpers/logger`).
    -   Thử đổi `moduleResolution` giữa `classic` và `node` và quan sát khác biệt.
    -   Thêm `baseUrl` + `paths` trong `tsconfig.json` để import gọn hơn.
4.  **Bonus**: Thử import folder thay vì file (`import { log } from './helpers'`) → Node strategy sẽ tìm `index.ts`?

## 5. Module Output Options

Có hai tùy chọn ảnh hưởng đến đầu ra JavaScript được phát ra:

1.  **`target`**: Xác định các tính năng JS nào được downlevel (chuyển đổi để chạy trong các runtime JavaScript cũ hơn) và những tính năng nào được giữ nguyên.
2.  **`module`**: Xác định mã nào được sử dụng cho các module để tương tác với nhau.

`target` bạn sử dụng được xác định bởi các tính năng có sẵn trong runtime JavaScript mà bạn mong đợi mã TypeScript sẽ chạy. Đó có thể là: trình duyệt web cũ nhất bạn hỗ trợ, phiên bản Node.js thấp nhất bạn mong đợi chạy hoặc có thể đến từ các ràng buộc độc đáo từ runtime của bạn - ví dụ như Electron.

Tất cả giao tiếp giữa các module xảy ra thông qua một module loader, tùy chọn compiler `module` xác định module loader nào được sử dụng. Tại runtime, module loader chịu trách nhiệm định vị và thực thi tất cả các dependency của một module trước khi thực thi nó.

### Ví dụ minh họa

Giả sử file `constants.ts` và `math.ts`:

**File: `constants.ts`**
```ts
export const valueOfPi = 3.14;
```

**File: `math.ts`**
```ts
import { valueOfPi } from "./constants.js";
export const twoPi = valueOfPi * 2;
```

#### Output với `module: "ES2020"`

```ts
import { valueOfPi } from "./constants.js";
export const twoPi = valueOfPi * 2;
```
Gần như giữ nguyên code TypeScript nếu runtime hỗ trợ ES Modules.

#### Output với `module: "CommonJS"`

```ts
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoPi = void 0;
const constants_js_1 = require("./constants.js");
exports.twoPi = constants_js_1.valueOfPi * 2;
```
TypeScript "biến" cú pháp ES Module sang CommonJS (`require`, `exports`).

#### Output với `module: "UMD"`

```ts
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./constants.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.twoPi = void 0;
    const constants_js_1 = require("./constants.js");
    exports.twoPi = constants_js_1.valueOfPi * 2;
});
```
UMD (Universal Module Definition) chạy được cả CommonJS (Node) và AMD (browser).

**Lưu ý**: Output ES2020 gần như giống TS gốc, chỉ dùng khi runtime hỗ trợ ES Modules.

### Câu hỏi tư duy

-   Khi nào bạn nên dùng `module: "CommonJS"` thay vì `ES2020`?
-   UMD phù hợp với tình huống nào?
-   Nếu bạn dùng `target: "ES5"` và `module: "ES2020"`, điều gì sẽ xảy ra?

### Use cases thực tế

-   **Node.js project**: CommonJS vẫn phổ biến, ES Modules mới hơn.
-   **Library phân phối cho cả Node và Browser**: Dùng UMD để tương thích.
-   **App hiện đại chỉ chạy browser mới**: ES2020 hoặc ESNext module, giữ syntax gốc để tree-shaking.

### Bug thường gặp

-   **Import không chạy khi module output sai**: Ví dụ: import ES Module trong runtime chỉ hiểu CommonJS → lỗi.
-   **Target quá cũ**: Async/await, optional chaining, class inheritance có thể break.
-   **UMD load dependencies nhầm thứ tự**: Dẫn đến lỗi runtime.

### Bài tập nhỏ thực hành

1.  **Tạo file `constants.ts`**:
    ```ts
    export const valueOfPi = 3.14;
    ```
2.  **Tạo file `math.ts`**:
    ```ts
    import { valueOfPi } from "./constants.js";
    export const twoPi = valueOfPi * 2;
    ```
3.  **Thử compile với các cấu hình khác nhau trong `tsconfig.json`**:
    ```json
    {
      "compilerOptions": {
        "target": "ES5",
        "module": "CommonJS"
      }
    }
    ```
    Quan sát output JS.
4.  **Thử đổi `module` thành `"ES2020"` và `"UMD"`** → quan sát sự khác biệt.
5.  **Bonus**: Thử import `math.js` vào Node.js và browser tương ứng → xem code chạy đúng hay lỗi.

## 6. TypeScript Namespaces

TypeScript có định dạng module riêng gọi là `namespaces` xuất hiện trước tiêu chuẩn ES Modules. Cú pháp này có nhiều tính năng hữu ích để tạo các file định nghĩa phức tạp và vẫn được sử dụng tích cực trong DefinitelyTyped. Mặc dù không bị deprecated, phần lớn các tính năng trong `namespaces` tồn tại trong ES Modules và chúng tôi khuyên bạn nên sử dụng ES Modules để phù hợp với hướng đi của JavaScript.

### Khái niệm cơ bản

-   **Namespace**: Một module format riêng của TypeScript xuất hiện trước ES Modules.
-   Dùng để gom nhóm các biến, hàm, class, interface liên quan vào cùng một scope.
-   Vẫn được dùng trong các complex definition files hoặc thư viện DefinitelyTyped.
-   Không bị deprecated, nhưng khuyến nghị dùng ES Modules nếu muốn code đồng bộ với JavaScript hiện đại.
-   **Tip**: Namespace tương tự object container, giúp tránh xung đột tên trong global scope.

### Ví dụ minh họa

```ts
namespace Geometry {
    export const PI = 3.14;

    export function areaOfCircle(radius: number) {
        return PI * radius * radius;
    }

    export class Circle {
        constructor(public radius: number) {}
        area() { return areaOfCircle(this.radius); }
    }
}

// Sử dụng namespace
console.log(Geometry.PI);                   // 3.14
console.log(Geometry.areaOfCircle(2));     // 12.56

const c = new Geometry.Circle(3);
console.log(c.area());                      // 28.26
```
**Chú ý**: Phải `export` các thành phần bên trong namespace nếu muốn truy cập từ bên ngoài.

### Câu hỏi tư duy

-   Namespace khác gì so với ES Modules về scope và import/export?
-   Tại sao các thư viện lớn như DefinitelyTyped vẫn dùng namespace?
-   Nếu bạn có nhiều file TS dùng namespace, cần làm gì để các file kết hợp được?

### Use cases thực tế

-   **Library definition files (`*.d.ts`)** trước ES Modules.
-   **Code legacy** trước khi ES Modules phổ biến.
-   **Gom nhóm hằng số, hàm helper, hoặc class** mà không cần module loader.
-   Ví dụ: thư viện jQuery type definitions vẫn dùng namespace `JQuery`.

### Bug thường gặp

-   **Quên export**: Không truy cập được từ ngoài namespace.
-   **Đặt cùng tên namespace trong nhiều file nhưng không dùng `///<reference path="..."/>`**: TypeScript không biết file nào trước.
-   **Kết hợp namespace với module ES**: Có thể gây nhầm lẫn scope.

### Bài tập nhỏ thực hành

1.  **Tạo namespace `Utils`**:
    -   `export function capitalize(str: string)` → viết hoa chữ cái đầu.
    -   `export const appName = "MyApp"`
2.  **Trong cùng file**:
    ```ts
    console.log(Utils.capitalize("hello")); // "Hello"
    console.log(Utils.appName);             // "MyApp"
    ```
3.  **Bonus**:
    -   Thêm namespace `MathUtils` trong file khác.
    -   Thử dùng `///<reference path="MathUtils.ts"/>` để gọi `MathUtils.areaOfCircle(2)`.

## 7. Tóm tắt kiến thức về Modules và Namespaces

| Khía cạnh          | Module (ES Modules)       | Namespace (TypeScript) | Script (Global)           |
| :----------------- | :------------------------ | :--------------------- | :------------------------ |
| **Cách xác định**  | Có `import` hoặc `export` | `namespace` keyword    | Không `import`/`export`   |
| **Scope**          | Riêng (file-scoped)       | Namespace-scoped       | Global scope              |
| **Import/Export**  | Có `import`/`export`      | `export` bên trong namespace | Không cần                 |
| **ES Modules support** | ✅                        | ❌                     | ❌                        |
| **Use case**       | Ứng dụng hiện đại, thư viện | Code legacy, `*.d.ts`, helper | Script nhỏ, global        |
| **Bug thường gặp** | Nhầm đường dẫn, quên export, import type như value | Quên export, `reference path` | Biến global xung đột, thứ tự load |

### Sơ đồ ý tưởng

```
File Type
 ├─ Script (global)
 ├─ Module (ES Module / CommonJS / UMD)
 │   └─ Default / Named Export / Import type / Namespace import
 └─ Namespace (pre-ES Module)
     └─ export bên trong namespace
```
