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
const APPLESPEED = 5;
let gameState = MENU;
let playButtonWidth = 500;
let playButtonHeight = 250;
let playButtonRadius = 20;
let centreX;
let centreY;
let shinaWidth = 100;
let shinaHeight = 100;
let shinaDX = 10;
let shinaDY = 10;
let shina;
let shinaHealth;


let appleX;
let appleY;
let appleHeight = 20;
let appleWidth = 20;

let player;


globalThis.instances = [];

// load assets
async function loadAssets() {
  shina = await loadImage("assets/imgs/shina.png");
  apple = await loadImage("assets/imgs/apple.png");
  song = await loadSound('assets/music/title_theme.mp3');
  font = await loadFont('assets/static/NotoSans-Bold.ttf');
  textFont(font);
  song.play();
}

// setup screen
async function setup() {
  createCanvas(windowWidth, windowHeight);
  loadAssets();
  imageMode(CENTER);
  rectMode(CENTER);

  player = {
    pos: createVector(width/2, height/2)
  };
}

// apple projectile class
class Apple {
  constructor() {
    this.x = player.pos.x;
    this.y = player.pos.y;
    image(apple, this.x, this.y, appleWidth, appleHeight);
  }

  move() {
    image(apple, this.x, this.y, appleWidth, appleHeight);
    // let mouseDir = createVector(mouseX, mouseY).sub(player.pos);
    // mouseDir.setMag(30);
    // let dirOffset = p5.Vector.add(player.pos, mouseDir);
    // apple.dir = mouseDir;
    // apple.dir.setMag(APPLESPEED);
  }
  static updateAll() {
    globalThis.instances.forEach((instance) => {
      instance.move();
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
    Apple.updateAll();
  }
}

// functions for while in the main menu
function mainMenu() {
  playButton();
  titleText();
}

// button to press play and begin game
function playButton() {
  centreX = windowWidth/2;
  centreY = windowHeight/2;
  fill('red');
  noStroke();
  rect(centreX, centreY, playButtonWidth, playButtonHeight, playButtonRadius);
  fill('black');
  textSize(100);
  textAlign(CENTER, CENTER);
  text("PLAY", windowWidth/2, windowHeight/2);
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
    mouseX > centreX - playButtonWidth / 2 &&
    mouseX < centreX + playButtonWidth / 2 &&
    mouseY > centreY - playButtonHeight / 2 &&
    mouseY < centreY + playButtonHeight / 2 &&
    gameState === MENU
  ) {
    gameState = RUNNING;
    shinaHealth = 100;
  }
}

// functions to run during the game
function gameRunning() {
  shinaFunc();
}

// functions for shina
function shinaFunc() {
  shinaMove();
  shinaRotate();
  shinaShoot();
}

// move shina
function shinaMove() {
  if (keyIsDown("a")) {
    player.pos.x -= shinaDX;
  }
  if (keyIsDown("d")) {
    player.pos.x += shinaDX;
  }
  if (keyIsDown("w")) {
    player.pos.y -= shinaDY;
  }
  if (keyIsDown("s")) {
    player.pos.y += shinaDY;
  }
}

// rotate shina towards mouse
function shinaRotate() {
  let angle = atan2(mouseY - player.pos.y, mouseX - player.pos.x) + HALF_PI + 0.1;
  push();
  translate(player.pos.x, player.pos.y);
  rotate(angle);
  image(shina, 0, 0, shinaWidth, shinaHeight);
  pop();
}

// shoot apples
function shinaShoot() {
  if (keyIsDown(" ")) {
    globalThis.instances.push(new Apple);
  }
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


