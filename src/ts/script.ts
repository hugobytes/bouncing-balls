// TODO: https://coderwall.com/p/vmkk6a/how-to-make-the-canvas-not-look-like-crap-on-retina or https://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
// TODO: https://stackoverflow.com/documentation/typescript/7456/unit-testing#t=20170720213125066547 or https://journal.artfuldev.com/write-tests-for-typescript-projects-with-mocha-and-chai-in-typescript-86e053bdb2b6
/**
 * @author Hugo Brook : Bouncing Balls using TypeScript, html, css and canvas
 * The main structure of this code followed the best two tutorials on canvas I could find (I am new to canvas, but not TypeScript):
 * @author Kirupa Chinnathambi : https://www.kirupa.com/html5/creating_simple_html5_canvas_animation.htm
 * @author Kirupa Chinnathambi : https://www.kirupa.com/html5/animating_many_things_on_a_canvas.htm
 */

/**
 * @property canvas
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;

/**
 * Need to initialise context as a 2d element for two-dimensional drawing
 * @property context
 * @type {CanvasRenderingContext2D|any}
 */
const context = canvas.getContext("2d");

/**
 * Set canvas width to take up full screen
 * @type {number}
 */
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;


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
 * Canvas width
 * @type {number}
 */
const canvasWidth = canvas.width;

/**
 * Canvas height
 * @type {number}
 */
const canvasHeight = canvas.height;

/**
 * Checks for different browsers
 * @type {((callback:FrameRequestCallback)=>number)|any}
 */
const reqAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

/**
 * Ball class to construct new balls
 * @class Ball
 */
class Ball {
    private radius: number;
    private speed: number;
    private width: number;
    private xPos: number;
    private yPos: number;
    private colour: string;
    private xVelocity: number;
    private yVelocity: number;

    constructor(xPos, yPos, colour, xVelocity, yVelocity, radius) {
        this.radius = radius;
        this.speed = 10;
        this.xPos = xPos;
        this.yPos = yPos;
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
         * Must take a value less than 1; larger balls have less bounce
         * @type {number}
         */
        const bounce = 0.63 * (30/(radius + 15)); // Max bounce = 0.945, min bounce = 0.63
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
        this.xLineStart = xLineStart;
        this.yLineStart = yLineStart;
        this.xLineEnd = xLineEnd;
        this.yLineEnd = yLineEnd;
    }

    public drawLine = () => {
        context.beginPath();
        context.moveTo(this.xLineStart, this.yLineStart);
        context.lineTo(this.xLineEnd, this.yLineEnd);
        context.strokeStyle="#FF0000";
        context.stroke();
    }
}

/**
 * Draw each individual ball
 * @method drawBall
 */
function addNewBall(xPos, yPos, xVelocity, yVelocity) {
    let colour = colours[randomIntFromInterval(0, colours.length)];

    /**
     * If randomBallSize input is checked, generate random size balls, otherwise use medium sizes ball
     * Larger ball sizes will have less bounce than smaller ball sizes
     * @type {number}
     */
    let radius = document.getElementById('randomBallSize').checked? randomIntFromInterval(5,15) : 10;

    let ball = new Ball(xPos, yPos, colour, xVelocity, yVelocity, radius);
    balls.push(ball);
}

/**
 * Fetch a random number between min and max number
 */
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

/**
 * Add click listener for canvas
 */
document.getElementById("myCanvas").addEventListener("click", (e) => {
    let xPos = e.clientX;
    let yPos = e.clientY;

    /**
     * Random direction (x and y velocities)
     * @type {number}
     */
    let xVelocity = randomIntFromInterval(-10,10);
    let yVelocity = randomIntFromInterval(-10,10);

    if (!document.getElementById("slingshot").checked) {
        addNewBall(xPos, yPos, xVelocity, yVelocity);
    }
});

let xPosStart, yPosStart;
let xLineStart, yLineStart;
let line = null;
let startLine = false;

/**
 * Listeners for slingshot mode
 */
document.getElementById("myCanvas").addEventListener("mousedown", (e) => {
    this.xPosStart = e.clientX;
    this.yPosStart = e.clientY;
    xLineStart = e.clientX;
    yLineStart = e.clientY;
    startLine = true;
});

/**
 * Draw slingshot line
 */
document.getElementById("myCanvas").addEventListener("mousemove", (e) => {
    if (document.getElementById("slingshot").checked && startLine === true) {
        line = new Line(xLineStart, yLineStart, e.clientX, e.clientY);
    }
});

/**
 * Release slingshot
 */
document.getElementById("myCanvas").addEventListener("mouseup", (e) => {
    let xPos = e.clientX;
    let yPos = e.clientY;
    let xPosEnd = e.clientX;
    let yPosEnd = e.clientY;

    startLine = false;
    line = null;

    /**
     * Velocities increase the more you drag the slingshot
     * @type {number}
     * @type {number}
     */
    let xVelocity = (this.xPosStart - xPosEnd)/10;
    let yVelocity = (this.yPosStart - yPosEnd)/10;

    if (document.getElementById("slingshot").checked) {
        addNewBall(xPos, yPos, xVelocity, yVelocity);
    }
});

/**
 * Add click listener for clear
 */
document.getElementById("clear").addEventListener("click", (e) => {
    this.balls = [];
});

/**
 * Draw or re-draw the entire canvas
 * reqAnimationFrame gets called roughly 60 times per second (decided by the browser)
 * @method draw
 */
function draw() {
    /**
     * Clear whole canvas
     */
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    /**
     * Dark background theme for canvas
     * @type {string}
     */
    context.fillStyle = "#333";

    /**
     * Fill canvas with dark bg
     * @method fillRect
     */
    context.fillRect(0,0,canvasWidth, canvasHeight);

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
 * Draw canvas and start animation process
 */
draw();
