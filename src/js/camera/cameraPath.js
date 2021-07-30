import * as THREE from "three";

export default class cameraPath {
  constructor(options) {
    this.camera = options.camera;
    this.scene = options.scene;
    this.renderer = options.renderer;
    this.container = options.container;
    this.sizes = options.sizes;
    this.gui = options.gui;
    this.splineCamera = null;
    this.cameraHelper = null;

    this.direction = new THREE.Vector3();
    this.binormal = new THREE.Vector3();
    this.normal = new THREE.Vector3();
    this.position = new THREE.Vector3();

    this.tubeGeometry = null;
    this.mesh = null;

    this.params = {
      extrusionSegments: 100,
      radiusSegments: 3,
      animationView: true,
      lookAhead: false,
      cameraHelper: false,
    };

    this.progress = 0;

    this.playPressed = false;

    // ACTIVE CAMERA /////////////////
    this.isActive = true;
    window.camera = this.camera;
    // ACTIVE CAMERA /////////////////

    this.positionCameraLarge();
    this.init();
  }

  positionCameraLarge() {
    if (this.isActive) {
      this.camera.position.x = -1000.4;
      this.camera.position.y = -6584.3;
      this.camera.position.z = 506.94;

      this.posCameraLarge = new THREE.Vector3(-5500, -4500, 0);

      this.params.animationView = false;
      document.body.classList.remove("scroll");
      document.querySelector(".btn__wrapper").style.pointerEvents = "none";
    } else {
      document.body.classList.add("scroll");
      document.querySelector(".btn__wrapper").style.pointerEvents = "auto";
    }
  }

  addTube(curve) {
    if (this.mesh) {
      this.scene.remove(this.mesh);
    }
    this.splines = {
      spline: new THREE.CatmullRomCurve3(curve),
    };

    this.extrudePath = this.splines.spline;

    this.material = new THREE.LineBasicMaterial({ color: 0xff00ff });

    this.tubeGeometry = new THREE.TubeGeometry(
      this.extrudePath,
      this.params.extrusionSegments,
      0.2,
      this.params.radiusSegments
    );
    this.mesh = new THREE.Mesh(this.tubeGeometry, this.material);

    // HIDE TUBE //////////////////////////////////////
    this.mesh.visible = false;

    this.scene.add(this.mesh);
  }

  animateCamera() {
    // Toggle Tube
    this.mesh.visible = !this.mesh.visible;
  }

  toggleCameraHelper() {
    this.cameraHelper.visible = !this.params.cameraHelper;
  }

  resize(width, height) {
    this.sizes.width = width;
    this.sizes.height = height;
    const ratio = this.sizes.width / this.sizes.height;
    this.splineCamera.aspect = ratio;
    this.splineCamera.updateProjectionMatrix();
  }

  init() {
    // Camera
    this.cameraGroup = new THREE.Group();

    this.splineCamera = new THREE.PerspectiveCamera(70, this.sizes.width / this.sizes.height, 0.01, 115000);

    var vector = new THREE.Vector3(); // create once and reuse it!

    this.cameraGroup.add(this.splineCamera);

    this.scene.add(this.cameraGroup);

    this.cameraHelper = new THREE.CameraHelper(this.splineCamera);
    this.scene.add(this.cameraHelper);
    this.cameraHelper.visible = this.params.cameraHelper;

    // GUI
    this.folderCamera = this.gui.addFolder("Camera");
    this.folderCamera.add(this.params, "animationView").onChange(() => {
      this.isActive = !this.isActive;
      this.positionCameraLarge();
    });
    this.folderCamera.add(this.params, "cameraHelper").onChange(() => {
      this.toggleCameraHelper();
    });
    this.folderCamera.open();
  }

  cameraPath(progress, time, parallax) {
    this.looptime = 20 * 1000;

    // range number between 0 and 1
    this.t = (progress % this.looptime) / this.looptime;
    this.t2 = ((progress + 0.1) % this.looptime) / this.looptime;

    this.pos = this.mesh.geometry.parameters.path.getPointAt(this.t);
    this.pos2 = this.mesh.geometry.parameters.path.getPointAt(this.t2);

    // if (!this.playPressed) {
    this.cameraGroup.position.copy(this.pos2);
    // }

    this.splineCamera.position.x = parallax.eased.x;
    this.splineCamera.position.y = parallax.eased.y;
    // this.splineCamera.translateY(parallax.eased.y);

    this.cameraHelper.update();
  }

  anim(progress, time, parallax) {
    // animate camera along spline
    this.camera.updateProjectionMatrix();

    this.cameraPath(this.progress, time, parallax);
    if (this.isActive) {
      this.camera.lookAt(this.posCameraLarge);
    }

    this.renderer.render(this.scene, this.params.animationView === true ? this.splineCamera : this.camera);
  }
}

//
