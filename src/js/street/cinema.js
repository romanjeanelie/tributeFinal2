import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Cinema {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    this.folderCinema = this.gui.addFolder("Cinema");
    this.folderCinema.open();

    this.scene = options.scene;

    this.loadingManager = options.loadingManager;
    this.gltfLoader = new GLTFLoader(this.loadingManager);

    this.cinema = new THREE.Group();
  }

  init() {
    this.debugObject.color = "#e7fbd2";

    this.folderCinema.addColor(this.debugObject, "color").onChange(() => {
      this.materialCosmos.color = new THREE.Color(this.debugObject.color);
    });

    this.materialCosmos = new THREE.MeshBasicMaterial({ color: new THREE.Color(this.debugObject.color) });

    this.addCinema();

    this.cinema.scale.set(1.5, 1.5, 1.5);

    this.cinema.rotation.y = 0.5;

    this.cinema.position.x = -32;
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
          }
        }
      });

      this.cinema.add(gltf.scene);
    });
  }
}
