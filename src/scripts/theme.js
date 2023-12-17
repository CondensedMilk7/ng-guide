const btn = document.querySelector("#theme-switch");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const currentTheme = localStorage.getItem("theme") || prefersDarkScheme;

// Initializes color theme switch handler
export async function themeSwitch() {
  if (currentTheme === "light") {
    setTheme("light");
  } else {
    setTheme("dark");
  }

  btn.addEventListener("click", function () {
    document.body.classList.add("bg-transition");
    if (document.body.classList.contains("light")) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  });
}

function setTheme(theme) {
  theme === "light"
    ? document.body.classList.add("light")
    : document.body.classList.remove("light");
  btn.innerHTML = document.querySelector(`#icon-${theme}`).innerHTML;
  localStorage.setItem("theme", theme);
}
