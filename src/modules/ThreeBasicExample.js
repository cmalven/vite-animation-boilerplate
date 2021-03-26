import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Boilerplate module using THREE.js
 */

class ThreeBasicExample {
  constructor(options = {
    appContainerSelector: '[data-app-container]',
  }) {
    this.options = options;
    this.appContainer = document.querySelector(this.options.appContainerSelector);

    // Time
    this.clock = new THREE.Clock();
    this.time = 0;

    // THREE items
    this.renderer;
    this.camera;
    this.scene;
    this.controls;
    this.mesh;

    // Settings
    this.settings = {
      cameraDistance: 5,
      scalePeriod: 8,
      bgColor: 0x212322,
    };

    this.init();
  }

  init = () => {
    this.createGui();
    this.createApp();
    this.createItems();
    this.update();
  }

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('ThreeExample');
    folder.open();

    window.APP.gui.add(this.settings, 'scalePeriod', 0.5, 20);
  }

  createApp = () => {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      devicePixelRatio: 1.5,
      antialias: false,
    });
    this.renderer.setSize(this.appContainer.offsetWidth, this.appContainer.offsetHeight);
    this.appContainer.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, this.appContainer.offsetWidth / this.appContainer.offsetHeight, 1, 10000);
    this.camera.position.set(-3, 2, this.settings.cameraDistance);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.settings.bgColor);

    // Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableKeys = false;
    this.controls.enableZoom = false;
    this.controls.enableDamping = false;

    // Resize the renderer on window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = this.appContainer.offsetWidth / this.appContainer.offsetHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.appContainer.offsetWidth, this.appContainer.offsetHeight);
    }, true);

    // Ambient Light
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.scene.add(ambientLight);

    // Directional Light
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(5, 3, 2);
    directionalLight.target.position.set(0, 0, 0);
    this.scene.add(directionalLight);
  }

  createItems = () => {
    // Box
    let boxGeom = new THREE.BoxGeometry(2, 2, 2);
    let material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x0000ff,
      shininess: 0,
    });
    this.mesh = new THREE.Mesh(boxGeom, material);
    this.scene.add(this.mesh);
  }

  updateItems = () => {
    const time = this.time;
    const amplitude = 0.3;
    const period = this.settings.scalePeriod;

    const baseScale = 0.4;
    const scaleEffect = baseScale + amplitude * Math.sin((Math.PI * 2) * (time / period));
    this.mesh.scale.set(scaleEffect, scaleEffect, scaleEffect);
  }

  update = () => {
    this.time = this.clock.getElapsedTime();

    this.updateItems();

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.update);

  }
}

export default ThreeBasicExample;
