# 1. DOM Manipulation với TypeScript

## 1.1. Giới thiệu về DOM và TypeScript

### DOM (Document Object Model)
DOM là một giao diện lập trình (API) được các trình duyệt triển khai để biến các trang web tĩnh (HTML/XML) thành các trang web động và tương tác. DOM biểu diễn cấu trúc của tài liệu dưới dạng một cây đối tượng, cho phép JavaScript thay đổi cấu trúc, kiểu dáng và nội dung của tài liệu.

### TypeScript và Type Definitions
TypeScript, là một siêu tập hợp có kiểu của JavaScript, cung cấp các định nghĩa kiểu (type definitions) cho DOM API. Các định nghĩa này có sẵn trong mọi dự án TypeScript mặc định. Trong số hàng ngàn dòng định nghĩa trong `lib.dom.d.ts`, `HTMLElement` là một trong những kiểu quan trọng nhất, đóng vai trò là xương sống cho việc thao tác DOM với TypeScript. `HTMLElement` là giao diện cơ sở cho mọi phần tử HTML.

## 1.2. Ví dụ cơ bản: Thêm phần tử vào DOM

Hãy xem xét một ví dụ đơn giản về cách thêm một phần tử `<p>Hello, World!</p>` vào một phần tử `div` có `id="app"`.

### HTML mẫu
```html
<!DOCTYPE html>
<html lang="en">
  <head><title>TypeScript Dom Manipulation</title></head>
  <body>
    <div id="app"></div>
    <!-- Assume index.js is the compiled output of index.ts -->
    <script src="index.js"></script>
  </body>
</html>
```

### Code TypeScript
```typescript
// 1. Chọn phần tử div bằng thuộc tính id
const app = document.getElementById("app");

// 2. Tạo một phần tử <p></p> mới theo chương trình
const p = document.createElement("p");

// 3. Thêm nội dung văn bản
p.textContent = "Hello, World!";

// 4. Nối phần tử p vào phần tử div
app?.appendChild(p);
```

### Kết quả HTML
Sau khi biên dịch và chạy trang `index.html`, HTML kết quả sẽ là:
```html
<div id="app">
  <p>Hello, World!</p>
</div>
```

**Giải thích:**
*   `document.getElementById()` trả về `HTMLElement | null`. Do đó, chúng ta sử dụng toán tử optional chaining (`?.`) để đảm bảo an toàn nếu phần tử không tồn tại.
*   `document.createElement("p")` trả về `HTMLParagraphElement`, được TypeScript tự động suy luận từ `HTMLElementTagNameMap`.

## 1.3. Giao diện `Document`

Dòng đầu tiên của mã TypeScript sử dụng biến toàn cục `document`. Biến này được định nghĩa bởi giao diện `Document` từ tệp `lib.dom.d.ts`. Đoạn mã chứa các lệnh gọi đến hai phương thức: `getElementById` và `createElement`.

### `Document.getElementById`
Định nghĩa cho phương thức này như sau:
```typescript
getElementById(elementId: string): HTMLElement | null;
```
*   Truyền vào một chuỗi `elementId`, nó sẽ trả về `HTMLElement` hoặc `null`.
*   Phương thức này giới thiệu một trong những kiểu quan trọng nhất, `HTMLElement`, đóng vai trò là giao diện cơ sở cho mọi giao diện phần tử khác. Ví dụ, biến `p` trong ví dụ mã có kiểu `HTMLParagraphElement`.
*   Lưu ý rằng phương thức này có thể trả về `null`. Điều này là do phương thức không thể chắc chắn trước khi chạy liệu nó có thể tìm thấy phần tử được chỉ định hay không. Trong dòng cuối cùng của đoạn mã, toán tử optional chaining (`?.`) được được sử dụng để gọi `appendChild`.

### `Document.createElement`
Định nghĩa cho phương thức này (đã bỏ qua định nghĩa không dùng nữa):
```typescript
createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K];
createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
```
Đây là một định nghĩa hàm quá tải (overloaded function definition).

*   **Quá tải thứ hai:** Đơn giản nhất và hoạt động tương tự như phương thức `getElementById`. Truyền vào bất kỳ chuỗi nào và nó sẽ trả về một `HTMLElement` tiêu chuẩn. Định nghĩa này cho phép các nhà phát triển tạo các thẻ HTML phần tử duy nhất. Ví dụ: `document.createElement('xyz')` trả về một phần tử `<xyz></xyz>`, rõ ràng không phải là một phần tử được chỉ định bởi đặc tả HTML.

*   **Quá tải thứ nhất:** Sử dụng một số mẫu generic nâng cao. Nó được hiểu rõ nhất khi chia nhỏ thành các phần, bắt đầu với biểu thức generic: `<K extends keyof HTMLElementTagNameMap>`. Biểu thức này định nghĩa một tham số generic `K` bị ràng buộc với các khóa của giao diện `HTMLElementTagNameMap`. Giao diện map này chứa mọi tên thẻ HTML được chỉ định và giao diện kiểu tương ứng của nó. Ví dụ, đây là 5 giá trị được ánh xạ đầu tiên:
    ```typescript
    interface HTMLElementTagNameMap {
        "a": HTMLAnchorElement;
        "abbr": HTMLElement;
        "address": HTMLElement;
        "applet": HTMLAppletElement;
        "area": HTMLAreaElement;
        // ...
    }
    ```
    Một số phần tử không thể hiện các thuộc tính duy nhất và do đó chúng chỉ trả về `HTMLElement`, nhưng các kiểu khác có các thuộc tính và phương thức duy nhất nên chúng trả về giao diện cụ thể của chúng (sẽ mở rộng hoặc triển khai `HTMLElement`).

    Phần còn lại của định nghĩa `createElement`: `(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K]`. Đối số đầu tiên `tagName` được định nghĩa là tham số generic `K`. Trình thông dịch TypeScript đủ thông minh để suy luận tham số generic từ đối số này. Điều này có nghĩa là nhà phát triển không phải chỉ định tham số generic khi sử dụng phương thức; bất kỳ giá trị nào được truyền cho đối số `tagName` sẽ được suy luận là `K` và do đó có thể được sử dụng trong phần còn lại của định nghĩa. Đây chính xác là những gì xảy ra; giá trị trả về `HTMLElementTagNameMap[K]` lấy đối số `tagName` và sử dụng nó để trả về kiểu tương ứng. Định nghĩa này là cách biến `p` từ đoạn mã có kiểu `HTMLParagraphElement`. Và nếu mã là `document.createElement('a')`, thì nó sẽ là một phần tử có kiểu `HTMLAnchorElement`.

## 1.4. Giao diện `Node`, `Element`, `HTMLElement`

### Thứ bậc kế thừa
Trong DOM API, có một thứ bậc kế thừa quan trọng:
*   `Node`: Giao diện cơ sở cho mọi nút trong DOM (element, text, comment, document, v.v.). Nó cung cấp các thuộc tính và phương thức chung cho tất cả các loại nút.
*   `Element`: Mở rộng `Node`, đại diện cho một phần tử HTML hoặc XML. Nó cung cấp các thuộc tính và phương thức dành riêng cho các phần tử, như `attributes`, `tagName`, `classList`, `id`, v.v.
*   `HTMLElement`: Mở rộng `Element`, đại diện cho các phần tử HTML cụ thể như `<div>`, `<p>`, `<a>`, `<span>`, v.v. Nó cung cấp các thuộc tính và phương thức dành riêng cho các phần tử HTML, ví dụ `innerHTML`, `textContent`, `style`.

Ví dụ:
```typescript
const div = document.createElement("div"); // HTMLElement
console.log(div instanceof HTMLElement); // true
console.log(div instanceof Element);     // true
console.log(div instanceof Node);        // true
```

### `Node.appendChild`
Phương thức `appendChild` được định nghĩa trên giao diện `Node`.
```typescript
appendChild<T extends Node>(newChild: T): T;
```
*   Phương thức này hoạt động tương tự như phương thức `createElement` ở chỗ tham số generic `T` được suy luận từ đối số `newChild`.
*   `T` bị ràng buộc với một giao diện cơ sở khác là `Node`.
*   Vì `p` là `HTMLParagraphElement` (kế thừa từ `HTMLElement` → `Element` → `Node`), TypeScript hiểu được kiểu trả về là `HTMLParagraphElement`.
*   `appendChild` có thể thêm bất kỳ loại `Node` nào, không chỉ các `HTMLElement`.

## 1.5. Sự khác biệt giữa `children` và `childNodes`

Trong DOM API, có khái niệm về các phần tử con. Ví dụ, trong HTML sau, các thẻ `<p>` là con của phần tử `div`.

### HTML ví dụ 1 (chỉ có element)
```html
<div>
  <p>Hello, World</p>
  <p>TypeScript!</p>
</div>
```
```typescript
const div = document.getElementsByTagName("div")[0];
console.log(div.children);   // HTMLCollection(2) [p, p]
console.log(div.childNodes); // NodeList(2) [p, p]
```
*   `div.children`: sẽ trả về một `HTMLCollection` chứa các `HTMLParagraphElement`.
*   `div.childNodes`: sẽ trả về một `NodeList` tương tự chứa các nút.
Trong trường hợp này, vì tất cả các nút con đều là `HTMLElement`, cả hai thuộc tính đều trả về kết quả giống nhau.

### HTML ví dụ 2 (có text node)
Hãy sửa đổi HTML bằng cách loại bỏ một trong các thẻ `<p>`, nhưng giữ lại văn bản.
```html
<div>
  <p>Hello, World</p>
  TypeScript!
</div>
```
```typescript
const div = document.getElementsByTagName("div")[0];
console.log(div.children);   // HTMLCollection(1) [p]
console.log(div.childNodes); // NodeList(2) [p, text]
```
*   `div.children`: bây giờ chỉ chứa phần tử `<p>Hello, World</p>` (vì nó là một `HTMLElement`).
*   `div.childNodes`: chứa một `NodeList` bao gồm `<p>` và một `text node` (chứa văn bản "TypeScript!").
Phần văn bản "TypeScript!" được coi là một `Node` kiểu `TEXT_NODE`, không phải là một `HTMLElement`, do đó nó chỉ xuất hiện trong `childNodes`.

### Bảng tóm tắt
| Thuộc tính | Loại dữ liệu     | Chứa gì?                               | Thường dùng khi…             |
| :--------- | :--------------- | :------------------------------------- | :--------------------------- |
| `children` | `HTMLCollection` | Chỉ các `HTMLElement` con              | Duyệt qua các phần tử HTML   |
| `childNodes` | `NodeList`       | Tất cả `Node` con (element, text, comment…) | Phân tích nội dung DOM đầy đủ |

### Ví dụ TypeScript thao tác với text node
```typescript
const div = document.getElementsByTagName("div")[0];
div.childNodes.forEach(node => {
  if (node.nodeType === Node.TEXT_NODE) {
    console.log("Text node:", node.nodeValue);
  }
});
```
*   `node.nodeType === Node.TEXT_NODE` kiểm tra xem nút có phải là nút văn bản hay không (giá trị `nodeType` là `3`).
*   `node.nodeValue` truy cập nội dung văn bản của nút.

## 1.6. Câu hỏi tư duy

*   Tại sao TypeScript trả về `HTMLElement | null` cho `getElementById` thay vì chỉ `HTMLElement`?
*   Nếu tạo một tag không chuẩn như `<xyz>` bằng `createElement("xyz")`, TypeScript có cảnh báo không? Tại sao?
*   Khi nào nên dùng optional chaining (`?.`) và khi nào nên dùng kiểm tra null thủ công?
*   Khi nào nên dùng `children` và khi nào nên dùng `childNodes`?
*   Nếu muốn duyệt tất cả `Node` con, kể cả text node, phương thức nào nên dùng?
*   Nếu muốn thao tác chỉ trên các element HTML, phương thức nào nhanh hơn và an toàn hơn?

## 1.7. Usecase thực tế

*   **Thêm thông báo động (notification):** Hiển thị các thông báo trên trang khi người dùng thực hiện một hành động (ví dụ: click nút, gửi form).
*   **Tạo danh sách items từ dữ liệu JSON:** Xây dựng danh sách động từ dữ liệu được tải về từ API mà không cần tải lại trang.
*   **Xây dựng modal, tooltip, hoặc bất kỳ component động nào:** Tạo và quản lý các thành phần giao diện người dùng phức tạp bằng cách thao tác DOM.

### Ví dụ: Tạo một button và click để thêm item vào danh sách
```typescript
const app = document.getElementById("app"); // Giả sử có div#app trong HTML

const button = document.createElement("button");
button.textContent = "Add Item";
app?.appendChild(button);

const ul = document.createElement("ul");
app?.appendChild(ul);

button.addEventListener("click", () => {
  const li = document.createElement("li");
  li.textContent = "New Item";
  ul.appendChild(li);
});
```

### Ví dụ: Highlight tất cả `<p>` trong một `div`
```typescript
const div = document.getElementById("content"); // Giả sử có div#content trong HTML
Array.from(div?.children ?? []).forEach((el) => {
  (el as HTMLElement).style.backgroundColor = "yellow";
});
```

## 1.8. Bug thường gặp

*   **`Cannot read property 'appendChild' of null`:** Xảy ra khi `getElementById` trả về `null` và bạn cố gắng gọi một phương thức trên nó.
    *   **Giải pháp:** Kiểm tra null (`if (app) { ... }`) hoặc sử dụng optional chaining (`app?.appendChild(p)`).
*   **Lỗi type khi thao tác HTML cụ thể (ví dụ `HTMLInputElement`) mà TypeScript suy ra là `HTMLElement`:**
    *   **Giải pháp:** Ép kiểu (type assertion) rõ ràng:
        ```typescript
        const input = document.getElementById("myInput") as HTMLInputElement;
        console.log(input.value);
        ```
*   **Ghi đè nội dung text không mong muốn khi dùng `innerHTML` thay vì `appendChild`:** `innerHTML` sẽ thay thế toàn bộ nội dung bên trong một phần tử, trong khi `appendChild` chỉ thêm một phần tử mới vào cuối.
*   **Nhầm lẫn giữa `children` và `childNodes`:** Dẫn đến việc bỏ qua các text node hoặc các loại node khác không phải `HTMLElement`.
*   **Truy cập `value` của `Node` text:** `Node` text không có thuộc tính `value`. Cần ép kiểu sang `Text` và sử dụng `nodeValue`.
    ```typescript
    const textNode = div.childNodes[1] as Text;
    console.log(textNode.nodeValue); // "TypeScript!"
    ```

## 1.9. Bài tập thực hành

### Bài tập 1 (DOM cơ bản)
*   **HTML:** Tạo một `div` với `id="container"`.
*   **TypeScript:**
    *   Tạo 5 phần tử `<p>` với nội dung là "Paragraph 1" … "Paragraph 5".
    *   Thêm tất cả các phần tử `<p>` này vào `div#container`.
    *   Khi click vào một phần tử `<p>`, nó sẽ đổi màu nền ngẫu nhiên.

### Bài tập 2 (Input & List)
*   **HTML:** Tạo một phần tử `<input type="text" id="itemInput">` và một `<button id="addItemBtn">Add Item</button>`, cùng với một `<ul id="itemList"></ul>`.
*   **TypeScript:**
    *   Khi người dùng nhập văn bản vào input và nhấn button, văn bản đó sẽ được thêm vào danh sách `ul` dưới dạng một `<li>` mới.
    *   **Chú ý:** Phải sử dụng type `HTMLInputElement` để lấy giá trị (`.value`) từ input.

### Bài tập 3 (Node types)
*   **HTML:**
    ```html
    <div id="container">
      <p>Paragraph 1</p>
      Some text
      <p>Paragraph 2</p>
    </div>
    ```
*   **TypeScript:**
    *   In ra tất cả `childNodes` của `div#container` và log loại node của mỗi node (sử dụng `Node.TEXT_NODE` hay `Node.ELEMENT_NODE`).
    *   Chỉ in ra các `children` của `div#container` và đổi màu nền của chúng thành xanh.

### Bài tập 4 (Wrap Text Nodes)
*   **TypeScript:** Viết một hàm `wrapTextNodes(element: HTMLElement)`:
    *   Hàm này sẽ duyệt qua tất cả `childNodes` của `element` được truyền vào.
    *   Nếu một node là text node, hãy bọc nó trong một thẻ `<span>` và đặt màu chữ thành đỏ.
    *   **Gợi ý:** Bạn sẽ cần tạo một `<span>` mới, di chuyển `text node` vào trong `<span>` đó, sau đó thay thế `text node` gốc bằng `<span>` mới.
