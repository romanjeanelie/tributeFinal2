import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex from "../shaders/stadium/vertex";
import fragment from "../shaders/stadium/fragment";

import stadiumPositionsLights1 from "./stadiumPositionsLights1.json";
import stadiumPositionsLights2 from "./stadiumPositionsLights2.json";
import stadiumPositionsLights3 from "./stadiumPositionsLights3.json";

export default class Stadium {
  constructor(options) {
    this.scene = options.scene;

    this.loadingManager = options.loadingManager;
    this.gltfLoader = new GLTFLoader(this.loadingManager);

    this.GLTFobjects = [];

    this.stadium = new THREE.Group();
    this.stadiumLights = new THREE.Group();
  }

  init() {
    this.addStadium();

    this.stadium.scale.set(0.4, 0.4, 0.4);
    this.stadium.rotation.y = 0.3;
    this.stadium.position.x = -80;
    this.stadium.position.z = 190;

    this.stadiumLights.scale.set(0.4, 0.4, 0.4);
    this.stadiumLights.rotation.y = 0.3;
    this.stadiumLights.position.x = -80;
    this.stadiumLights.position.z = 190;

    this.scene.add(this.stadium, this.stadiumLights);
  }

  addStadium() {
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      opacity: 1,
    });

    this.gltfLoader.load("/models/stadium.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          child.material = material;
        }
      });
      this.stadium.add(gltf.scene);

      this.createLights1(stadiumPositionsLights1);
      this.createLights2(stadiumPositionsLights2);
      this.createLights3(stadiumPositionsLights3);
    });
  }

  createLights1(positionsLight) {
    const count = positionsLight.length;
    this.pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        color1: { value: new THREE.Color("#CEC98B") },
        color2: { value: new THREE.Color("#ffffff") },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });

    const pointsGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const opacity = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = positionsLight[i].x;
      positions[i3 + 1] = positionsLight[i].y;
      positions[i3 + 2] = positionsLight[i].z;

      size[i] = 25000;
      opacity[i] = Math.random();
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
    pointsGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacity, 1));

    const points = new THREE.Points(pointsGeometry, this.pointsMaterial);

    this.stadiumLights.add(points);
  }

  createLights2(positionsLight) {
    const count = positionsLight.length;
    this.pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uOpacity: { value: 1 },
        color1: { value: new THREE.Color("#F1CB8A") },
        color2: { value: new THREE.Color("#fff") },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });

    const pointsGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const opacity = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = positionsLight[i].x;
      positions[i3 + 1] = positionsLight[i].y;
      positions[i3 + 2] = positionsLight[i].z;

      size[i] = 25000;
      opacity[i] = Math.random() * 0.7;
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
    pointsGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacity, 1));

    const points = new THREE.Points(pointsGeometry, this.pointsMaterial);

    this.stadiumLights.add(points);
  }

  createLights3(positionsLight) {
    const count = positionsLight.length;
    this.pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uOpacity: { value: 1 },
        color1: { value: new THREE.Color("#fff") },
        color2: { value: new THREE.Color("#ffffff") },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    });

    const pointsGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const opacity = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = positionsLight[i].x;
      positions[i3 + 1] = positionsLight[i].y;
      positions[i3 + 2] = positionsLight[i].z;

      size[i] = 60000;
      opacity[i] = 1;
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
    pointsGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacity, 1));

    const points = new THREE.Points(pointsGeometry, this.pointsMaterial);

    this.stadiumLights.add(points);
  }
}
