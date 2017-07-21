var _this = this;
var canvas = document.querySelector("#myCanvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var colours = ["#ff6138", "#ffff9d", "#beeb9f", "#79bd8f", "#00a388", "#ff9ddb"];
var balls = [];
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var reqAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var Ball = (function () {
    function Ball(xPos, yPos, colour, xVelocity, yVelocity, radius) {
        var _this = this;
        this.update = function () {
            context.beginPath();
            var radius = _this.radius;
            var sAngle = 0;
            var eAngle = Math.PI * 2;
            var counterclockwise = false;
            var gravity = 0.2;
            var bounce = 0.63 * (30 / (radius + 15));
            var traction = 0.8;
            if (_this.xPos + radius >= canvas.width) {
                _this.xVelocity = -_this.xVelocity * bounce;
                _this.xPos = canvas.width - radius;
            }
            else if (_this.xPos - radius <= 0) {
                _this.xVelocity = -_this.xVelocity * bounce;
                _this.xPos = radius;
            }
            if (_this.yPos + radius >= canvas.height) {
                _this.yVelocity = -_this.yVelocity * bounce;
                _this.yPos = canvas.height - radius;
                _this.xVelocity *= traction;
            }
            else if (_this.yPos - radius <= 0) {
                _this.yVelocity = -_this.yVelocity * bounce;
                _this.yPos = radius;
            }
            _this.yVelocity += gravity;
            _this.xPos += _this.xVelocity;
            _this.yPos += _this.yVelocity;
            var xPos = _this.xPos;
            var yPos = _this.yPos;
            context.arc(xPos, yPos, radius, sAngle, eAngle, counterclockwise);
            context.closePath();
            context.fillStyle = _this.colour;
            context.fill();
        };
        this.radius = radius;
        this.speed = 10;
        this.xPos = xPos;
        this.yPos = yPos;
        this.colour = colour;
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;
    }
    return Ball;
}());
var Line = (function () {
    function Line(xLineStart, yLineStart, xLineEnd, yLineEnd) {
        var _this = this;
        this.drawLine = function () {
            context.beginPath();
            context.moveTo(_this.xLineStart, _this.yLineStart);
            context.lineTo(_this.xLineEnd, _this.yLineEnd);
            context.lineWidth = 2;
            context.strokeStyle = "rgba(255,255,255,0.25)";
            context.stroke();
        };
        this.xLineStart = xLineStart;
        this.yLineStart = yLineStart;
        this.xLineEnd = xLineEnd;
        this.yLineEnd = yLineEnd;
    }
    return Line;
}());
function addNewBall(xPos, yPos, xVelocity, yVelocity) {
    var colour = colours[randomIntFromInterval(0, colours.length)];
    var radius = document.getElementById('randomBallSize').checked ? randomIntFromInterval(5, 15) : 10;
    var ball = new Ball(xPos, yPos, colour, xVelocity, yVelocity, radius);
    balls.push(ball);
}
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
document.getElementById("myCanvas").addEventListener("click", function (e) {
    var xPos = e.clientX;
    var yPos = e.clientY;
    var xVelocity = randomIntFromInterval(-10, 10);
    var yVelocity = randomIntFromInterval(-10, 10);
    if (!document.getElementById("slingshot").checked) {
        addNewBall(xPos, yPos, xVelocity, yVelocity);
    }
});
var xPosStart, yPosStart;
var xLineStart, yLineStart;
var line = null;
var startLine = false;
document.getElementById("myCanvas").addEventListener("mousedown", function (e) {
    _this.xPosStart = e.clientX;
    _this.yPosStart = e.clientY;
    xLineStart = e.clientX;
    yLineStart = e.clientY;
    startLine = true;
});
document.getElementById("myCanvas").addEventListener("mousemove", function (e) {
    if (document.getElementById("slingshot").checked && startLine === true) {
        line = new Line(xLineStart, yLineStart, e.clientX, e.clientY);
    }
});
document.getElementById("myCanvas").addEventListener("mouseup", function (e) {
    var xPos = e.clientX;
    var yPos = e.clientY;
    var xPosEnd = e.clientX;
    var yPosEnd = e.clientY;
    startLine = false;
    line = null;
    var xVelocity = (_this.xPosStart - xPosEnd) / 10;
    var yVelocity = (_this.yPosStart - yPosEnd) / 10;
    if (document.getElementById("slingshot").checked) {
        addNewBall(xPos, yPos, xVelocity, yVelocity);
    }
});
document.getElementById("clear").addEventListener("click", function (e) {
    _this.balls = [];
});
function draw() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = "#333";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    for (var i = 0; i < balls.length; i++) {
        var myBall = balls[i];
        myBall.update();
    }
    if (line != null) {
        line.drawLine();
    }
    reqAnimationFrame(draw);
}
draw();
