let Pos = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function start(size) {
  var ext = size - Pos.length;
  for (var i = 0; i < Pos.length; i++) {
    for (var j = 0; j < ext; j++) {
      Pos[i].push(0);
    }
  }
  for (var i = 0; i < ext; i++) {
    Pos.push([]);
    for (var j = 0; j < size; j++) {
      Pos[i + 10].push(0);
    }
    var l = 1;
  }
  for (var i = 0; i < Pos.length; i++) {
    for (var j = 0; j < Pos[i].length; j++) {
      var div = document.createElement("div");
      div.classList = "Black";
      div.id = `[${i}][${j}]`;

      document.getElementById("gameArea").appendChild(div);
      l += 1;
    }
  }
}

start(50);

var pixelSize = 15;
document.addEventListener("mousedown", mousedown);
document.addEventListener("mouseup", mouseup);
var mousedownID = -1;

function mousedown() {
  mousedownID = 1;
}

function mouseup() {
  mousedownID = 0;
}

document.getElementById("gameArea").addEventListener("mouseover", function (e) {
  if (mousedownID === 1) {
    click(e.srcElement.id);
  }
});
document.getElementById("gameArea").addEventListener("mousedown", function (e) {
  click(e.srcElement.id);
});

document.getElementById("gameArea").style.height = `${
  Pos[1].length * pixelSize
}px`;
document.getElementById("gameArea").style.width = `${
  Pos[1].length * pixelSize
}px`;
update();

function update() {
  for (var i = 0; i < Pos.length; i++) {
    for (var j = 0; j < Pos[i].length; j++) {
      if (Pos[i][j] === 1) {
        document.getElementById(`[${i}][${j}]`).style.backgroundColor = "Black";
      } else {
        document.getElementById(`[${i}][${j}]`).style.backgroundColor = "White";
      }
    }
  }
}

function click(pos) {
  eval(`Pos${pos} = 1`);
  update();
}

function checkNeighbors(i, j) {
  var count = 0;
  try {
    if (Pos[i][j - 1] === 1) {
      count = count + 1;
    }
  } catch (err) {}
  try {
    if (Pos[i][j + 1] === 1) {
      count = count + 1;
    }
  } catch (err) {}
  try {
    if (Pos[i - 1][j] === 1) {
      count = count + 1;
    }
  } catch (err) {}
  try {
    if (Pos[i + 1][j] === 1) {
      count = count + 1;
    }
  } catch (err) {}
  try {
    if (Pos[i - 1][j - 1] === 1) {
      count = count + 1;
    }
  } catch (err) {}
  try {
    if (Pos[i - 1][j + 1] === 1) {
      count = count + 1;
    }
  } catch (err) {}

  try {
    if (Pos[i + 1][j - 1] === 1) {
      count = count + 1;
    }
  } catch (err) {}
  try {
    if (Pos[i + 1][j + 1] === 1) {
      count = count + 1;
    }
  } catch (err) {}
  return count;
}

function newGen() {
  var deleteListX = [];
  var deleteListY = [];
  var birthListX = [];
  var birthListY = [];
  for (var i = 0; i < Pos.length; i++) {
    for (var j = 0; j < Pos[i].length; j++) {
      if (Pos[i][j] === 0) {
        if (checkNeighbors(i, j) === 3) {
          birthListX.push(i);
          birthListY.push(j);
        }
      } else if (checkNeighbors(i, j) < 2) {
        deleteListX.push(i);
        deleteListY.push(j);
      } else if (checkNeighbors(i, j) > 3) {
        deleteListX.push(i);
        deleteListY.push(j);
      }
    }
  }
  for (var i = 0; i < deleteListX.length; i++) {
    var x = deleteListX[i];
    var y = deleteListY[i];
    Pos[x][y] = 0;
  }
  for (var i = 0; i < birthListX.length; i++) {
    var x = birthListX[i];
    var y = birthListY[i];
    Pos[x][y] = 1;
  }
  update();
}

function play() {
  setInterval(function () {
    newGen();
  }, 100);
}
