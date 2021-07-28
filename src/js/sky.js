import * as THREE from "three";
import { gsap } from "gsap";

import fragment from "./shaders/sky/fragment.glsl";
import vertex from "./shaders/sky/vertex.glsl";

export default class Sky {
  constructor(options) {
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);

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
    this.createClouds();

    this.sky.position.x = this.positionX;
    this.sky.position.y = this.positionY;
    this.sky.position.z = this.positionZ;

    this.scene.add(this.sky);
  }

  createSky() {
    this.setColors();

    this.geometry = new THREE.PlaneGeometry(1, 2);
    // this.geometry = new THREE.PlaneGeometry(1, 1);

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
    // this.material = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   side: THREE.DoubleSide,
    // });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.scale.set(105000, 15000, 100);
    this.mesh.rotation.z = Math.PI;

    //
    // this.mesh.position.y = -8000;
    // this.mesh.scale.y = 5000;
    //

    this.sky.add(this.mesh);
  }

  setColors() {
    this.debugObject.color1 = "#c5590c";
    this.gui
      .addColor(this.debugObject, "color1")
      .onChange(() => (this.material.uniforms.color1.value = new THREE.Color(this.debugObject.color1)))
      .name("skyColor1");

    this.debugObject.color2 = "#ed0000";
    this.gui
      .addColor(this.debugObject, "color2")
      .onChange(() => (this.material.uniforms.color2.value = new THREE.Color(this.debugObject.color2)))
      .name("skyColor2");

    this.debugObject.color3 = "#566679";
    this.gui
      .addColor(this.debugObject, "color3")
      .onChange(() => (this.material.uniforms.color3.value = new THREE.Color(this.debugObject.color3)))
      .name("skyColor3");
    this.debugObject.color1a = "#a22b0a";
    this.gui
      .addColor(this.debugObject, "color1a")
      .onChange(() => (this.material.uniforms.color1a.value = new THREE.Color(this.debugObject.color1a)))
      .name("skyColor1a");

    this.debugObject.color2a = "#1c1c1c";
    this.gui
      .addColor(this.debugObject, "color2a")
      .onChange(() => (this.material.uniforms.color2a.value = new THREE.Color(this.debugObject.color2a)))
      .name("skyColor2a");

    this.debugObject.color3a = "#a88c6a";
    this.gui
      .addColor(this.debugObject, "color3a")
      .onChange(() => (this.material.uniforms.color3a.value = new THREE.Color(this.debugObject.color3a)))
      .name("skyColor3a");
  }

  createClouds() {
    const mapTexture1 = this.textureLoader.load("/img/cloud.png");
    const geometry = new THREE.PlaneBufferGeometry(1, 1);
    const material1 = new THREE.MeshBasicMaterial({ map: mapTexture1, transparent: true });

    const cloud1 = new THREE.Mesh(geometry, material1);

    cloud1.position.x = -5000;
    cloud1.position.y = -10000;
    cloud1.position.z = 5000;

    cloud1.scale.set(2000, 2000, 2000);

    // this.sky.add(cloud1);
  }

  anim(time, progress) {
    this.material.uniforms.time.value = time;
    this.material.uniforms.opacity.value = this.opacity;
    this.material.uniforms.animColors.value = this.animColors.value;
    this.material.uniforms.changeColor.value = this.changeColor.value;
  }
}
