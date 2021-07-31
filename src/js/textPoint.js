import gsap from "gsap";

export default class TextPoint {
  constructor(options) {
    this.scene = options.scene;

    this.animComplete = true;
  }

  animText(index) {
    const texts = document.querySelectorAll(".text__point p");
    const textOut = texts[index - 1];
    const textIn = texts[index];
    this.animComplete = false;

    if (textOut) {
      gsap.to(textOut, {
        autoAlpha: 0,
        duration: 1,
      });
    }

    if (textIn) {
      gsap.to(textIn, {
        autoAlpha: 1,
        duration: 1,
        onComplete: () => (this.animComplete = true),
      });
    }
  }
}
