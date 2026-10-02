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
let gameState = MENU;
let playButtonWidth = 500;
let playButtonHeight = 250;
let playButtonRadius = 20;
let centreX;
let centreY;
let shinaWidth = 100;
let shinaHeight = 100;
let shinaX;
let shinaY;
let shinaDX = 10;
let shinaDY = 10;
let shina;

// load assets
async function loadAssets() {
  shina = await loadImage("assets/imgs/shina.png");
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
  shinaX = windowWidth/2
  shinaY = windowHeight/2
}

function draw() {
  background(255);
  // check for game states
  if (gameState === MENU) {
    mainMenu();
  }
  else if (gameState === RUNNING) {
    greenBackdrop(); 
    gameRunning();
  }
}

// functions for while in the main menu
function mainMenu() {
  playButton();
  titleText();
}

// button to press play and begin game
function playButton() {
  centreX = windowWidth/2
  centreY = windowHeight/2
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
    mouseY < centreY + playButtonHeight / 2
  ) {
    gameState = RUNNING;
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
}

// move shina
function shinaMove() {
  if (keyIsDown("a")) {
    shinaX -= shinaDX;
  }
  if (keyIsDown("d")) {
    shinaX += shinaDX;
  }
  if (keyIsDown("w")) {
    shinaY -= shinaDY;
  }
  if (keyIsDown("s")) {
    shinaY += shinaDY;
  }
}

// rotate shina towards mouse
function shinaRotate() {
  let angle = atan2(mouseY - shinaY, mouseX - shinaX) + HALF_PI + 0.1;
  push();
  translate(shinaX, shinaY);
  rotate(angle);
  image(shina, 0, 0, shinaWidth, shinaHeight)
  pop();
}

// create a checkerboard background
function greenBackdrop() {
  noStroke();
  for (let y = 0; y < height; y += 50) {
        for (let x = 0; x < width; x += 50) {
      if ((x / 50 + y / 50) % 2 === 0) {
        fill(120, 195, 90); 
      } else {
        fill(105, 180, 75); 
      }
      rect(x, y, 50, 50);
    }
  }
}


