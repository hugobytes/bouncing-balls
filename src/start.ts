import canvas from "./lib/canvas"
import { addMouseClickListener } from "./features/fireInRandomDirection"
import { addMouseDragListener } from "./features/slingshotMode"
import { handleResetButtonClick } from "./features/resetBalls"

addMouseClickListener();
addMouseDragListener();
handleResetButtonClick();

addEventListener("resize", () => canvas.resizeCanvas());

(function drawCanvas() {
  canvas.clear();
  canvas.drawNextFrame();

  window.requestAnimationFrame(drawCanvas);
})();

