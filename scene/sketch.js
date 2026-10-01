// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
const MENU = "menu";
const RUNNING = "running";
let gameState = MENU;


let playButtonWidth = 500;
let playButtonHeight = 250;
let playButtonRadius = 20;
let centreX;
let centreY;
let mouseDistanceFromPlayButton;
let shinaWidth = 100;
let shinaHeight = 100;
let shinaX;
let shinaY;
let shinaDX = 10;
let shinaDY = 10;
let shinaCenterX = shinaX + shinaWidth/2;
let shinaCenterY = shinaY + shinaHeight/2;
let shina;

async function loadImgs() {
  shina = await loadImage("assets/imgs/shina.png");
}

async function setup() {
  createCanvas(windowWidth, windowHeight);
  font = await loadFont('assets/static/NotoSans-Bold.ttf');
  textFont(font);
  loadImgs();
  shinaX = windowWidth/2 - shinaWidth/2;
  shinaY = windowHeight/2 - shinaHeight/2;
}

function draw() {
  background(255);

  if (gameState === MENU) {
    playButton();
    titleText();
  }
  else if (gameState === RUNNING) {
    gameRunning();
  }

}

function mainMenu() {
  
}


function playButton() {
  centreX = windowWidth/2 - playButtonWidth/2;
  centreY = windowHeight/2 - playButtonHeight/2;
  fill('red');
  noStroke();
  rect(centreX, centreY, playButtonWidth, playButtonHeight, playButtonRadius);
  fill('black');
  textSize(100);
  textAlign(CENTER, CENTER);
  text("PLAY", windowWidth/2, windowHeight/2);

  // mouseDistanceFromPlayButton = dist(centreX + 250, centreY + 125, mouseX, mouseY);
  // console.log(mouseDistanceFromPlayButton);
}

function titleText() {
  fill(255);
  stroke(0);
  strokeWeight(35);
  text("AURA GAME 2", windowWidth/2, windowHeight/2 - 300);
}

function mousePressed() {
  if (mouseX > centreX && mouseX < windowWidth/2 + playButtonWidth/2 && mouseY > centreY && mouseY < windowHeight/2 + playButtonHeight/2) {
    gameState = RUNNING;
  }
}

function gameRunning() {
  shinaFunc();

}

function shinaFunc() {
  image(shina, shinaX, shinaY, shinaWidth, shinaHeight);
  shinaMove();
  shinaRotate();
}

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

function shinaRotate() {
  
}