import slingshot from "../features/slingshot";
import balls from "./balls";
import { adjustForRetinaDisplay } from "./settings";

const element = document.querySelector("#myCanvas") as HTMLCanvasElement;
const context = element.getContext("2d");

export default {
  element() {
    return element
  },
  context() {
    return context
  },
  clear() {
    context!.clearRect(0, 0, element.width, element.width);
    context!.fillStyle = "#333";
    context!.fillRect(0, 0, element.width, element.width);
  },
  drawNextFrame() {
    slingshot.drawSlingshotLine();
    balls.drawNextPositions();
  },
  resizeCanvas() {
    element.width = adjustForRetinaDisplay(window.innerWidth);
    element.height = adjustForRetinaDisplay(window.innerHeight);
    element.style.width = "100%";
    element.style.height = "100%";
  }
}
