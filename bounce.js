import { drawBrick } from "./drawBrick.js";

const c1 = document.getElementById("canvas1"),
  ctxB = c1.getContext("2d"), //canvas for ball
  c2 = document.getElementById("canvas2"),
  ctx = c2.getContext("2d"), //canvas for hidden bricks, bat and boundary wall
  c3 = document.getElementById("canvas3"),
  ctxTop = c3.getContext("2d"), //canvas for visible bricks, bat and boundary wall
  container = document.getElementById("container"),
  buttons = document.getElementById("buttons"),
  soundBtn = document.getElementById("sound"),
  startbtn = document.getElementById("start"),
  soundIcon = document.getElementById("soundIcon");

soundBtn.addEventListener("click", soundBtnClick);
startbtn.addEventListener("click", startBtnClick);
window.addEventListener("mousemove", batMove);
window.addEventListener("touchmove", batTouchMove);
window.addEventListener("touchstart", batTouchMove);

ctx.translate(0.5, 0.5);

let size;

const setSize = () => {
  window.innerWidth > window.innerHeight
    ? (size = window.innerHeight * 0.9)
    : (size = window.innerWidth * 0.9);

  container.style.width = container.style.height = `${size}px`;

  c1.style.width = c2.style.width = c3.style.width = c1.style.height = c2.style.height = c3.style.height =
    "100%";

  if (window.innerWidth < size + 140) {
    buttons.style.flexDirection = "row";
  } else {
    buttons.style.flexDirection = "column";
  }
};

setSize();
window.onresize = setSize;

let x = Math.random() * 200 + 20;
let y = 300; //ball co-ordinates
let r = 6; //ball radius
let speed = 2; //ball speed
let xDir = speed;
let yDir = speed;
let rows = 9; //brick rows
let boundary = 14; //boundary wall width
let brickWidth = (600 - boundary * 2) / 12;
let brickHeight = brickWidth / 2.4;
let wallTop = brickHeight * 3;
let batX = 300;

let soundOn = true;

let beep1 = document.getElementById("beep1");
let beep2 = document.getElementById("beep2");
let beepFail = document.getElementById("beepFail");
let beepSuccess = document.getElementById("beepSuccess");

function beep1Play() {
  beep1.currentTime = 0;
  beep1.play();
}

function beep2Play() {
  beep2.currentTime = 0;
  beep2.play();
}

function beepFailPlay() {
  beepFail.currentTime = 0;
  beepFail.play();
}

function beepSuccessPlay() {
  beepSuccess.currentTime = 0;
  beepSuccess.play();
}

//hidden boundary wall (red)
ctx.beginPath();
ctx.strokeStyle = "rgba(255, 0, 0, 1";
ctx.lineWidth = "6";
ctx.moveTo(boundary - 3, 600 - boundary * 2);
ctx.lineTo(boundary - 3, boundary - 3);
ctx.lineTo(600 - (boundary - 3), boundary - 3);
ctx.lineTo(600 - (boundary - 3), 600 - boundary * 2);
ctx.stroke();

//visible boundary wall (white)
ctxTop.beginPath();
ctxTop.strokeStyle = "rgba(255, 255, 255, 1)";
ctxTop.lineCap = "round";
ctxTop.lineWidth = boundary;
ctxTop.moveTo(boundary / 2, 600 - boundary * 2);
ctxTop.lineTo(boundary / 2, boundary / 2);
ctxTop.stroke();
ctxTop.beginPath();
ctxTop.moveTo(boundary / 2, boundary / 2);
ctxTop.lineTo(600 - boundary / 2, boundary / 2);
ctxTop.stroke();
ctxTop.beginPath();
ctxTop.moveTo(600 - boundary / 2, boundary / 2);
ctxTop.lineTo(600 - boundary / 2, 600 - boundary * 2);
ctxTop.stroke();

drawBat();

let bricks;

class Brick {
  constructor(x, y, width, height, index, hit = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.index = index;
    this.hit = hit;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function drawBricks() {
  bricks = [];
  let index = 1;
  let i = 0.00392; //RGBa transparency
  for (let row = 0; row < rows; row++) {
    let color = {
      main: `hsl(${row * 30}, 100%, 40%)`,
      left: `hsl(${row * 30}, 100%, 60%)`,
      top: `hsl(${row * 30}, 100%, 70%)`,
      right: `hsl(${row * 30}, 100%, 30%)`,
      bottom: `hsl(${row * 30}, 100%, 20%)`
    };
    for (let n = boundary; n < 600 - boundary * 2; n = n + brickWidth) {
      ctx.fillStyle = `rgba(0, 255, 0, ${i})`; //green hidden bricks, variable transparency
      drawHiddenBrick(n, row);
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
      await sleep(20);
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
  ctx.strokeStyle = "#000";
  ctx.lineWidth = "2";
  ctx.moveTo(n, wallTop + row * brickHeight);
  ctx.lineTo(n + brickWidth, wallTop + row * brickHeight);
  ctx.lineTo(n + brickWidth, wallTop + row * brickHeight + brickHeight);
  ctx.lineTo(n, wallTop + row * brickHeight + brickHeight);
  ctx.closePath();
  ctx.stroke();
}

function drawBall() {
  ctxB.beginPath();
  ctxB.fillStyle = "#fff";
  ctxB.arc(x, y, r, 0, 2 * Math.PI);
  ctxB.fill();
}

function check(x, y, r) {
  let leftData = ctx.getImageData(x - (r + 1), y - 2, 1, 4).data;
  let left = [];
  for (let n = 0; n < leftData.length; n = n + 4) {
    left.push(leftData.slice(n, n + 3).toString());
    left.push(leftData.slice(n + 3, n + 4).toString());
  }
  let rightData = ctx.getImageData(x + (r + 1), y - 2, 1, 4).data;
  let right = [];
  for (let n = 0; n < rightData.length; n = n + 4) {
    right.push(rightData.slice(n, n + 3).toString());
    right.push(rightData.slice(n + 3, n + 4).toString());
  }
  let aboveData = ctx.getImageData(x - 2, y - (r + 1), 4, 1).data;
  let above = [];
  for (let n = 0; n < aboveData.length; n = n + 4) {
    above.push(aboveData.slice(n, n + 3).toString());
    above.push(aboveData.slice(n + 3, n + 4).toString());
  }
  let belowData = ctx.getImageData(x - 2, y + (r + 1), 4, 1).data;
  let below = [];
  for (let n = 0; n < belowData.length; n = n + 4) {
    below.push(belowData.slice(n, n + 3).toString());
    below.push(belowData.slice(n + 3, n + 4).toString());
  }
  return { left, right, above, below };
}

function gameLoop() {
  moveBall();
  drawBat();
  if (y > 650) {
    soundOn ? beepFailPlay() : null;
    clearInterval(loop);
  }
}

function moveBall() {
  ctxB.beginPath();
  ctxB.clearRect(x - (r + 2), y - (r + 2), r * 3, r * 3);
  x = x + xDir;
  y = y + yDir;
  drawBall();

  let checked = check(x, y, r);

  if (yDir > 0) {
    if (checked.below.includes("255,0,0")) {
      soundOn ? beep2Play() : null;
      yDir = yDir * -1;
      if (x > batX - 50 - r && x < batX - 50 + r && xDir > 0) {
        //left end-of-bat bounce
        xDir = xDir * -1;
        return;
      }
      if (x > batX + 50 - r && x < batX + 50 + r && xDir < 0) {
        //right end-of-bat bounce
        xDir = xDir * -1;
        return;
      }
    }
    if (
      checked.below.includes("0,255,0") ||
      checked.below.includes("0,254,0") // 254 included for weird Firefox bug
    ) {
      hitBrick(check(x, y, r).below);
      yDir = yDir * -1;
    }
  }
  if (yDir < 0) {
    if (checked.above.includes("255,0,0")) {
      yDir = yDir * -1;
    }
    if (
      checked.above.includes("0,255,0") ||
      checked.above.includes("0,254,0")
    ) {
      hitBrick(check(x, y, r).above);
      yDir = yDir * -1;
    }
  }
  if (xDir < 0) {
    if (checked.left.includes("255,0,0")) {
      xDir = xDir * -1;
    }
    if (checked.left.includes("0,255,0") || checked.left.includes("0,254,0")) {
      hitBrick(check(x, y, r).left);
      xDir = xDir * -1;
    }
  }
  if (xDir > 0) {
    if (checked.right.includes("255,0,0")) {
      xDir = xDir * -1;
    }
    if (
      checked.right.includes("0,255,0") ||
      checked.right.includes("0,254,0")
    ) {
      hitBrick(check(x, y, r).right);
      xDir = xDir * -1;
    }
  }
}

function hitBrick(checkArray) {
  soundOn ? beep1Play() : null;
  for (let brick of bricks) {
    if (checkArray.includes(`${brick.index}`)) {
      ctx.clearRect(
        brick.x - 1,
        brick.y - 1,
        brick.width + 2,
        brick.height + 2
      );
      ctxTop.clearRect(brick.x, brick.y - 1, brick.width, brick.height + 2);
      brick.hit = true;
      bricks = bricks.filter(function(b) {
        return b.hit == false;
      });
    }
  }
  if (bricks.length == 0) {
    ctxB.clearRect(0, 0, c3.width, c3.height);
    clearInterval(loop);
    soundOn ? beepSuccessPlay() : null;
    startBtnClick();
  }
}

function drawBat() {
  ctx.clearRect(brickHeight, 562, c1.width - brickHeight * 2, 16);
  ctx.lineWidth = "13";
  ctxTop.clearRect(brickHeight, 562, c1.width - brickHeight * 2, 16);
  ctxTop.lineWidth = "15";

  ctx.beginPath();
  ctx.moveTo(batX - 50, 570);
  ctx.strokeStyle = "#f00"; //red hidden bat
  ctx.lineCap = "round";
  ctx.lineTo(batX + 50, 570);
  ctx.stroke();
  ctxTop.beginPath();
  ctxTop.moveTo(batX - 50, 570);
  ctxTop.strokeStyle = "#fff"; //white visible bat
  ctxTop.lineCap = "round";
  ctxTop.lineTo(batX + 50, 570);
  ctxTop.stroke();
}

function batMove(e) {
  let mouseX = getMousePos(c3, e).x;
  if (mouseX > 29 && mouseX < 471) {
    batX = mouseX + 50;
  }
}

function batTouchMove(e) {
  e.preventDefault();
  if (e.targetTouches.length == 1) {
    let touch = e.targetTouches[0];
    let touchX = getMousePos(c3, touch).x;
    if (touchX > 79 && touchX < 521) {
      batX = touchX;
    }
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY
  };
}

function soundBtnClick() {
  soundOn = !soundOn;
  soundIcon.classList.toggle("fa-volume-up");
  soundIcon.classList.toggle("fa-volume-mute");
}

async function startBtnClick() {
  ctxTop.clearRect(boundary, boundary, c3.width - boundary * 2, c3.height);
  ctx.clearRect(boundary, boundary, c2.width - boundary * 2, c2.height);
  batX = 300;
  drawBat();
  await drawBricks();
  x = Math.random() * 200 + 20;
  y = 300;
  xDir = speed;
  yDir = speed;
  window.loop = setInterval(gameLoop, 0);
}
