import { themeSwitch } from "./theme.js";

export function listenToPrint() {
  window.addEventListener("beforeprint", () => {
    document.body.classList.add("light");
  });
  window.addEventListener("afterprint", () => {
    themeSwitch();
  });
}
