import canvas from "./canvas";

let canvasMultiplier = 2;
let maxBallSzie = 30; let minBallSize = 10;

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
    canvas.context()!.beginPath();

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
    if (this.xPos + radius >= canvas.canvas()!.width) {
      this.xVelocity = -this.xVelocity * bounce;
      this.xPos = canvas.canvas()!.width - radius;
    } else if (this.xPos - radius <= 0) {
      this.xVelocity = -this.xVelocity * bounce;
      this.xPos = radius;
    }
    if (this.yPos + radius >= canvas.canvas()!.height) {
      this.yVelocity = -this.yVelocity * bounce;
      this.yPos = canvas.canvas()!.height - radius;
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
    canvas.context()!.arc(xPos, yPos, radius, sAngle, eAngle, counterclockwise);

    /**
     * Finish drawing new individual ball / updating existing ball position
     * @method closePath()
     */
    canvas.context()!.closePath();

    /**
     * Define a colour for the ball
     * @type {string}
     */
    canvas.context()!.fillStyle = this.colour;

    /**
     * Fill in the ball with colour
     * @method fill()
     */
    canvas.context()!.fill();
  }
}
