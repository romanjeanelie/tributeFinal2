import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import * as THREE from "three";

import { gsap } from "gsap";

import vertex from "./shaders/textLight/vertex.glsl";
import fragment from "./shaders/textLight/fragment.glsl";

export default class TextLight {
  constructor(options) {
    this.gltfLoader = new GLTFLoader();

    this.text = new THREE.Group();
    this.scene = options.scene;

    this.materials = [];
    this.opacity = 0;
  }

  init() {
    this.addText();

    // this.text.children[1].position.y = 50;
    this.text.scale.set(110, 110, 110);
    this.text.rotation.y = -Math.PI * 0.5;
    this.text.position.x = -120;
    this.text.position.y = 0;
    this.text.position.z = -50;
    this.scene.add(this.text);
  }

  addText() {
    this.gltfLoader.load("/models/text.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === "Mesh") {
          this.createParticles(child);
        }
      });

      /*------------------------------
      Particles Material
      ------------------------------*/
    });
  }

  createParticles(mesh) {
    this.geometry = mesh.geometry;

    const sampler = new MeshSurfaceSampler(mesh).build();
    const numParticles = 1000;

    this.particlesGeometry = new THREE.BufferGeometry();
    const particlesPosition = new Float32Array(numParticles * 3);
    const particlesOpacity = new Float32Array(numParticles);
    const particlesSize = new Float32Array(numParticles);

    for (let i = 0; i < numParticles; i++) {
      const newPosition = new THREE.Vector3();
      sampler.sample(newPosition);
      particlesPosition.set([newPosition.x, newPosition.y, newPosition.z], i * 3);
      particlesOpacity[i] = Math.random();

      particlesSize[i] = 5000 + Math.random() * 30000;
    }

    this.particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlesPosition, 3));
    this.particlesGeometry.setAttribute("aOpacity", new THREE.BufferAttribute(particlesOpacity, 1));
    this.particlesGeometry.setAttribute("size", new THREE.BufferAttribute(particlesSize, 1));

    /*------------------------------
      Particles
      ------------------------------*/

    this.particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        color1: { value: new THREE.Color("#E77F68") },
        color2: { value: new THREE.Color("#ffffff") },
        uOpacity: { value: this.opacity },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    this.materials.push(this.particlesMaterial);

    this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);

    if (mesh.name === "Spin") {
      this.particles.position.z = -1.5;
    }

    console.log(this.particles);
    this.text.add(this.particles);
  }

  anim(progress, time) {
    if (this.particlesMaterial === undefined) return;
    this.materials.forEach((material) => {
      material.uniforms.uOpacity.value = this.opacity;
    });
    // this.particlesMaterial.uniforms.uTime.value = time;
  }
}
