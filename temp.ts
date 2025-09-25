interface Movable {
  speed: number = 5;
  move(): void;
}

// Bất kỳ lớp nào cũng có thể thực hiện hợp đồng này.
class Car implements Movable {
  speed = 60;
  move() {
    console.log(`Driving at ${this.speed} km/h.`);
  }
}

class Person implements Movable {
  speed = 5;
  move() {
    console.log(`Walking at ${this.speed} km/h.`);
  }
}
