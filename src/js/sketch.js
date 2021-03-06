import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { gsap } from "gsap";

import getOrientation from "./utils/getOrientation";

import Animations from "./animations";

export default class Sketch {
  constructor(options) {
    this.gui = new dat.GUI({
      hideable: false,
    });
    this.debugObject = {};
    this.gui.hide();

    // GUI
    this.folderSketch = this.gui.addFolder("Sketch");

    this.time = 0;

    this.container = options.dom;

    this.scene = new THREE.Scene();

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 1000000);
    this.camera.position.z = 10;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.render(this.scene, this.camera);

    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
    this.controls.enableDamping = true;

    this.finalScene = new THREE.Group();

    this.init();
  }

  init() {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };
    this.setupResize();
    this.setClearColor();

    //this.addObject();
    this.animations = new Animations({
      camera: this.camera,
      finalScene: this.finalScene,
      scene: this.scene,
      gui: this.gui,
      container: this.container,
      renderer: this.renderer,
      controls: this.controls,
      sizes: {
        width: this.width,
        height: this.height,
      },
    });

    this.scene.add(this.finalScene);

    this.render();
    this.resize();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.animations.createPath.cameraPath.resize(this.width, this.height);
    if (getOrientation() === "Portrait") {
      document.querySelector(".rotate").style.display = "flex";
    } else {
      document.querySelector(".rotate").style.display = "none";
    }
  }

  setClearColor() {
    this.debugObject.clearColor = "#000";
    this.renderer.setClearColor(this.debugObject.clearColor);
    this.folderSketch
      .addColor(this.debugObject, "clearColor")
      .onChange(() => this.renderer.setClearColor(this.debugObject.clearColor));
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    this.animations.render();

    window.requestAnimationFrame(this.render.bind(this));
  }
}
