import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Cinema {
  constructor(options) {
    this.scene = options.scene;

    this.loadingManager = options.loadingManager;
    this.gltfLoader = new GLTFLoader(this.loadingManager);

    this.cinema = new THREE.Group();
  }

  init() {
    this.materialText = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FFE489"),
      opacity: 0,
      transparent: true,
    });
    this.materialCosmos = new THREE.MeshBasicMaterial({ color: new THREE.Color("#FFE489") });

    this.addCinema();

    this.cinema.scale.set(1.5, 1.5, 1.5);

    this.cinema.rotation.y = 0.5;

    this.cinema.position.x = -42;
    this.cinema.position.y = 0;
    this.cinema.position.z = 240;
    this.scene.add(this.cinema);
  }

  addCinema() {
    this.gltfLoader.load("/models/cinema.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          if (child.name.includes("Cosmos")) {
            child.material = this.materialCosmos;
          } else if (child.name.includes("Text")) {
            child.material = this.materialText;
          }
        }
      });

      this.cinema.add(gltf.scene);
    });
  }
}
