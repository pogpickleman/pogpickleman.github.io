// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let hit = false;

async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  rectangle =  rect(300, 400, 200, 150);
  myCircle = circle(mouseX, mouseY, 100);

  hit = collideRectCircle(300, 400, 200, 150, mouseX, mouseY, 100);

  if (hit) {
    fill("red");
  }
  else {
    fill("black");
  }
}
