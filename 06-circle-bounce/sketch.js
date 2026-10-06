// Object Notation and Arrays Demo
// Bouncing Cirlces

let theCircles = [];
let theCircle;

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  for (let theCircle of theCircles) {
    // move circle
    theCircle.x += theCircle.dx;
    theCircle.y += theCircle.dy;
  
    // bounce of edges
    if (theCircle.x <= theCircle.radius || theCircle.x >= width - theCircle.radius) {
      theCircle.dx *= -1.2;
    }
    if (theCircle.y <= theCircle.radius || theCircle.y >= height - theCircle.radius) {
      theCircle.dy *= -1.2;
    }
  
    // display circle
    noStroke();
    fill(theCircle.r, theCircle.g, theCircle.b);
    circle(theCircle.x, theCircle.y, theCircle.radius);
  }
  if (keyIsDown(" ")) {
    spawnCircle();

  }

}

function mousePressed() {
  spawnCircle();
}


function spawnCircle() {
  let someCircle = {
    x: mouseX,
    y: mouseY,
    dx: random(-5,5),
    dy: random(-5,5),
    radius: random(10,50),
    r: random(0,255),
    g: random(0,255),
    b: random(0,255),
  };
  theCircles.push(someCircle);
}