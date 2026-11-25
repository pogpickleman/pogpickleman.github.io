
// AURA GAME 2
// IK
// 11/1/2026
//
// 2d Arrays Project
// Extra for Experts:
// budget-and-weight type spawning algorithim in the SpawnEnemies class. 
// WIP game!

// game states
const MENU = "menu";
const RUNNING = "running";

// player settings
const PLAYER_MAX_HEALTH = 100;

// enemy spawning settings
const SPAWN_INTERVAL = 2000;
const MAX_SKELETONS = 10;
const ENEMY_SPAWN_CONFIG = {
  skeleton: { cost: 1, weight: 35, unlockRound: 1, img: () => skeletonImg},
  bat:      { cost: 2, weight: 25, unlockRound: 1, img: () => batImg},
  slime:    { cost: 3, weight: 15, unlockRound: 2, img: () => slimeImg},
  dog:      { cost: 3, weight: 15, unlockRound: 2, img: () => dogImg},
  nurikabe: { cost: 4, weight: 10, unlockRound: 3, img: () => nurikabeImg},
  soldier:  { cost: 6, weight: 10, unlockRound: 4, img: () => soldierImg},
};

// grid for nurikabe
const GRID_SIZE = 50;
let nurikabeGrid = [];
let gridColumns;
let gridRows;

// enemy types
const ENEMY_TYPES = {
  skeleton: {
    damage: 2,
    speed: 1,
    health: 1,
    hitboxSize: 40,
    imageSize: 100,
  },

  bat: {
    damage: 2,
    speed: 2,
    health: 2,
    hitboxSize: 30,
    imageSize: 100,
    abilityCooldown: 500,
    lastAbility: 0,
  },

  soldier: {
    damage: 2,
    speed: 0.5,
    health: 10,
    hitboxSize: 40,
    imageSize: 100,
  },

  slime: {
    damage: 5,
    speed: 0.2,
    health: 3,
    hitboxSize: 30,
    imageSize: 100,
    abilityCooldown: 1000,
    lastAbility: 0,
  },

  dog: {
    damage: 5,
    speed: 0.4,
    health: 3,
    hitboxSize: 30,
    imageSize: 100,
    abilityCooldown: 1000,
    lastAbility: 0,
  },

  nurikabe: {
    damage: 10,
    speed: 3,
    health: 2,
    hitboxSize: 30,
    imageSize: 100,
    abilityCooldown: 500,
    lastAbility: 0,

  },

  worm: {
    damage: 5,
    speed: 2,
    health: 3,
    hitboxSize: 30,
    imageSize: 100,
    abilityCooldown: 1000,
    lastAbility: 0,
  },


};

const PROJECTILES = {
  apple: {
    speed: 10,
    damage: 1,
    delay: 40,
    imageSize: 100,
    bounce: 1,
  }
};

// game variables
let gameState = MENU;
let shina;
let appleImg;
let skeletonImg;
let batImg;
let slimeImg;
let dogImg;
let soldierImg;
let nurikabeImg;

let font;
let holocureTitle;
let playlist;

let ms = 0;
let lastAppleShot = 0;
let lastSkeletonSpawn = 0;
let enemySpawns;

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
globalThis.enemies = [];

// load assets
async function loadAssets() {
  shina = await loadImage("assets/imgs/shina.png");
  appleImg = await loadImage("assets/imgs/apple.png");

  skeletonImg = await loadImage("assets/imgs/skeleton.png");
  batImg = await loadImage("assets/imgs/bat.png");
  soldierImg = await loadImage("assets/imgs/soldier.png");
  dogImg = await loadImage("assets/imgs/dog.png");
  nurikabeImg = await loadImage("assets/imgs/nurikabe.png");
  slimeImg = await loadImage("assets/imgs/slime.png");

  font = await loadFont("assets/static/NotoSans-Bold.ttf");
  textFont(font);

  holocureTitle = await loadSound("assets/music/holocure_title.mp3");
  playlist = [holocureTitle];
}

// setup screen
async function setup() {
  createCanvas(windowWidth, windowHeight);

  imageMode(CENTER);
  rectMode(CENTER);

  await loadAssets();

  let player = new Player();
  globalThis.players.push(player);
  enemySpawns = new SpawnEnemies;
}

// projectile class
class Projectile {
  constructor(type, image, player) {
    this.type = type;
    this.settings = PROJECTILES[type];
    this.img = image;
    this.bounce = this.settings.bounce;
 
    this.dim = createVector(
      this.settings.imageSize,
      this.settings.imageSize
    );

    // determine where the projectile should move
    this.speed = this.settings.speed;
    this.pos = createVector(player.pos.x, player.pos.y);

    this.velocity = createVector(mouseX, mouseY);
    this.velocity.sub(this.pos);
    this.velocity.normalize();
    this.velocity.mult(this.speed);

    this.angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x) + HALF_PI;
  }

  move() {
    // update projectile along angle
    this.pos.add(this.velocity);
    this.checkCollision();

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    image(appleImg, 0, 0, this.dim.x, this.dim.y);
    pop();

    // remove projectile if it leaves the canvas
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
    // check for collision with enemy
    for (let i = globalThis.enemies.length - 1; i >= 0; i--) {
      let enemy = globalThis.enemies[i];
      let thisHit = false;
      let appleSize = 30;
      let enemySize = enemy.hitboxSize;

      let hit =
        this.pos.x + appleSize / 2 > enemy.pos.x - enemySize / 2 &&
        this.pos.x - appleSize / 2 < enemy.pos.x + enemySize / 2 &&
        this.pos.y + appleSize / 2 > enemy.pos.y - enemySize / 2 &&
        this.pos.y - appleSize / 2 < enemy.pos.y + enemySize / 2;

      // deal dmg upon hit and remove if 0 hp
      if (hit) {
        enemy.health -= PROJECTILES.apple.damage;
        let appleIndex = globalThis.apples.indexOf(this);

        if (appleIndex !== -1) {
          globalThis.apples.splice(appleIndex, 1);
          thisHit = true;
        }

        if (globalThis.enemies[i].health <= 0) {
          globalThis.enemies[i].removeFromGrid();
          globalThis.enemies.splice(i, 1);

          if (appleIndex !== -1 && thisHit === false) {
            globalThis.apples.splice(appleIndex, 1);
          }

        }
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
    this.width = 100;
    this.height = 100;
    this.dim = createVector(this.width, this.height);

    this.vel = createVector(10, 10);

    this.health = PLAYER_MAX_HEALTH;
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
      if (ms - lastAppleShot >= PROJECTILES.apple.delay) {
        lastAppleShot = ms;

        let projectile = new Projectile("apple", appleImg, this);
        globalThis.apples.push(projectile);
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
    this.cooldown = this.settings.abilityCooldown;
    this.lastAbility = this.settings.lastAbility;

    // random spawning
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
    this.health = this.settings.health;


    if (this.type === "nurikabe") {
      this.moveCooldown = 250;
      this.lastMove = 0;

      // convert pixels to grid pos
      this.gridX = constrain(round(this.pos.x / GRID_SIZE), 0, gridColumns - 1);
      this.gridY = constrain(round(this.pos.y / GRID_SIZE), 0, gridRows - 1);

      // check if cell is occupied
      if (nurikabeGrid[this.gridY] && nurikabeGrid[this.gridY][this.gridX] === 1) {
        for (let r = 0; r < gridRows; r++) {
          let placed = false;
          for (let c = 0; c < gridColumns; c++) {
            if (nurikabeGrid[r][c] === 0) {
              this.gridX = c;
              this.gridY = r;
              placed = true;
              break;
            }
          }
          if (placed) {
            break;
          }
        }
      }

      // mark cell as occupied
      if (nurikabeGrid[this.gridY]) {
        nurikabeGrid[this.gridY][this.gridX] = 1;
      }
      this.pos.set(this.gridX * GRID_SIZE, this.gridY * GRID_SIZE);
    }

    else if (this.type === "dog") {
      this.speed = this.settings.speed;
      this.baseSpeed = this.settings.speed;
      this.isDogSprinting = false;
    }

  }

  drawSprite(player) {
    // draw enemy img 
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

  move(player) {
    // move enemy towards player
    let direction = p5.Vector.sub(player.pos, this.pos);
    direction.normalize();

    direction.mult(this.speed);
    this.pos.add(direction);

    if (this.checkPlayerCollision(player)) {
      return;
    }

    this.drawSprite(player);
  }

  checkPlayerCollision(player) {
    // check for collisions with player and deal dmg
    let playerHitbox = 50;

    let halfEnemy = this.hitboxSize / 2;
    let halfPlayer = playerHitbox / 2;

    let hit =
      this.pos.x + halfEnemy > player.pos.x - halfPlayer &&
      this.pos.x - halfEnemy < player.pos.x + halfPlayer &&
      this.pos.y + halfEnemy > player.pos.y - halfPlayer &&
      this.pos.y - halfEnemy < player.pos.y + halfPlayer;

    if (hit) {
      player.takeDamage(this.damage);

      let index = globalThis.enemies.indexOf(this);

      if (index !== -1) {
        this.removeFromGrid();
        globalThis.enemies.splice(index, 1);
      }

      return true;
    }
    return false;
  }

  ability(player) {
    if (this.type === "bat") {
      // gain speed and dmg over time
      if (ms - this.lastAbility >= this.cooldown) {
        this.lastAbility = ms;
        this.speed += 0.5;
        this.damage += 0.2;
      }
    }
    else if (this.type === "slime") {
      // teleport behind player
      if (ms - this.lastAbility >= this.cooldown) {
        this.lastAbility = ms;

        let direction = p5.Vector.sub(player.pos, this.pos);
        direction.mult(1.4);

        this.pos.add(direction);
      }
    }
    else if (this.type === "dog") {
      // gain and lose speed boost
      if (ms - this.lastAbility >= this.cooldown) {
        this.lastAbility = ms;
        this.isDogSprinting = !this.isDogSprinting;

        this.speed = this.isDogSprinting
          ? this.baseSpeed * 10
          : this.baseSpeed * 0.4;
      }
    }
  }

  moveNurikabe(player) {
    if (ms - this.lastMove < this.moveCooldown) {
      return;
    }

    // dist from player to self in grid coords
    let playerGridX = round(player.pos.x / GRID_SIZE);
    let playerGridY = round(player.pos.y / GRID_SIZE);
    let dx = playerGridX - this.gridX;
    let dy = playerGridY - this.gridY;

    // move along largest axis
    let directions = [];

    if (abs(dx) > abs(dy)) {
      directions.push([Math.sign(dx), 0]);
      directions.push([0, Math.sign(dy)]);
    }
    else {
      directions.push([0, Math.sign(dy)]);
      directions.push([Math.sign(dx), 0]);
    }

    // check for empty cells 
    for (let direction of directions) {
      let newX = this.gridX + direction[0];
      let newY = this.gridY + direction[1];

      // skip cells that are out of bounds
      if (
        newX < 0 || newX >= gridColumns ||
        newY < 0 || newY >= gridRows
      ) {
        continue;
      }

      // leave previous cell
      if (nurikabeGrid[newY][newX] === 0) {
        nurikabeGrid[this.gridY][this.gridX] = 0;

        // update and claim cell
        this.gridX = newX;
        this.gridY = newY;
        nurikabeGrid[this.gridY][this.gridX] = 1;

        this.pos.set(
          this.gridX * GRID_SIZE,
          this.gridY * GRID_SIZE
        );

        this.lastMove = ms;

        break;
      }
    }
  }

  removeFromGrid() {
    // clear nurikabe from grid
    if (
      this.type === "nurikabe" &&
      nurikabeGrid[this.gridY] &&
      nurikabeGrid[this.gridY][this.gridX] !== undefined
    ) {
      nurikabeGrid[this.gridY][this.gridX] = 0;
    }
  }

  static updateAll() {
    // update enemies with their methods
    if (globalThis.players.length === 0) {
      return;
    }

    let player = globalThis.players[0];
    for (let i = globalThis.enemies.length - 1; i >= 0; i--) {
      let enemy = globalThis.enemies[i];

      if (enemy.type === "nurikabe") {
        enemy.moveNurikabe(player);
        if (globalThis.enemies[i] && !enemy.checkPlayerCollision(player)) {
          enemy.drawSprite(player);
        }
      }
      else {
        enemy.move(player);
      }
      if (globalThis.enemies[i]) {
        globalThis.enemies[i].ability(player);
      }
    }
  }
}

class SpawnEnemies {
  constructor() {
    // wave budget scaling settings
    this.baseBudget = 4;
    this.budgetPerRound = 2;
    this.currentBudget = 0;

    // enemy pacing within rounds
    this.spawnDelay = 500;
    this.lastSpawnTime = 0;

    // wave intervals
    this.waveInterval = 3000; 
    this.lastWave = -3000;  
    this.round = 0;
    this.isSpawning = false;
  }

  wave() {
    // spawn round if none is active
    if (!this.isSpawning && ms - this.lastWave >= this.waveInterval) {
      this.round++;
      this.currentBudget = this.baseBudget + (this.round - 1) * this.budgetPerRound;
      this.isSpawning = true;
    }
    if (this.isSpawning) {
      this.spawnNextEnemy();
    }
  }

  getAffordablePool() {
    const pool = [];

    // only spawn enemies unlocked so far and fit with the budget
    for (const [type, cfg] of Object.entries(ENEMY_SPAWN_CONFIG)) {
      if (this.round >= cfg.unlockRound && cfg.cost <= this.currentBudget) {
        pool.push({ type, ...cfg });
      }
    }

    return pool;
  }

  pickWeightedEnemy(pool) {
    // pick enemy proportionally using cumulative weight subtraction
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    let roll = random(totalWeight);

    for (const item of pool) {
      roll -= item.weight;
      if (roll <= 0) {
        return item;
      }
    }

    // fallback for rounding edge cases
    return pool[pool.length - 1];
  }

  spawnNextEnemy() {
    if (ms - this.lastSpawnTime < this.spawnDelay) {
      return;
    }

    const pool = this.getAffordablePool();

    // end wave when no affordable enemies are left
    if (pool.length === 0) {
      this.isSpawning = false;
      this.lastWave = ms;
      return;
    }

    // create enemy, add to active list and deduct cost and reset spawn timer
    const chosen = this.pickWeightedEnemy(pool);
    const enemy = new Enemy(chosen.type, chosen.img());

    globalThis.enemies.push(enemy);
    this.currentBudget -= chosen.cost;
    this.lastSpawnTime = ms;
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
    Projectile.updateAll();
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
  globalThis.enemies = [];

  // reset player
  if (globalThis.players.length > 0) {
    let player = globalThis.players[0];

    player.health = PLAYER_MAX_HEALTH;
    player.pos.set(width / 2, height / 2);
    player.lastDamageTime = -Infinity;
  }

  lastSkeletonSpawn = millis();
  createNurikabeGrid();
}

// enemy spawning
function gameRunning() {
  enemySpawns.wave();

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

// wip music function
function playMusic() {
  let randomSong = Math.floor(Math.random() * playlist.length);
  let song = playlist[randomSong];
}

function createNurikabeGrid() {
  // make grid dimensions along canvas
  gridColumns = ceil(width / GRID_SIZE) + 1;
  gridRows = ceil(height / GRID_SIZE) + 1;

  nurikabeGrid = [];

  // create empty 2d array
  for (let row = 0; row < gridRows; row++) {
    nurikabeGrid.push([]);
    for (let col = 0; col < gridColumns; col++) {
      nurikabeGrid[row].push(0);
    }
  }
}