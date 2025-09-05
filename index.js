import { initTower } from "./resources/tower.js";
import { login } from "./resources/login.js";
import { initStroop } from "./resources/stroop.js";
import { GoNoGoGame } from "./resources/Gono_go.js";
import { initTMT } from "./resources/tmt.js";
import { updateTestResults } from "./resources/updateResults.js";


// SPA Routes definition

// Each path is mapped to its corresponding HTML view.
const routes = {
  "/login": "./views/login.html",
  "/tower": "./views/tower.html",
  "/stroop": "./views/stroop.html",
  "/gonogo": "./views/gonogo.html",
  "/tmt": "./views/tmt.html",
  "/logout": "./views/logout.html"
};


// CSS Handling

// Keeps track   of the currently loaded CSS file
let activeCSS = null;

// Dynamically loads a CSS file
function loadCSS(href) {
  return new Promise((resolve, reject) => {
    // If CSS is already loaded, resolve immediately
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve();
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(`Error loading CSS: ${href}`);
    document.head.appendChild(link);
  });
}

// Removes a CSS file from the document
function unloadCSS(href) {
  const link = document.querySelector(`link[href="${href}"]`);
  if (link) {
    document.head.removeChild(link);
  }
}


// Navigation function

// Handles SPA navigation and route logic
export async function navigate(pathname) {
  const route = routes[pathname];
  if (!route) {
    return navigate("/login"); 
  }

  // Load the corresponding HTML
  const html = await fetch(route).then(res => res.text());
  document.getElementById("content").innerHTML = html;

  // Update the browser URL without reloading the page
  history.pushState({}, "", pathname);

  // Map routes to their CSS files
  const cssMap = {
    "/tower": "./resources/tower.css",
    "/stroop": "./resources/stroop.css",
    "/gonogo": "./resources/gonogo.css",
    "/tmt": "./resources/tmt.css"
  };

  // Unload previous CSS if different from the new one
  if (activeCSS && activeCSS !== cssMap[pathname]) {
    unloadCSS(activeCSS);
    activeCSS = null;
  }

  // Load the CSS for the current route if necessary
  if (cssMap[pathname] && activeCSS !== cssMap[pathname]) {
    try {
      await loadCSS(cssMap[pathname]);
      activeCSS = cssMap[pathname];
    } catch (error) {
      console.error(error);
    }
  }

  // Execute the corresponding JS logic for the route
  if (pathname === "/login") {
    login();
  } else if (pathname === "/tower") {
    initTower();
  } else if (pathname === "/stroop") {
    initStroop();
  } else if (pathname === "/gonogo") {
    GoNoGoGame();
  } else if (pathname === "/tmt") {
    initTMT();
  } else if (pathname === "/logout") {
    updateTestResults();
  }
}


// SPA Event Listeners


// Intercept clicks on links with [data-link] to enable SPA navigation
document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    const path = e.target.getAttribute("href");
    navigate(path);
  }
});

// Handle browser back/forward navigation without reloading
window.addEventListener("popstate", () => {
  navigate(location.pathname);
});


// Initial Load

// When the page loads, check if a user is stored in localStorage
// and navigate to the appropriate view (login or test).
window.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("user");
  const currentPath = location.pathname;

  if (currentUser) {
    console.log("User session detected");
    // If path is invalid or root, redirect to Stroop test
    if (currentPath === "/" || !routes[currentPath]) {
      navigate("/stroop");
    } else {
      navigate(currentPath);
    }
  } else {
    // If not logged in, force navigation to login for restricted routes
    if (!routes[currentPath] || currentPath === "/" || currentPath === "/tower" || currentPath === "/stroop" || currentPath === "/gonogo" || currentPath === "/tmt" || currentPath === "/logout") {
      navigate("/login");
    } else {
      navigate(currentPath);
    }
  }
});
