// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const PARTICLES_PER_CLICK = 100;
let firework;
let theFireworks = [];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random(-5,5);
    this.dy = random(-5,5);
    this.ax = random (-0.5, 0.5);
    this.ay = random (-0.5, 0.5);
    this.incx = random(0,1);
    this.incy = random(0,1);


    this.diameter = 10;
    this.r = random(0, 255);
    this.g = random(0, 255);
    this.b = random(0, 255);
    this.opacity = 255;
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b, this. opacity);
    circle(this.x, this.y, this.diameter);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.incx === 0) {
      this.dx += this.ax;
    }
    else {
      this.dx -= this.ax;
    }
    this.dy += this.ay;


    this.opacity--;
  }

  cull() {
    let index = theFireworks.indexOf(this);
    if (this.opacity === 0 ||
      this.x > width ||
      this.x < this.diameter ||
      this.y > height ||
      this.y < this.diameter
    ) {
      if (index !== -1) {
        theFireworks.splice(index, 1);
      }
    }
  }
}


async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background('black');
  for (let firework of theFireworks) {
    firework.display();
    firework.update();
    firework.cull();
  }

  console.log(theFireworks);
}

function mouseDragged() {
  for (let i = 0; i < PARTICLES_PER_CLICK; i ++) {
    let someFirework = new Particle(mouseX, mouseY);
    theFireworks.push(someFirework);
  }
}

function mousePressed() {
  mouseDragged();
}




