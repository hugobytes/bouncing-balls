export const GRAVITY_PULL_IN_PX = 0.2;
export const TRACTION = 0.8;

export function adjustForRetinaDisplay(value: number) {
  const RETINA_DISPLAY_MULTIPLIER = 2;
  return value * RETINA_DISPLAY_MULTIPLIER
}

const slingshotCheckbox = <HTMLInputElement>document.getElementById("slingshot");
export const slingshotMode = {
  isOn() {
    return slingshotCheckbox.checked;
  }
}
