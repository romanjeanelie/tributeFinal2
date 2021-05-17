import * as THREE from "three";

import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

import cameraPath from "./cameraPath";
import { LogLuvEncoding } from "three";

export default class CreatePath {
  constructor(options) {
    this.container = options.container;
    this.camera = options.camera;
    this.scene = options.scene;
    this.renderer = options.renderer;
    this.controls = options.controls;
    this.gui = options.gui;

    this.splineHelperObjects = [];
    this.splinePointsLength = 4;
    this.positions = [];
    this.point = new THREE.Vector3();

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.onUpPosition = new THREE.Vector2();
    this.onDownPosition = new THREE.Vector2();

    this.geometry = new THREE.BoxGeometry(20, 20, 20);
    this.transformControl;

    this.ARC_SEGMENTS = 200;

    this.splines = {};

    this.codeCurve = [
      new THREE.Vector3(516.0070336965083, 76.99118361639042, 3.6003446214659967),
      new THREE.Vector3(165.3978506734047, 55.77475073285952, -61.3002486221354),
      new THREE.Vector3(-26.491533393748455, 61.48348806732774, -124.11445194211284),
      new THREE.Vector3(2.7064228794056895, 69.82724672099745, -18.201708198476528),
      new THREE.Vector3(-3.2070442316403596, -47.70566097733623, 99.2823595051571),
      new THREE.Vector3(88.31455120145267, -21.99544882379576, 112.04905088709852),
      new THREE.Vector3(170.4478841224952, 124.95044442800464, 100.70431254286862),
    ];

    this.params = {
      uniform: true,
      tension: 0.5,
      centripetal: true,
      chordal: true,
      addPoint: () => this.addPoint(),
      removePoint: () => this.removePoint(),
      exportSpline: () => this.exportSpline(),
      toggleCurve: () => this.toggleCurve(),
    };

    this.init();

    this.createCameraPath();
  }

  init() {
    // GUI
    this.gui.add(this.params, "addPoint");
    this.gui.add(this.params, "removePoint");
    this.gui.add(this.params, "exportSpline");
    this.gui.add(this.params, "toggleCurve");
    this.gui.open();

    // Transform Controls
    this.transformControl = new TransformControls(this.camera, this.renderer.domElement);
    this.transformControl.addEventListener("change", () => this.anim());
    this.transformControl.addEventListener("dragging-changed", (event) => {
      this.controls.enabled = !event.value;
    });
    this.scene.add(this.transformControl);

    this.transformControl.addEventListener("objectChange", () => {
      this.updateSplineOutline();
    });

    // Event listeners
    this.container.addEventListener("pointerdown", (e) => this.onPointerDown(e));
    this.container.addEventListener("pointerup", (e) => this.onPointerUp(e));
    this.container.addEventListener("pointermove", (e) => this.onPointerMove(e));

    /*******
     * Curves
     *********/
    this.createCurve();
  }

  createCameraPath() {
    this.cameraPath = new cameraPath({
      scene: this.scene,
      camera: this.camera,
      gui: this.gui,
      renderer: this.renderer,
      container: this.container,
    });
    this.cameraPath.addTube(this.codeCurve);
  }

  createCurve() {
    for (let i = 0; i < this.splinePointsLength; i++) {
      this.addSplineObject(this.positions[i]);
    }

    this.positions.length = 0;

    for (let i = 0; i < this.splinePointsLength; i++) {
      this.positions.push(this.splineHelperObjects[i].position);
    }

    this.lineGeometry = new THREE.BufferGeometry();
    this.lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(this.ARC_SEGMENTS * 3), 3));

    this.curve = new THREE.CatmullRomCurve3(this.positions);
    this.curve.curveType = "catmullrom";
    this.curve.mesh = new THREE.Line(
      this.lineGeometry.clone(),
      new THREE.LineBasicMaterial({
        color: 0xff0000,
        opacity: 0.35,
      })
    );
    this.splines.uniform = this.curve;

    this.splines.chordal = this.curve;

    for (const k in this.splines) {
      this.spline = this.splines[k];

      this.scene.add(this.spline.mesh);
    }

    this.load(this.codeCurve);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  addSplineObject(position) {
    this.material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
    this.object = new THREE.Mesh(this.geometry, this.material);

    if (position) {
      this.object.position.copy(position);
    } else {
      this.object.position.x = Math.random() * 1000 - 500;
      this.object.position.y = Math.random() * 600;
      this.object.position.z = Math.random() * 800 - 400;
    }

    this.object.scale.set(0.5, 0.5, 0.5);
    this.scene.add(this.object);
    this.splineHelperObjects.push(this.object);

    return this.object;
  }

  addPoint() {
    this.splinePointsLength++;

    this.positions.push(this.addSplineObject().position);

    this.updateSplineOutline();
  }

  removePoint() {
    if (this.splinePointsLength <= 4) {
      return;
    }

    this.pointToRemove = this.splineHelperObjects.pop();
    this.splinePointsLength--;
    this.positions.pop();

    if (this.transformControl.object === this.pointToRemove) this.transformControl.detach();
    this.scene.remove(this.pointToRemove);

    this.updateSplineOutline();
  }

  updateSplineOutline() {
    for (let k in this.splines) {
      this.spline = this.splines[k];

      this.splineMesh = this.spline.mesh;
      this.position = this.splineMesh.geometry.attributes.position;

      for (let i = 0; i < this.ARC_SEGMENTS; i++) {
        const t = i / (this.ARC_SEGMENTS - 1);
        this.spline.getPoint(t, this.point);
        this.position.setXYZ(i, this.point.x, this.point.y, this.point.z);
      }

      this.position.needsUpdate = true;
    }
  }

  exportSpline() {
    this.strplace = [];
    this.points = [];

    for (let i = 0; i < this.splinePointsLength; i++) {
      const p = this.splineHelperObjects[i].position;
      this.strplace.push(`new THREE.Vector3(${p.x}, ${p.y}, ${p.z})`);
      this.points.push(p);
    }

    this.codeToCopy = "[" + this.strplace.join(",\n\t") + "]";
    console.log(this.codeToCopy);
    this.cameraPath.addTube(this.points);
  }

  toggleCurve() {
    const state = this.spline.mesh.visible;

    this.spline.mesh.visible = !state;

    for (const i in this.splineHelperObjects) {
      const cube = this.splineHelperObjects[i];
      cube.visible = !state;
    }
  }

  load(new_positions) {
    while (new_positions.length > this.positions.length) {
      this.addPoint();
    }

    while (new_positions.length < this.positions.length) {
      this.removePoint();
    }

    for (let i = 0; i < this.positions.length; i++) {
      this.positions[i].copy(new_positions[i]);
    }

    this.updateSplineOutline();
  }

  anim() {
    //this.splines.uniform.mesh.visible = this.params.uniform;
  }

  onPointerDown(event) {
    this.onDownPosition.x = event.clientX;
    this.onDownPosition.y = event.clientY;
  }

  onPointerUp(event) {
    this.onUpPosition.x = event.clientX;
    this.onUpPosition.y = event.clientY;

    if (this.onDownPosition.distanceTo(this.onUpPosition) === 0) this.transformControl.detach();
  }

  onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    this.intersects = this.raycaster.intersectObjects(this.splineHelperObjects);

    if (this.intersects.length > 0) {
      const object = this.intersects[0].object;

      if (object !== this.transformControl.object) {
        this.transformControl.attach(object);
      }
    }
  }
}
