# TypeScript Classes

TypeScript offers full support for the `class` keyword introduced in ES2015.

As with other JavaScript language features, TypeScript adds type annotations and other syntax to allow you to express relationships between classes and other types.

## 1. Class Members

### 1.1. Fields
A field declaration creates a public writeable property on a class:

```typescript
class Point {
  x: number;
  y: number;
}

const pt = new Point();
pt.x = 0;
pt.y = 0;
```

As with other locations, the type annotation is optional, but will be an implicit `any` if not specified.

Fields can also have initializers; these will run automatically when the class is instantiated:

```typescript
class Point {
  x = 0;
  y = 0;
}

const pt = new Point();
// Prints 0, 0
console.log(`${pt.x}, ${pt.y}`);
```

Just like with `const`, `let`, and `var`, the initializer of a class property will be used to infer its type:

```typescript
const pt = new Point();
pt.x = "0"; // Type 'string' is not assignable to type 'number'.
```

#### 1.1.1. `--strictPropertyInitialization`
The `strictPropertyInitialization` setting controls whether class fields need to be initialized in the constructor.

```typescript
class BadGreeter {
  name: string; // Property 'name' has no initializer and is not definitely assigned in the constructor.
}
```

```typescript
class GoodGreeter {
  name: string;

  constructor() {
    this.name = "hello";
  }
}
```

Note that the field needs to be initialized in the constructor itself. TypeScript does not analyze methods you invoke from the constructor to detect initializations, because a derived class might override those methods and fail to initialize the members.

If you intend to definitely initialize a field through means other than the constructor (for example, maybe an external library is filling in part of your class for you), you can use the definite assignment assertion operator, `!`:

```typescript
class OKGreeter {
  // Not initialized, but no error
  name!: string;
}
```

#### 1.1.2. `readonly`
Fields may be prefixed with the `readonly` modifier. This prevents assignments to the field outside of the constructor.

```typescript
class Greeter {
  readonly name: string = "world";

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }

  err() {
    this.name = "not ok"; // Cannot assign to 'name' because it is a read-only property.
  }
}
const g = new Greeter();
g.name = "also not ok"; // Cannot assign to 'name' because it is a read-only property.
```

### 1.2. Constructors
Background Reading:
[Constructor (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor)

Class constructors are very similar to functions. You can add parameters with type annotations, default values, and overloads:

```typescript
class Point {
  x: number;
  y: number;

  // Normal signature with defaults
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
```

```typescript
class Point {
  x: number = 0;
  y: number = 0;

  // Constructor overloads
  constructor(x: number, y: number);
  constructor(xy: string);
  constructor(x: string | number, y: number = 0) {
    // Code logic here
  }
}
```

There are just a few differences between class constructor signatures and function signatures:

*   Constructors can’t have type parameters - these belong on the outer class declaration, which we’ll learn about later
*   Constructors can’t have return type annotations - the class instance type is always what’s returned

#### 1.2.1. Super Calls
Just as in JavaScript, if you have a base class, you’ll need to call `super();` in your constructor body before using any `this.` members:

```typescript
class Base {
  k = 4;
}

class Derived extends Base {
  constructor() {
    // Prints a wrong value in ES5; throws exception in ES6
    console.log(this.k); // 'super' must be called before accessing 'this' in the constructor of a derived class.
    super();
  }
}
```

Forgetting to call `super` is an easy mistake to make in JavaScript, but TypeScript will tell you when it’s necessary.

### 1.3. Methods
Background Reading:
[Method definitions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions)

A function property on a class is called a method. Methods can use all the same type annotations as functions and constructors:

```typescript
class Point {
  x = 10;
  y = 10;

  scale(n: number): void {
    this.x *= n;
    this.y *= n;
  }
}
```

Other than the standard type annotations, TypeScript doesn’t add anything else new to methods.

Note that inside a method body, it is still mandatory to access fields and other methods via `this.`. An unqualified name in a method body will always refer to something in the enclosing scope:

```typescript
let x: number = 0;

class C {
  x: string = "hello";

  m() {
    // This is trying to modify 'x' from line 1, not the class property
    x = "world"; // Type 'string' is not assignable to type 'number'.
  }
}
```

### 1.4. Getters / Setters
Classes can also have accessors:

```typescript
class C {
  _length = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
  }
}
```

Note that a field-backed get/set pair with no extra logic is very rarely useful in JavaScript. It’s fine to expose public fields if you don’t need to add additional logic during the get/set operations.

TypeScript has some special inference rules for accessors:

*   If `get` exists but no `set`, the property is automatically `readonly`
*   If the type of the setter parameter is not specified, it is inferred from the return type of the getter

Since TypeScript 4.3, it is possible to have accessors with different types for getting and setting.

```typescript
class Thing {
  _size = 0;

  get size(): number {
    return this._size;
  }

  set size(value: string | number | boolean) {
    let num = Number(value);

    // Don't allow NaN, Infinity, etc

    if (!Number.isFinite(num)) {
      this._size = 0;
      return;
    }

    this._size = num;
  }
}
```

### 1.5. Index Signatures
Classes can declare index signatures; these work the same as Index Signatures for other object types:

```typescript
class MyClass {
  [s: string]: boolean | ((s: string) => boolean);

  check(s: string) {
    return this[s] as boolean;
  }
}
```

Because the index signature type needs to also capture the types of methods, it’s not easy to usefully use these types. Generally it’s better to store indexed data in another place instead of on the class instance itself.

## 2. Class Heritage

### 2.1. `implements` Clauses
You can use an `implements` clause to check that a class satisfies a particular interface. An error will be issued if a class fails to correctly implement it:

```typescript
interface Pingable {
  ping(): void;
}

class Sonar implements Pingable {
  ping() {
    console.log("ping!");
  }
}

class Ball implements Pingable {
  // Class 'Ball' incorrectly implements interface 'Pingable'.
  // Property 'ping' is missing in type 'Ball' but required in type 'Pingable'.
  pong() {
    console.log("pong!");
  }
}
```

Classes may also implement multiple interfaces, e.g. `class C implements A, B {`.

#### 2.1.1. Cautions
It’s important to understand that an `implements` clause is only a check that the class can be treated as the interface type. It doesn’t change the type of the class or its methods at all. A common source of error is to assume that an `implements` clause will change the class type - it doesn’t!

```typescript
interface Checkable {
  check(name: string): boolean;
}

class NameChecker implements Checkable {
  check(s) { // Parameter 's' implicitly has an 'any' type.
    // Notice no error here
    return s.toLowerCase() === "ok";
  }
}
```

In this example, we perhaps expected that `s`’s type would be influenced by the `name: string` parameter of `check`. It is not - `implements` clauses don’t change how the class body is checked or its type inferred.

Similarly, implementing an interface with an optional property doesn’t create that property:

```typescript
interface A {
  x: number;
  y?: number;
}
class C implements A {
  x = 0;
}
const c = new C();
c.y = 10; // Property 'y' does not exist on type 'C'.
```

### 2.2. `extends` Clauses
Background Reading:
[extends keyword (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends)

Classes may extend from a base class. A derived class has all the properties and methods of its base class, and can also define additional members.

```typescript
class Animal {
  move() {
    console.log("Moving along!");
  }
}

class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log("woof!");
    }
  }
}

const d = new Dog();
// Base class method
d.move();
// Derived class method
d.woof(3);
```

#### 2.2.1. Overriding Methods
Background Reading:
[super keyword (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super)

A derived class can also override a base class field or property. You can use the `super.` syntax to access base class methods. Note that because JavaScript classes are a simple lookup object, there is no notion of a “super field”.

TypeScript enforces that a derived class is always a subtype of its base class.

For example, here’s a legal way to override a method:

```typescript
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}

const d = new Derived();
d.greet();
d.greet("reader");
```

It’s important that a derived class follow its base class contract. Remember that it’s very common (and always legal!) to refer to a derived class instance through a base class reference:

```typescript
// Alias the derived instance through a base class reference
const b: Base = d;
// No problem
b.greet();
```

What if `Derived` didn’t follow `Base`’s contract?

```typescript
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  // Make this parameter required
  greet(name: string) {
    // Property 'greet' in type 'Derived' is not assignable to the same property in base type 'Base'.
    // Type '(name: string) => void' is not assignable to type '() => void'.
    // Target signature provides too few arguments. Expected 1 or more, but got 0.
    console.log(`Hello, ${name.toUpperCase()}`);
  }
}
```

If we compiled this code despite the error, this sample would then crash:

```typescript
const b: Base = new Derived();
// Crashes because "name" will be undefined
b.greet();
```

#### 2.2.2. Type-only Field Declarations
When `target >= ES2022` or `useDefineForClassFields` is `true`, class fields are initialized after the parent class constructor completes, overwriting any value set by the parent class. This can be a problem when you only want to re-declare a more accurate type for an inherited field. To handle these cases, you can write `declare` to indicate to TypeScript that there should be no runtime effect for this field declaration.

```typescript
interface Animal {
  dateOfBirth: any;
}

interface Dog extends Animal {
  breed: any;
}

class AnimalHouse {
  resident: Animal;
  constructor(animal: Animal) {
    this.resident = animal;
  }
}

class DogHouse extends AnimalHouse {
  // Does not emit JavaScript code,
  // only ensures the types are correct
  declare resident: Dog;
  constructor(dog: Dog) {
    super(dog);
  }
}
```

#### 2.2.3. Initialization Order
The order that JavaScript classes initialize can be surprising in some cases. Let’s consider this code:

```typescript
class Base {
  name = "base";
  constructor() {
    console.log("My name is " + this.name);
  }
}

class Derived extends Base {
  name = "derived";
}

// Prints "base", not "derived"
const d = new Derived();
```

What happened here?

The order of class initialization, as defined by JavaScript, is:

1.  The base class fields are initialized
2.  The base class constructor runs
3.  The derived class fields are initialized
4.  The derived class constructor runs

This means that the base class constructor saw its own value for `name` during its own constructor, because the derived class field initializations hadn’t run yet.

#### 2.2.4. Inheriting Built-in Types
Note: If you don’t plan to inherit from built-in types like `Array`, `Error`, `Map`, etc. or your compilation target is explicitly set to `ES6`/`ES2015` or above, you may skip this section

In ES2015, constructors which return an object implicitly substitute the value of `this` for any callers of `super(...)`. It is necessary for generated constructor code to capture any potential return value of `super(...)` and replace it with `this`.

As a result, subclassing `Error`, `Array`, and others may no longer work as expected. This is due to the fact that constructor functions for `Error`, `Array`, and the like use ECMAScript 6’s `new.target` to adjust the prototype chain; however, there is no way to ensure a value for `new.target` when invoking a constructor in ECMAScript 5. Other downlevel compilers generally have the same limitation by default.

For a subclass like the following:

```typescript
class MsgError extends Error {
  constructor(m: string) {
    super(m);
  }
  sayHello() {
    return "hello " + this.message;
  }
}
```

you may find that:

*   methods may be undefined on objects returned by constructing these subclasses, so calling `sayHello` will result in an error.
*   `instanceof` will be broken between instances of the subclass and their instances, so `(new MsgError()) instanceof MsgError` will return `false`.

As a recommendation, you can manually adjust the prototype immediately after any `super(...)` calls.

```typescript
class MsgError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, MsgError.prototype);
  }

  sayHello() {
    return "hello " + this.message;
  }
}
```

However, any subclass of `MsgError` will have to manually set the prototype as well. For runtimes that don’t support `Object.setPrototypeOf`, you may instead be able to use `__proto__`.

Unfortunately, these workarounds will not work on Internet Explorer 10 and prior. One can manually copy methods from the prototype onto the instance itself (i.e. `MsgError.prototype` onto `this`), but the prototype chain itself cannot be fixed.

## 3. Member Visibility
You can use TypeScript to control whether certain methods or properties are visible to code outside the class.

### 3.1. `public`
The default visibility of class members is `public`. A public member can be accessed anywhere:

```typescript
class Greeter {
  public greet() {
    console.log("hi!");
  }
}
const g = new Greeter();
g.greet();
```

Because `public` is already the default visibility modifier, you don’t ever need to write it on a class member, but might choose to do so for style/readability reasons.

### 3.2. `protected`
`protected` members are only visible to subclasses of the class they’re declared in.

```typescript
class Greeter {
  public greet() {
    console.log("Hello, " + this.getName());
  }
  protected getName() {
    return "hi";
  }
}

class SpecialGreeter extends Greeter {
  public howdy() {
    // OK to access protected member here
    console.log("Howdy, " + this.getName());
  }
}
const g = new SpecialGreeter();
g.greet(); // OK
// g.getName(); // Property 'getName' is protected and only accessible within class 'Greeter' and its subclasses.
```

#### 3.2.1. Exposure of protected members
Derived classes need to follow their base class contracts, but may choose to expose a subtype of base class with more capabilities. This includes making protected members public:

```typescript
class Base {
  protected m = 10;
}
class Derived extends Base {
  // No modifier, so default is 'public'
  m = 15;
}
const d = new Derived();
console.log(d.m); // OK
```

Note that `Derived` was already able to freely read and write `m`, so this doesn’t meaningfully alter the “security” of this situation. The main thing to note here is that in the derived class, we need to be careful to repeat the `protected` modifier if this exposure isn’t intentional.

#### 3.2.2. Cross-hierarchy protected access
TypeScript doesn’t allow accessing protected members of a sibling class in a class hierarchy:

```typescript
class Base {
  protected x: number = 1;
}
class Derived1 extends Base {
  protected x: number = 5;
}
class Derived2 extends Base {
  f1(other: Derived2) {
    other.x = 10;
  }
  f2(other: Derived1) {
    other.x = 10; // Property 'x' is protected and only accessible within class 'Derived1' and its subclasses.
  }
}
```

This is because accessing `x` in `Derived2` should only be legal from `Derived2`’s subclasses, and `Derived1` isn’t one of them. Moreover, if accessing `x` through a `Derived1` reference is illegal (which it certainly should be!), then accessing it through a base class reference should never improve the situation.

See also [Why Can’t I Access A Protected Member From A Derived Class?](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/protected#why-can-t-i-access-a-protected-member-from-a-derived-class) which explains more of C#‘s reasoning on the same topic.

### 3.3. `private`
`private` is like `protected`, but doesn’t allow access to the member even from subclasses:

```typescript
class Base {
  private x = 0;
}
const b = new Base();
// Can't access from outside the class
// console.log(b.x); // Property 'x' is private and only accessible within class 'Base'.
```

```typescript
class Derived extends Base {
  showX() {
    // Can't access in subclasses
    // console.log(this.x); // Property 'x' is private and only accessible within class 'Base'.
  }
}
```

Because private members aren’t visible to derived classes, a derived class can’t increase their visibility:

```typescript
class Base {
  private x = 0;
}
class Derived extends Base {
  // Class 'Derived' incorrectly extends base class 'Base'.
  // Property 'x' is private in type 'Base' but not in type 'Derived'.
  x = 1;
}
```

#### 3.3.1. Cross-instance private access
Different OOP languages disagree about whether different instances of the same class may access each others’ private members. While languages like Java, C#, C++, Swift, and PHP allow this, Ruby does not.

TypeScript does allow cross-instance private access:

```typescript
class A {
  private x = 10;

  public sameAs(other: A) {
    // No error
    return other.x === this.x;
  }
}
```

#### 3.3.2. Caveats
Like other aspects of TypeScript’s type system, `private` and `protected` are only enforced during type checking.

This means that JavaScript runtime constructs like `in` or simple property lookup can still access a private or protected member:

```typescript
class MySafe {
  private secretKey = 12345;
}
```

```javascript
// In a JavaScript file...
const s = new MySafe();
// Will print 12345
console.log(s.secretKey);
```

`private` also allows access using bracket notation during type checking. This makes private-declared fields potentially easier to access for things like unit tests, with the drawback that these fields are soft private and don’t strictly enforce privacy.

```typescript
class MySafe {
  private secretKey = 12345;
}

const s = new MySafe();

// Not allowed during type checking
// console.log(s.secretKey); // Property 'secretKey' is private and only accessible within class 'MySafe'.

// OK
console.log(s["secretKey"]);
```

Unlike TypeScripts’s `private`, JavaScript’s private fields (`#`) remain private after compilation and do not provide the previously mentioned escape hatches like bracket notation access, making them hard private.

```typescript
class Dog {
  #barkAmount = 0;
  personality = "happy";

  constructor() {}
}
```

```javascript
"use strict";
class Dog {
    #barkAmount = 0;
    personality = "happy";
    constructor() { }
}
```

When compiling to ES2021 or less, TypeScript will use WeakMaps in place of `#`.

```javascript
"use strict";
var _Dog_barkAmount;
class Dog {
    constructor() {
        _Dog_barkAmount.set(this, 0);
        this.personality = "happy";
    }
}
_Dog_barkAmount = new WeakMap();
```

If you need to protect values in your class from malicious actors, you should use mechanisms that offer hard runtime privacy, such as closures, WeakMaps, or private fields. Note that these added privacy checks during runtime could affect performance.

## 4. Static Members
Background Reading:
[Static Members (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static)

Classes may have static members. These members aren’t associated with a particular instance of the class. They can be accessed through the class constructor object itself:

```typescript
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}
console.log(MyClass.x);
MyClass.printX();
```

Static members can also use the same `public`, `protected`, and `private` visibility modifiers:

```typescript
class MyClass {
  private static x = 0;
}
// console.log(MyClass.x); // Property 'x' is private and only accessible within class 'MyClass'.
```

Static members are also inherited:

```typescript
class Base {
  static getGreeting() {
    return "Hello world";
  }
}
class Derived extends Base {
  myGreeting = Derived.getGreeting();
}
```

### 4.1. Special Static Names
It’s generally not safe/possible to overwrite properties from the `Function` prototype. Because classes are themselves functions that can be invoked with `new`, certain static names can’t be used. Function properties like `name`, `length`, and `call` aren’t valid to define as static members:

```typescript
class S {
  // static name = "S!"; // Static property 'name' conflicts with built-in property 'Function.name' of constructor function 'S'.
}
```

### 4.2. Why No Static Classes?
TypeScript (and JavaScript) don’t have a construct called `static class` the same way as, for example, C# does.

Those constructs only exist because those languages force all data and functions to be inside a class; because that restriction doesn’t exist in TypeScript, there’s no need for them. A class with only a single instance is typically just represented as a normal object in JavaScript/TypeScript.

For example, we don’t need a “static class” syntax in TypeScript because a regular object (or even top-level function) will do the job just as well:

```typescript
// Unnecessary "static" class
class MyStaticClass {
  static doSomething() {}
}

// Preferred (alternative 1)
function doSomething() {}

// Preferred (alternative 2)
const MyHelperObject = {
  dosomething() {},
};
```

### 4.3. `static` Blocks in Classes
Static blocks allow you to write a sequence of statements with their own scope that can access private fields within the containing class. This means that we can write initialization code with all the capabilities of writing statements, no leakage of variables, and full access to our class’s internals.

```typescript
class Foo {
    static #count = 0;

    get count() {
        return Foo.#count;
    }

    static {
        try {
            const lastInstances = ["a","b"]; // giả lập load dữ liệu
            Foo.#count += lastInstances.length;
        }
        catch {}
    }
}
```

## 5. Generic Classes and `this` at Runtime

### 5.1. Generic Classes
Classes, much like interfaces, can be generic. When a generic class is instantiated with `new`, its type parameters are inferred the same way as in a function call:

```typescript
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}

const b = new Box("hello!"); // const b: Box<string>
```

Classes can use generic constraints and defaults the same way as interfaces.

#### 5.1.1. Type Parameters in Static Members
This code isn’t legal, and it may not be obvious why:

```typescript
class Box<Type> {
  // static defaultValue: Type; // Static members cannot reference class type parameters.
}
```

Remember that types are always fully erased! At runtime, there’s only one `Box.defaultValue` property slot. This means that setting `Box<string>.defaultValue` (if that were possible) would also change `Box<number>.defaultValue` - not good. The static members of a generic class can never refer to the class’s type parameters.

### 5.2. `this` at Runtime in Classes
Background Reading:
[this keyword (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

It’s important to remember that TypeScript doesn’t change the runtime behavior of JavaScript, and that JavaScript is somewhat famous for having some peculiar runtime behaviors.

JavaScript’s handling of `this` is indeed unusual:

```typescript
class MyClass {
  name = "MyClass";
  getName() {
    return this.name;
  }
}
const c = new MyClass();
const obj = {
  name: "obj",
  getName: c.getName,
};

// Prints "obj", not "MyClass"
console.log(obj.getName());
```

Long story short, by default, the value of `this` inside a function depends on how the function was called. In this example, because the function was called through the `obj` reference, its value of `this` was `obj` rather than the class instance.

This is rarely what you want to happen! TypeScript provides some ways to mitigate or prevent this kind of error.

#### 5.2.1. Arrow Functions
Background Reading:
[Arrow functions (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

If you have a function that will often be called in a way that loses its `this` context, it can make sense to use an arrow function property instead of a method definition:

```typescript
class MyClass {
  name = "MyClass";
  getName = () => {
    return this.name;
  };
}
const c = new MyClass();
const g = c.getName;
// Prints "MyClass" instead of crashing
console.log(g());
```

This has some trade-offs:

*   The `this` value is guaranteed to be correct at runtime, even for code not checked with TypeScript
*   This will use more memory, because each class instance will have its own copy of each function defined this way
*   You can’t use `super.getName` in a derived class, because there’s no entry in the prototype chain to fetch the base class method from

#### 5.2.2. `this` parameters
In a method or function definition, an initial parameter named `this` has special meaning in TypeScript. These parameters are erased during compilation:

```typescript
// TypeScript input with 'this' parameter
function fn(this: SomeType, x: number) {
  /* ... */
}
```

```javascript
// JavaScript output
function fn(x) {
  /* ... */
}
```

TypeScript checks that calling a function with a `this` parameter is done so with a correct context. Instead of using an arrow function, we can add a `this` parameter to method definitions to statically enforce that the method is called correctly:

```typescript
class MyClass {
  name = "MyClass";
  getName(this: MyClass) {
    return this.name;
  }
}
const c = new MyClass();
// OK
c.getName();

// Error, would crash
const g = c.getName;
// console.log(g()); // The 'this' context of type 'void' is not assignable to method's 'this' of type 'MyClass'.
```

This method makes the opposite trade-offs of the arrow function approach:

*   JavaScript callers might still use the class method incorrectly without realizing it
*   Only one function per class definition gets allocated, rather than one per class instance
*   Base method definitions can still be called via `super.`

#### 5.2.3. `this` Types
In classes, a special type called `this` refers dynamically to the type of the current class. Let’s see how this is useful:

```typescript
class Box {
  contents: string = "";
  set(value: string) {
    this.contents = value;
    return this; // (method) Box.set(value: string): this
  }
}
```

Here, TypeScript inferred the return type of `set` to be `this`, rather than `Box`. Now let’s make a subclass of `Box`:

```typescript
class ClearableBox extends Box {
  clear() {
    this.contents = "";
  }
}

const a = new ClearableBox();
const b = a.set("hello"); // const b: ClearableBox
```

You can also use `this` in a parameter type annotation:

```typescript
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}
```

This is different from writing `other: Box` — if you have a derived class, its `sameAs` method will now only accept other instances of that same derived class:

```typescript
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}

class DerivedBox extends Box {
  otherContent: string = "?";
}

const base = new Box();
const derived = new DerivedBox();
// derived.sameAs(base); // Argument of type 'Box' is not assignable to parameter of type 'DerivedBox'.
                         // Property 'otherContent' is missing in type 'Box' but required in type 'DerivedBox'.
```

#### 5.2.4. `this`-based type guards
You can use `this is Type` in the return position for methods in classes and interfaces. When mixed with a type narrowing (e.g. `if` statements) the type of the target object would be narrowed to the specified `Type`.

```typescript
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep;
  }
  isDirectory(): this is Directory {
    return this instanceof Directory;
  }
  isNetworked(): this is Networked & this {
    return this.networked;
  }
  constructor(public path: string, private networked: boolean) {}
}

class FileRep extends FileSystemObject {
  constructor(path: string, public content: string) {
    super(path, false);
  }
}

class Directory extends FileSystemObject {
  children: FileSystemObject[];
}

interface Networked {
  host: string;
}

const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo");

if (fso.isFile()) {
  fso.content; // const fso: FileRep
} else if (fso.isDirectory()) {
  fso.children; // const fso: Directory
} else if (fso.isNetworked()) {
  fso.host; // const fso: Networked & FileSystemObject
}
```

A common use-case for a `this`-based type guard is to allow for lazy validation of a particular field. For example, this case removes an `undefined` from the value held inside box when `hasValue` has been verified to be `true`:

```typescript
class Box<T> {
  value?: T;

  hasValue(): this is { value: T } {
    return this.value !== undefined;
  }
}

const box = new Box<string>();
box.value = "Gameboy";

box.value; // (property) Box<string>.value?: string

if (box.hasValue()) {
  box.value; // (property) value: string
}
```

## 6. Parameter Properties
TypeScript offers special syntax for turning a constructor parameter into a class property with the same name and value. These are called parameter properties and are created by prefixing a constructor argument with one of the visibility modifiers `public`, `private`, `protected`, or `readonly`. The resulting field gets those modifier(s):

```typescript
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // No body necessary
  }
}
const a = new Params(1, 2, 3);
console.log(a.x); // (property) Params.x: number
// console.log(a.z); // Property 'z' is private and only accessible within class 'Params'.
```

## 7. Constructor Signatures
JavaScript classes are instantiated with the `new` operator. Given the type of a class itself, the `InstanceType` utility type models this operation.

```typescript
class Point {
  createdAt: number;
  x: number;
  y: number
  constructor(x: number, y: number) {
    this.createdAt = Date.now()
    this.x = x;
    this.y = y;
  }
}
type PointInstance = InstanceType<typeof Point>

function moveRight(point: PointInstance) {
  point.x += 5;
}

const point = new Point(3, 4);
moveRight(point);
point.x; // => 8
```

## 8. Abstract Classes and Members
Classes, methods, and fields in TypeScript may be `abstract`.

An `abstract` method or `abstract` field is one that hasn’t had an implementation provided. These members must exist inside an `abstract` class, which cannot be directly instantiated.

The role of abstract classes is to serve as a base class for subclasses which do implement all the abstract members. When a class doesn’t have any abstract members, it is said to be concrete.

Let’s look at an example:

```typescript
abstract class Base {
  abstract getName(): string;

  printName() {
    console.log("Hello, " + this.getName());
  }
}

// const b = new Base(); // Cannot create an instance of an abstract class.
```

We can’t instantiate `Base` with `new` because it’s abstract. Instead, we need to make a derived class and implement the abstract members:

```typescript
class Derived extends Base {
  getName() {
    return "world";
  }
}

const d = new Derived();
d.printName();
```

Notice that if we forget to implement the base class’s abstract members, we’ll get an error:

```typescript
class Derived extends Base {
  // Non-abstract class 'Derived' does not implement inherited abstract member getName from class 'Base'.
  // forgot to do anything
}
```

### 8.1. Abstract Construct Signatures
Sometimes you want to accept some class constructor function that produces an instance of a class which derives from some abstract class.

For example, you might want to write this code:

```typescript
function greet(ctor: typeof Base) {
  // const instance = new ctor(); // Cannot create an instance of an abstract class.
  // instance.printName();
}
```

TypeScript is correctly telling you that you’re trying to instantiate an abstract class. After all, given the definition of `greet`, it’s perfectly legal to write this code, which would end up constructing an abstract class:

```typescript
// Bad!
// greet(Base);
```

Instead, you want to write a function that accepts something with a construct signature:

```typescript
function greet(ctor: new () => Base) {
  const instance = new ctor();
  instance.printName();
}
greet(Derived);
// greet(Base); // Argument of type 'typeof Base' is not assignable to parameter of type 'new () => Base'.
             // Cannot assign an abstract constructor type to a non-abstract constructor type.
```

Now TypeScript correctly tells you about which class constructor functions can be invoked - `Derived` can because it’s concrete, but `Base` cannot.

## 9. Relationships Between Classes
In most cases, classes in TypeScript are compared structurally, the same as other types.

For example, these two classes can be used in place of each other because they’re identical:

```typescript
class Point1 {
  x = 0;
  y = 0;
}

class Point2 {
  x = 0;
  y = 0;
}

// OK
const p: Point1 = new Point2();
```

Similarly, subtype relationships between classes exist even if there’s no explicit inheritance:

```typescript
class Person {
  name: string;
  age: number;
}

class Employee {
  name: string;
  age: number;
  salary: number;
}

// OK
const p: Person = new Employee();
```

This sounds straightforward, but there are a few cases that seem stranger than others.

Empty classes have no members. In a structural type system, a type with no members is generally a supertype of anything else. So if you write an empty class (don’t!), anything can be used in place of it:

```typescript
class Empty {}

function fn(x: Empty) {
  // can't do anything with 'x', so I won't
}

// All OK!
fn(window);
fn({});
fn(fn);
```

## 10. Tổng hợp các khái niệm về Class trong TypeScript

### 10.1. Bảng tổng hợp
| Khái niệm | Từ khóa / Modifier | Mô tả | Ví dụ / Ghi chú |
|---|---|---|---|
| Class cơ bản | `class` | Tạo một class thông thường | `class Point { x: number; y: number; }` |
| Field | `x: number` hoặc `x = 0` | Thuộc tính của class, có thể public, protected, private | `class P { x = 0; }` |
| Constructor | `constructor()` | Khởi tạo instance, có thể nhận parameters | `constructor(x: number, y: number) { this.x = x; }` |
| Parameter Properties | `public`/`private`/`protected`/`readonly` | Tạo field trực tiếp từ constructor parameter | `constructor(public readonly id: number, private password: string)` |
| Method | `methodName()` | Function trong class, dùng `this` để truy cập field | `scale(n: number) { this.x *= n; }` |
| Getter / Setter | `get` / `set` | Truy cập/thiết lập property với logic | `get size(): number { return this._size; }` |
| Static Members | `static` | Thuộc về class, không thuộc instance | `static x = 0; MyClass.x` |
| Visibility | `public` / `protected` / `private` | Kiểm soát quyền truy cập member | `private secret: string; protected age: number;` |
| Readonly | `readonly` | Không thể gán lại sau constructor | `readonly id: number` |
| Abstract Class / Method | `abstract` | Class hoặc method chỉ khai báo, subclass phải implement | `abstract class Base { abstract getName(): string; }` |
| Inheritance | `extends` | Kế thừa base class, override method | `class Dog extends Animal { woof() {} }` |
| Implements Interface | `implements` | Đảm bảo class tuân theo interface | `class Sonar implements Pingable { ping() {} }` |
| Generic Class | `<T>` | Class sử dụng type parameter | `class Box<T> { contents: T; }` |
| `this`-based Type | `this` | Method trả về instance hiện tại hoặc subtype | `set(value: string): this { this.contents = value; return this; }` |
| Constructor Signatures / InstanceType | `InstanceType<typeof Class>` | Lấy type của instance từ class type | `type P = InstanceType<typeof Point>` |
| Structural Typing | – | Class compare dựa trên cấu trúc fields, không cần inheritance | `const p: Point1 = new Point2(); // OK` |

### 10.2. Sơ đồ quan hệ class trong TypeScript

```
Class
│
├─ Fields (x, y, ...)            <-- public/protected/private, readonly
├─ Constructor (init fields)
│     └─ Parameter Properties     <-- public/private/protected/readonly
├─ Methods (scale(), getName(), ...)
│     └─ this parameter / arrow functions
├─ Static Members                 <-- static fields/methods
├─ Getter/Setter                  <-- logic khi get/set
├─ Abstract Members               <-- abstract class only
│
├─ Inheritance (extends)
│     ├─ Override methods
│     ├─ Access base via super
│     └─ Initialization order: base fields -> base constructor -> derived fields -> derived constructor
├─ Implements Interfaces          <-- class must implement interface members
├─ Generic Classes <T>
│     └─ Static members cannot use T
└─ Relationships
      ├─ Structural Typing        <-- type-check theo field, không cần extends
      └─ Subtype Assignment
```

### 10.3. Key Notes / Tips
*   **Visibility:**
    *   `public` = default, truy cập ở mọi nơi.
    *   `protected` = chỉ subclass truy cập.
    *   `private` = chỉ class hiện tại.
*   **Readonly:** chỉ gán trong constructor.
*   **Static members:** không truy cập `this`, truy cập qua `ClassName.member`.
*   **Abstract class:** không thể `new`, subclass phải implement method/field abstract.
*   **Structural typing:** TS so sánh class theo fields, không cần inheritance.
*   **Empty class** = “wildcard”, mọi object có thể assign.
*   **`this` type / `this`-based type guard:** giúp giữ type khi subclass hoặc kiểm tra runtime.
*   **Generic classes:** static không thể dùng type parameter `<T>`.
*   **Parameter properties:** shortcut để tạo field từ constructor parameter, giảm boilerplate.

## 11. Class trong TypeScript dưới góc độ nấu nướng

Hãy tưởng tượng TypeScript class = công thức nấu ăn + căn bếp:

### 11.1. Class = Recipe (Công thức nấu ăn)
Class mô tả “cách làm” một món ăn, không phải món ăn sẵn.

*   **Fields** = nguyên liệu: `x`, `y`, `z`…
    *   Ví dụ: `x = flour`, `y = sugar`
*   **Constructor** = bước chuẩn bị: trộn nguyên liệu, đặt số lượng
    *   Ví dụ: `constructor(flourAmount, sugarAmount) { this.flour = flourAmount; this.sugar = sugarAmount }`
*   **Methods** = thao tác/step nấu ăn: trộn, nướng, rán
    *   Ví dụ: `bake(minutes: number)`

### 11.2. Static Members = Dụng cụ chung
Một số dụng cụ/recipe có sẵn cho mọi món ăn mà không cần instance:

*   `ovenTemperature`
*   `sharedRecipeBook.print()`

### 11.3. Visibility = Ai được phép dùng
| Modifier | Trong nấu ăn | Ví dụ |
|---|---|---|
| `public` | Ai cũng có thể dùng | Everyone can see sugar |
| `protected` | Chỉ những đầu bếp kế thừa công thức mới biết | Family recipe secret |
| `private` | Chỉ trong công thức hiện tại mới dùng | Chef’s secret spice |

### 11.4. Abstract Class = Template / Công thức cơ bản
Một template recipe: chưa đầy đủ, không thể nấu trực tiếp

Subclass phải implement bước thiếu:

```typescript
abstract class BaseRecipe {
  abstract addMainIngredient(): void;
  bake() { console.log("Baking..."); }
}

class Cake extends BaseRecipe {
  addMainIngredient() { console.log("Adding flour & sugar"); }
}
```
`BaseRecipe` = công thức cơ bản, `Cake` = món cụ thể.

### 11.5. Inheritance = Công thức mở rộng
Class kế thừa = thêm/override bước nấu

*   Ví dụ: `BaseRecipe` = bánh cơ bản, `ChocolateCake` kế thừa và thêm chocolate.

### 11.6. Generic Class = Công thức linh hoạt
Recipe với nguyên liệu bất kỳ

```typescript
class Box<T> {
  contents: T;
}
```
`T` = nguyên liệu: có thể là chocolate, vanilla, trứng,…

### 11.7. `this` type = Đầu bếp hiện tại
`this` = chính bạn, đầu bếp đang nấu món này

Giữ mối quan hệ giữa recipe và step đúng instance.

### 11.8. Relationships / Structural Typing = Chỉ nhìn nguyên liệu
Nếu hai công thức cùng nguyên liệu + bước tương tự, bạn có thể thay thế nhau.

*   Empty recipe = không nguyên liệu → “mọi món ăn đều hợp lệ” 😅

#### 11.8.1. Kết luận:
*   **Class trong TypeScript** = một công thức nấu ăn
*   **Fields** = nguyên liệu
*   **Methods** = thao tác nấu
*   **Constructor** = chuẩn bị
*   **Static** = dụng cụ chung
*   **Visibility** = quyền sử dụng nguyên liệu/step
*   **Abstract** = template chưa hoàn thiện
*   **Generic** = recipe linh hoạt với nguyên liệu tuỳ chọn
*   **`this`** = đầu bếp hiện tại
