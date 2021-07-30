import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import ios from "./utils/ios";

import fragment from "./shaders/button/fragment.glsl";
import vertex from "./shaders/button/vertex.glsl";
import fragmentText from "./shaders/button/fragmentText.glsl";
import vertexText from "./shaders/button/vertexText.glsl";

export default class Buttons {
  constructor(options) {
    this.gui = options.gui;
    this.debugObject = {};
    this.folderButton = this.gui.addFolder("Button");
    this.folderButton.close();

    this.loadingManager = options.loadingManager;
    this.loader = new THREE.FontLoader(this.loadingManager);

    this.sizes = options.sizes;
    this.camera = options.camera;
    this.scene = options.scene;
    this.points = options.points;
    this.singlePoint = options.singlePoint;
    this.moon = options.moon;
    this.road = options.road;
    this.textStars = this.singlePoint.textStars;
    this.flower = options.flower;
    this.sky = options.sky;
    this.backSky = options.backSky;
    this.textGod = options.textGod;
    this.textFinal = options.textFinal;
    this.plane = options.plane;
    this.planet = options.planet;
    this.help = options.help;

    this.finalScene = options.finalScene;

    this.btnPlay = document.querySelector(".play");

    this.buttonsMesh = [];
    this.buttons = new THREE.Group();
    this.textsMesh = [];
    this.materialsText = [];

    this.destroy = false;

    this.clicked = false;

    this.tl = gsap.timeline({ paused: true });
    this.audio = document.getElementById("audio");

    gsap.registerPlugin(SplitText);

    //////////////////////////////////////////////////// DEBUG
    this.debug = false;
    this.start = 200;
    //////////////////////////////////////////////////// DEBUG
  }

  init() {
    this.createButton({ text: "PLAY", x: 0, y: 0, z: 0 });

    // this.buttons.position.y = -1050;
    // this.buttons.position.z = 18400;
    this.buttons.position.y = -1650;
    this.buttons.position.z = 16400;

    // this.buttons.scale.set(3.5, 3.5, 3.5);
    this.buttons.scale.set(7, 7, 7);

    this.objectsToTest = this.buttonsMesh;

    this.finalScene.add(this.buttons);

    this.hoverLinks();

    if (this.debug) {
      setTimeout(() => {
        this.returnScene();
      }, 1000);
    }

    this.cityLights = this.road.cityLights;
  }

  clickListener(obj) {
    this.btnPlay.addEventListener("click", () => {
      // Help
      this.clicked = true;
      this.help.hidePlay();
      //

      const materialBtnClicked = this.materialButton;
      const materialTextClicked = this.textMaterial;

      gsap.to(this.buttons.position, {
        z: 16400 - 20,
        duration: 0.5,
      });

      gsap.to(materialBtnClicked.uniforms.changeColor2, {
        value: 1,
        duration: 0.5,
      });
      gsap.to(materialTextClicked.uniforms.changeColor2, {
        value: 1,
        duration: 0.5,
      });

      // Remove scroll
      document.body.style.overflow = "hidden";

      // Disable button
      this.btnPlay.disabled = true;

      // Block camera
      this.camera.playPressed = true;

      this.returnScene();
    });
  }

  returnScene() {
    // this.audio.muted = true;
    this.tl.play();
    this.audio.play();
    let start = 0;

    if (this.debug) {
      this.textGod.opacity.value = 1;
      start = this.start;
      this.tl.paused = true;
      this.audio.pause();
      setTimeout(() => {}, 500);
    }

    const steps = {};
    steps.one = 15;
    steps.two = 20;
    steps.three = 35;
    steps.four = 58;
    steps.five = 86;
    steps.six = 112;
    steps.seven = 163;

    this.audio.currentTime = start;

    this.tl.to(
      this.sky.animColors,
      {
        value: 1,
        duration: 60,
      },
      "<"
    );
    this.tl.to(
      this.sky.changeColor,
      {
        value: 0,
        duration: 60,
      },
      "<"
    );

    this.tl.to(
      this.sky.mesh.position,
      {
        y: -8000,
        duration: 20,
      },
      "<"
    );
    this.tl.to(
      this.sky.mesh.scale,
      {
        y: 3000,
        duration: 30,
      },
      "<"
    );

    this.tl.to(
      this.moon.moon.position,
      {
        x: -5000,
        y: 1000,
        z: 10000,
        duration: 50,
      },
      "<"
    );

    this.tl.to(
      this.moon.moonMaterial.uniforms.changeColor,
      {
        duration: 20,
        value: 1,
        ease: "power2.out",
      },
      "<"
    );
    this.tl.to(
      this.moon.moonMaterial.uniforms.wide,
      {
        duration: 23,
        value: 4,
        ease: "power2.out",
      },
      "<"
    );

    this.tl.to(
      this.plane,
      {
        textOpacity: 0,
        duration: 20,
      },
      "<"
    );

    this.tl.to(
      this.camera.position,
      {
        z: -28500,
        duration: 226,
        ease: "power1.inOut",
        onUpdate: () => {},
      },
      "<"
    );

    this.tl.to(
      this.flower.particlesMaterial.uniforms.scaleSize,
      {
        value: 1.5,
        duration: 100,
        ease: "power2.inOut",
      },
      "<"
    );

    this.tl.to(
      this.moon.moonMaterial.uniforms.opacity,
      {
        duration: 5,
        value: 1,
        ease: "linear",
      },
      "<"
    );

    this.tl.to(
      this.textFinal.materialsText[0].uniforms.opacity,
      {
        value: 0.5,
        delay: steps.one,
        duration: 16,
        ease: "power1.in",
      },
      "<"
    );

    this.tl.to(
      this.textStars,
      {
        disperse: 1,
        duration: 130,
      },
      "<"
    );
    this.tl.to(
      this.road.textBuilding,
      {
        disperse: 1,
        duration: 130,
      },
      "<"
    );

    this.tl.to(
      this.camera.rotation,
      {
        z: -Math.PI,
        // z: 0,
        delay: steps.two - steps.one,

        duration: 80,
        ease: "power1.inOut",
      },
      "<"
    );

    this.tl.to(
      this.textFinal.materialsText[0].uniforms.opacity,
      {
        value: 0,
        delay: steps.three - steps.two,
        duration: 22,
      },
      "<"
    );

    this.tl.to(
      this.textFinal.materialsText[1].uniforms.opacity,
      {
        value: 1,
        duration: 45,
      },
      "<"
    );

    this.tl.to(
      this.camera.rotation,
      {
        x: -Math.PI * 0.5,
        delay: steps.four - steps.three,
        duration: 50,
        ease: "power1.out",
      },
      "<"
    );

    this.tl.to(
      this.cityLights.textLight,
      {
        duration: 18,
        opacity: 1,
        ease: "power1.in",
      },
      "<"
    );

    this.tl.to(
      this.camera.rotation,
      {
        y: -Math.PI,
        delay: steps.five - steps.four,
        duration: 110,
        onStart: () => {},
      },
      "<"
    );

    this.tl.to(
      this.sky,
      {
        opacity: 0,
        duration: 1,
      },
      "<"
    );

    this.tl.to(
      this.singlePoint.material.uniforms.opacity,
      {
        value: 0,
        duration: 1,
      },
      "<"
    );

    this.tl.to(
      this.flower.particlesMaterial.uniforms.disperse,
      {
        value: 0,
        duration: 107,
        ease: "power1.inOut",
      },
      "<"
    );

    this.tl.to(
      this.flower.particlesMaterial.uniforms.scaleSize,
      {
        value: 2.5,
        duration: 10,
      },
      "<"
    );

    this.tl.to(
      this.flower.particlesMaterial.uniforms.changeColor,
      {
        value: 0,
        duration: 65,
        ease: "power2.in",
      },
      "<"
    );

    this.tl.to(
      this.textFinal.materialsText[1].uniforms.opacity,
      {
        value: 0,
        duration: 1,
      },
      "<"
    );

    this.tl.to(
      this.cityLights.textLight,
      {
        duration: 80,
        disperse: 1,
      },
      "<"
    );

    this.tl.to(
      this.road.textBuilding,
      {
        duration: 10,
        opacity: 0,
      },
      "<"
    );
    this.tl.to(
      this.textStars,
      {
        duration: 10,
        opacity: 0,
      },
      "<"
    );

    this.tl.to(
      this.cityLights.textLight,
      {
        duration: 30,
        opacity: 0,
      },
      "<"
    );

    this.tl.to(
      this.textGod.opacity,
      {
        value: 1,
        duration: 1,
      },
      "<"
    );

    this.tl.to(
      this.camera.rotation,
      {
        x: 0,
        delay: steps.six - steps.five,
        duration: 60,
      },
      "<"
    );

    this.tl.to(
      this.planet.planetMaterial.uniforms.wide,
      {
        value: 5.8,
        delay: steps.seven - steps.six,
        duration: 12,
        onStart: () => {
          console.log("start wide");
        },
      },
      "<"
    );

    this.tlFinal = gsap.timeline({ paused: true, delay: 2 });

    this.tlFinal.fromTo(
      ".final p",
      { opacity: 0, color: "#F41B0C" },
      {
        opacity: 1,
        color: "#ccc",
        duration: 3,
        ease: "power1.in",
      },
      "<"
    );

    this.audio.addEventListener("timeupdate", (event) => {
      const progress = this.audio.currentTime;

      if (progress > 204.5) {
        document.querySelector(".final").style.display = "flex";
        this.tlFinal.play();

        while (this.finalScene.children.length > 0) {
          this.finalScene.remove(this.finalScene.children[0]);
        }
      }
    });
  }

  createButton(options) {
    this.debugObject.color1 = "#0b0b0b";
    this.debugObject.color2 = "#0800c0";
    this.debugObject.color3 = "#0b0b0b";
    this.debugObject.colorText = "#ff00ef";
    this.debugObject.colorText3 = "#0b0b0b";

    this.folderButton.addColor(this.debugObject, "colorText").onChange(() => {
      this.textMaterial.uniforms.uColor2.value = new THREE.Color(this.debugObject.colorText);
    });
    this.folderButton.addColor(this.debugObject, "colorText3").onChange(() => {
      this.textMaterial.uniforms.uColor3.value = new THREE.Color(this.debugObject.colorText3);
    });

    this.folderButton.addColor(this.debugObject, "color1").onChange(() => {
      this.materialButton.uniforms.uColor1.value = new THREE.Color(this.debugObject.color1);
    });
    this.folderButton.addColor(this.debugObject, "color2").onChange(() => {
      this.materialButton.uniforms.uColor2.value = new THREE.Color(this.debugObject.color2);
    });
    this.folderButton.addColor(this.debugObject, "color3").onChange(() => {
      this.materialButton.uniforms.uColor3.value = new THREE.Color(this.debugObject.color3);
    });
    this.loader.load("/fonts/Soleil_Regular.json", (font) => {
      const textGeometry = new THREE.TextGeometry(options.text, {
        font: font,
        size: 3,
        height: 0,
        curveSegments: 10,
        bevelEnabled: false,
      });
      textGeometry.center();

      this.textMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          opacity: { value: 1 },
          uColor1: { value: new THREE.Color(this.debugObject.color1) },
          uColor2: { value: new THREE.Color(this.debugObject.colorText) },
          uColor3: { value: new THREE.Color(this.debugObject.colorText3) },
          changeColor: { value: 0 },
          changeColor2: { value: 0 },
        },
        transparent: true,
        vertexShader: vertexText,
        fragmentShader: fragmentText,
      });

      const textMesh = new THREE.Mesh(textGeometry, this.textMaterial);

      textMesh.position.x = options.x;
      textMesh.position.y = options.y + 2;
      textMesh.position.z = options.z + 20;
      textMesh.scale.set(6.5, 6.5, 6.5);

      this.textsMesh.push(textMesh);

      const geometryButton = new THREE.BoxBufferGeometry(8, 1, 2);
      this.materialButton = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          opacity: { value: 1 },
          uColor1: { value: new THREE.Color(this.debugObject.color1) },
          uColor2: { value: new THREE.Color(this.debugObject.color2) },
          uColor3: { value: new THREE.Color(this.debugObject.color3) },
          changeColor: { value: 0 },
          changeColor2: { value: 0 },
        },
        transparent: true,
        vertexShader: vertex,
        fragmentShader: fragment,
      });

      const button = new THREE.Mesh(geometryButton, this.materialButton);

      button.rotation.x = Math.PI * 0.5;
      button.position.x = options.x;
      button.position.y = options.y;
      button.position.z = options.z;
      button.scale.set(18, 18, 18);

      this.buttonsMesh.push(button);

      this.buttons.add(button, textMesh);

      // All buttons are loaded
      if (this.buttons.children.length > 0) {
        this.objectsToTest.forEach((obj) => {
          this.clickListener(obj);
        });
      }
    });
  }

  display() {
    gsap.to(this.materialButton.uniforms.changeColor, {
      value: 1,
    });
    gsap.to(this.textMaterial.uniforms.changeColor, {
      value: 1,
    });

    document.querySelector(".btn__wrapper .play").style.pointerEvents = "auto";

    // Help
    setTimeout(() => {
      if (this.clicked === false) {
        this.help.displayPlay();
      } else {
        return;
      }
    }, 5000);
  }

  hide() {
    gsap.to(this.materialButton.uniforms.changeColor, {
      value: 0,
    });
    gsap.to(this.textMaterial.uniforms.changeColor, {
      value: 0,
    });

    document.querySelector(".btn__wrapper .play").style.pointerEvents = "none";

    // Help
    this.help.hidePlay();
  }

  hoverLinks() {
    const linkRoman = document.querySelector(".link__roman");
    const linkBeau = document.querySelector(".link__beau");
    const finalSpans = document.querySelectorAll(".final span");

    linkBeau.addEventListener("mouseenter", () => {
      finalSpans.forEach((span) => {
        span.classList.add("inactive");
      });
      linkRoman.classList.add("inactive");
    });
    linkBeau.addEventListener("mouseleave", () => {
      finalSpans.forEach((span) => {
        span.classList.remove("inactive");
        linkRoman.classList.remove("inactive");
      });
    });

    linkRoman.addEventListener("mouseenter", () => {
      finalSpans.forEach((span) => {
        span.classList.add("inactive");
      });
      linkBeau.classList.add("inactive");
    });
    linkRoman.addEventListener("mouseleave", () => {
      finalSpans.forEach((span) => {
        span.classList.remove("inactive");
        linkBeau.classList.remove("inactive");
      });
    });
  }

  anim(progress, time) {
    if (this.materialButton) {
      this.materialButton.uniforms.time.value = time;
    }
    this.tl.seek(this.audio.currentTime);
    if (this.buttonsMesh.length > 0) {
      const screenPosition = this.buttonsMesh[0].position.clone();
      screenPosition.project(this.camera);
      const translateX = screenPosition.x * this.sizes.width * 1600;
      const translateY = screenPosition.y * this.sizes.height * 9;
      this.btnPlay.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
    }
    if (this.debug) {
      this.sky.opacity = 0;
    }
  }
}
