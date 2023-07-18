import slingshot from "../features/slingshotMode";
import balls from "./balls";

const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");

export default {
  canvas() {
    return canvas
  },
  context() {
    return context
  },
  clear() {
    context!.clearRect(0, 0, canvas.width, canvas.width);
    context!.fillStyle = "#333";
    context!.fillRect(0, 0, canvas.width, canvas.width);
  },
  drawNextFrame() {
    slingshot.drawSlingshotLineIfActive();
    balls.drawNextPositions();
  }
}
