// map grid
const map = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

// resolution, tick rate, map scale, and fov settings
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const TICK = 30;
const CELL_SIZE = 32;
const FOV = toRadians(75);

// colors
const COLORS = {
  floor: "#654321", // "#ff6361"
  ceiling: "#140d07", // "#012975",
  wall: "#332211", // "#58508d"
  wallDark: "#281b0d", // "#003f5c"
  rays: "#ffa600",
};

// textures
const TEXTURES = {
  test: "./logo512.png",
  wall: "./textures/brick_wall.jpeg",
  wallDark: "./textures/brick_wall.jpeg",
}

// player settings
const player = {
  x: CELL_SIZE * 1.5,
  y: CELL_SIZE * 2,
  angle: toRadians(0),
  speedY: 0,
  speedX: 0,
  points: 0
};

// enemy settings
const enemy = {
  x: CELL_SIZE * 5,
  y: CELL_SIZE * 5,
  angle: toRadians(0),
  speed: 1,
  range: 1,
  frozen: false
};

// init canvas with screen resolution
const canvas = document.createElement("canvas");
canvas.setAttribute("width", SCREEN_WIDTH);
canvas.setAttribute("height", SCREEN_HEIGHT);
document.body.appendChild(canvas);

const context = canvas.getContext("2d");

// color for clear canvas
function clearScreen() {
  context.fillStyle = "black";
  context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

// minimap toggle
let miniMapDisplay = true;
let counter = 0;
function miniMapToggle() {
  counter++
  if (counter % 2 === 0) {
      miniMapDisplay = true;
  }
  else {
      miniMapDisplay = false;
  }
}

// render minimap
function renderMinimap(posX = 0, posY = 0, scale, rays) {
  const cellSize = scale * CELL_SIZE;
  map.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        context.fillStyle = "grey";
        context.fillRect(
          posX + x * cellSize,
          posY + y * cellSize,
          cellSize,
          cellSize
        );
      }
    });
  });

  // player
  context.fillStyle = "blue";
  context.fillRect(
    posX + player.x * scale - 10 / 2,
    posY + player.y * scale - 10 / 2,
    10,
    10
  );
  
  context.strokeStyle = "blue";
  context.beginPath();
  context.moveTo(player.x * scale, player.y * scale);
  context.lineTo(
    (player.x + Math.cos(player.angle) * 20) * scale,
    (player.y + Math.sin(player.angle) * 20) * scale
  );
  context.closePath();
  context.stroke();

  context.strokeStyle = COLORS.rays;
  rays.forEach((ray) => {
    context.beginPath();
    context.moveTo(player.x * scale, player.y * scale);
    context.lineTo(
      (player.x + Math.cos(ray.angle) * ray.distance) * scale,
      (player.y + Math.sin(ray.angle) * ray.distance) * scale
    );
    context.closePath();
    context.stroke();
  });

  // enemy
  context.fillStyle = "red";
  context.fillRect(
    posX + enemy.x * scale - 10 / 2,
    posY + enemy.y * scale - 10 / 2,
    10,
    10
  );
}

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function outOfMapBounds(x, y) {
  return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
}

function getVCollision(angle) {
  const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2);

  const firstX = right
    ? Math.floor(player.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE
    : Math.floor(player.x / CELL_SIZE) * CELL_SIZE;

  const firstY = player.y + (firstX - player.x) * Math.tan(angle);

  const xA = right ? CELL_SIZE : -CELL_SIZE;
  const yA = xA * Math.tan(angle);

  let wall;
  let nextX = firstX;
  let nextY = firstY;
  while (!wall) {
    const cellX = right
      ? Math.floor(nextX / CELL_SIZE)
      : Math.floor(nextX / CELL_SIZE) - 1;
    const cellY = Math.floor(nextY / CELL_SIZE);

    if (outOfMapBounds(cellX, cellY)) {
      break;
    }
    wall = map[cellY][cellX];
    if (!wall) {
      nextX += xA;
      nextY += yA;
    } else {
    }
  }
  return {
    angle,
    distance: distance(player.x, player.y, nextX, nextY),
    vertical: true,
  };
}

function getHCollision(angle) {
  const up = Math.abs(Math.floor(angle / Math.PI) % 2);
  const firstY = up
    ? Math.floor(player.y / CELL_SIZE) * CELL_SIZE
    : Math.floor(player.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE;
  const firstX = player.x + (firstY - player.y) / Math.tan(angle);

  const yA = up ? -CELL_SIZE : CELL_SIZE;
  const xA = yA / Math.tan(angle);

  let wall;
  let nextX = firstX;
  let nextY = firstY;
  while (!wall) {
    const cellX = Math.floor(nextX / CELL_SIZE);
    const cellY = up
      ? Math.floor(nextY / CELL_SIZE) - 1
      : Math.floor(nextY / CELL_SIZE);

    if (outOfMapBounds(cellX, cellY)) {
      break;
    }

    wall = map[cellY][cellX];
    if (!wall) {
      nextX += xA;
      nextY += yA;
    }
  }
  return {
    angle,
    distance: distance(player.x, player.y, nextX, nextY),
    vertical: false,
  };
}

function castRay(angle) {
  const vCollision = getVCollision(angle);
  const hCollision = getHCollision(angle);

  return hCollision.distance >= vCollision.distance ? vCollision : hCollision;
}

function fixFishEye(distance, angle, playerAngle) {
  const diff = angle - playerAngle;
  return distance * Math.cos(diff);
}

function getRays() {
  const initialAngle = player.angle - FOV / 2;
  const numberOfRays = SCREEN_WIDTH;
  const angleStep = FOV / numberOfRays;
  return Array.from({ length: numberOfRays }, (_, i) => {
    const angle = initialAngle + i * angleStep;
    const ray = castRay(angle);
    return ray;
  });
}

// player x and y movement w/ collision
function movePlayer() {
  const nextX = player.x + Math.cos(player.angle) * player.speedY;
  const nextY = player.y + Math.sin(player.angle) * player.speedY;
  const nextX2 = nextX + Math.cos(player.angle + toRadians(90)) * player.speedX;
  const nextY2 = nextY + Math.sin(player.angle + toRadians(90)) * player.speedX;

  const cellX = Math.floor(nextX / CELL_SIZE);
  const cellY = Math.floor(nextY / CELL_SIZE);
  const cellX2 = Math.floor(nextX2 / CELL_SIZE);
  const cellY2 = Math.floor(nextY2 / CELL_SIZE);

  if (map[cellY][cellX] === 0 && map[cellY2][cellX2] === 0) {
    player.x = nextX;
    player.y = nextY;
    player.x += Math.cos(player.angle + toRadians(90)) * player.speedX;
    player.y += Math.sin(player.angle + toRadians(90)) * player.speedX;
  }
}

// enemy movement
function moveEnemy() {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance > enemy.range && enemy.frozen === false) {
    enemy.x += (dx / distance) * enemy.speed;
    enemy.y += (dy / distance) * enemy.speed;
  } 
  
  // console.log(`enemy coords: ${enemy.x} ${enemy.y}`)
  // console.log(`player coords: ${player.x} ${player.y}`)
}

// when the player looks at the enemy, freeze the enemy
function freezeEnemy() {
  let rotationFix;
  if (player.angle > 2.5) {
    rotationFix = player.angle - 2;
  } else if (player.angle < -2.5) {
    rotationFix = player.angle + 2;
  } else {
    rotationFix = player.angle
  }

  const dx = enemy.x - player.x;
  const dy = enemy.y - player.y;
  const angleToEnemy = Math.atan2(dy, dx);
  const angleDifference = Math.abs(rotationFix - angleToEnemy);

  if (angleDifference < FOV / 2) {
    enemy.speed = 0;
    enemy.frozen = true;
  } else {
    enemy.speed = 1;
    enemy.frozen = false;
  }
  console.log('player angle:', player.angle)
  console.log('rotation fix:', rotationFix)
  console.log('angleToEnemy:', angleToEnemy);
  console.log('angleDifference:', angleDifference);
  console.log('FOV:', FOV);
}

function playerAngleFix() {
  if (player.angle > 6) {
    player.angle = 0;
  } else if (player.angle < -6) {
    player.angle = 0;
  }
}

// add points when enemy is not frozen
function addPoints() {
  if (enemy.frozen === false) {
    player.points += 1;
  }
  console.log(player.points)
}

// render first person view
function renderScene(rays) {
  rays.forEach((ray, i) => {
    const distance = fixFishEye(ray.distance, ray.angle, player.angle);
    const wallHeight = ((CELL_SIZE * 5) / distance) * 277;
    context.fillStyle = ray.vertical ? COLORS.wallDark : COLORS.wall;
    context.fillRect(i, SCREEN_HEIGHT / 2 - wallHeight / 2, 1, wallHeight);
    context.fillStyle = COLORS.floor;
    context.fillRect(
      i,
      SCREEN_HEIGHT / 2 + wallHeight / 2,
      1,
      SCREEN_HEIGHT / 2 - wallHeight / 2
    );
    context.fillStyle = COLORS.ceiling;
    context.fillRect(i, 0, 1, SCREEN_HEIGHT / 2 - wallHeight / 2);

    const stripHeight = ((CELL_SIZE * 5) / distance) * 280;
    const stripSize = 5;

    context.fillStyle = "lightblue";
    context.fillRect(
      i - stripSize / 2,
      SCREEN_HEIGHT / 2 - stripHeight / 2 - stripSize / 2,
      stripSize,
      stripSize
    );
  });

  // render points
  context.font = "16px Arial";
  context.fillStyle = "#0095DD";
  context.fillText(`Points: ${player.points}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT * 0.1);
}

// main loop
function gameLoop() {
  clearScreen();
  movePlayer();
  moveEnemy();
  freezeEnemy();
  playerAngleFix(); // my sanity
  addPoints();
  const rays = getRays();
  renderScene(rays);
  if (miniMapDisplay === true) {
    renderMinimap(0, 0, 0.75, rays);
  }
  
}

// loop speed limiter
setInterval(gameLoop, TICK);

// controls
canvas.addEventListener("click", () => {
  canvas.requestPointerLock();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "w") {
    player.speedY = 2;
  }
  if (e.key === "s") {
    player.speedY = -2;
  }
  if (e.key === "a") {
    player.speedX = -2;
  }
  if (e.key === "d") {
    player.speedX = 2;
  }
  if (e.key === "q") {
    miniMapToggle();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "s") {
    player.speedY = 0;
  }
  if (e.key === "a" || e.key === "d") {
    player.speedX = 0;
  }
});

const mouseSensitivity = 0.05;
document.addEventListener("mousemove", function (event) {
  player.angle += toRadians(event.movementX) * mouseSensitivity;
});

