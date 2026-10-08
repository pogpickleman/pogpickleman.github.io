let theRect;
let terrain = [];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  generateTerrain();
}

function draw() {
  background(220);
  stroke("lime");
  fill("lime");

  for (let theRect of terrain) {
    rect(theRect.x, theRect.y, theRect.w, theRect.h);
  }
}

function spawnRectangle(leftSide, rectWidth, rectHeight) {
  let theRect = {
    x: leftSide,
    y: height - rectHeight,
    w: rectWidth,
    h: rectHeight,
  };
  return theRect;
}

function generateTerrain () {
  let theWidth = 0.1; 
  let time = 0;
  let deltaTime = 0.0001;
  for (let i = 0; i < width / theWidth; i++) {
    let theHeight = noise(time) * height;
    let someRect = spawnRectangle(theWidth * i, theWidth, theHeight);
    terrain.push(someRect);
    time += deltaTime;
  }
}