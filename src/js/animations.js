import gsap from "gsap";
import Text from "./text";
import Circle from "./circle";
import SinglePoint from "./singlePoint";
import Points from "./points";
import Plane from "./plane";
import Moon from "./moon/moon";
import Road from "./street/road";
import CreatePath from "./camera/createPath";

export default class Animations {
  constructor(options) {
    let start = 1000;
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
    this.text = new Text({ scene: this.scene, gui: this.gui });
    this.circle = new Circle({ scene: this.scene, gui: this.gui });
    this.singlePoint = new SinglePoint({ scene: this.scene, gui: this.gui });
    this.points = new Points({ scene: this.scene, gui: this.gui });
    this.plane = new Plane({ scene: this.scene, gui: this.gui });
    this.moon = new Moon({ scene: this.scene, gui: this.gui });
    this.road = new Road({ scene: this.scene, gui: this.gui });

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
      console.log(this.scrollValue);
    });
  }

  anim() {
    // this.text.anim(this.tlText);
    // this.stepOne();
    // this.stepTwo();
    // this.stepThree();
  }

  stepOne() {
    this.tl.fromTo(
      this.circle.circleMesh.position,
      {
        y: -2,
      },
      {
        y: 0,
        duration: 80,
      }
    );

    // ZOOM Circle
    this.tl.fromTo(
      this.circle.circleMesh.position,
      {
        z: 3.7,
      },
      {
        z: 6,
        delay: 33,
        duration: 40,
        ease: "power1.in",
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
        delay: 10,
      },
      "<"
    );

    // FADE OUT Circle
    // this.tl.fromTo(
    //   this.circle.material.uniforms.opacity,
    //   {
    //     value: 1,
    //   },
    //   {
    //     value: 0,
    //     duration: 20,
    //   },
    //   "<"
    // );

    this.tl.to(
      textPoints[0],
      {
        opacity: 0.4,
        duration: 15,
        delay: 10,
      },
      "<"
    );

    this.tl.to(
      textPoints[0],
      {
        opacity: 0.2,
        duration: 5,
        delay: 10,
      },
      "<"
    );

    this.tl.to(
      textPoints[1],
      {
        opacity: 1,
        duration: 5,
        delay: 0,
      },
      "<"
    );
    this.tl.to(
      this.singlePoint.activeWave,
      {
        value: 1,
        duration: 100,
        delay: 10,
      },
      "<"
    );

    this.tl.to(
      textPoints[1],
      {
        opacity: 0,
        duration: 5,
        delay: 5,
      },
      "<"
    );

    this.tl.to(
      textPoints[2],
      {
        opacity: 1,
        duration: 5,
        delay: 0,
      },
      "<"
    );

    this.tl.to(
      textPoints[2],
      {
        opacity: 0,
        duration: 5,
        delay: 5,
      },
      "<"
    );

    this.tl.to(
      textPoints[3],
      {
        opacity: 1,
        duration: 5,
        delay: 0,
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

  render() {
    const speedFactor = 1;
    this.time += 0.0001 * speedFactor;
    //this.timeText += 0.00035 * speedFactor;
    this.timeText += this.time;
    this.progress = this.time * 0.06;
    //this.progress = this.scrollValue;

    this.tl.progress(this.progress);
    this.tlText.progress(this.progress * 3.5);

    this.singlePoint.move(this.time);

    // Animation Camera
    this.createPath.anim();
    this.createPath.cameraPath.anim();
  }
}
