import canvas from "./canvas";
import { GRAVITY_PULL_IN_PX, adjustForRetinaDisplay, TRACTION } from "./settings";

export default class SelfDrawingBall {
  private radius: number;
  private xPos: number;
  private yPos: number;
  private color: string;
  private xVelocity: number;
  private yVelocity: number;
  private velocityReducerFromBounce: number;

  constructor(color: string, radius: number, xPos: number, yPos: number, xVelocity: number, yVelocity: number) {
    this.radius = radius;
    this.xPos = adjustForRetinaDisplay(xPos);
    this.yPos = adjustForRetinaDisplay(yPos);
    this.color = color;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    const MIN_BALL_SIZE_IN_PX = 10;
    this.velocityReducerFromBounce = 0.9 * MIN_BALL_SIZE_IN_PX / this.radius;
  }

  public moveBallWithGravityAndVelocity() {
    this.detectAndHandleBounces();
    this.yVelocity += GRAVITY_PULL_IN_PX;
    this.xPos += this.xVelocity;
    this.yPos += this.yVelocity;

    this.redrawBallWithNewCoordinates();
  }

  private redrawBallWithNewCoordinates() {
    const startAngle = 0;
    const endAngle = Math.PI * 2;
    const counterclockwise = false;
    canvas.context()!.beginPath();
    canvas.context()!.arc(this.xPos, this.yPos, this.radius, startAngle, endAngle, counterclockwise);
    canvas.context()!.closePath();
    canvas.context()!.fillStyle = this.color;
    canvas.context()!.fill();
  }

  private detectAndHandleBounces() {
    if (this.hasBouncedOnRightSideOfCanvas()) {
      this.xVelocity = -this.xVelocity * this.velocityReducerFromBounce;
      this.xPos = canvas.canvas()!.width - this.radius;
    }

    if (this.hasBouncedOnLeftSideOfCanvas()) {
      this.xVelocity = -this.xVelocity * this.velocityReducerFromBounce;
      this.xPos = this.radius;
    }

    if (this.hasBouncedOnTopOfCanvas()) {
      this.yVelocity = -this.yVelocity * this.velocityReducerFromBounce;
      this.yPos = canvas.canvas()!.height - this.radius;
      this.xVelocity *= TRACTION;
    }

    if (this.hasBouncedOnBottomOfCanvas()) {
      this.yVelocity = -this.yVelocity * this.velocityReducerFromBounce;
      this.yPos = this.radius;
    }
  }

  private hasBouncedOnRightSideOfCanvas() {
    return this.xPos + this.radius >= canvas.canvas()!.width
  }

  private hasBouncedOnLeftSideOfCanvas() {
    return this.xPos - this.radius <= 0
  }

  private hasBouncedOnTopOfCanvas() {
    return this.yPos + this.radius >= canvas.canvas()!.height
  }

  private hasBouncedOnBottomOfCanvas() {
    return this.yPos - this.radius <= 0
  }
}
