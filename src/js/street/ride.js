import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import vertex from "../shaders/ride/vertex";
import fragment from "../shaders/ride/fragment";

import ridePositionsLights from "./ridePositionsLights.json";

export default class Stadium {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    this.folderRide = this.gui.addFolder("Ride");
    this.folderRide.open();

    this.scene = options.scene;

    this.loadingManager = options.loadingManager;
    this.gltfLoader = new GLTFLoader(this.loadingManager);

    this.ride = new THREE.Group();
  }

  init() {
    this.addRide();

    this.ride.scale.set(2, 2, 2);

    this.ride.position.x = 160;
    this.ride.position.z = -40;

    this.scene.add(this.ride);
  }

  addRide() {
    this.createLights(ridePositionsLights);
  }

  createLights(positionsLights) {
    this.debugObject.color1 = "#ffebda";
    this.debugObject.color2 = "#ffffff";
    this.folderRide.addColor(this.debugObject, "color1").onChange(() => {
      this.pointsMaterial.uniforms.color1.value = new THREE.Color(this.debugObject.color1);
    });
    this.folderRide.addColor(this.debugObject, "color2").onChange(() => {
      this.pointsMaterial.uniforms.color2.value = new THREE.Color(this.debugObject.color2);
    });

    const count = positionsLights.length;
    this.pointsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uOpacity: { value: 1 },
        color1: { value: new THREE.Color(this.debugObject.color1) },
        color2: { value: new THREE.Color(this.debugObject.color2) },
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
      positions[i3 + 0] = positionsLights[i].x;
      positions[i3 + 1] = positionsLights[i].y;
      positions[i3 + 2] = positionsLights[i].z;

      size[i] = 20000;
      opacity[i] = Math.min(0.4 + Math.random(), 0.8);
    }

    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(size, 1));
    pointsGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacity, 1));

    const points = new THREE.Points(pointsGeometry, this.pointsMaterial);

    this.ride.add(points);
  }

  anim(progress, time) {
    this.ride.rotation.y += 0.001;
  }
}
