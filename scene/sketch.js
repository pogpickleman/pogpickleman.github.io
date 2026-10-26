// AURA GAME 2
// IK
// 11/1/2026
//
// Extra for Experts:
// - image manipulations in the shinaRotate() function
// WIP game!

// variables
const MENU = "menu";
const RUNNING = "running";
const APPLESPEED = 10;


let gameState = MENU;
let shina;

let playButtonData = {
  x: 0,
  y: 0,
  width: 500,
  height: 250,
  radius: 20,
  colour: "red",
  text: "PLAY"

}

globalThis.players = [];
globalThis.apples = [];
globalThis.skeletons = [];

// load assets
async function loadAssets() {
  shina = await loadImage("assets/imgs/shina.png");
  appleImg = await loadImage("assets/imgs/apple.png");
  skeletonImg = await loadImage("assets/imgs/skeleton.png");

  song = await loadSound('assets/music/title_theme.mp3');
  font = await loadFont('assets/static/NotoSans-Bold.ttf');
  textFont(font);
  // song.play();
}

// setup screen
async function setup() {
  createCanvas(windowWidth, windowHeight);
  loadAssets();
  imageMode(CENTER);
  rectMode(CENTER);

  await loadAssets();

  let player = new Player();
  globalThis.players.push(player);
  let skeleton = new Skeleton();
  globalThis.skeletons.push(skeleton);
}

// apple projectile class
class Apple {
  constructor(player) {
    this.pos = createVector(player.pos.x, player.pos.y);
    this.dim = createVector(100,100);

    this.mouse = createVector(mouseX, mouseY);
    this.mouse.sub(this.pos);
    this.mouse.normalize();
    this.mouse.mult(APPLESPEED);
    this.angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x) + HALF_PI;

  }

  move() {
    this.pos.add(this.mouse);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    image(appleImg, 0, 0, this.dim.x, this.dim.y);
    pop();


    if (this.pos.x > width + this.dim.x || this.pos.x <= 0 - this.dim.x || this.pos.y >= height + this.dim.y|| this.pos.y <= 0 - this.dim.y) {
      let index = globalThis.apples.indexOf(this);
      globalThis.apples.splice(index, 1);
    }


    // this.target = p5.Vector.sub(mouse, this.pos);
    // this.target.normalize();
    // this.d = p5.Vector.dist(mouse, this.pos);
    // this.pos += this.target * 0.1;
    // image(appleImg, this.pos.x, this.pos.y, this.dim.x, this.dim.y);

    
    // let mouse = createVector(mouseX , mouseY);
    // let dist = mouse.dist(this.pos);
    // let mappedDist = map(dist, 100, 0, 1.5, 0.5);
    // mouse.sub(this.pos);
    // mouse.normalize();
    // mouse.mult(mappedDist);
    // this.pos.add(mouse);
    // image(appleImg, this.pos.x, this.pos.y, this.dim.x, this.dim.y);

  }


  static updateAll() {
    globalThis.apples.forEach((instance) => {
      instance.move();
    });
  }
}

class Player {
  constructor() {
    this.pos = createVector(width/2, height/2);
    this.dim = createVector(100, 100);
    this.vel = createVector(10,10);
    this.health = 0;
  }

  move() {
    if (keyIsDown("a")) {
      this.pos.x -= this.vel.x;
    }
    if (keyIsDown("d")) {
      this.pos.x += this.vel.x;
    }
    if (keyIsDown("w")) {
      this.pos.y -= this.vel.y;
    }
    if (keyIsDown("s")) {
      this.pos.y += this.vel.y;
    }
  }

  // rotate shina towards mouse
  rotate() {
    let angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x) + HALF_PI + 0.1;
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    image(shina, 0, 0, this.dim.x, this.dim.y);
    pop();
  }

  // shoot apples
  shoot() {
    if (keyIsDown(" ")) {
      if (ms - lastAppleShot >= 10) {
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

class Skeleton {
  constructor() {

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

    this.dim = createVector(100, 100);
    this.speed = 2;
  }

  move(player) {
    let direction = p5.Vector.sub(player.pos, this.pos);
    direction.normalize();
    direction.mult(this.speed);
    this.pos.add(direction);


    let angle = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x) + HALF_PI + 0.1;

    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    image(skeletonImg, 0, 0, this.dim.x, this.dim.y);
    pop();
  }

  static updateAll() {
    globalThis.skeletons.forEach((instance) => {

      if (globalThis.players.length > 0) {
        instance.move(globalThis.players[0]);
      }
    });
  }
}


// draw loop
function draw() {


  background(255);
  // check for game states
  if (gameState === MENU) {
    mainMenu();
  }
  else if (gameState === RUNNING) {
    greenBackdrop(); 
    gameRunning();
    Player.updateAll();
    Apple.updateAll();
    Skeleton.updateAll();

  }
}

// functions for while in the main menu
function mainMenu() {
  playButton();
  titleText();
}

// button to press play and begin game
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


  fill('black');
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


function mousePressed() {
  // check if you pressed play
  if (
    mouseX > playButtonData.x - playButtonData.width / 2 &&
    mouseX < playButtonData.x + playButtonData.width / 2 &&
    mouseY > playButtonData.y - playButtonData.width / 2 &&
    mouseY < playButtonData.y + playButtonData.width / 2 &&
    gameState === MENU
  ) {
    gameState = RUNNING;
    resetGame();

  }
}

function pauseGame() {
  
}


function resetGame() {
  shinaHealth = 100;
  time = 0;
  lastAppleShot = 0;

}

// functions to run during the game
function gameRunning() {
  ms = millis();
  console.log(globalThis.apples);
}


// create a checkerboard background
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