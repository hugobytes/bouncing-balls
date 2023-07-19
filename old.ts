
const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;

const context = canvas.getContext("2d");


let slingshotInputElement = <HTMLInputElement>document.getElementById("slingshot");
let randomBallSizeInput = <HTMLInputElement>document.getElementById("randomBallSize");
let clearButton = <HTMLButtonElement>document.getElementById("clear");

/**
 * Used to fix blurry view on Retina devices
 * @type {number}
 */
let canvasMultiplier = 2;

/**
 * Set canvas width to take up full screen
 * @type {number}
 */
canvas.width = window.innerWidth * canvasMultiplier;
canvas.height = window.innerHeight * canvasMultiplier;

canvas.style.width = "100%";
canvas.style.height = "100%";


/**
 * Array of possible colours each ball will use
 * @source https://color.adobe.com/create/color-wheel/?copy=true&base=1&rule=Custom&selected=0&name=Copy%20of%20Phaedra&mode=rgb&rgbvalues=1,0.38009,0.218215,1,1,0.615686,0.744159,0.92,0.623819,0.474904,0.74,0.55981,0,0.64,0.534545&swatchOrder=0,1,2,3,4
 * @type {[string,string,string,string,string]}
 */
const colours = ["#ff6138", "#ffff9d", "#beeb9f", "#79bd8f", "#00a388", "#ff9ddb"];

/**
 * Start with empty array (balls will be pushed on click)
 * @type {Array}
 */
let balls = [];

/**
 * Slingshot and line start x/y position variables
 * Set once in 'mousedown' functions and destroyed on mouseup
 */
let xSlingshotStart, ySlingshotStart;
let xLineStart, yLineStart;

/**
 * Line is created on 'mousedown' and destroyed on 'mouseup' in Slingshot mode
 * @type {any}
 */
let line = null; let startLine = false;

/**
 * Min and max ball sizes
 * @type {number}
 */
let maxBallSzie = 30; let minBallSize = 10;

/**
 * Checks for different browsers
 * @type {((callback:FrameRequestCallback)=>number)|any}
 */
const reqAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

/**
 * Ball class to construct new balls
 * @class Ball
 */
class Ball {
  private radius: number;
  private speed: number;
  private xPos: number;
  private yPos: number;
  private colour: string;
  private xVelocity: number;
  private yVelocity: number;

  constructor(xPos, yPos, colour, xVelocity, yVelocity, radius) {
    this.radius = radius;
    this.speed = 10;
    this.xPos = xPos * canvasMultiplier;
    this.yPos = yPos * canvasMultiplier;
    this.colour = colour;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
  }

  public update = () => {
    /**
     * Begin drawing new individual ball / updating existing ball position
     * Contains animation logic (should follow bouncing ball animation with gravity)
     * @method beginPath()
     */
    context.beginPath();

    let radius = this.radius;
    let sAngle = 0;
    let eAngle = Math.PI * 2;
    let counterclockwise = false;

    const gravity = 0.2;

    /**
     * Larger balls have less bounce
     * @type {number}
     */
    const bounce = 0.9 * minBallSize / radius;
    const traction = 0.8;

    /**
     * Bouncing animation logic - modified from a JS tutorial on StackOverflow of a similar nature
     * @author Shomz : https://stackoverflow.com/questions/29982228/how-to-apply-gravity-to-bouncing-balls-in-javascript
     */
    if (this.xPos + radius >= canvas.width) {
      this.xVelocity = -this.xVelocity * bounce;
      this.xPos = canvas.width - radius;
    } else if (this.xPos - radius <= 0) {
      this.xVelocity = -this.xVelocity * bounce;
      this.xPos = radius;
    }
    if (this.yPos + radius >= canvas.height) {
      this.yVelocity = -this.yVelocity * bounce;
      this.yPos = canvas.height - radius;
      this.xVelocity *= traction;
    } else if (this.yPos - radius <= 0) {
      this.yVelocity = -this.yVelocity * bounce;
      this.yPos = radius;
    }

    this.yVelocity += gravity;

    this.xPos += this.xVelocity;
    this.yPos += this.yVelocity;

    let xPos = this.xPos;
    let yPos = this.yPos;

    /**
     * Each ball is redrawn
     * @method arc
     * @param xPos, x-coordinate of the center of the circle
     * @param yPos, y-coordinate of the center of the circle
     * @param radius, The radius of the circle (no change)
     * @param sAngle, The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle) - no change
     * @param eAngle, The ending angle, in radians (no change) - uses Math.PI * 2 to ensure a full circle is drawn
     * @param counterclockwise (optional), Specifies whether the drawing should be counterclockwise or clockwise
     */
    context.arc(xPos, yPos, radius, sAngle, eAngle, counterclockwise);

    /**
     * Finish drawing new individual ball / updating existing ball position
     * @method closePath()
     */
    context.closePath();

    /**
     * Define a colour for the ball
     * @type {string}
     */
    context.fillStyle = this.colour;

    /**
     * Fill in the ball with colour
     * @method fill()
     */
    context.fill();
  }
}

/**
 * Line drawn by dragging mouse in slingshot mode
 * @class
 */
class Line {
  private xLineStart: number;
  private yLineStart: number;
  private xLineEnd: number;
  private yLineEnd: number;

  constructor(xLineStart, yLineStart, xLineEnd, yLineEnd) {
    this.xLineStart = xLineStart * canvasMultiplier;
    this.yLineStart = yLineStart * canvasMultiplier;
    this.xLineEnd = xLineEnd * canvasMultiplier;
    this.yLineEnd = yLineEnd * canvasMultiplier;
  }

  public drawLine = () => {
    context.beginPath();
    context.moveTo(this.xLineStart, this.yLineStart);
    context.lineTo(this.xLineEnd, this.yLineEnd);
    context.lineWidth = 2;
    context.strokeStyle = "rgba(255,255,255,0.15)";
    context.stroke();
  }
}

/**
 * Draw each individual ball
 * @method drawBall
 */
function addNewBall(xPos, yPos, xVelocity, yVelocity) {
  let colour = colours[randomIntFromInterval(0, colours.length)];

  let randomBallSizeChecked = randomBallSizeInput.checked;

  /**
   * If randomBallSize input is checked, generate random size balls, otherwise use medium sizes ball
   * Larger ball sizes will have less bounce than smaller ball sizes
   * @type {number}
   */
  let radius = randomBallSizeChecked ? randomIntFromInterval(minBallSize, maxBallSzie) : maxBallSzie / 2;

  let ball = new Ball(xPos, yPos, colour, xVelocity, yVelocity, radius);
  balls.push(ball);
}

/**
 * Fetch a random number between min and max number
 */
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Draw or re-draw the entire canvas
 * reqAnimationFrame gets called roughly 60 times per second (decided by the browser)
 * @method draw
 */
function draw() {
  /**
   * Clear whole canvas
   */
  context.clearRect(0, 0, canvas.width, canvas.width);

  /**
   * Dark background theme for canvas
   * @type {string}
   */
  context.fillStyle = "#333";

  /**
   * Fill canvas with dark bg
   * @method fillRect
   */
  context.fillRect(0, 0, canvas.width, canvas.width);

  /**
   * Update each ball's position
   * update() function should follow a bouncing ball animation with gravity
   */
  for (let i = 0; i < balls.length; i++) {
    let myBall = balls[i];
    myBall.update();
  }

  /**
   * Draw line
   */
  if (line != null) {
    line.drawLine();
  }

  reqAnimationFrame(draw);
}

/**
 * Event listeners
 */
function addEventListeners() {
  /**
   * Add click listener for canvas
   */
  canvas.addEventListener("click", (e) => {
    let xPos = e.clientX;
    let yPos = e.clientY;

    /**
     * Random direction (x and y velocities)
     * @type {number}
     */
    let xVelocity = randomIntFromInterval(-10, 10);
    let yVelocity = randomIntFromInterval(-10, 10);

    if (!slingshotInputElement.checked) {
      addNewBall(xPos, yPos, xVelocity, yVelocity);
    }

  });

  /**
   * Event listeners for slingshot mode (desktop and mobile)
   * Holding mouse down starts creating slingshot line
   * Releasing mouse
   */
  canvas.addEventListener("mousedown", (e) => {
    if (!slingshotInputElement.checked) {
      return
    }
    this.xSlingshotStart = e.clientX;
    this.ySlingshotStart = e.clientY;
    xLineStart = e.clientX;
    yLineStart = e.clientY;
    startLine = true;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!slingshotInputElement.checked) {
      return
    }
    if (startLine === true) {
      line = new Line(xLineStart, yLineStart, e.clientX, e.clientY);
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!slingshotInputElement.checked) {
      return
    }

    let xPos = e.clientX;
    let yPos = e.clientY;

    let xPosEnd = e.clientX;
    let yPosEnd = e.clientY;

    startLine = false;
    line = null;

    /**
     * Velocities increase the more you drag the slingshot
     * Slingshot start positions are set on mouse down and used here
     * @type {number}
     * @type {number}
     */
    let xVelocity = (this.xSlingshotStart - xPosEnd) / 5;
    let yVelocity = (this.ySlingshotStart - yPosEnd) / 5;

    addNewBall(xPos, yPos, xVelocity, yVelocity);

  });

  /**
   * Add click listener for clear
   */
  clearButton.addEventListener("click", (e) => {
    this.balls = [];
  });
}

/**
 * Add event listeners
 */
addEventListeners();

/**
 * Draw canvas and start animation process
 */
draw();
