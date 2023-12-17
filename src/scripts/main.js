import { themeSwitch } from "./theme.js";
import { listenToPrint } from "./print.js";

const SIDENAV_ANIM_DURATION = 250;
const container = document.querySelector(".radiance-container");
const sidenav = document.querySelector("aside");

sidenav.style.animationDuration = `${SIDENAV_ANIM_DURATION}ms`;

function showSidebar(show) {
  if (show) {
    sidenav.style.animationName = "slide_in";
    sidenav.setAttribute("data-visible", true);
    container.removeAttribute("data-no-sidebar");
  } else {
    sidenav.style.animationName = "slide_out";
    setTimeout(() => {
      sidenav.setAttribute("data-visible", false);
      container.setAttribute("data-no-sidebar", true);
    }, SIDENAV_ANIM_DURATION);
  }
}

function init() {
  themeSwitch();
  listenToPrint();

  const highlightedLink = document.querySelector("aside .active");

  // Scroll navigation sidebar into active link
  if (highlightedLink) {
    const sidebar = document.querySelector("aside");
    const sidebarRect = sidebar.getBoundingClientRect();
    const linkRect = highlightedLink.getBoundingClientRect();

    if (linkRect.bottom > sidebarRect.bottom) {
      sidebar.scrollTop =
        linkRect.top -
        sidebarRect.top -
        (sidebarRect.height - linkRect.height) / 2;
    }
  }

  // Scroll into active fragment (must be after navbat scroll)
  if (window.location.hash) {
    const fragment = document.getElementById(
      window.location.hash.split("#")[1]
    );
    fragment.scrollIntoView();
  }

  document.querySelector("#menu-btn").addEventListener("click", () => {
    const navAttr = sidenav.getAttribute("data-visible");

    if (navAttr === "true") {
      showSidebar(false);
    } else if (navAttr === "false") {
      showSidebar(true);
    } else if (!navAttr) {
      if (window.matchMedia("(max-width: 800px)").matches) {
        showSidebar(true);
      } else {
        showSidebar(false);
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
