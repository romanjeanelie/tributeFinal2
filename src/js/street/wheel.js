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
    const nbFaces = 7;
    const faceA = new THREE.Group();
    const faceB = new THREE.Group();

    const faceGeometry = new THREE.PlaneBufferGeometry(1.5, 4);
    const faceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor1: { value: new THREE.Color("#E77F68") },
        uColor2: { value: new THREE.Color("#FFFFFF") },
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

    // Add random attribute
    const random = new Float32Array(numberPoints);

    for (let i = 0; i < numberPoints; i++) {
      random[i] = Math.random();
    }

    geometry.setAttribute("aRandom", new THREE.BufferAttribute(random, 1));

    // Material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        color1: { value: new THREE.Color("#FBE9E5") },
        color2: { value: new THREE.Color("#FFFFFF") },
        uOpacity: { value: 1 },
      },
      vertexShader: vertex3,
      fragmentShader: fragment3,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    // const material = new THREE.PointsMaterial({
    //   color: 0xff0000,
    //   size: 10,
    // });
    const circle = new THREE.Points(geometry, material);

    this.mainWheel.add(circle);
  }

  createBranch() {
    // Branches
    const nbPointsBranch = 30;
    const nbBranches = 6;
    const ratioRotate = Math.PI / nbBranches;

    this.branchGeometry = new THREE.PlaneGeometry(21, 0.1, nbPointsBranch, nbPointsBranch);

    // Add random attribute
    const random = new Float32Array(nbPointsBranch);

    for (let i = 0; i < nbPointsBranch; i++) {
      random[i] = Math.random();
    }

    this.branchGeometry.setAttribute("aRandom", new THREE.BufferAttribute(random, 1));

    this.branchMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor1: { value: new THREE.Color("#FDF4E4") },
        uColor2: { value: new THREE.Color("#0917FC") },
      },
      vertexShader: vertex2,
      fragmentShader: fragment2,
      transparent: true,
    });

    for (let i = 0; i < nbBranches; i++) {
      const branch = new THREE.Points(this.branchGeometry, this.branchMaterial);

      branch.position.x = 0;
      branch.rotation.z = (i + 1) * ratioRotate;
      // branch.rotation.z = i;

      this.mainWheel.add(branch);
    }
  }

  anim(progress, time) {
    this.mainWheel.rotation.z = time * 0.08;
  }
}
