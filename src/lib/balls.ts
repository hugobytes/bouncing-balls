import SelfDrawingBall from "./selfDrawingBall"

let balls: SelfDrawingBall[] = []

export default {
  balls() {
    return balls
  },
  addNewBall(ball: SelfDrawingBall) {
    balls.push(ball)
  },
  destroyAll() {
    balls = []
  },
  drawNextPositions() {
    for (const ball of balls) {
      ball.moveBallWithGravityAndVelocity()
    }
  }
}
