(function () {
  class Game {
    #bird;
    #obstacles;
    #groundViewEle;
    #score;

    constructor(bird, obstacles, groundViewEle) {
      this.#bird = bird;
      this.#obstacles = obstacles;
      this.#groundViewEle = groundViewEle;
      this.#score = 0;
    }

    #groundWidth() {
      return this.#groundViewEle.clientWidth;
    }

    #updateScore(obstacle) {
      if (obstacle.hasReached(this.#groundWidth())) {
        this.#score++;
      }
    }

    moveObstacle() {
      this.#obstacles.forEach(obstacle => {
        obstacle.updatePosition(this.#groundWidth());
        this.#updateScore(obstacle);
      });
    };

    getScore() {
      return this.#score;
    }

    hasObstacleHit(obstacle, birdDetail) {
      const obstacleDetail = getObjectDetail(obstacle);

      if (obstacleDetail.max.x > birdDetail.min.x) {
        if (obstacleDetail.max.y > birdDetail.min.y && obstacleDetail.min.y < birdDetail.max.y) {
          return true;
        }
      }
      return false;
    }

    hasBirdHit() {
      const birdDetail = getObjectDetail(this.#bird);
      if (birdDetail.min.y < 0 || birdDetail.max.y > 400) {
        return true;
      }
      for (const obstacle of this.#obstacles) {
        if (this.hasObstacleHit(obstacle, birdDetail)) {
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

  const drawBird = (ground, bird) => {
    drawObject(ground, bird);
  };

  const moveBird = (event, bird) => {
    if (event.key === 'ArrowUp') {
      bird.moveUp();
    }
    if (event.key === 'ArrowDown') {
      bird.moveDown();
    }
  };

  const getObjectDetail = entity => {
    const { position, size } = entity.getDetails();
    const min = { x: position.x, y: position.y };
    const max = { x: position.x + size.width, y: position.y + size.height };
    return { min, max };
  };

  const stopGame = () => {
    const bird = document.getElementById('bird-1');
    const view = document.getElementById('ground');
    const message = document.getElementById('message');
    bird.style.backgroundImage = 'url("./resources/stoppedBird.png")';
    view.style.backgroundImage = 'url("./resources/stoppedMountain.png")';
    message.innerText = 'Game Over';
  };

  const randomInt = limit => {
    return Math.ceil(Math.random() * limit);
  };

  const createObstacles = (Obstacle, id) => {
    return new Obstacle(id, { x: -randomInt(700), y: randomInt(350) }, { width: 25, height: 50 }, { dx: 10, dy: 0 });
  };

  const main = () => {
    const groundViewEle = document.getElementById('ground');
    const bird = new Bird('bird-1', { x: 730, y: 150 }, { width: 60, height: 65 }, { dx: 3, dy: 10 });
    const obstacles = [];

    document.addEventListener('keydown', event => moveBird(event, bird));

    const game = new Game(bird, obstacles, groundViewEle);
    drawObstacle(groundViewEle, obstacles);
    let count = -1;

    const id = setInterval(() => {
      count++;
      if (count % 50 === 0) {
        const id = obstacles.length;
        obstacles.push(createObstacles(Obstacle, id));
      }
      drawBird(groundViewEle, bird);
      game.moveObstacle();
      drawObstacle(groundViewEle, obstacles);
      drawScore(game.getScore());

      if (game.hasBirdHit()) {
        stopGame();
        clearInterval(id);
      };
    }, 100);
  };

  window.onload = main;
})();