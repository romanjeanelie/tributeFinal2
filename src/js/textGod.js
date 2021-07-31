import * as THREE from "three";
import gsap from "gsap";

import fragment from "./shaders/textGod/fragment.glsl";
import vertex from "./shaders/textGod/vertex.glsl";

export default class TextGod {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    this.folderGod = this.gui.addFolder("TextGod");
    this.folderGod.open();

    this.scene = options.scene;

    this.loadingManager = options.loadingManager;
    this.loader = new THREE.FontLoader(this.loadingManager);

    this.strengthValue = 1;

    this.textMaterial = null;

    this.materialsText = [];

    this.textLoaded = 0;
    this.allTextLoaded = false;

    this.textGroup = new THREE.Group();

    this.opacity = { value: 0 };
    this.isLoaded = false;

    this.index = 0;
  }

  init() {
    this.addText();

    this.folderGod.addColor(this.debugObject, "color").onChange(() => {
      this.materialsText.forEach((material) => {
        material.uniforms.uColor.value = new THREE.Color(this.debugObject.color);
      });
    });

    this.folderGod.addColor(this.debugObject, "color2").onChange(() => {
      this.materialsText.forEach((material) => {
        material.uniforms.uColor2.value = new THREE.Color(this.debugObject.color2);
      });
    });
  }

  addText() {
    this.debugObject.color = "#fff1b6";
    this.debugObject.color2 = "#eff6ce";

    const texts = ["LIFE IS A GRAIN OF SALT IN THE EYES OF GOD", ""];
    this.loader.load("/fonts/Moniqa-ExtBold_Italic.json", (font) => {
      if (this.index > texts.length - 1) {
        // Position
        this.textGroup.rotation.x = Math.PI;
        this.textGroup.position.y = -2500;
        this.textGroup.position.z = -2300;
        this.textGroup.children[0].position.y = 20;
        this.textGroup.children[1].position.y = -20;
        this.textGroup.scale.set(25, 25, 25);

        this.scene.add(this.textGroup);
        this.isLoaded = true;
        return;
      }
      const text = texts[this.index];
      this.createText(text, font, this.index).then(() => {
        this.index++;
        this.addText();
      });
    });
  }

  createText(text, font, index) {
    return new Promise((resolve, reject) => {
      const textGeometry = new THREE.TextGeometry(text, {
        font: font,
        size: 20,
        height: 0,
        curveSegments: 10,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          opacity: { value: this.opacity.value },
          uColor: { value: new THREE.Color(this.debugObject.color) },
          uColor2: { value: new THREE.Color(this.debugObject.color2) },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      this.materialsText.push(textMaterial);

      const textMesh = new THREE.Mesh(textGeometry, this.materialsText[index]);

      textGeometry.center();

      this.textGroup.add(textMesh);
      if (textMesh) {
        resolve();
      }
    });
  }

  anim(progress, time) {
    this.materialsText.forEach((material) => {
      material.uniforms.time.value = time;
      material.uniforms.opacity.value = this.opacity.value;
    });
  }
}
