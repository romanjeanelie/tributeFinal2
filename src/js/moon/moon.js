import * as THREE from "three";

import fragment from "../shaders/moon/fragment.glsl";
import vertex from "../shaders/moon/vertex.glsl";

export default class Moon {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    this.folderMoon = this.gui.addFolder("Moon");
    this.folderMoon.close();

    this.scene = options.scene;
    this.moon = new THREE.Group();
  }

  init() {
    this.addMoon();

    this.moon.position.x = -6000;
    this.moon.position.y = -1000;
    this.moon.position.z = -1000;

    this.moon.rotation.z = -0.5;
  }

  addMoon() {
    this.debugObject.moonColor1 = "#cf9d50";
    this.debugObject.moonColor2 = "#e5681f";
    this.debugObject.moonColor3 = "#000";
    this.debugObject.moonColor4 = "#f5c263";
    this.folderMoon.addColor(this.debugObject, "moonColor1").onChange(() => {
      this.moonMaterial.uniforms.color1.value = new THREE.Color(this.debugObject.moonColor1);
    });
    this.folderMoon.addColor(this.debugObject, "moonColor2").onChange(() => {
      this.moonMaterial.uniforms.color2.value = new THREE.Color(this.debugObject.moonColor2);
    });
    this.folderMoon.addColor(this.debugObject, "moonColor3").onChange(() => {
      this.moonMaterial.uniforms.color3.value = new THREE.Color(this.debugObject.moonColor3);
    });
    this.folderMoon.addColor(this.debugObject, "moonColor4").onChange(() => {
      this.moonMaterial.uniforms.color4.value = new THREE.Color(this.debugObject.moonColor4);
    });

    this.geometry = new THREE.SphereGeometry(60, 70, 70);
    this.moonMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(this.debugObject.moonColor1) },
        color2: { value: new THREE.Color(this.debugObject.moonColor2) },
        color3: { value: new THREE.Color(this.debugObject.moonColor3) },
        color4: { value: new THREE.Color(this.debugObject.moonColor4) },
        wide: { value: 2 },
        opacity: { value: 1 },
        changeColor: { value: 0 },
      },
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.sphere = new THREE.Mesh(this.geometry, this.moonMaterial);

    this.moon.add(this.sphere);

    this.moon.scale.set(5, 5, 5);

    this.scene.add(this.moon);
  }
}
