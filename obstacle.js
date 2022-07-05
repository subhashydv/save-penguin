class Obstacle {
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

  moveLeft() {
    this.#position.x += this.#speed.dx;
  }

  hasReached(limit) {
    return this.#position.x + this.#size.width >= limit
  }

  updatePosition(limit) {
    if (this.hasReached(limit)) {
      this.#position.x = 0;
    }
    this.moveLeft();
  }

  getDetails() {
    const position = { x: this.#position.x, y: this.#position.y };
    return { id: this.#id, position, size: this.#size };
  }
};