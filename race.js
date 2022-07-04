class Horse {
  #id;
  #position;
  #height;
  #speed;

  constructor(id, position, height, speed) {
    this.#id = id;
    this.#position = position;
    this.#height = height;
    this.#speed = speed;
  }

  move() {
    this.#position.x -= this.#speed.x;
  }

  moveDown() {
    this.#position.y += 8;
  }

  moveUp() {
    this.#position.y -= 8;
  }

  getDetails() {
    const position = { x: this.#position.x, y: this.#position.y };
    return { id: this.#id, position, height: this.#height };
  }
};

class Obstacle {
  #id;
  #position;
  #height;
  #speed;

  constructor(id, position, height, speed) {
    this.#id = id;
    this.#position = position;
    this.#height = height;
    this.#speed = speed;
  }

  move() {
    this.#position.x += this.#speed.x;
  }

  getDetails() {
    const position = { x: this.#position.x, y: this.#position.y };
    return { id: this.#id, position, height: this.#height };
  }
};

const roadWay = (roadPattern) => {
  return roadPattern.slice(2) + roadPattern.slice(0, 2);
};

const drawRoad = (ground) => {
  const road = '-----------+';
  const element = document.createElement('div');
  element.id = 'road';
  element.innerText = road.repeat(11);
  ground.appendChild(element);
};

const updateRoad = () => {
  const element = document.getElementById('road');
  const newRoad = roadWay(element.innerText);
  element.innerText = newRoad;
};

const isHorseWon = horse => {
  const { x } = horse.getDetails().position;
  return x <= 12;
};

const stopHorse = () => {
  const horse = document.getElementById('horse-1');
  horse.style.backgroundImage = "url('horseStopped.png')";
};

const drawObstacle = (ground, obstacle) => {
  const { id, position, height } = obstacle.getDetails();
  ele = document.getElementById(id) || document.createElement('div');
  ele.id = id;
  ele.style.top = position.y;
  ele.style.left = position.x;
  ele.style.height = height;
  ground.appendChild(ele);
}

const drawHorse = (ground, horse) => {
  const { id, position, height } = horse.getDetails();
  const ele = document.getElementById(id) || document.createElement('div');
  ele.id = id;
  ele.style.top = position.y;
  ele.style.left = position.x;
  ele.style.height = height;
  ground.appendChild(ele);
};

const move = (event, horse) => {
  if (event.key === 'ArrowUp') {
    horse.moveUp();
  }
  if (event.key === 'ArrowDown') {
    horse.moveDown();
  }
}

const main = () => {
  const ground = document.getElementById('ground');
  const horse = new Horse('horse-1', { x: 680, y: 150 }, 120, { x: 3, y: 0 });
  drawRoad(ground);
  document.addEventListener('keydown', event => move(event, horse));

  const obstacle = new Obstacle('obs-1', { x: 120, y: 120 }, 50, { x: 3, y: 0 })
  drawObstacle(ground, obstacle);

  const id = setInterval(() => {
    drawHorse(ground, horse)
    updateRoad();
    obstacle.move();
    drawObstacle(ground, obstacle);
  }, 100)
}

window.onload = main;