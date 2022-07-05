class Game {
  #horse;
  #obstacle;
  #groundViewEle;
  #score;

  constructor(horse, obstacle, groundViewEle) {
    this.#horse = horse;
    this.#obstacle = obstacle;
    this.#groundViewEle = groundViewEle;
    this.#score = 0;
  }

  #groundWidth() {
    return this.#groundViewEle.clientWidth;
  }

  updateScore(obstacle) {
    if (obstacle.hasReached(this.#groundWidth())) {
      this.#score++;
    }
  }

  moveObstacle() {
    this.#obstacle.forEach(obstacle => {
      obstacle.updatePosition(this.#groundWidth());
      this.updateScore(obstacle);
    });
  };

  getScore() {
    return this.#score;
  }

  hasObstacleHit(obstacle, horseDetail) {
    const obstacleDetail = getEntityDetail(obstacle);

    if (obstacleDetail.max.x > horseDetail.min.x) {
      if (obstacleDetail.max.y > horseDetail.min.y && obstacleDetail.min.y < horseDetail.max.y) {
        return true;
      }
    }
    return false;
  }

  hasHorseHit() {
    const horseDetail = getEntityDetail(this.#horse);
    if (horseDetail.min.y < 0 || horseDetail.max.y > 400) {
      return true;
    }
    for (const obstacle of this.#obstacle) {
      if (this.hasObstacleHit(obstacle, horseDetail)) {
        return true;
      };
    }
    return false;
  };
}


const drawScore = score => {
  const scoreBoard = document.getElementById('score');
  const content = scoreBoard.innerText.split(':');
  content[1] = score;
  scoreBoard.innerText = content.join(':');
};

const drawObject = (view, object) => {
  const { id, position, size } = object.getDetails();
  ele = document.getElementById(id) || document.createElement('div');
  ele.id = id;
  ele.style.top = position.y;
  ele.style.left = position.x;
  ele.style.width = size.width;
  ele.style.height = size.height;
  view.appendChild(ele);
};

const drawObstacle = (ground, obstacles) => {
  obstacles.forEach(obstacle => {
    const { id, position, size } = obstacle.getDetails();
    ele = document.getElementById(id) || document.createElement('div');
    ele.id = id;
    ele.style.top = position.y;
    ele.style.left = position.x;
    ele.style.width = size.width;
    ele.style.height = size.height;
    ele.className = 'obstacle';
    ground.appendChild(ele);
  });
};

const drawHorse = (ground, horse) => {
  drawObject(ground, horse);
};

const moveHorse = (event, horse) => {
  if (event.key === 'ArrowUp') {
    horse.moveUp();
  }
  if (event.key === 'ArrowDown') {
    horse.moveDown();
  }
};

const getEntityDetail = entity => {
  const { position, size } = entity.getDetails();
  const min = { x: position.x, y: position.y };
  const max = { x: position.x + size.width, y: position.y + size.height };
  return { min, max };
};

const stopHorse = () => {
  const horse = document.getElementById('horse-1');
  horse.style.backgroundImage = 'url("./horseStopped.png")';
};

const randomInt = limit => {
  return Math.ceil(Math.random() * limit);
};

const createObstacles = (Obstacle, id) => {
  return new Obstacle(id, { x: -randomInt(700), y: randomInt(350) }, { width: 25, height: 50 }, { dx: 10, dy: 0 });
};

const main = () => {
  const groundViewEle = document.getElementById('ground');
  const horse = new Horse('horse-1', { x: 680, y: 150 }, { width: 120, height: 65 }, { dx: 3, dy: 10 });
  const obstacles = [];

  document.addEventListener('keydown', event => moveHorse(event, horse));

  const game = new Game(horse, obstacles, groundViewEle);
  drawObstacle(groundViewEle, obstacles);
  let count = -1;

  const id = setInterval(() => {
    count++;
    if (count % 50 === 0) {
      const id = obstacles.length;
      obstacles.push(createObstacles(Obstacle, id));
    }
    drawHorse(groundViewEle, horse);
    game.moveObstacle();
    drawObstacle(groundViewEle, obstacles);
    drawScore(game.getScore());

    if (game.hasHorseHit()) {
      stopHorse();
      clearInterval(id);
    };
  }, 100);
};

window.onload = main;