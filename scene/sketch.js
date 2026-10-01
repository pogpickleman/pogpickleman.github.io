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

async function setup() {
  createCanvas(windowWidth, windowHeight);
  font = await loadFont('assets/static/NotoSans-Bold.ttf');
  textFont(font);
}

function draw() {
  background(255);

  if (gameState === MENU) {
    playButton();
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
  pressPlay();

}

function pressPlay() {
  if (mouseX > windowWidth/2 && mouseX < windowWidth/2 + playButtonWidth && mouseY > windowHeight/2 && mouseY < windowHeight/2 + playButtonHeight) {
    console.log("hi");
  }



}


