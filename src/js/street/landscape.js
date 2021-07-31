import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export default class Landscape {
  constructor(options) {
    this.loadingManager = options.loadingManager;
    this.gltfLoader = new GLTFLoader(this.loadingManager);

    this.scene = options.scene;

    this.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  }

  init() {
    this.addLandscape2({ x: 260, y: 0, z: 30 });
    this.addLandscape3({ x: -200, y: 0, z: -50 });
  }

  addLandscape2(options) {
    this.gltfLoader.load("/models/landscape2.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          child.material = this.material;
        }
      });
      gltf.scene.rotation.y = Math.PI * 0.5;
      gltf.scene.scale.set(50, 50, 50);
      gltf.scene.position.x = options.x;
      gltf.scene.position.y = options.y;
      gltf.scene.position.z = options.z;

      this.scene.add(gltf.scene);
    });
  }
  addLandscape3(options) {
    this.gltfLoader.load("/models/landscape3.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          child.material = this.material;
        }
      });
      gltf.scene.rotation.y = -Math.PI * 0.5;
      gltf.scene.scale.set(30, 30, 30);
      gltf.scene.position.x = options.x;
      gltf.scene.position.y = options.y;
      gltf.scene.position.z = options.z;

      this.scene.add(gltf.scene);
    });
  }
}
