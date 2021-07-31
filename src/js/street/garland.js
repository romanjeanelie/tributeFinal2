import * as THREE from "three";

import fragment from "../shaders/garland/fragment.glsl";
import vertex from "../shaders/garland/vertex.glsl";

export default class Garland {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    this.folderGarland = this.gui.addFolder("Garland");
    this.folderGarland.close();

    this.scene = options.scene;

    this.lightsGarland = new THREE.Group();
    this.garlands = new THREE.Group();

    this.materials = [];
  }

  init() {
    const nbGarlands = 3;
    this.debugObject.colorLittle = "#fffbfd";
    this.debugObject.colorBig1 = "#112e59";
    this.debugObject.colorBig2 = "#feebeb";

    this.folderGarland.addColor(this.debugObject, "colorLittle").onChange(() => {
      this.materials.forEach((material) => {
        material.uniforms.colorLittle.value = new THREE.Color(this.debugObject.colorLittle);
      });
    });
    this.folderGarland.addColor(this.debugObject, "colorBig1").onChange(() => {
      this.materials.forEach((material) => {
        material.uniforms.colorBig1.value = new THREE.Color(this.debugObject.colorBig1);
      });
    });
    this.folderGarland.addColor(this.debugObject, "colorBig2").onChange(() => {
      this.materials.forEach((material) => {
        material.uniforms.colorBig2.value = new THREE.Color(this.debugObject.colorBig2);
      });
    });
    for (let i = 0; i < nbGarlands; i++) {
      this.createGarland(i);
    }

    this.garlands.scale.set(0.6, 0.6, 0.6);

    this.garlands.rotation.y = -1;

    this.garlands.position.x = 120;
    this.garlands.position.y = 7;
    this.garlands.position.z = -23;

    this.scene.add(this.garlands);
  }

  createGarland(i) {
    const curve = new THREE.SplineCurve([
      new THREE.Vector3(-15, 0, Math.random() * i),
      new THREE.Vector3(0, -4, 0),
      new THREE.Vector3(15, 0, 0),
    ]);

    const numberLights = 20;

    const points = curve.getPoints(numberLights);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Add index attribute
    const indexParticle = new Float32Array(numberLights);
    const random = new Float32Array(numberLights);

    for (let i = 0; i < numberLights; i++) {
      indexParticle[i] = i % 2;
      random[i] = Math.random();
    }
    geometry.setAttribute("index", new THREE.BufferAttribute(indexParticle, 1));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(random, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        colorLittle: { value: new THREE.Color(this.debugObject.colorLittle) },
        colorBig1: { value: new THREE.Color(this.debugObject.colorBig1) },
        colorBig2: { value: new THREE.Color(this.debugObject.colorBig2) },
        opacity: { value: 1 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });

    this.materials.push(material);

    const garland = new THREE.Points(geometry, material);

    garland.position.z = Math.random() * i * 3;

    this.garlands.add(garland);
  }

  anim(progress, time) {
    this.mainWheel.rotation.z = time * 0.05;
  }
}
