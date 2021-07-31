import Sketch from "./js/sketch.js";

new Sketch({ dom: document.getElementById("container") });

setTimeout(() => {
  window.scrollTo(0, 0);
  document.body.style.overflow = "hidden";
}, 500);
