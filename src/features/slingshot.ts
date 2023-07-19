import canvas from "../lib/canvas"
import { slingshotMode } from "../lib/settings";
import { SlingshotLine } from "../lib/slingshotLine";

let line: SlingshotLine

export function addMouseDragListener() {
  canvas.element().addEventListener("mousedown", (e) => {
    if (!slingshotMode.isOn()) {
      return
    }

    line = new SlingshotLine(e.clientX, e.clientX, e.clientY, e.clientY)
  });


  canvas.element().addEventListener("mousemove", (e) => {
    if (!slingshotMode.isOn()) {
      return
    }

    const line = new Line(e.clientX, e.clientX, e.clientY, e.clientY)
    line.drawLine()
    if (startLine === true) {
      line = new Line(xLineStart, yLineStart, e.clientX, e.clientY);
    }
  });
}

export default {
  isOn() {
    const slingshotModeEnabled = ""
    return slingshotModeEnabled
  },

  drawSlingshotLine() {
  }
}




/**
 * Event listeners for slingshot mode (desktop and mobile)
 * Holding mouse down starts creating slingshot line
 * Releasing mouse
 */



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
