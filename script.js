var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var mousePos = {
  x: 0,
  y: 0,
};

console.log(mousePos);
ctx.lineWidth = "2";

class line {
  constructor(x1, y1, x2, y2) {
    this.a = { x: x1, y: y1 };
    this.b = { x: x2, y: y2 };
    objects.push(this);
  }
  show() {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.stroke();
  }
}
class Circle {
  constructor(x, y, r) {
    this.pos = { x: x, y: y };
    this.r = r;
    this.color = "white";
    objects.push(this);
  }
  show() {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
    // ctx.fillStyle = "white";
    // ctx.fill();
    ctx.stroke();
  }
}
class rayCircle {
  constructor(x, y, r) {
    this.pos = { x: x, y: y };
    this.r = r;
    rayCircles.push(this);
  }
  show() {
    if (this.r > 0) {
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
      // ctx.fillStyle = "white";
      // ctx.fill();
      ctx.stroke();
    }
  }
}
class rayLine {
  constructor(x1, y1, x2, y2, style) {
    this.a = { x: x1, y: y1 };
    this.b = { x: x2, y: y2 };
    rayLines.push(this);
    this.strokeStyle = style;
  }
  show() {
    ctx.strokeStyle = this.strokeStyle;
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.stroke();
  }
}

var objects = [];
var rayCircles = [];
var rayLines = [];
var pointList = [];
var hitList = [];

p1 = new Circle(200, 100, 5);

p2 = new Circle(800, 400, 100);

p3 = new Circle(800, 700, 50);

p4 = new Circle(450, 500, 70);

p5 = new Circle(600, 300, 10);

p6 = new Circle(900, 500, 10);

draw();

class point {
  constructor(a, b) {
    this.pos = {
      x: a,
      y: b,
    };
    pointList.push(this);
  }
}

function draw() {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();
  for (var i = 0; i < objects.length; i++) {
    objects[i].show();
  }
  for (var i = 0; i < rayCircles.length; i++) {
    rayCircles[i].show();
  }
  for (var i = 0; i < rayLines.length; i++) {
    rayLines[i].show();
  }
}

canvas.addEventListener("mousemove", function (e) {
  rayCircles = [];
  hitList = [];
  rayLines = [];
  mousePos.x = e.offsetX;
  mousePos.y = e.offsetY;
  p1.pos.x = mousePos.x;
  p1.pos.y = mousePos.y;
  degrees = 0;
  while (degrees < 2 * Math.PI) {
    march(p1, degrees);
    degrees += (2 * Math.PI) / 3000;
  }
  // march(p1, 0);
  hit(hitList);
  draw();
});

function dist(a, b) {
  x1 = a.x;
  y1 = a.y;
  x2 = b.x;
  y2 = b.y;
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function edgeDist(a, b) {
  return dist(a.pos, b.pos) - b.r;
}

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

function radians_to_degrees(rad) {
  var pi = Math.PI;
  return rad * (180 / pi);
}

function lineDir(origin, dir) {
  rayLines = [];
  x = Math.cos(dir) * 1000000;
  y = Math.sin(dir) * 1000000;
  ray = new rayLine(origin.x, origin.y, x + origin.x, origin.y + y);
}

function Dir(origin, other) {
  x = other.x;
  y = other.y;
  x1 = origin.x;
  y1 = origin.y;
  if ((y) => origin.y) {
    return Math.acos((x - origin.x) / dist(origin, other));
  } else if (other.y <= origin.y) {
    return 2 * Math.PI - Math.acos((x - origin.x) / dist(origin, other));
  }
}

function march(origin, dir) {
  stepSize = edgeDist(origin, objects[getClosest(origin, origin)]);
  raySize = stepSize;
  nextPoint = new point(
    Math.cos(dir) * stepSize + origin.pos.x,
    Math.sin(dir) * stepSize + origin.pos.y
  );

  for (j = 0; j < 40; j++) {
    stepSize = edgeDist(nextPoint, objects[getClosest(p1, nextPoint)]);
    raySize += stepSize;
    // ray = new rayCircle(nextPoint.pos.x, nextPoint.pos.y, stepSize);
    nextPoint.pos.x += Math.cos(dir) * stepSize;
    nextPoint.pos.y += Math.sin(dir) * stepSize;

    if (edgeDist(nextPoint, objects[getClosest(p1, nextPoint)]) < 1) {
      hitList.push(objects[getClosest(p1, nextPoint)]);
      break;
    } else if (nextPoint.pos.x < 0) {
      break;
    } else if (nextPoint.pos.y < 0) {
      break;
    }
  }
  ray = new rayLine(
    origin.pos.x,
    origin.pos.y,
    Math.cos(dir) * raySize + origin.pos.x,
    Math.sin(dir) * raySize + origin.pos.y,
    "rgba(255, 255, 255, 0.05)"
  );
}
function getClosest(origin, pos) {
  minDist = Infinity;
  for (i = 0; i < objects.length; i++) {
    if (origin != objects[i]) {
      if (edgeDist(pos, objects[i]) < minDist) {
        minDist = edgeDist(pos, objects[i]);
        var index = i;
      }
    }
  }
  return index;
}

function hit(hitList) {
  hitList.forEach((element) => {
    element.color = "white";
  });
  objects.forEach((element) => {
    if (hitList.includes(element) === false) {
      element.color = "white";
    }
  });
}
