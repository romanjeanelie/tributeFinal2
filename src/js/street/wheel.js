import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex2 from "../shaders/wheel/branches/vertex2";
import fragment2 from "../shaders/wheel/branches/fragment2";
import vertex3 from "../shaders/wheel/branches/vertex3";
import fragment3 from "../shaders/wheel/branches/fragment3";

import vertex4 from "../shaders/wheel/base/vertex";
import fragment4 from "../shaders/wheel/base/fragment";

export default class Wheel {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    this.folderWheel = this.gui.addFolder("Wheel");
    this.folderWheel.close();

    this.scene = options.scene;

    this.loadingManager = options.loadingManager;
    this.gltfLoader = new GLTFLoader(this.loadingManager);

    this.mainWheel = new THREE.Group();
    this.baseWheel = new THREE.Group();

    this.wheel = new THREE.Group();
  }

  init() {
    this.createBranch();
    this.createCircle();
    this.createLightBase();

    this.mainWheel.position.y = 13;

    this.wheel.add(this.baseWheel);
    this.wheel.add(this.mainWheel);

    this.wheel.position.x = 100;
    this.wheel.position.y = 0;
    this.wheel.position.z = -20;

    this.wheel.rotation.y = -Math.PI * 0.25;

    this.wheel.scale.set(1, 1, 1);
    this.scene.add(this.wheel);
  }

  createLightBase() {
    this.debugObject.baseColor1 = "#85e6f9";
    this.debugObject.baseColor2 = "#FFFFFF";

    this.folderWheel.addColor(this.debugObject, "baseColor1").onChange(() => {
      faceMaterial.uniforms.uColor1.value = new THREE.Color(this.debugObject.baseColor1);
    });
    this.folderWheel.addColor(this.debugObject, "baseColor2").onChange(() => {
      faceMaterial.uniforms.uColor2.value = new THREE.Color(this.debugObject.baseColor2);
    });

    const nbFaces = 7;
    const faceA = new THREE.Group();
    const faceB = new THREE.Group();

    const faceGeometry = new THREE.PlaneBufferGeometry(1.5, 4);
    const faceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor1: { value: new THREE.Color(this.debugObject.baseColor1) },
        uColor2: { value: new THREE.Color(this.debugObject.baseColor2) },
      },
      vertexShader: vertex4,
      fragmentShader: fragment4,
      transparent: true,
    });

    for (let i = 0; i < nbFaces; i++) {
      const face = new THREE.Mesh(faceGeometry, faceMaterial);

      face.position.y = i * 5;

      faceA.add(face);
    }

    for (let i = 0; i < nbFaces; i++) {
      const face = new THREE.Mesh(faceGeometry, faceMaterial);

      face.position.y = i * 5;

      faceB.add(face);
    }

    faceA.scale.set(0.4, 0.4, 0.4);

    faceA.position.x = -8;
    faceA.position.y = 3;
    faceA.position.z = 4.7;

    faceA.rotation.x = -0.2;
    faceA.rotation.z = -0.6;

    faceB.scale.set(0.4, 0.4, 0.4);

    faceB.position.x = 8;
    faceB.position.y = 3;
    faceB.position.z = 4.7;

    faceB.rotation.x = -0.2;
    faceB.rotation.z = 0.6;

    this.baseWheel.add(faceA, faceB);
  }

  createCircle() {
    this.debugObject.circleColor1 = "#fbffdc";
    this.debugObject.circleColor2 = "#FFFFFF";

    this.folderWheel.addColor(this.debugObject, "circleColor1").onChange(() => {
      material.uniforms.color1.value = new THREE.Color(this.debugObject.circleColor1);
    });
    this.folderWheel.addColor(this.debugObject, "circleColor2").onChange(() => {
      material.uniforms.color2.value = new THREE.Color(this.debugObject.circleColor2);
    });
    const numberPoints = 100;

    const curve = new THREE.EllipseCurve(
      0,
      0, // ax, aY
      10,
      10, // xRadius, yRadius
      0,
      2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    );

    const points = curve.getPoints(numberPoints);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        color1: { value: new THREE.Color(this.debugObject.circleColor1) },
        color2: { value: new THREE.Color(this.debugObject.circleColor2) },
        uOpacity: { value: 1 },
      },
      vertexShader: vertex3,
      fragmentShader: fragment3,
      transparent: true,
    });

    const circle = new THREE.Points(geometry, material);

    this.mainWheel.add(circle);
  }

  createBranch() {
    this.debugObject.branchColor1 = "#e1f4bd";
    this.debugObject.branchColor2 = "#dac28a";

    this.folderWheel.addColor(this.debugObject, "branchColor1").onChange(() => {
      this.branchMaterial.uniforms.uColor1.value = new THREE.Color(this.debugObject.branchColor1);
    });
    this.folderWheel.addColor(this.debugObject, "branchColor2").onChange(() => {
      this.branchMaterial.uniforms.uColor2.value = new THREE.Color(this.debugObject.branchColor2);
    });

    // Branches
    const nbPointsBranch = 30;
    const nbBranches = 6;
    const ratioRotate = Math.PI / nbBranches;

    this.branchGeometry = new THREE.PlaneGeometry(19, 0.1, nbPointsBranch, nbPointsBranch);

    this.branchMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor1: { value: new THREE.Color(this.debugObject.branchColor1) },
        uColor2: { value: new THREE.Color(this.debugObject.branchColor2) },
      },
      vertexShader: vertex2,
      fragmentShader: fragment2,
      transparent: true,
    });

    for (let i = 0; i < nbBranches; i++) {
      const branch = new THREE.Points(this.branchGeometry, this.branchMaterial);

      branch.position.x = 0;
      branch.rotation.z = (i + 1) * ratioRotate;

      this.mainWheel.add(branch);
    }
  }

  anim(progress, time) {
    this.mainWheel.rotation.z = time * 0.08;
  }
}
