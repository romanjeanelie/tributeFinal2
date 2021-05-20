import gsap from "gsap";
import TextIntro from "./textIntro";
import TextGod from "./textGod";
import Circle from "./circle";
import SinglePoint from "./singlePoint";
import Points from "./points";
import Plane from "./plane";
import Moon from "./moon/moon";
import Road from "./street/road";
import CreatePath from "./camera/createPath";

export default class Animations {
  constructor(options) {
    let start = 0;
    this.time = start;
    this.timeText = start;

    this.scene = options.scene;
    this.gui = options.gui;
    this.camera = options.camera;
    this.container = options.container;
    this.renderer = options.renderer;
    this.controls = options.controls;
    //this.objects = options.objects;

    this.scrollValue = 0;

    this.init();
  }

  init() {
    this.addObject();
    this.manageCamera();
    this.createTimelines();
    this.getScroll();
    this.render();
  }

  addObject() {
    this.textIntro = new TextIntro({ scene: this.scene, scroll: this.scrollValue });
    this.textGod = new TextGod({ scene: this.scene, scroll: this.scrollValue, gui: this.gui });
    this.circle = new Circle({ scene: this.scene, gui: this.gui });
    this.singlePoint = new SinglePoint({ scene: this.scene, gui: this.gui });
    this.points = new Points({ scene: this.scene, gui: this.gui });
    this.plane = new Plane({ scene: this.scene, gui: this.gui });
    this.moon = new Moon({ scene: this.scene, gui: this.gui });
    this.road = new Road({ scene: this.scene, gui: this.gui });

    this.textIntro.init();
    this.textGod.init();
    this.circle.init();
    this.singlePoint.init();
    this.points.init();
    this.plane.init();
    this.moon.init();
    this.road.init();
  }

  manageCamera() {
    this.createPath = new CreatePath({
      container: this.container,
      scene: this.scene,
      camera: this.camera,
      controls: this.controls,
      renderer: this.renderer,
      gui: this.gui,
    });
  }

  createTimelines() {
    this.tl = gsap.timeline({
      paused: true,
    });

    this.tlText = gsap.timeline({
      paused: true,
    });
  }

  getScroll() {
    window.addEventListener("scroll", (e) => {
      this.scrollValue = window.scrollY / document.body.scrollHeight;
    });
  }

  anim() {
    this.stepOne();
    this.stepTwo();
    // this.stepThree();
  }

  stepOne() {
    this.tl.to(this.circle.circleMesh.position, {
      y: this.circle.positionY + 160,
      duration: 60,
    });
    console.log(this.circle.positionY);

    // ZOOM Circle
    this.tl.to(
      this.circle.circleMesh.position,
      {
        z: this.circle.positionZ + 110,
        delay: 20,
        duration: 100,
      },
      "<"
    );
  }

  stepTwo() {
    const textPoints = document.querySelectorAll(".text__point");

    // FADE IN Single point
    this.tl.fromTo(
      this.singlePoint.material.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 80,
        delay: 30,
      },
      "<"
    );
  }

  stepThree() {
    // APPEAR Points 1
    this.tl.fromTo(
      this.points.pointsMaterial1.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 10,
      }
    );

    this.tl.fromTo(
      this.points.pointsMaterial2.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 30,
        delay: 10,
      },
      "<"
    );

    this.tl.fromTo(
      this.points.pointsMaterial3.uniforms.opacity,
      {
        value: 0,
      },
      {
        value: 1,
        duration: 50,
        delay: 10,
      },
      "<"
    );
  }

  animCamera() {
    this.createPath.cameraPath.cameraSpeed = 0;

    this.createPath.anim();
    this.createPath.cameraPath.anim(this.time);
  }

  animText(progress, time) {
    this.textIntro.anim(progress * 12, time);
    this.textIntro.animText(progress * 0.5);
    this.textGod.anim(progress * 12, time);
    this.textGod.animText(progress * 0.5);
  }

  render() {
    // Params
    const speedFactor = 100;
    this.time += 0.0001 * speedFactor;
    this.progress = this.scrollValue * 6;

    // Animation objects
    this.tl.progress(this.time * this.progress * 0.02);

    // Animations object materials
    this.circle.anim(this.time, this.progress);

    // Animation Text
    setTimeout(() => {
      this.animText(this.progress, this.time);
    }, 1000);

    // Animation camera
    this.animCamera();
  }
}
