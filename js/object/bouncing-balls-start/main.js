// 设置画布

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// 生成随机数的函数

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

// 生成随机颜色值的函数

function randomColor() {
  const color =
    "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")";
  return color;
}

// 定义 Ball 构造器

function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

// 定义彩球绘制函数

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// 定义彩球更新函数

Ball.prototype.update = function () {
  // 在每种情况下，我们都会加上小球的半径，因为 x/y 坐标是小球中心的坐标，我们希望小球在其边界接触浏览器窗口的边界时反弹，而不是小球的一部分都不见了再返回。
  // 检查小球的 x 坐标是否大于画布的宽度（小球会从右边缘离开）
  if (this.x + this.size >= width) {
    this.velX = -this.velX;
  }
  // 检查小球的 x 坐标是否小于 0（小球会从左边缘离开）
  if (this.x - this.size <= 0) {
    this.velX = -this.velX;
  }
  // 检查小球的 y 坐标是否大于画布的高度（小球会从下边缘离开）
  if (this.y + this.size >= height) {
    this.velY = -this.velY;
  }
  // 检查小球的 y 坐标是否小于 0（小球会从上边缘离开）
  if (this.y - this.size <= 0) {
    this.velY = -this.velY;
  }
  // 我们将 velX 的值加到 x 的坐标上，将 velY 的值加到 y 坐标上 —— 每次调用这个方法的时候小球就移动这么多。
  this.x += this.velX;
  this.y += this.velY;
};

// 定义碰撞检测函数

Ball.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;

      const distance = Math.sqrt(dx * dx + dy * dy);
      // 检测两个小球是否相撞了，两个小球中心的距离是否小于两个小球的半径之和。
      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = randomColor();
      }
    }
  }
};

// 定义一个数组，生成并保存所有的球

let balls = [];
const ballNumber = 100;

while (balls.length < ballNumber) {
  const size = random(10, 20);
  let ball = new Ball(
    // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size
  );
  balls.push(ball);
}

// 定义一个循环来不停地播放
// 几乎所有的动画效果都会用到一个运动循环，也就是每一帧都自动更新视图。
function loop() {
  ctx.fillStyle = "rgba(0,0,0,0.25)"; //将整个画布的颜色设置成半透明的黑色。
  // fillRect用途：这是在下一个视图画出来时用来遮住之前的视图的。如果不这样做得话，你就会在屏幕上看到一条蛇的形状而不是小球的运动了。用来填充的颜色设置成半透明的rgba(0,0,0,0.25)，也就是让之前的视图留下来一点点，从而你可以看到小球运动时的轨迹。如果你将 0.25 设置成 1 时，你就完全看不到了。
  ctx.fillRect(0, 0, width, height); //画出一个填充满整个画布的矩形。

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }
  // 当一个函数正在运行时传递相同的函数名，从而每隔一小段时间都会运行一次这个函数，这样我们可以得到一个平滑的动画效果。这主要是通过递归完成的 —— 也就是说函数每次运行的时候都会调用自己，从而可以一遍又一遍得运行。
  requestAnimationFrame(loop);
}

loop();
