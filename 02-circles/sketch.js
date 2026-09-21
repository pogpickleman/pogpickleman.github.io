// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


async function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  makeRandomCircles();
}

function makeRandomCircles() {
  let x = random(0, windowWidth);
  let y = random(0, windowHeight);
  let diameter = random(0,250);
  fill(random(255), random(255), random(255));
  circle(x,y, diameter);
}