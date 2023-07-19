import canvas from "../lib/canvas";
import { randomNumberFrom } from "../lib/utils";
import { slingshotMode } from "../lib/settings";

export function addMouseClickListener() {
  canvas.element().addEventListener("click", (e) => {
    if (slingshotMode.isOn()) {
      return
    }

    const xMousePosition = e.clientX;
    const yMousePosition = e.clientY;

    const xVelocity: number = randomNumberFrom(-10, 10);
    const yVelocity: number = randomNumberFrom(-10, 10);

    addNewBall(xMousePosition, yMousePosition, xVelocity, yVelocity);
  });
}
