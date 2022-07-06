class Bird {
  #id;
  #position;
  #size;
  #speed;

  constructor(id, position, size, speed) {
    this.#id = id;
    this.#position = position;
    this.#size = size;
    this.#speed = speed;
  }

  moveDown() {
    this.#position.y += this.#speed.dy;
  }

  moveUp() {
    this.#position.y -= this.#speed.dy;
  }

  getDetails() {
    const position = { x: this.#position.x, y: this.#position.y };
    return { id: this.#id, position, size: this.#size };
  }
};