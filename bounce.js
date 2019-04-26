import { drawBrick } from "./drawBrick.js";

let c1 = document.getElementById("canvas1");
let ctxB = c1.getContext("2d");
let c2 = document.getElementById("canvas2");
let ctx = c2.getContext("2d");
let c3 = document.getElementById("canvas3");
let ctxTop = c3.getContext("2d");

let x = 60;
let y = 200;
let r = 6;
let xDir = 1;
let yDir = 1;
let rows = 6;
let brickWidth = (c1.width - 8) / 12;
let brickHeight = 20;
let wallTop = 50;
let batX = 200;

let color = {
  main: `hsl(200, 100%, 40%)`,
  left: `hsl(200, 100%, 60%)`,
  top: `hsl(200, 100%, 70%)`,
  right: `hsl(200, 100%, 30%)`,
  bottom: `hsl(200, 100%, 20%)`
};

document.addEventListener("mousemove", batMove);

ctx.beginPath();
ctx.strokeStyle = "#f00";
ctx.lineWidth = "6";
ctx.moveTo(0, 0);
ctx.lineTo(0, 600);
ctx.lineTo(600, 600);
ctx.lineTo(600, 0);
ctx.closePath();
ctx.stroke();

let bricks = [];
function Brick(x, y, width, height, index, hit = false) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.index = index;
  this.hit = hit;
}

function drawBricks() {
  let index = 1;
  let i = 0.00392;
  for (let row = 0; row < rows; row++) {
    for (let n = 4; n < 550; n = n + brickWidth) {
      ctx.fillStyle = `rgba(0,255,0,${i})`;
      drawHiddenBrick(n, row, index);
      drawBrick(
        ctxTop,
        n,
        wallTop + row * brickHeight,
        brickWidth,
        brickHeight,
        3,
        color
      );
      i = i + 0.00392;
      let b = new Brick();
      b.x = n;
      b.y = wallTop + row * brickHeight;
      b.width = brickWidth;
      b.height = brickHeight;
      b.index = index;
      bricks.push(b);
      index = index + 1;
    }
  }
}

function drawHiddenBrick(n, row) {
  ctx.beginPath();
  ctx.moveTo(n, wallTop + row * brickHeight);
  ctx.lineTo(n + brickWidth, wallTop + row * brickHeight);
  ctx.lineTo(n + brickWidth, wallTop + row * brickHeight + brickHeight);
  ctx.lineTo(n, wallTop + row * brickHeight + brickHeight);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.lineWidth = "1";
  ctx.moveTo(n, wallTop + row * brickHeight);
  ctx.lineTo(n + brickWidth, wallTop + row * brickHeight);
  ctx.lineTo(n + brickWidth, wallTop + row * brickHeight + brickHeight);
  ctx.lineTo(n, wallTop + row * brickHeight + brickHeight);
  ctx.closePath();
  ctx.stroke();
}

function drawBall() {
  ctxB.beginPath();
  ctxB.fillStyle = "#00f";
  ctxB.arc(x, y, r, 0, 2 * Math.PI);
  ctxB.fill();
}

function check(x, y, r) {
  let leftData = ctx.getImageData(x - (r + 1), y - r / 2, 1, r).data;
  let left = [];
  for (let n = 0; n < leftData.length; n = n + 4) {
    left.push(leftData.slice(n, n + 3).toString());
    left.push(leftData.slice(n + 3, n + 4).toString());
  }
  let rightData = ctx.getImageData(x + (r + 1), y - r / 2, 1, r).data;
  let right = [];
  for (let n = 0; n < rightData.length; n = n + 4) {
    right.push(rightData.slice(n, n + 3).toString());
    right.push(rightData.slice(n + 3, n + 4).toString());
  }
  let aboveData = ctx.getImageData(x - r / 2, y - (r + 1), r, 1).data;
  let above = [];
  for (let n = 0; n < aboveData.length; n = n + 4) {
    above.push(aboveData.slice(n, n + 3).toString());
    above.push(aboveData.slice(n + 3, n + 4).toString());
  }
  let belowData = ctx.getImageData(x - r / 2, y + (r + 1), r, 1).data;
  let below = [];
  for (let n = 0; n < belowData.length; n = n + 4) {
    below.push(belowData.slice(n, n + 3).toString());
    below.push(belowData.slice(n + 3, n + 4).toString());
  }
  return { left, right, above, below };
}

function moveBall() {
  drawBat();
  ctxB.beginPath();
  ctxB.clearRect(x - r, y - r, r * 2, r * 2);
  x = x + xDir;
  y = y + yDir;
  drawBall();

  if (yDir > 0) {
    if (check(x, y, r).below.includes("255,0,0")) {
      yDir = yDir * -1;
      if (x > batX - r && x < batX + r * 2 && xDir > 0) {
        xDir = xDir * -1;
        return;
      }
      if (x > batX + 100 - r * 2 && x < batX + 100 + r && xDir < 0) {
        xDir = xDir * -1;
        return;
      }
    }
    if (check(x, y, r).below.includes("0,255,0")) {
      hitBrick(check(x, y, r).below);
      yDir = yDir * -1;
    }
  }
  if (yDir < 0) {
    if (check(x, y, r).above.includes("255,0,0")) {
      yDir = yDir * -1;
    }
    if (check(x, y, r).above.includes("0,255,0")) {
      hitBrick(check(x, y, r).above);
      yDir = yDir * -1;
    }
  }
  if (xDir < 0) {
    if (check(x, y, r).left.includes("255,0,0")) {
      xDir = xDir * -1;
    }
    if (check(x, y, r).left.includes("0,255,0")) {
      hitBrick(check(x, y, r).left);
      xDir = xDir * -1;
    }
  }
  if (xDir > 0) {
    if (check(x, y, r).right.includes("255,0,0")) {
      xDir = xDir * -1;
    }
    if (check(x, y, r).right.includes("0,255,0")) {
      hitBrick(check(x, y, r).right);
      xDir = xDir * -1;
    }
  }
}

function hitBrick(checkArray) {
  for (let brick of bricks) {
    if (checkArray.includes(`${brick.index}`)) {
      ctx.clearRect(brick.x, brick.y, brick.width, brick.height);
      ctxTop.clearRect(brick.x, brick.y, brick.width, brick.height);
      brick.hit = true;
      bricks = bricks.filter(function(b) {
        return b.hit == false;
      });
    }
  }
}

function drawBat() {
  ctx.clearRect(3, 562, 594, 16);
  ctx.lineWidth = "15";

  ctx.beginPath();
  ctx.moveTo(batX, 570);
  ctx.strokeStyle = "rgb(255,0,0)";
  ctx.lineCap = "round";
  ctx.lineTo(batX + 100, 570);
  ctx.stroke();
}

function batMove(event) {
  if (event.clientX > 6 && event.clientX < 494) {
    batX = event.clientX;
  }
}

c2.addEventListener("click", e => {
  console.log(ctx.getImageData(e.clientX + 10, e.clientY + 10, 1, 1).data);
});

drawBricks();
drawBat();
drawBall();

setInterval(moveBall, 0);
