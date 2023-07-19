import balls from "../lib/balls"

export function handleResetButtonClick() {
  window.document.getElementById("reset")!
    .addEventListener("click", () => balls.destroyAll());
}
