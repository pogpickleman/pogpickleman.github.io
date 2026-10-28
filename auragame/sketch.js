
// AURA GAME 2
// IK
// 11/1/2026
//
// Object notation project
// Extra for Experts:
// Using classes to store the player, projectiles, and enemies
// WIP game!

// game states
const MENU = "menu";
const RUNNING = "running";

// player settings
const APPLESPEED = 10;
const PLAYER_MAX_HEALTH = 100;

// enemy spawning settings
const SPAWN_INTERVAL = 2000;
const MAX_SKELETONS = 10;

// enemy types
const ENEMY_TYPES = {
  skeleton: {
    damage: 5,
    speed: 2,
    hitboxSize: 30,
    imageSize: 100,
    damageCooldown: 500
  },

};

let gameState = MENU;

let shina;
let appleImg;
let skeletonImg;
let song;
let font;

let ms = 0;
let lastAppleShot = 0;
let lastSkeletonSpawn = 0;

let playButtonData = {
  x: 0,
  y: 0,
  width: 500,
  height: 250,
  radius: 20,
  colour: "red",
  text: "PLAY"
};

globalThis.players = [];
globalThis.apples = [];
globalThis.skeletons = [];

// load assets
async function loadAssets() {
  shina = await loadImage("assets/imgs/shina.png");
  appleImg = await loadImage("assets/imgs/apple.png");
  skeletonImg = await loadImage("assets/imgs/skeleton.png");

  song = await loadSound("assets/music/title_theme.mp3");
  font = await loadFont("assets/static/NotoSans-Bold.ttf");
  textFont(font);
}

// setup screen
async function setup() {
  createCanvas(windowWidth, windowHeight);

  imageMode(CENTER);
  rectMode(CENTER);

  await loadAssets();

  let player = new Player();
  globalThis.players.push(player);
}

// apple projectile class
class Apple {
  constructor(player) {
    this.pos = createVector(player.pos.x, player.pos.y);
    this.dim = createVector(100, 100);

    this.velocity = createVector(mouseX, mouseY);
    this.velocity.sub(this.pos);
    this.velocity.normalize();
    this.velocity.mult(APPLESPEED);

    this.angle =
      atan2(mouseY - this.pos.y, mouseX - this.pos.x) + HALF_PI;
  }

  move() {
    this.pos.add(this.velocity);

    this.checkCollision();

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    image(appleImg, 0, 0, this.dim.x, this.dim.y);
    pop();

    // remove apple if it leaves the canvas
    if (
      this.pos.x > width + this.dim.x ||
      this.pos.x < -this.dim.x ||
      this.pos.y > height + this.dim.y ||
      this.pos.y < -this.dim.y
    ) {
      let index = globalThis.apples.indexOf(this);

      if (index !== -1) {
        globalThis.apples.splice(index, 1);
      }
    }
  }

  checkCollision() {
    for (let i = globalThis.skeletons.length - 1; i >= 0; i--) {
      let enemy = globalThis.skeletons[i];

      let appleSize = 30;
      let enemySize = enemy.hitboxSize;

      let hit =
        this.pos.x + appleSize / 2 > enemy.pos.x - enemySize / 2 &&
        this.pos.x - appleSize / 2 < enemy.pos.x + enemySize / 2 &&
        this.pos.y + appleSize / 2 > enemy.pos.y - enemySize / 2 &&
        this.pos.y - appleSize / 2 < enemy.pos.y + enemySize / 2;

      if (hit) {
        // remove enemy and apple
        globalThis.skeletons.splice(i, 1);
        let appleIndex = globalThis.apples.indexOf(this);

        if (appleIndex !== -1) {
          globalThis.apples.splice(appleIndex, 1);
        }

        return;
      }
    }
  }

  static updateAll() {
    for (let i = globalThis.apples.length - 1; i >= 0; i--) {
      globalThis.apples[i].move();
    }
  }
}

// player class
class Player {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.dim = createVector(100, 100);
    this.vel = createVector(10, 10);

    this.health = PLAYER_MAX_HEALTH;
    this.lastDamageTime = -Infinity;
  }

  move() {
    if (keyIsDown('a')) {
      this.pos.x -= this.vel.x;
    }
    if (keyIsDown('d')) {
      this.pos.x += this.vel.x;
    }
    if (keyIsDown('w')) {
      this.pos.y -= this.vel.y;
    }
    if (keyIsDown('s')) {
      this.pos.y += this.vel.y;
    }

    // keep player inside the canvas
    this.pos.x = constrain(
      this.pos.x,
      this.dim.x / 2,
      width - this.dim.x / 2
    );

    this.pos.y = constrain(
      this.pos.y,
      this.dim.y / 2,
      height - this.dim.y / 2
    );
  }

  // rotate shina towards mouse
  rotate() {
    let angle =
      atan2(mouseY - this.pos.y, mouseX - this.pos.x) + HALF_PI + 0.1;

    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    image(shina, 0, 0, this.dim.x, this.dim.y);
    pop();

    this.drawHealthBar();
  }

  // health bar for Shina
  drawHealthBar() {
    let barWidth = 70;
    let barHeight = 10;

    let barX = this.pos.x;
    let barY = this.pos.y - this.dim.y / 2 - 5;

    let healthRatio = constrain(
      this.health / PLAYER_MAX_HEALTH,
      0,
      1
    );

    // health bar background
    noStroke();
    fill(80);
    rect(barX, barY, barWidth, barHeight, 3);

    // colours
    if (healthRatio > 0.5) {
      fill(0, 220, 0);
    }
    else if (healthRatio > 0.25) {
      fill(255, 180, 0);
    }
    else {
      fill(255, 0, 0);
    }

    if (healthRatio > 0) {
      rect(
        barX - barWidth / 2 + barWidth * healthRatio / 2,
        barY,
        barWidth * healthRatio,
        barHeight,
        3
      );
    }

    fill(255);
    stroke(0);
    strokeWeight(2);
    textSize(12);
    textAlign(CENTER, CENTER);

    text(
      this.health + " / " + PLAYER_MAX_HEALTH,
      barX,
      barY - 12
    );

    noStroke();
  }

  // receive damage from an enemy
  takeDamage(damage) {
    if (this.health <= 0) {
      return;
    }

    this.health = max(this.health - damage, 0);

    if (this.health <= 0) {
      gameState = MENU;
    }
  }

  // shoot apples
  shoot() {
    if (keyIsDown(' ')) {
      if (ms - lastAppleShot >= 40) {
        lastAppleShot = ms;

        let apple = new Apple(this);
        globalThis.apples.push(apple);
      }
    }
  }

  static updateAll() {
    globalThis.players.forEach((instance) => {
      instance.move();
      instance.rotate();
      instance.shoot();
    });
  }
}

// enemy class
class Enemy {
  constructor(type, image) {
    this.type = type;
    this.settings = ENEMY_TYPES[type];
    this.img = image;

    // spawn from a random edge
    let side = floor(random(4));

    if (side === 0) {
      this.pos = createVector(random(width), 0);
    }
    else if (side === 1) {
      this.pos = createVector(width, random(height));
    }
    else if (side === 2) {
      this.pos = createVector(random(width), height);
    }
    else {
      this.pos = createVector(0, random(height));
    }

    this.dim = createVector(
      this.settings.imageSize,
      this.settings.imageSize
    );

    this.speed = this.settings.speed;
    this.hitboxSize = this.settings.hitboxSize;
    this.damage = this.settings.damage;
    this.damageCooldown = this.settings.damageCooldown;

    this.lastDamageTime = -Infinity;
  }

  move(player) {
    // move towards Shina
    let direction = p5.Vector.sub(player.pos, this.pos);
    direction.normalize();
    direction.mult(this.speed);
    this.pos.add(direction);

    // check collision with shina
    if (this.checkPlayerCollision(player)) {
      return;
    }

    // rotate towards Shina
    let angle =
      atan2(
        player.pos.y - this.pos.y,
        player.pos.x - this.pos.x
      ) + HALF_PI + 0.1;

    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    image(this.img, 0, 0, this.dim.x, this.dim.y);
    pop();
  }

  checkPlayerCollision(player) {
    let playerHitbox = 50;

    let halfEnemy = this.hitboxSize / 2;
    let halfPlayer = playerHitbox / 2;

    let hit =
      this.pos.x + halfEnemy > player.pos.x - halfPlayer &&
      this.pos.x - halfEnemy < player.pos.x + halfPlayer &&
      this.pos.y + halfEnemy > player.pos.y - halfPlayer &&
      this.pos.y - halfEnemy < player.pos.y + halfPlayer;

    if (hit) {
      // deal dmg to shina
      if (ms - this.lastDamageTime >= this.damageCooldown) {
        player.takeDamage(this.damage);
        this.lastDamageTime = ms;
      }

      // eliminate self on impact with shina
      let index = globalThis.skeletons.indexOf(this);

      if (index !== -1) {
        globalThis.skeletons.splice(index, 1);
      }

      return true;
    }

    return false;
  }

  static updateAll() {
    if (globalThis.players.length === 0) {
      return;
    }

    for (let i = globalThis.skeletons.length - 1; i >= 0; i--) {
      globalThis.skeletons[i].move(globalThis.players[0]);
    }
  }
}

// draw loop
function draw() {
  background(255);

  if (gameState === MENU) {
    mainMenu();
  }
  else if (gameState === RUNNING) {
    greenBackdrop();

    ms = millis();

    gameRunning();

    Player.updateAll();
    Apple.updateAll();
    Enemy.updateAll();
  }
}

// main menu
function mainMenu() {
  playButton();
  titleText();
}

// play button 
function playButton() {
  playButtonData.x = windowWidth / 2;
  playButtonData.y = windowHeight / 2;

  fill(playButtonData.colour);
  noStroke();

  rect(
    playButtonData.x,
    playButtonData.y,
    playButtonData.width,
    playButtonData.height,
    playButtonData.radius
  );

  fill("black");
  textSize(100);
  textAlign(CENTER, CENTER);

  text(
    playButtonData.text,
    playButtonData.x,
    playButtonData.y
  );
}

// game title text 
function titleText() {
  fill(255);
  stroke(0);
  strokeWeight(35);
  text("AURA GAME 2", windowWidth/2, windowHeight/2 - 300);
}

// mouse input
function mousePressed() {
  if (
    mouseX > playButtonData.x - playButtonData.width / 2 &&
    mouseX < playButtonData.x + playButtonData.width / 2 &&
    mouseY > playButtonData.y - playButtonData.height / 2 &&
    mouseY < playButtonData.y + playButtonData.height / 2 &&
    gameState === MENU
  ) {
    resetGame();
    gameState = RUNNING;
  }
}

// pause game
function pauseGame() {
}

// reset game
function resetGame() {
  lastAppleShot = 0;

  globalThis.apples = [];
  globalThis.skeletons = [];

  // reset player
  if (globalThis.players.length > 0) {
    let player = globalThis.players[0];

    player.health = PLAYER_MAX_HEALTH;
    player.pos.set(width / 2, height / 2);
    player.lastDamageTime = -Infinity;
  }

  lastSkeletonSpawn = millis();

  let skeleton = new Enemy("skeleton", skeletonImg);
  globalThis.skeletons.push(skeleton);
}

// enemy spawning
function gameRunning() {
  if (ms - lastSkeletonSpawn >= SPAWN_INTERVAL) {
    if (globalThis.skeletons.length < MAX_SKELETONS) {
      let skeleton = new Enemy("skeleton", skeletonImg);
      globalThis.skeletons.push(skeleton);
    }

    lastSkeletonSpawn = ms;
  }
}

// checkerboard background
function greenBackdrop() {
  noStroke();

  for (let y = 0; y < height; y += 50) {
    for (let x = 0; x < width; x += 50) {
      if ((x / 50 + y / 50) % 2 === 0) {
        fill(120, 195, 90);
      }
      else {
        fill(105, 180, 75);
      }

      rect(x, y, 50, 50);
    }
  }
}
