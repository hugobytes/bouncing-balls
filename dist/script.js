var canvas = document.querySelector("#myCanvas");
var context = canvas.getContext("2d");
var slingshotInputElement = document.getElementById("slingshot");
var randomBallSizeInput = document.getElementById("randomBallSize");
var clearButton = document.getElementById("clear");
var canvasMultiplier = 2;
canvas.width = window.innerWidth * canvasMultiplier;
canvas.height = window.innerHeight * canvasMultiplier;
canvas.style.width = "100%";
canvas.style.height = "100%";
var colours = ["#ff6138", "#ffff9d", "#beeb9f", "#79bd8f", "#00a388", "#ff9ddb"];
var balls = [];
var xSlingshotStart, ySlingshotStart;
var xLineStart, yLineStart;
var line = null;
var startLine = false;
var maxBallSzie = 30;
var minBallSize = 10;
var reqAnimationFrame = window.requestAnimationFrame;
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
            var bounce = 0.9 * minBallSize / radius;
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
        this.xPos = xPos * canvasMultiplier;
        this.yPos = yPos * canvasMultiplier;
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
            context.strokeStyle = "rgba(255,255,255,0.15)";
            context.stroke();
        };
        this.xLineStart = xLineStart * canvasMultiplier;
        this.yLineStart = yLineStart * canvasMultiplier;
        this.xLineEnd = xLineEnd * canvasMultiplier;
        this.yLineEnd = yLineEnd * canvasMultiplier;
    }
    return Line;
}());
function addNewBall(xPos, yPos, xVelocity, yVelocity) {
    var colour = colours[randomIntFromInterval(0, colours.length)];
    var randomBallSizeChecked = randomBallSizeInput.checked;
    var radius = randomBallSizeChecked ? randomIntFromInterval(minBallSize, maxBallSzie) : maxBallSzie / 2;
    var ball = new Ball(xPos, yPos, colour, xVelocity, yVelocity, radius);
    balls.push(ball);
}
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.width);
    context.fillStyle = "#333";
    context.fillRect(0, 0, canvas.width, canvas.width);
    for (var i = 0; i < balls.length; i++) {
        var myBall = balls[i];
        myBall.update();
    }
    if (line != null) {
        line.drawLine();
    }
    reqAnimationFrame(draw);
}
function addEventListeners() {
    var _this = this;
    canvas.addEventListener("click", function (e) {
        var xPos = e.clientX;
        var yPos = e.clientY;
        var xVelocity = randomIntFromInterval(-10, 10);
        var yVelocity = randomIntFromInterval(-10, 10);
        if (!slingshotInputElement.checked) {
            addNewBall(xPos, yPos, xVelocity, yVelocity);
        }
    });
    canvas.addEventListener("mousedown", function (e) {
        if (!slingshotInputElement.checked) {
            return;
        }
        _this.xSlingshotStart = e.clientX;
        _this.ySlingshotStart = e.clientY;
        xLineStart = e.clientX;
        yLineStart = e.clientY;
        startLine = true;
    });
    canvas.addEventListener("mousemove", function (e) {
        if (!slingshotInputElement.checked) {
            return;
        }
        if (startLine === true) {
            line = new Line(xLineStart, yLineStart, e.clientX, e.clientY);
        }
    });
    canvas.addEventListener("mouseup", function (e) {
        if (!slingshotInputElement.checked) {
            return;
        }
        var xPos = e.clientX;
        var yPos = e.clientY;
        var xPosEnd = e.clientX;
        var yPosEnd = e.clientY;
        startLine = false;
        line = null;
        var xVelocity = (_this.xSlingshotStart - xPosEnd) / 5;
        var yVelocity = (_this.ySlingshotStart - yPosEnd) / 5;
        addNewBall(xPos, yPos, xVelocity, yVelocity);
    });
    clearButton.addEventListener("click", function (e) {
        _this.balls = [];
    });
}
addEventListeners();
draw();
