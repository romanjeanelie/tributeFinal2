import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import * as THREE from "three";

import { gsap } from "gsap";

import vertex from "./shaders/flower/vertex.glsl";
import fragment from "./shaders/flower/fragment.glsl";

export default class Flower {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    this.folderFlower = this.gui.addFolder("Flower");
    this.folderFlower.close();

    this.scene = options.scene;

    this.loadingManager = options.loadingManager;
    this.gltfLoader = new GLTFLoader(this.loadingManager);

    this.flower = new THREE.Group();

    this.opacity = 1;
  }

  init() {
    this.addFlower();
    this.flower.scale.set(13, 13, 13);
    this.flower.rotation.x = 1;
    this.flower.position.y = -6000;
    this.flower.position.z = 12500;
    this.scene.add(this.flower);
  }

  addFlower() {
    this.gltfLoader.load("/models/flower.glb", (gltf) => {
      this.mesh = gltf.scene.children[0];

      this.material = new THREE.MeshBasicMaterial({
        color: "white",
        wireframe: true,
      });

      this.mesh.material = this.material;

      this.geometry = this.mesh.geometry;

      /*------------------------------
      Particles Material
      ------------------------------*/
      this.debugObject.color1 = "#3f0909";
      this.debugObject.color2 = "#5b624e";
      this.folderFlower.addColor(this.debugObject, "color1").onChange(() => {
        this.particlesMaterial.uniforms.color1.value = new THREE.Color(this.debugObject.color1);
      });
      this.folderFlower.addColor(this.debugObject, "color2").onChange(() => {
        this.particlesMaterial.uniforms.color2.value = new THREE.Color(this.debugObject.color2);
      });
      this.particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          color1: { value: new THREE.Color(this.debugObject.color1) },
          color2: { value: new THREE.Color(this.debugObject.color2) },
          uOpacity: { value: this.opacity },
          disperse: { value: 1 },
          changeColor: { value: 1 },
          scaleSize: { value: 0.4 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      /*------------------------------
      Particles Geometry
      ------------------------------*/
      const sampler = new MeshSurfaceSampler(this.mesh).build();
      const numParticles = 2000;

      this.particlesGeometry = new THREE.BufferGeometry();
      const particlesPosition = new Float32Array(numParticles * 3);
      const particlesOpacity = new Float32Array(numParticles);
      const particlesSize = new Float32Array(numParticles);

      for (let i = 0; i < numParticles; i++) {
        const newPosition = new THREE.Vector3();
        sampler.sample(newPosition);
        particlesPosition.set([newPosition.x, newPosition.y, newPosition.z], i * 3);
        particlesOpacity[i] = 0.3 + Math.random();

        particlesSize[i] = 5000 + Math.random() * 50000;
      }

      this.particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlesPosition, 3));
      this.particlesGeometry.setAttribute("aOpacity", new THREE.BufferAttribute(particlesOpacity, 1));
      this.particlesGeometry.setAttribute("size", new THREE.BufferAttribute(particlesSize, 1));

      /*------------------------------
      Particles
      ------------------------------*/
      this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);

      this.flower.add(this.particles);
    });
  }
}
