import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertShader from './shaders/threeImageExampleVert.glsl?raw';
import fragShader from './shaders/threeImageExampleFrag.glsl?raw';

/**
 * Boilerplate module using THREE.js
 */

class ThreeImageExample {
  constructor(options = {
    containerSelector: '[data-app-container]',
  }) {
    this.options = options;
    this.container = document.querySelector(this.options.containerSelector);

    // Time
    this.clock = new THREE.Clock();
    this.time = 0;

    // THREE items
    this.renderer;
    this.camera;
    this.scene;
    this.controls;
    this.imageTexture;
    this.uniforms;
    this.geometry;
    this.mesh;

    // Mouse
    this.currentMouse = { x: 0, y: 0 };
    this.targetMouse = { x: 0, y: 0 };

    // Settings
    this.settings = {
      cameraDistance: 100,
      bgColor: 0x212322,
      mouseEase: 0.05,
    };

    this.init();
  }

  init = async () => {
    this.createGui();
    await this.loadTexture();
    this.createUniforms();
    this.createApp();
    this.createItems();
    this.addEventListeners();
    this.update();
  };

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('ThreeExample');
    folder.open();

    window.APP.gui.add(this.settings, 'mouseEase', 0.001, 1);
  };

  loadTexture = async () => {
    this.imageTexture = await new THREE.TextureLoader().load('/assets/chicago.jpg');
  };

  createUniforms = () => {
    this.uniforms = {
      imageTexture: { value: this.imageTexture },
    };
    this.updateUniforms();
  };

  updateUniforms = () => {
    Object.assign(this.uniforms, {}, {
      time: { value: this.time },
      currentMouse: { value: this.currentMouse },
    });
  };

  createApp = () => {
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
    this.controls.enableKeys = false;
    this.controls.enableZoom = false;
    this.controls.enableDamping = false;

    // Resize the renderer on window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    }, true);
  };

  createItems = () => {
    // Create the geometry
    const imageRatio = 1333 / 2000;
    const imageWidth = 60;
    this.geometry = new THREE.PlaneBufferGeometry(imageWidth, imageWidth * imageRatio, 16 * 2, 9 * 2);

    // Create the material
    let shaderMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      depthTest: true,
      transparent: true,
      vertexColors: true,
      side: THREE.DoubleSide,
    });

    // Create the mesh
    this.mesh = new THREE.Mesh(this.geometry, shaderMaterial);

    // Add mesh to the scene
    this.scene.add(this.mesh);
  };

  addEventListeners = () => {
    this.container.addEventListener('mousemove', this.onMouseMove);
  };

  onMouseMove = evt => {
    // Project mouse position onto Z plane based on camera
    let vec = new THREE.Vector3();
    let pos = new THREE.Vector3();
    vec.set(
      (evt.clientX / window.innerWidth) * 2 - 1,
      - (evt.clientY / window.innerHeight) * 2 + 1,
      0.5);
    vec.unproject(this.camera);
    vec.sub(this.camera.position).normalize();
    let distance = - this.camera.position.z / vec.z;
    pos.copy(this.camera.position).add(vec.multiplyScalar(distance));

    this.targetMouse = { x: pos.x, y: pos.y };
  };

  updateMouse = () => {
    const mouseDiffX = (this.targetMouse.x - this.currentMouse.x) * this.settings.mouseEase;
    const mouseDiffY = (this.targetMouse.y - this.currentMouse.y) * this.settings.mouseEase;

    this.currentMouse.x += mouseDiffX;
    this.currentMouse.y += mouseDiffY;
  };

  updateItems = () => {

  };

  update = () => {
    if (window.APP.stats) window.APP.stats.begin();
    this.time = this.clock.getElapsedTime();

    this.updateMouse();
    this.updateUniforms();
    this.updateItems();

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.update);
    if (window.APP.stats) window.APP.stats.end();
  };
}

export default ThreeImageExample;