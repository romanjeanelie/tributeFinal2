import * as THREE from "three";
import { gsap } from "gsap";

import fragment from "./shaders/sky/fragment.glsl";
import vertex from "./shaders/sky/vertex.glsl";

export default class Sky {
  constructor(options) {
    this.scene = options.scene;
    this.gui = options.gui;
    this.debugObject = {};

    this.positionX = 0;
    this.positionY = 8000;
    this.positionZ = -7000;

    this.opacity = 0;
    this.animColors = { value: 0 };
    this.changeColor = { value: 0 };

    this.material = null;

    this.sky = new THREE.Group();
  }

  init() {
    this.createSky();

    this.sky.position.x = this.positionX;
    this.sky.position.y = this.positionY;
    this.sky.position.z = this.positionZ;

    this.scene.add(this.sky);
  }

  createSky() {
    this.setColors();

    this.geometry = new THREE.PlaneGeometry(1, 2);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(this.debugObject.color1) },
        color2: { value: new THREE.Color(this.debugObject.color2) },
        color3: { value: new THREE.Color(this.debugObject.color3) },
        color1a: { value: new THREE.Color(this.debugObject.color1a) },
        color2a: { value: new THREE.Color(this.debugObject.color2a) },
        color3a: { value: new THREE.Color(this.debugObject.color3a) },
        opacity: { value: this.opacity },
        animColors: { value: this.animColors.value },
        changeColor: { value: this.changeColor.value },
      },
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.scale.set(105000, 15000, 100);
    this.mesh.rotation.z = Math.PI;

    this.sky.add(this.mesh);
  }

  setColors() {
    this.debugObject.color1 = "#3c3c24";
    this.gui
      .addColor(this.debugObject, "color1")
      .onChange(() => (this.material.uniforms.color1.value = new THREE.Color(this.debugObject.color1)))
      .name("skyColor1");

    this.debugObject.color2 = "#803104";
    this.gui
      .addColor(this.debugObject, "color2")
      .onChange(() => (this.material.uniforms.color2.value = new THREE.Color(this.debugObject.color2)))
      .name("skyColor2");

    this.debugObject.color3 = "#425646";
    this.gui
      .addColor(this.debugObject, "color3")
      .onChange(() => (this.material.uniforms.color3.value = new THREE.Color(this.debugObject.color3)))
      .name("skyColor3");
    this.debugObject.color1a = "#080808";
    this.gui
      .addColor(this.debugObject, "color1a")
      .onChange(() => (this.material.uniforms.color1a.value = new THREE.Color(this.debugObject.color1a)))
      .name("skyColor1a");

    this.debugObject.color2a = "#190c0c";
    this.gui
      .addColor(this.debugObject, "color2a")
      .onChange(() => (this.material.uniforms.color2a.value = new THREE.Color(this.debugObject.color2a)))
      .name("skyColor2a");

    this.debugObject.color3a = "#2a0e0e";
    this.gui
      .addColor(this.debugObject, "color3a")
      .onChange(() => (this.material.uniforms.color3a.value = new THREE.Color(this.debugObject.color3a)))
      .name("skyColor3a");
  }

  anim(time, progress) {
    this.material.uniforms.time.value = time;
    this.material.uniforms.opacity.value = this.opacity;
    this.material.uniforms.animColors.value = this.animColors.value;
    this.material.uniforms.changeColor.value = this.changeColor.value;
  }
}
