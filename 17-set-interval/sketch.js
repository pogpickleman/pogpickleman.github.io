// window.setInterval demo
// change the colour of a circle every half second


let theColor;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  window.setInterval(changeColor, 0);
  noStroke();

}

function draw() {
  background(220);

  fill(theColor);
  circle(width/2, height/2 , 400);
}

function changeColor() {
  theColor = color(random(255), random(255), random(255));
}