# 0. Giới thiệu TypeScript cơ bản

## 0.1. Khái niệm cơ bản: Hành vi của giá trị trong JavaScript

Mỗi giá trị trong JavaScript đều có một tập hợp các hành vi mà bạn có thể quan sát từ việc chạy các phép toán khác nhau.

**Ví dụ:**

```javascript
const message = "Hello World!";

// Truy cập thuộc tính 'toLowerCase' trên 'message' và gọi nó
message.toLowerCase();

// Gọi 'message' trực tiếp
message();
```

Nếu `message` là `"Hello World!"`:
- `message.toLowerCase()` sẽ trả về `"hello world!"`.
- `message()` sẽ gây ra lỗi `TypeError: message is not a function` vì một chuỗi không thể được gọi như một hàm.

Các câu hỏi cần suy nghĩ khi viết JavaScript:
- `message` có thể gọi được không?
- Nó có thuộc tính `toLowerCase` không?
- Nếu có, `toLowerCase` có thể gọi được không?
- Nếu cả hai đều có thể gọi được, chúng trả về gì?

JavaScript chỉ cung cấp kiểu động (dynamic typing) – chạy code để xem điều gì xảy ra. Một kiểu (type) là khái niệm mô tả những giá trị nào có thể được truyền vào một hàm và những giá trị nào sẽ gây lỗi.

## 0.2. Static Type-checking

TypeScript giúp chúng ta tìm lỗi trước khi code chạy. Một hệ thống kiểu tĩnh (static type system) mô tả hình dạng và hành vi của các giá trị khi chương trình chạy. Một trình kiểm tra kiểu (type-checker) như TypeScript sử dụng thông tin đó và cho chúng ta biết khi nào mọi thứ có thể đi chệch hướng.

**Ví dụ:**

```typescript
const message = "hello!";

message();
```

Khi chạy đoạn code trên với TypeScript, bạn sẽ nhận được thông báo lỗi trước khi chạy code:
```
This expression is not callable.
  Type 'String' has no call signatures.
```

**Sơ đồ minh hoạ:**

```
        +------------------+
        |   JavaScript     |
        +------------------+
   viết code  →  chạy code  →  gặp lỗi runtime ❌
        +------------------+
        |   TypeScript     |
        +------------------+
   viết code  →  compile check  →  báo lỗi ngay ✅
```

Với TypeScript, lỗi được phát hiện sớm, tiết kiệm thời gian kiểm thử và sửa lỗi.

## 0.3. Types for Tooling

TypeScript không chỉ bắt lỗi mà còn giúp lập trình viên viết code nhanh hơn, ít sai hơn nhờ các công cụ hỗ trợ (tooling) như tự động hoàn thành (autocomplete), refactor, và sửa lỗi nhanh (quick fix).

Type-checker biết được hình dạng và khả năng của đối tượng, nhờ đó IDE/editor (VSCode, WebStorm, v.v.) có thể:
- Gợi ý autocomplete chính xác.
- Báo lỗi ngay khi gõ sai.
- Đưa ra “quick fix” (sửa code tự động).
- Refactor an toàn (đổi tên biến, trích xuất phương thức…).

**Ví dụ:**

```typescript
import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.sen // dừng gõ ở đây
});
```

Editor sẽ tự động gợi ý: `send`, `sendDate`, `sendFile`, `sendStatus`. Nếu bạn gõ nhầm `sen`, nó sẽ báo lỗi và đề xuất Quick Fix để đổi thành `send`.

**Sơ đồ tư duy:**

```
[TypeScript Type System]
          |
   +------+--------------------+
   |                           |
[Error Checking]         [Tooling Support]
(runtime bug ↓)          (developer experience ↑)
   |                           |
Catch type errors          Autocomplete, Quick Fix,
before run                 Refactoring, Jump to def
```

## 0.4. Cài đặt và thiết lập TypeScript Compiler (tsc) trên Ubuntu và VS Code

### 0.4.1. Cài đặt Node.js & npm

Trước hết cần Node.js vì `tsc` được phát hành qua `npm`.

```bash
# Cập nhật package list
sudo apt update

# Cài Node.js & npm
sudo apt install -y nodejs npm

# Kiểm tra phiên bản
node -v
npm -v
```

### 0.4.2. Cài đặt TypeScript Compiler (tsc)

Có 2 cách: global (dùng mọi project) hoặc local (riêng từng project).

**Cài global:**
```bash
sudo npm install -g typescript
tsc -v
```

**Cài local (khuyên dùng khi làm project):**
```bash
mkdir my-ts-app && cd my-ts-app
npm init -y
npm install --save-dev typescript
npx tsc -v
```

### 0.4.3. Khởi tạo file cấu hình `tsconfig.json`

File này giúp định nghĩa rules cho project TypeScript.

```bash
npx tsc --init
```

**Ví dụ `tsconfig.json` cơ bản:**

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

**Cấu trúc project:**

```
my-ts-app/
 ├─ src/
 │   └─ index.ts
 ├─ dist/     (output JS sau khi build)
 └─ tsconfig.json
```

### 0.4.4. Biên dịch TypeScript → JavaScript

Ví dụ trong `src/index.ts`:

```typescript
const message: string = "Hello TS!";
console.log(message);
```

Compile:
```bash
npx tsc
```

JS output sẽ nằm trong `dist/index.js`:

```javascript
"use strict";
const message = "Hello TS!";
console.log(message);
```

### 0.4.5. Thiết lập trong VS Code

- Cài extension: `TypeScript and JavaScript Language Features` (thường có sẵn trong VS Code).
- (Khuyên dùng) Cài thêm extension: `TypeScript Hero`, `ESLint`, `Prettier` để có gợi ý + format đẹp.
- Mở project (`my-ts-app`) bằng VS Code → editor sẽ tự nhận `tsconfig.json`.
- Khi gõ code `.ts`, VS Code sẽ:
    - Autocomplete property/method.
    - Báo lỗi type trực tiếp trong editor.
    - Gợi ý “Quick Fix”.

### 0.4.6. Tích hợp Run Task trong VS Code (tùy chọn)

Để build bằng phím tắt:
- Mở VS Code → Terminal > Configure Default Build Task.
- Chọn `TypeScript: tsc - build - tsconfig.json`.
- Giờ bạn chỉ cần `Ctrl+Shift+B` để compile.

## 0.5. Lỗi `SyntaxError: Unexpected token '?'`

Lỗi này không phải do code sai, mà do JS runtime (Node.js) không hiểu toán tử `??` (nullish coalescing operator), hoặc không hiểu cú pháp TypeScript hiện đại.

### 0.5.1. Nguyên nhân

Toán tử `??` xuất hiện từ ECMAScript 2020 (ES11).
- Nếu Node.js bạn đang chạy quá cũ (≤ 12), nó sẽ không support trực tiếp.
- Nếu bạn viết TypeScript mà compile target thấp (es5 hoặc es2015), output JS vẫn có thể giữ nguyên `??`, dẫn đến Node không hiểu.

### 0.5.2. Cách khắc phục

1. **Kiểm tra Node version:**
   ```bash
   node -v
   ```
   Nếu `< 14` thì nâng cấp Node:
   ```bash
   sudo npm install -g n
   sudo n stable
   ```
   Rồi restart terminal.

2. **Chỉnh `tsconfig.json`:**
   Đảm bảo `target` ít nhất là `es2020` (hoặc cao hơn).
   ```json
   {
     "compilerOptions": {
       "target": "es2020",
       "module": "commonjs",
       "outDir": "./dist",
       "rootDir": "./src",
       "strict": true
     }
   }
   ```
   Rồi compile lại:
   ```bash
   npx tsc
   ```

3. **Nếu vẫn cần support Node cũ:**
   Dùng Babel hoặc TypeScript compiler để downlevel `??` thành code tương thích.
   Ví dụ với TypeScript, nếu `target: "es2019"`, TS sẽ transform:
   ```typescript
   let i = startIndex ?? array.length - 1;
   ```
   → thành:
   ```javascript
   let i = (startIndex !== null && startIndex !== undefined)
     ? startIndex
     : array.length - 1;
   ```

## 0.6. Tìm hiểu các option trong `tsconfig.json`

File `tsconfig.json` cực kỳ quan trọng vì nó điều khiển cách TypeScript biên dịch, kiểm tra type và tạo output.

```json
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // ============================
    // File Layout
    // ============================
    "rootDir": "./src",       // Thư mục chứa code nguồn TypeScript
    "outDir": "./dist",       // Thư mục xuất file JavaScript sau khi build

    // ============================
    // Environment Settings
    // ============================
    "module": "nodenext",     // Dùng import/export theo chuẩn Node.js ESM
    "target": "esnext",       // Compile ra JS hiện đại (ES2022+)
    "types": [],              // Nếu muốn load type tự động (VD: ["node"])
    // For nodejs environment:
    // "lib": ["esnext"],      // Bao gồm API mới nhất của JS
    // "types": ["node"],      // Bật type cho Node.js (fs, path, …)
    // => nhớ cài: npm install -D @types/node

    // ============================
    // Other Outputs
    // ============================
    "sourceMap": true,        // Xuất file .map để debug TS trong VSCode/Chrome
    "declaration": true,      // Xuất file .d.ts (type definitions)
    "declarationMap": true,   // Map .d.ts về source → debug type dễ hơn

    // ============================
    // Stricter Typechecking Options
    // ============================
    "noUncheckedIndexedAccess": true,   // arr[i] → có thể undefined
    "exactOptionalPropertyTypes": true, // Phân biệt optional với | undefined

    // ============================
    // Style / Code Quality Options
    // ============================
    "noImplicitReturns": true,           // Mọi nhánh hàm phải return rõ ràng
    "noImplicitOverride": true,          // Override method phải có từ khóa override
    "noUnusedLocals": true,              // Báo lỗi biến khai báo mà không dùng
    "noUnusedParameters": true,          // Báo lỗi tham số hàm không dùng
    "noFallthroughCasesInSwitch": true,  // Ngăn switch-case rơi xuống nhánh dưới
    "noPropertyAccessFromIndexSignature": true, // Bắt buộc dùng obj["prop"] thay vì obj.prop nếu chỉ có index signature

    // ============================
    // Recommended Options
    // ============================
    "strict": true,                      // Bật toàn bộ strict type-checking
    "jsx": "react-jsx",                  // Cho phép JSX (React 17+)
    "verbatimModuleSyntax": true,        // Giữ nguyên import/export (không TS auto chỉnh)
    "isolatedModules": true,             // Mỗi file compile riêng → hỗ trợ Babel/ESBuild
    "noUncheckedSideEffectImports": true,// Cảnh báo import chỉ để side-effect
    "moduleDetection": "force",          // Bắt buộc xác định module (có import/export)
    "skipLibCheck": true                 // Bỏ qua check type trong .d.ts (build nhanh hơn)
  }
}
```

## 0.7. Pipeline quy trình TypeScript + Node.js

```
┌───────────────────────────┐
│   Viết code TypeScript    │
│   (src/index.ts)          │
└─────────────┬─────────────┘
              │ npx tsc
              ▼
┌───────────────────────────┐
│  Trình biên dịch tsc      │
│  (sử dụng tsconfig.json)  │
└─────────────┬─────────────┘
              │ sinh file .js + .d.ts
              ▼
┌───────────────────────────┐
│   Code JavaScript output  │
│   (dist/index.js)         │
└─────────────┬─────────────┘
              │ node dist/index.js
              ▼
┌───────────────────────────┐
│   Node.js Runtime chạy    │
│   (in ra kết quả console) │
└───────────────────────────┘
```

**Giải thích ngắn gọn:**
- `src/index.ts` → bạn viết code bằng TypeScript (có type check).
- `tsc` đọc `tsconfig.json` → biên dịch TS thành `dist/index.js`.
- Node.js chỉ chạy được `.js` → nên phải chạy file trong `dist/`.
- Nếu bật `declaration: true` trong `tsconfig.json` → `tsc` còn tạo thêm file `.d.ts` (chứa type cho thư viện).

## 0.8. TypeScript Compiler (tsc)

`tsc` là trình biên dịch TypeScript.

### 0.8.1. Cài đặt `tsc`

```bash
npm install -g typescript
```
Hoặc dùng `npx` nếu cài local.

### 0.8.2. Hello World (không lỗi type)

**`hello.ts`:**
```typescript
// Greets the world.
console.log("Hello world!");
```

Chạy lệnh:
```bash
tsc hello.ts
```
Kết quả:
- Không báo lỗi (vì code hợp lệ).
- Sinh ra file `hello.js` với nội dung giống hệt:
  ```javascript
  // Greets the world.
  console.log("Hello world!");
  ```
TypeScript biên dịch về JavaScript thuần, để Node.js hoặc browser chạy được.

### 0.8.3. Hello World (có lỗi type)

**`hello.ts`:**
```typescript
// This is an industrial-grade general-purpose greeter function:
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}

greet("Brendan");
```

Chạy:
```bash
tsc hello.ts
```
Kết quả:
```
Expected 2 arguments, but got 1.
```
TypeScript phát hiện lỗi ngay lúc compile, chứ không phải chờ runtime mới phát hiện.

### 0.8.4. Fix bằng cách thêm type

**`hello.ts`:**
```typescript
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Brendan", new Date());
```

Chạy `tsc hello.ts` → không lỗi, file `hello.js` sinh ra:
```javascript
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet("Brendan", new Date());
```

### 0.8.5. Tại sao không in ra log?

Khi chạy `tsc greet.ts`, TypeScript sẽ biên dịch sang `greet.js`. File `.js` này hoàn toàn hợp lệ và sẽ in log khi chạy bằng Node.js.

**Nguyên nhân thường gặp khiến không thấy log:**
- **Compile nhưng không chạy file `.js`:** `tsc greet.ts` chỉ sinh ra `greet.js`. Muốn in ra log phải chạy: `node greet.js`.
- **Chạy nhầm file `.ts` trực tiếp bằng Node:** Nếu gõ `node greet.ts` → Node không hiểu TypeScript → sẽ lỗi hoặc không chạy đúng. Để chạy `.ts` trực tiếp thì phải dùng `ts-node` (cài thêm): `npx ts-node greet.ts`.
- **File không được gọi đúng:** Ví dụ: bạn chạy `node dist/greet.js` trong khi file lại nằm ở `./greet.js`. Kiểm tra lại đường dẫn.

**Cách chạy đúng:**
1. **Compile rồi chạy JS:**
   ```bash
   tsc greet.ts
   node greet.js
   ```
2. **Dùng `ts-node` (chạy trực tiếp TS, không cần compile thủ công):**
   ```bash
   npm install -g ts-node typescript
   ts-node greet.ts
   ```

## 0.9. Emitting with Errors

TypeScript sẽ vẫn emit (xuất ra) file `.js` ngay cả khi code `.ts` bị lỗi type.

### 0.9.1. Vì sao lại như vậy?

- Khi migrate dự án JavaScript → TypeScript, có thể sẽ còn rất nhiều lỗi type.
- Nhưng code JS gốc vẫn chạy bình thường.
- Nếu TS mà cứng nhắc không xuất `.js`, thì dev sẽ bị “kẹt cứng”, không thể vừa chạy vừa refactor code.
- Thế nên mặc định, TS báo lỗi type nhưng vẫn biên dịch ra JS.

### 0.9.2. Ngăn không cho emit khi có lỗi

Nếu muốn “nghiêm khắc” hơn → bật `--noEmitOnError`.
```bash
tsc --noEmitOnError hello.ts
```
Kết quả: Có lỗi → KHÔNG sinh/không update file `hello.js`.
Đây là cách dùng trong CI/CD (build pipeline), để đảm bảo không bao giờ phát hành code sai type.

### 0.9.3. Cấu hình trong `tsconfig.json`

Không cần gõ flag mỗi lần, bạn có thể thêm trực tiếp:
```json
{
  "compilerOptions": {
    "noEmitOnError": true
  }
}
```

## 0.10. Explicit Types

Explicit types (chỉ định type rõ ràng) và type inference (TS tự suy luận) trong TypeScript.

### 0.10.1. Explicit types (chỉ định type rõ ràng)

**Ví dụ:**
```typescript
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```
- `person: string` → chỉ nhận chuỗi.
- `date: Date` → chỉ nhận đối tượng `Date`.

Giúp compiler phát hiện lỗi ngay khi ta gọi sai:
```typescript
greet("Maddison", Date());
// ❌ Lỗi: "string" không phải "Date"
```
Vì `Date()` (không có `new`) trả về string, còn `new Date()` trả về object `Date`.

**Sửa lỗi đúng cách:**
```typescript
greet("Maddison", new Date()); // ✅ đúng
```

### 0.10.2. Type inference (TS tự suy luận)

Không phải lúc nào cũng cần viết type.
```typescript
let msg = "hello there!";
// TS tự hiểu msg: string
```
Nếu viết lại:
```typescript
let msg: string = "hello there!";
```
Cũng đúng, nhưng thừa vì TS đã infer được.

### 0.10.3. Khi nào nên dùng explicit type?

- Nên dùng khi function/method public (giúp người khác đọc hiểu nhanh).
- Nên dùng khi biến khởi tạo rỗng (`let result;`) → TS không đoán được type.
- Không cần dùng khi biến được khởi tạo ngay (`let msg = "abc";`).

## 0.11. Erased Types

Type annotations không phải là một phần của JavaScript. TypeScript cần một trình biên dịch để loại bỏ hoặc chuyển đổi bất kỳ code TypeScript cụ thể nào để bạn có thể chạy nó. Hầu hết code TypeScript cụ thể sẽ bị xóa đi, và tương tự, các type annotations cũng bị xóa hoàn toàn.

**Ví dụ:**
Code TypeScript:
```typescript
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```
Sau khi compile (`tsc greet.ts`), ta nhận được JavaScript:
```javascript
"use strict";
function greet(person, date) {
    console.log("Hello " + person + ", today is " + date.toDateString() + "!");
}
greet("Maddison", new Date());
```
**So sánh:**
- Type annotations (`: string`, `: Date`) → biến mất.
- Template string (`` `Hello ${person}` ``) → chuyển thành string concatenation (`"Hello " + person`).
- Hành vi runtime không thay đổi, chỉ còn JavaScript thuần.

**Ý nghĩa của Erased Types:**
- Type annotations chỉ tồn tại khi compile.
- Khi chạy trên Node.js hay Browser → chỉ có JavaScript, không còn thông tin type.
- Vì vậy, type không ảnh hưởng đến runtime.
- Nghĩa là: Nếu sai type → TypeScript báo lỗi lúc compile. Nhưng khi chạy JS (đã build ra) → runtime vẫn cố chạy.

**Minh họa bug thường gặp:**
```typescript
function square(num: number) {
  return num * num;
}

square("10" as any); // ép kiểu bằng any, compile pass
```
Sau khi compile:
```javascript
function square(num) {
  return num * num;
}
square("10"); // runtime bug: "1010"
```
Vì type bị xóa → runtime không còn bảo vệ.

**Nếu type bị xóa hết, tại sao TypeScript vẫn hữu ích?**
- TypeScript bắt lỗi sớm ở compile-time. Nghĩa là trước khi chạy code thật, mình đã phát hiện ra bug tiềm ẩn (ví dụ thiếu tham số, nhầm kiểu, nhầm return…). Đây chính là giá trị lớn nhất của TS, dù khi chạy runtime thì type đã bị xóa.

**Trong trường hợp nào type inference cũng bị xóa?**
- Trong mọi trường hợp. Type inference (TS tự đoán kiểu) chỉ tồn tại trong lúc compile.

**Có cách nào giữ type lại ở runtime không?**
- Với TypeScript thuần thì không. Nhưng nếu muốn giữ “kiểm tra type” ở runtime, ta phải dùng thêm thư viện hoặc tự code validation (ví dụ: Zod, class-validator).

## 0.12. Downleveling

Downleveling là quá trình chuyển code từ phiên bản ECMAScript mới → phiên bản cũ hơn.

**Ví dụ:** template string (ES2015 feature) bị biên dịch về string concatenation (ES5-compatible).
```typescript
// TypeScript (ES2015+)
`Hello ${person}, today is ${date.toDateString()}!`;

// Output khi target = ES5
"Hello ".concat(person, ", today is ").concat(date.toDateString(), "!");
```

**Vì sao mặc định lại là ES5?**
- Vì TypeScript muốn đảm bảo code chạy trên hầu hết các môi trường (kể cả trình duyệt cũ).
- Nhưng ES5 giờ đã quá cũ, hầu hết trình duyệt hiện đại đều hỗ trợ ES2015 trở lên.

**Cách chỉnh target:**
Trong `tsconfig.json`, ta có thể set:
```json
{
  "compilerOptions": {
    "target": "es2015" // hoặc es2016, es2020, esnext...
  }
}
```
Hoặc khi compile:
```bash
tsc --target es2015 hello.ts
```

**Khi nào nên chọn target thấp (ES5)?**
- Khi phải support trình duyệt cũ (ví dụ IE11).
- Hoặc một số embedded system / legacy JS runtime.

**Khi nào nên chọn target cao (ES2015+)?**
- Khi code chạy Node.js hiện đại (Node 14+ đã hỗ trợ ES2020).
- Khi build web app chỉ hướng tới Chrome/Firefox/Safari/Edge mới.

## 0.13. Strictness

Strictness trong TypeScript là tập hợp các flag trong `tsconfig.json` để điều chỉnh mức độ nghiêm ngặt của type-checker. TypeScript mặc định khá thoải mái, nhưng với project mới, thường nên bật strict mode để hạn chế bug tiềm ẩn.

### 0.13.1. Bảng tổng hợp Strict Mode trong TypeScript

| Flag | Ý nghĩa | Ví dụ khi bật | Ghi chú |
|---|---|---|---|
| `strict` | Bật tất cả strict flags bên dưới | - | Shortcut: chỉ cần `"strict": true` thay cho việc bật từng flag |
| `noImplicitAny` | Không cho biến/parameter ngầm định là `any` | `function greet(person) { }` // ❌ lỗi | Giúp tránh quên khai báo type |
| `strictNullChecks` | Không cho gán `null`/`undefined` nếu type không cho phép | `let x: string = null;` // ❌ | Tránh bug null pointer |
| `strictFunctionTypes` | Kiểm tra chặt chẽ type của function parameter/return | Hàm callback sai type sẽ ❌ | Bảo vệ khi dùng callback, generic |
| `strictBindCallApply` | Kiểm tra chặt chẽ khi dùng `.bind()`, `.call()`, `.apply()` | `let f = (a: number) => a; f.call(null, "hi");` // ❌ | Ngăn truyền sai đối số |
| `alwaysStrict` | Emit `"use strict";` trong JS output + parse TS code ở strict mode | Code JS sinh ra luôn `"use strict";` | Bảo đảm code chạy strict mode JS |
| `strictPropertyInitialization` | Bắt buộc class property phải được khởi tạo | `class C { name: string; }` // ❌ lỗi | Có thể dùng `!` (definite assignment) để bypass |
| `noImplicitThis` | Cấm dùng `this` không rõ type | `function f() { this.x = 10; }` // ❌ | Hữu ích khi viết OOP hoặc callback |
| `useUnknownInCatchVariables` (TS 4.4+) | Biến trong `catch` mặc định là `unknown` thay vì `any` | `try {} catch(e) { e.message; // ❌ }` | Bắt dev check type `instanceof Error` trước |

### 0.13.2. Strict Mode Use Cases trong dự án thực tế

| Flag | Use case trong dự án | Ví dụ code |
|---|---|---|
| `noImplicitAny` | 🚫 Tránh bug khi quên định nghĩa type trong API hoặc logic phức tạp | `function getUser(id) { return fetch(`/api/users/${id}`); }` // ❌ TS: id là any. Nếu code backend mà id là object thì bug cực nặng. |
| `strictNullChecks` | ✅ Bảo vệ khi xử lý dữ liệu có thể null/undefined (API, DB query) | `interface User { name: string; email?: string } let u: User = { name: "Alice" }; console.log(u.email.length);` // ❌ lỗi. → Tránh crash khi email chưa có |
| `strictFunctionTypes` | ✅ Kiểm tra chặt chẽ callback trong event handler hoặc Redux | `type Fn = (x: number) => void; let f: Fn = (x: string) => {};` // ❌. → Ngăn truyền callback sai type |
| `strictBindCallApply` | ✅ Khi dùng lib như Lodash, hoặc function util | `function greet(name: string) { return "Hi " + name } greet.call(null, 123);` // ❌. → Nếu không strict → runtime bug |
| `alwaysStrict` | ✅ Bắt buộc JS chạy trong strict mode → tránh lỗi ngầm (vd: biến global vô tình tạo) | `x = 10;` // ❌ ReferenceError trong strict mode |
| `strictPropertyInitialization` | ✅ Dùng trong OOP, class service/model | `class User { name: string; } let u = new User(); console.log(u.name.length);` // ❌ name chưa init. → Tránh undefined property |
| `noImplicitThis` | ✅ Hữu ích trong frontend (React event handler) | `function onClick() { this.setState({}); }` // ❌ this là any. → Ngăn bug khi this bị undefined |
| `useUnknownInCatchVariables` | ✅ Xử lý error API call đúng cách | `try { await fetch("/api") } catch (e) { console.log(e.message);` // ❌ e: unknown. → Buộc dev check type `instanceof Error` trước |

**Kinh nghiệm áp dụng trong dự án:**
- **Backend (Node.js + Express / NestJS):** Luôn bật `strictNullChecks` để tránh crash khi DB trả về null. Bật `noImplicitAny` để đảm bảo API input/output rõ ràng. Dùng thêm lib runtime validation (Zod, Joi) để kết hợp.
- **Frontend (React/Next.js):** Bật `noImplicitThis` để tránh lỗi `this` trong event handler. `strictPropertyInitialization` giúp React component state/init chuẩn hơn. `strictFunctionTypes` tránh callback props bị sai type.
- **Fullstack app (tách shared models trong monorepo):** Bật full `"strict": true` → đảm bảo model (User, Order, Product) đồng nhất cả client + server. Nếu không strict, dữ liệu bị `null | undefined` truyền sang dễ gây crash frontend.

### 0.13.3. `noImplicitAny` và `strictNullChecks`

**1. `noImplicitAny`**
- **Ý nghĩa:** Nếu TS không đoán được type, nó sẽ gán mặc định là `any`. Flag này sẽ chặn điều đó → bắt buộc dev phải chỉ định type hoặc viết code rõ ràng hơn.
- **Ví dụ:**
  ```typescript
  function greet(person) { // ❌ báo lỗi: Parameter 'person' implicitly has an 'any' type.
    console.log("Hello " + person);
  }
  ```
  Fix:
  ```typescript
  function greet(person: string) {
    console.log("Hello " + person);
  }
  ```
- **Use case thực tế:** Backend API: Nếu quên type cho `req.body` → mọi property đều là `any` → dễ bị bug khi client gửi dữ liệu sai. Frontend form: Người dùng nhập số nhưng mình lại xử lý như string → crash UI.

**2. `strictNullChecks`**
- **Ý nghĩa:** Mặc định TS cho phép gán `null` hoặc `undefined` cho bất kỳ type nào. Khi bật flag này, muốn dùng `null`/`undefined` thì phải khai báo rõ ràng.
- **Ví dụ:**
  ```typescript
  let name: string = null; // ❌ lỗi khi bật strictNullChecks
  ```
  Fix:
  ```typescript
  let name: string | null = null;
  if (name !== null) {
    console.log(name.toUpperCase());
  }
  ```
- **Use case thực tế:** DB Query: Có thể trả về `null` nếu không tìm thấy user. Nếu không bật flag này → dễ crash khi gọi `user.name`. Optional props trong React: Nếu component nhận prop có thể `undefined`, mà mình không check trước khi dùng → UI hỏng.

## 0.14. Câu hỏi phỏng vấn về `noImplicitAny` và `strictNullChecks`

### A. Khái niệm cơ bản

1.  **Trong TypeScript, `any` nghĩa là gì?**
    → Khi một biến có type `any`, ta có thể gán giá trị bất kỳ và gọi thuộc tính/hàm mà không có kiểm tra type.
2.  **Tại sao `any` được coi là “escape hatch” trong TypeScript?**
    → Vì nó vô hiệu hóa hoàn toàn type-checking, khiến code gần như quay lại JavaScript thuần.
3.  **Flag `noImplicitAny` hoạt động như thế nào?**
    → Nó sẽ báo lỗi khi TS không thể suy luận type và fallback sang `any`.
4.  **Cho ví dụ code bị lỗi khi bật `noImplicitAny`.**
    ```typescript
    function processData(data) { // Lỗi: Parameter 'data' implicitly has an 'any' type.
      return data.value * 2;
    }
    ```

### B. Thực tế dự án

1.  **Trong dự án backend, tại sao `noImplicitAny` quan trọng khi xử lý `req.body` trong Express?**
    → Vì nếu không định nghĩa type, `req.body` là `any` → dễ gây bug runtime khi dùng sai property (ví dụ: `req.body.userId` thay vì `req.body.user_id`).
2.  **Trong frontend React, một tình huống nào có thể dẫn đến implicit `any`?**
    → Ví dụ khi viết callback event mà không khai báo type cho tham số sự kiện:
    ```typescript
    const handleChange = (e) => setValue(e.target.value); // e là any
    ```
    Fix:
    ```typescript
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
    ```

### C. Về `strictNullChecks`

1.  **Nếu `strictNullChecks` bị tắt, điều gì xảy ra khi gán `null` cho một biến type `string`?**
    → Code sẽ compile bình thường, nhưng có thể gây runtime error nếu biến đó được sử dụng mà không kiểm tra `null` (ví dụ: gọi `.toUpperCase()` trên `null`).
2.  **Tại sao `null` và `undefined` được gọi là “the billion dollar mistake”?**
    → Vì bug do quên xử lý `null`/`undefined` đã gây thiệt hại khổng lồ trong lịch sử phần mềm, dẫn đến các lỗi không mong muốn và crash ứng dụng.
3.  **Cho ví dụ bug thực tế nếu `strictNullChecks` tắt trong query database.**
    → Giả sử một hàm lấy user từ DB có thể trả về `User` hoặc `null`:
    ```typescript
    function findUserById(id: string): User | null { /* ... */ }
    const user = findUserById("123"); // user có thể là null
    console.log(user.name); // Nếu strictNullChecks tắt, compile pass nhưng runtime crash nếu user là null
    ```
4.  **Làm thế nào để khai báo một biến có thể là `string` hoặc `null` khi bật `strictNullChecks`?**
    → Dùng union type: `let name: string | null = null;`

### D. Nâng cao

1.  **So sánh `any` và `unknown`.**
    → `any`: dùng thoải mái, không check type. Nó là một "cửa thoát hiểm" khỏi hệ thống kiểu của TypeScript.
    → `unknown`: an toàn hơn, cần check type trước khi sử dụng. Bạn phải thu hẹp kiểu của `unknown` trước khi thực hiện bất kỳ thao tác nào trên nó.
    ```typescript
    let val: unknown = "hello";
    let s1: string = val; // ❌ Lỗi
    if (typeof val === "string") {
      let s2: string = val; // ✅ OK
    }
    ```
2.  **Tại sao `strictNullChecks` thường đi kèm với `noImplicitAny` khi migrate từ JS sang TS?**
    → Vì hai flag này giải quyết phần lớn bug runtime phổ biến nhất: `noImplicitAny` giải quyết các vấn đề về kiểu dữ liệu không rõ ràng, còn `strictNullChecks` giải quyết các vấn đề liên quan đến `null`/`undefined`. Bật cả hai giúp tăng cường độ an toàn và độ tin cậy của code.
3.  **Nếu bạn phải làm việc với codebase cũ đầy implicit `any`, bạn sẽ xử lý như thế nào?**
    → Bật `noImplicitAny` dần dần (file-by-file hoặc module-by-module), thêm type alias hoặc `unknown` thay vì `any` cho các biến/tham số không rõ ràng. Sử dụng các công cụ refactoring của IDE để thêm type annotations.
4.  **Có nên bật `strict` mode ngay từ đầu trong dự án mới không? Tại sao?**
    → Có, vì nó giúp code rõ ràng, an toàn hơn, phát hiện bug sớm và cung cấp trải nghiệm tooling tốt hơn. Mặc dù có thể tốn thêm công sức ban đầu để khai báo type, nhưng về lâu dài sẽ tiết kiệm thời gian debug và bảo trì.
