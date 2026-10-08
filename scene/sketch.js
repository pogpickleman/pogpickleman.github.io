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
const PLAYBUTTONWIDTH = 500;
const PLAYBUTTONHEIGHT = 250;
const PLAYBUTTONRADIUS = 20;
let gameState = MENU;

let centreX;
let centreY;
let shina;

let apple = {
  x: undefined,
  y: undefined,
  h: 20,
  w: 20,
  img: undefined,
};

globalThis.instances = [];

// load assets
async function loadAssets() {
  shina = await loadImage("assets/imgs/shina.png");
  apple.img = await loadImage("assets/imgs/apple.png");
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

  player = new Player();
  globalThis.instances.push(player);

}

// apple projectile class
class Apple {
  constructor() {
    this.x = player.pos.x;
    this.y = player.pos.y;
    image(apple.img, this.x, this.y, apple.w, apple.h);
  }

  move() {
    image(apple.img, this.x, this.y, apple.w, apple.h);
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

class Player {
  constructor() {
    this.pos = createVector(width/2, height/2);
    this.width = 100;
    this.height = 100;
    this.dx = 10;
    this.dy = 10;
    this.health = 0;
  }

  move() {
    if (keyIsDown("a")) {
      this.pos.x -= this.dx;
    }
    if (keyIsDown("d")) {
      this.pos.x += this.dx;
    }
    if (keyIsDown("w")) {
      this.pos.y -= this.dy;
    }
    if (keyIsDown("s")) {
      this.pos.y += this.dy;
    }
  }

  // rotate shina towards mouse
  rotate() {
    let angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x) + HALF_PI + 0.1;
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    image(shina, 0, 0, this.width, this.height);
    pop();
  }


  static updateAll() {
    globalThis.instances.forEach((instance) => {
      instance.move();
      instance.rotate();
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
    Player.updateAll();
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
  rect(centreX, centreY, PLAYBUTTONWIDTH, PLAYBUTTONHEIGHT, PLAYBUTTONRADIUS);
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
    mouseX > centreX - PLAYBUTTONWIDTH / 2 &&
    mouseX < centreX + PLAYBUTTONWIDTH / 2 &&
    mouseY > centreY - PLAYBUTTONHEIGHT / 2 &&
    mouseY < centreY + PLAYBUTTONHEIGHT / 2 &&
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
  shinaShoot();
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


