import canvas from "./canvas";
import { adjustForRetinaDisplay } from "./settings";

export class SlingshotLine {
  private xPositionOnStartDrag: number;
  private yPositionOnStartDrag: number;
  private xCurrentMousePosition: number;
  private yCurrentMousePosition: number;

  constructor(xPositionOnStartDrag: number, yPositionOnStartDrag: number, xCurrentMousePosition: number, yCurrentMousePosition: number) {
    this.xPositionOnStartDrag = adjustForRetinaDisplay(xPositionOnStartDrag);
    this.yPositionOnStartDrag = adjustForRetinaDisplay(yPositionOnStartDrag);
    this.xCurrentMousePosition = adjustForRetinaDisplay(xCurrentMousePosition);
    this.yCurrentMousePosition = adjustForRetinaDisplay(yCurrentMousePosition);
  }

  public drawLine = () => {
    canvas.context()!.beginPath();
    canvas.context()!.moveTo(this.xPositionOnStartDrag, this.yPositionOnStartDrag);
    canvas.context()!.lineTo(this.xCurrentMousePosition, this.yCurrentMousePosition);
    canvas.context()!.lineWidth = 2;
    canvas.context()!.strokeStyle = "rgba(255,255,255,0.15)";
    canvas.context()!.stroke();
  }
}
