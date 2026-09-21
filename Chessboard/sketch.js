let side;

function setup() {
  side = Math.min(windowWidth, windowHeight);
  createCanvas(side, side);
  noStroke();

}

function draw() {
  background(255);
  chessBoard();
}

function chessBoard () {
  for (let i = 0; i < side; i += side/8) {
    for (let j = 0; j < side; j += side/8) {
      
      if ((i + j) % 2 === 1) {
        fill("black");
      }
      else {
        fill("white");
      }  

      rect(i ,j, side/8, side/8);
    }
  }
}