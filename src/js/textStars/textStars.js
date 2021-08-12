import * as THREE from "three";
import gsap from "gsap";

import fragment from "../shaders/textStars/fragment.glsl";
import vertex from "../shaders/textStars/vertex.glsl";

export default class TextStars {
  constructor(options) {
    this.scene = options.scene;

    this.loader = new THREE.FontLoader();
    this.strengthValue = 1;

    this.textMaterial = null;

    this.materialsText = [];

    this.textLoaded = 0;
    this.allTextLoaded = false;

    this.textGroup = new THREE.Group();

    this.textsMesh = [];
    this.materialsText = [];

    this.index = 0;

    this.opacity = 1;
    this.disperse = 0;
  }

  init() {
    this.texts = [
      {
        text: "YOUR LIPS ARE SO SWEET",
        posX: -6,
        posY: -818,
        posZ: -300,
        scale: 30,
        color: "#192028",
        color2: "#C0D2E3",
      },
      {
        text: "THEY KEEP RUNNING ON MY FEET",
        posX: -6,
        posY: -1500,
        posZ: -300,
        scale: 40,
        color: "#192028",
        color2: "#F2E7D9",
      },
      {
        text: "IT HELPED THE DAYS COMPLETE",
        posX: -6,
        posY: -2600,
        posZ: -300,
        scale: 70,
        color: "#2F3438",
        color2: "#FBD1C8",
      },
      {
        text: "I'M LOCKED IN YOUR DREAMS",
        posX: -6,
        posY: -4500,
        posZ: -600,
        scale: 160,
        color: "#F76E3B",
        color2: "#FF1B7E",
      },
    ];
    this.loader.load("/fonts/Moniqa-ExtBold.json", (font) => {
      this.texts.forEach((textOptions) => {
        this.createText(font, textOptions).then(() => {
          this.index++;

          if (this.index === this.texts.length) {
            this.allTextLoaded = true;
          }
        });
      });
    });
  }

  createText(font, options) {
    return new Promise((resolve, reject) => {
      const textGeometry = new THREE.TextGeometry(options.text, {
        font: font,
        size: 1,
        height: 0,
        curveSegments: 10,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          opacity: { value: this.opacity },
          uColor: { value: new THREE.Color(options.color) },
          uColor2: { value: new THREE.Color(options.color2 ? options.color2 : options.color) },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
      });

      this.materialsText.push(textMaterial);

      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textMesh.position.x = options.posX;
      textMesh.position.y = options.posY;
      textMesh.position.z = options.posZ;

      if (options.rotY) {
        textMesh.rotation.y = options.rotY;
      }
      textMesh.scale.set(options.scale, options.scale, options.scale);

      this.textsMesh.push(textMesh);

      textGeometry.center();

      this.scene.add(textMesh);

      if (textMesh) {
        resolve();
      }
    });
  }

  anim(progress, time) {
    this.materialsText.forEach((material, i) => {
      material.uniforms.time.value = time;
      material.uniforms.opacity.value = this.opacity;
    });

    this.textsMesh.forEach((mesh, i) => {
      mesh.position.y += this.disperse * 0.1;
      mesh.position.x += i % 2 === 0 ? this.disperse * 0.05 : -this.disperse * 0.05;
      mesh.position.z += this.disperse * 0.1;
      mesh.rotation.y += this.disperse * 0.0001;
      mesh.rotation.x += this.disperse * 0.001 * i;
    });
  }
}
