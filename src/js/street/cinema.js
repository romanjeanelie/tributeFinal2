import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Cinema {
  constructor(options) {
    this.scene = options.scene;

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.cinema = new THREE.Group();
  }

  init() {
    this.materialText = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x00f0ff) });
    this.materialCosmos = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff00ff) });

    this.addCinema();

    this.cinema.scale.set(1.5, 1.5, 1.5);

    this.cinema.rotation.y = 0.5;

    this.cinema.position.x = -50;
    this.cinema.position.z = 250;
    this.scene.add(this.cinema);
  }

  addCinema() {
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
    });

    const bakedTexture = this.textureLoader.load("/img/baked2.jpg");
    bakedTexture.flipY = false;
    bakedTexture.encoding = THREE.sRGBEncoding;
    const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

    this.gltfLoader.load("/models/cinema.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          if (child.name.includes("Cosmos")) {
            child.material = this.materialCosmos;
          } else if (child.name.includes("Text")) {
            child.material = this.materialText;
          } else {
            // child.material = bakedMaterial;
          }
        }
      });

      this.cinema.add(gltf.scene);
    });
  }

  anim(progress, time) {}
}