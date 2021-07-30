import * as THREE from "three";

import vertex from "../shaders/buildings/text/vertex";
import fragment from "../shaders/buildings/text/fragment";

export default class TextBuilding {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    this.folderTextBuilding = this.gui.addFolder("TextBuilding");
    this.folderTextBuilding.open();

    this.scene = options.scene;

    this.loadingManager = options.loadingManager;
    this.loader = new THREE.FontLoader(this.loadingManager);

    this.materialsText = [];
    this.textsMesh = [];

    this.opacity = 1;
    this.disperse = 0;
  }

  init() {
    this.debugObject.color1 = "#79b4ff";
    this.debugObject.color2 = "#fdfa6b";
    this.debugObject.ComeBackcolor1 = "#fcd282";
    this.debugObject.ComeBackcolor2 = "#f6fffd";
    this.debugObject.YourHeartcolor1 = "#920017";
    this.debugObject.YourHeartcolor2 = "#ecf4e0";

    this.texts = [
      {
        text: "DANCE",
        font: "Gala",
        posX: -59,
        posY: 22,
        posZ: 15,
        rotateY: 0,
        scale: 6,
        color1: "#E8E77F",
        color2: "#CD6F3C",
      },
      {
        text: "WITH ME",
        font: "Gala",
        posX: -44,
        posY: 12,
        posZ: 15,
        scale: 6,
        color1: "#E8E77F",
        color2: "#CD6F3C",
      },
      {
        text: "ON THE FLOOR",
        font: "Gala",
        posX: -14,
        posY: 20,
        posZ: 3,
        scale: 6,
        color1: "#E8E77F",
        color2: "#CD6F3C",
      },
      {
        text: "I want",
        font: "Milestone",

        posX: 8,
        posY: 15,
        posZ: 40,
        rotateY: -0.5,
        scale: 7,
        color1: this.debugObject.color1,
        color2: this.debugObject.color2,
      },
      {
        text: "to feel you",
        font: "Milestone",
        posX: 9,
        posY: 8.5,
        posZ: 40,
        rotateY: -0.5,
        scale: 7,
        color1: this.debugObject.color1,
        color2: this.debugObject.color2,
      },
      {
        text: "come back",
        font: "Score-Board_Regular",

        posX: -115,
        posY: 26,
        posZ: 76,
        rotateY: 0.4,
        scale: 6,
        color1: this.debugObject.ComeBackcolor1,
        color2: this.debugObject.ComeBackcolor2,
      },
      {
        text: "to me",
        font: "Score-Board_Regular",

        posX: -115,
        posY: 20,
        posZ: 76,
        rotateY: 0.4,
        scale: 6,
        color1: this.debugObject.ComeBackcolor1,
        color2: this.debugObject.ComeBackcolor2,
      },
      {
        text: "YOUR HEART IS A GOLDMINE",
        font: "Oswald_Regular",
        posX: -45,
        posY: 27,
        posZ: 175,
        rotateY: 0.1,
        scale: 4,
        color1: this.debugObject.YourHeartcolor1,
        color2: this.debugObject.YourHeartcolor2,
      },
      {
        text: "LARGER THAN ME",
        font: "Oswald_Regular",
        posX: -45,
        posY: 23,
        posZ: 175,
        rotateY: 0.1,
        scale: 4,
        color1: this.debugObject.YourHeartcolor1,
        color2: this.debugObject.YourHeartcolor2,
      },
    ];

    this.texts.forEach((textOptions) => {
      this.loader.load(`/fonts/${textOptions.font}.json`, (font) => {
        this.createText(font, textOptions);
      });
    });

    // I want to feel you
    this.folderTextBuilding.addColor(this.debugObject, "color1").onChange(() => {
      this.materialsText[3].uniforms.uColor1.value = new THREE.Color(this.debugObject.color1);
      this.materialsText[4].uniforms.uColor1.value = new THREE.Color(this.debugObject.color1);
    });
    this.folderTextBuilding.addColor(this.debugObject, "color2").onChange(() => {
      this.materialsText[3].uniforms.uColor2.value = new THREE.Color(this.debugObject.color2);
      this.materialsText[4].uniforms.uColor2.value = new THREE.Color(this.debugObject.color2);
    });

    // Come back
    this.folderTextBuilding.addColor(this.debugObject, "ComeBackcolor1").onChange(() => {
      this.materialsText[5].uniforms.uColor1.value = new THREE.Color(this.debugObject.ComeBackcolor1);
      this.materialsText[6].uniforms.uColor1.value = new THREE.Color(this.debugObject.ComeBackcolor1);
    });
    this.folderTextBuilding.addColor(this.debugObject, "ComeBackcolor2").onChange(() => {
      this.materialsText[5].uniforms.uColor2.value = new THREE.Color(this.debugObject.ComeBackcolor2);
      this.materialsText[6].uniforms.uColor2.value = new THREE.Color(this.debugObject.ComeBackcolor2);
    });

    // Your heart
    this.folderTextBuilding.addColor(this.debugObject, "YourHeartcolor1").onChange(() => {
      this.materialsText[7].uniforms.uColor1.value = new THREE.Color(this.debugObject.YourHeartcolor1);
      this.materialsText[8].uniforms.uColor1.value = new THREE.Color(this.debugObject.YourHeartcolor1);
    });
    this.folderTextBuilding.addColor(this.debugObject, "YourHeartcolor2").onChange(() => {
      this.materialsText[7].uniforms.uColor2.value = new THREE.Color(this.debugObject.YourHeartcolor2);
      this.materialsText[8].uniforms.uColor2.value = new THREE.Color(this.debugObject.YourHeartcolor2);
    });

    this.structures = [
      // DANCE
      {
        posX: -59.4,
        posY: 19.5,
        posZ: 15,
        rotateY: 0,
        scale: 0.5,
      },
      {
        posX: -61.3,
        posY: 19.5,
        posZ: 15,
        rotateY: 0,
        scale: 0.51,
      },

      {
        posX: -57,
        posY: 19.5,
        posZ: 15,
        rotateY: 0,
        scale: 0.5,
      },

      // ON THE FLOOR
      {
        posX: -16,
        posY: 15,
        posZ: 3,
        rotateY: 0,
        scale: 3,
      },
      {
        posX: -14,
        posY: 19,
        posZ: 3,
        rotateY: 0,
        scale: 1,
      },
      {
        posX: -19,
        posY: 19.6,
        posZ: 3,
        rotateY: 0,
        scale: 0.7,
      },

      {
        posX: -14.5,
        posY: 18.3,
        posZ: 4,
        rotateZ: Math.PI * 0.5,
        scale: 4.5,
      },

      // FEEL YOU
      // {
      //   posX: 2,
      //   posY: 8.5,
      //   posZ: 37,
      //   scale: 3,
      // },
      // {
      //   posX: 9,
      //   posY: 8.5,
      //   posZ: 42,
      //   scale: 3,
      // },
    ];

    this.structures.forEach((structure) => {
      this.createStructure(structure);
    });
  }

  createText(font, options) {
    const textGeometry = new THREE.TextGeometry(options.text, {
      font: font,
      size: 0.5,
      height: 0.05,
      curveSegments: 10,
      bevelEnabled: false,
      bevelThickness: 0.04,
      bevelSize: 0.0001,
      bevelOffset: 0.006,
      bevelSegments: 0.5,
    });

    const textMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        activeLines: { value: 0 },
        progress: { value: 0 },
        opacity: { value: 1 },
        uColor1: { value: new THREE.Color(options.color1) },
        uColor2: { value: new THREE.Color(options.color2) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    });

    this.materialsText.push(textMaterial);

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textGeometry.center();

    textMesh.position.x = options.posX;
    textMesh.position.y = options.posY;
    textMesh.position.z = options.posZ;

    if (options.rotateY) {
      textMesh.rotation.y = options.rotateY;
    }
    textMesh.scale.set(options.scale, options.scale, options.scale);

    this.textsMesh.push(textMesh);

    this.scene.add(textMesh);
  }

  createStructure(options) {
    const geometry = new THREE.PlaneBufferGeometry(0.2, 4);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });

    const structure = new THREE.Mesh(geometry, material);

    structure.position.set(options.posX, options.posY, options.posZ);

    if (options.rotateY) {
      structure.rotation.y = options.rotateY;
    }
    if (options.rotateZ) {
      structure.rotation.z = options.rotateZ;
    }

    structure.scale.set(1, options.scale, 1);
    this.scene.add(structure);
  }

  anim(progress, time) {
    this.materialsText.forEach((material) => {
      material.uniforms.time.value = time;
      material.uniforms.progress.value = progress;

      material.uniforms.activeLines.value = progress;
      material.uniforms.opacity.value = this.opacity;
    });

    this.textsMesh.forEach((mesh, i) => {
      // mesh.position.y += time * 0.0012 * this.disperse;
      // mesh.position.x += i % 2 === 0 ? time * 0.0006 * this.disperse : -(time * 0.0006 * this.disperse);
      // mesh.position.z += time * 0.001 * this.disperse;
      // mesh.rotation.y += time * 0.00001 * this.disperse;
      // mesh.rotation.x += time * 0.001 * this.disperse * i * 0.01;
      mesh.position.y += this.disperse * 0.1;
      mesh.position.x += i % 2 === 0 ? this.disperse * 0.02 : -this.disperse * 0.02;
      mesh.position.z += this.disperse * 0.06;
      mesh.rotation.y += this.disperse * 0.001;
      mesh.rotation.x += this.disperse * 0.001 * i;
    });
  }
}
