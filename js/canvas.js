var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

// context.beginPath();
// context.rect(20,40,50,50);
// context.fillStyle = "red";
// context.fill();
// context.closePath();

// context.beginPath();
// context.arc(240,160,20,Math.PI*2,false);
// context.fillStyle = 'green';
// context.fill();
// context.closePath();
//
// context.beginPath();
// context.rect(160,10,100,40);
// context.strokeStyle = "rgba(0,0,255,0.5)";
// context.stroke();
// context.closePath();

var x = canvas.width/2 ;
var y = canvas.height - 30 ;
var dx = 2 ;
var dy = -2 ;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75 ;
var paddleX = (canvas.width - paddleWidth)/2;
var rightPressed = false ;
var leftPressed = false ;
var gameOver = false ;
var brickRowCount = 3 ;
var brickColumnCount = 5 ;
var brickWidth = 75 ;
var brickHeight = 20 ;
var brickPadding = 10 ;
var brickOffsetTop = 30 ;
var brickOffsetLeft = 30 ;
var score = 0 ;
var lives = 3 ;
var bricks = [];
for( c = 0 ; c < brickColumnCount ; c++ ) {
  bricks[c] = [] ;
  for ( r = 0 ; r < brickRowCount ; r++) {
    bricks[c][r] = {x:0,y:0,status:1};
  }
}

function drawLives() {
  context.font = "16px Arial";
  context.fillStyle = "red" ;
  context.fillText("Lives: "+lives,canvas.width-65,20);
}

function drawScore() {
  context.font = "16px Arial" ;
  context.fillStyle = "#0095DD" ;
  context.fillText("Score: "+score, 8, 20);
}

function drawBricks() {
  for( c = 0 ; c < brickColumnCount ; c++ ) {
    for( r = 0 ; r < brickRowCount ; r++ ) {
      if( bricks[c][r].status === 1) {
        var brickX = c*(brickPadding+brickWidth)+brickOffsetLeft ;
        var brickY = r*(brickPadding+brickHeight)+brickOffsetTop ;
        bricks[c][r].x = brickX ;
        bricks[c][r].y = brickY ;
        context.beginPath();
        context.rect(brickX,brickY,brickWidth,brickHeight);
        context.fillStyle = '#0095DD';
        context.fill();
        context.closePath();
      }
    }
  }
}

function collisionDetection() {
  for( c = 0 ; c < brickColumnCount ; c++ ) {
    for( r = 0 ; r < brickRowCount ; r++ ) {
      var b = bricks[c][r] ;
      if(b.status === 1 && x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
        dy *= -1;
        b.status = 0 ;
        score++;
        if(score === brickRowCount*brickColumnCount) {
          alert("You Win, Congratulations!");
          gameOver = true ;
          document.location.reload();
        }
      }
    }
  }
}
document.addEventListener("keydown",keyDownHandler, false);
document.addEventListener("keyup",keyUpHandler, false);
document.addEventListener("mousemove",mouseMoveHandler, false);
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if( relativeX > paddleWidth/2 && relativeX < canvas.width-paddleWidth/2 ) {
    paddleX = relativeX - paddleWidth/2 ;
  }
}

function keyDownHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = true ;
  }
  else if(e.keyCode == 37) {
    leftPressed = true ;
  }
}
function keyUpHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = false ;
  }
  else if(e.keyCode == 37) {
    leftPressed = false ;
  }
}
function drawBall() {
  context.beginPath();
  context.arc(x,y,ballRadius,0,Math.PI*2);
  context.fillStyle = "#0095DD" ;
  context.fill();
  context.closePath();
}
function drawPaddle() {
  context.beginPath();
  context.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  context.fillStyle = "#0095DD" ;
  context.fill();
  context.closePath();
}
function draw(){
  if (gameOver) {
    return ;
  }
  context.clearRect(0,0,canvas.width,canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx *= -1 ;
  }
  if(y + dy < ballRadius) {
    dy *= -1 ;
  }
  else if(y + dy > canvas.height - ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy *= -1 ;
    }
    else {
      lives--;
      if(!lives) {
        alert("Game Over");
        gameOver = true ;
        document.location.reload();
      }
      else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }
  if(rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }
  if(leftPressed && paddleX > 0) {
    paddleX -= 7 ;
  }
  x += dx ;
  y += dy ;
  requestAnimationFrame(draw);
}
// setInterval(draw,10);
draw();
