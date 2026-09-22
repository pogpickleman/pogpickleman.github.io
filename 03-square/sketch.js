// Square moving around edge of screen
let x = 0;
let y = 0;
let dx = 5;
let dy = 5;
let mode = 0;
let side = 50;


async function setup() {
}

function draw() {
  createCanvas(windowWidth, windowHeight);

  background(255);
  rect(x,y,side, side);
  moveSquare();
  console.log(mode);
}

function moveSquare() {
  if (mode === 0) {
    x += dx;
    if (x > windowWidth - side) {
      mode = 1;
    }
    if (y > 0) {
      y -= dy;
    }
  }

  else if (mode === 1) {
    y += dy;
    if (y > windowHeight - side) {
      mode = 2;
    }
    if (x < windowWidth - side) {
      x += dx;
    }
  }

  else if (mode === 2) {
    x -= dx;
    if (x < 0) {
      mode = 3;
    }
    if (y < windowHeight - side) {
      y += dy;
    }
  }

  else if (mode === 3) {
    y -= dy;
    if (y < 0) {
      mode = 0;
    }  
    if (x > 0) {
      x += dx;
    }



  }
}