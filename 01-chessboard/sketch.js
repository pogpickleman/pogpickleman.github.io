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
  for (let i = 0; i < 8; i ++) {
    for (let j = 0; j < 8; j ++) {
      
      if ((i + j) % 2 === 1) {
        fill("black");
      }
      else {
        fill("white")
      }  

      rect(i * side/8 ,j * side/8, side/8, side/8);
    }
  }
}