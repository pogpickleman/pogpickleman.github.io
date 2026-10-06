// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let time = 0;
let deltaTime = 0.01;
const TIMEOFFSET = 100000;

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  let x = noise(time) * width;
  let y = noise(time + TIMEOFFSET) * height;
  fill("black");
  circle(x,y,50);

  time += deltaTime;

}
