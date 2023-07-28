import { themeSwitch } from "./theme/index.js";

function init() {
  themeSwitch();

  document.querySelector("aside .active").scrollIntoView({ block: "center" });

  document.querySelector("#menu-btn").addEventListener("click", () => {
    const container = document.querySelector(".radiance-container");
    const sidenav = document.querySelector("aside");
    const navAttr = sidenav.getAttribute("data-visible");

    if (navAttr === "true") {
      sidenav.setAttribute("data-visible", false);
      container.setAttribute("data-no-sidebar", true);
    } else if (navAttr === "false") {
      sidenav.setAttribute("data-visible", true);
      container.removeAttribute("data-no-sidebar");
    } else if (!navAttr) {
      if (window.matchMedia("(max-width: 800px)").matches) {
        sidenav.setAttribute("data-visible", true);
        container.removeAttribute("data-no-sidebar");
      } else {
        sidenav.setAttribute("data-visible", false);
        container.setAttribute("data-no-sidebar", true);
      }
    }
  });

  const searchBtn = document.querySelector("#search-toggler");
  const searchDialog = document.querySelector(".search-dialog");
  const closeIcon = document.querySelector("#icon-close").innerHTML;
  const searchIcon = document.querySelector("#icon-search").innerHTML;

  searchBtn.addEventListener("click", () => {
    if (searchDialog.classList.contains("visible")) {
      searchDialog.classList.remove("visible");
      searchBtn.innerHTML = searchIcon;
    } else {
      searchDialog.classList.add("visible");
      searchBtn.innerHTML = closeIcon;
    }
  });
}

init();
