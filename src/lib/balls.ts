let balls = []

export default {
  balls() {
    return balls
  },
  addNewBall(ball) {
    balls.push(ball)
  },
  destroyAll() {
    balls = []
  },
  drawNextPositions() {
    for (const ball of balls) {
      ball.drawNextPosition()
    }
  }
}
