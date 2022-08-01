import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Boilerplate module using THREE.js
 */

class ThreeBasicExample {
  // Container
  container: HTMLElement | null;

  // Time
  clock = new THREE.Clock();
  time = 0;

  // THREE items
  renderer?: THREE.WebGLRenderer;
  camera?: THREE.PerspectiveCamera;
  scene?: THREE.Scene;
  controls?: OrbitControls;
  mesh?: THREE.Mesh;

  // Settings
  settings = {
    cameraDistance: 5,
    scalePeriod: 8,
    bgColor: 0x212322,
  };

  constructor(containerSelector = '[data-app-container]') {
    this.container = document.querySelector(containerSelector);

    this.init();
  }

  init = () => {
    this.createGui();
    this.createApp();
    this.createItems();
    this.update();
  };

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('ThreeExample');
    folder.open();

    window.APP.gui.add(this.settings, 'scalePeriod', 0.5, 20);
  };

  createApp = () => {
    if (!this.container) return;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
    });
    this.renderer.setPixelRatio(1.5);
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.container.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, this.container.offsetWidth / this.container.offsetHeight, 1, 10000);
    this.camera.position.set(-3, 2, this.settings.cameraDistance);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.settings.bgColor);

    // Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false;
    this.controls.enableDamping = false;

    // Resize the renderer on window resize
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    }, true);

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.scene.add(ambientLight);

    // Directional Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(5, 3, 2);
    directionalLight.target.position.set(0, 0, 0);
    this.scene.add(directionalLight);
  };

  createItems = () => {
    if (!this.scene) return;

    // Box
    const boxGeom = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x0000ff,
      shininess: 0,
    });
    this.mesh = new THREE.Mesh(boxGeom, material);
    this.scene.add(this.mesh);
  };

  updateItems = () => {
    if (!this.mesh) return;

    const time = this.time;
    const amplitude = 0.3;
    const period = this.settings.scalePeriod;

    const baseScale = 0.4;
    const scaleEffect = baseScale + amplitude * Math.sin((Math.PI * 2) * (time / period));
    this.mesh.scale.set(scaleEffect, scaleEffect, scaleEffect);
  };

  update = () => {
    if (!this.renderer || !this.camera || !this.scene) return;

    this.time = this.clock.getElapsedTime();

    this.updateItems();

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.update);

  };
}

export default ThreeBasicExample;
