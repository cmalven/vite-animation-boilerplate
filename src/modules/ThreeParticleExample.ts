import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import colorPalettes from 'nice-color-palettes';
import vertShader from './shaders/threeParticleExampleVert.glsl?raw';
import fragShader from './shaders/threeParticleExampleFrag.glsl?raw';

/**
 * Boilerplate module using THREE.js
 */

class ThreeParticleExample {
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
    this.geometry;
    this.particles;
    this.pointTexture;
    this.uniforms;

    // Mouse
    this.currentMouse = { x: 0, y: 0 };
    this.targetMouse = { x: 0, y: 0 };

    // Settings
    this.settings = {
      cameraDistance: 100,
      minSize: 5,
      maxSize: 50,
      bgColor: 0x212322,
      mouseEase: 0.05,
    };

    this.init();
  }

  init = async() => {
    this.createGui();
    await this.loadTexture();
    this.createUniforms();
    this.createApp();
    this.createItems();
    this.addEventListeners();
    this.update();
  }

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('ThreeExample');
    folder.open();

    window.APP.gui.add(this.settings, 'minSize', 1, 90);
    window.APP.gui.add(this.settings, 'maxSize', 1, 90);
    window.APP.gui.add(this.settings, 'mouseEase', 0.001, 1);
  }

  loadTexture = async() => {
    this.pointTexture = await new THREE.TextureLoader().load('https://assets.codepen.io/66496/dot.png');
  }

  createUniforms = () => {
    this.uniforms = {
      pointTexture: { value: this.pointTexture },
      currentMouse: { value: this.currentMouse },
    };
    this.updateUniforms();
  }

  updateUniforms = () => {
    Object.assign(this.uniforms, {}, {
      time: { value: this.time },
      minSize: { value: this.settings.minSize },
      maxSize: { value: this.settings.maxSize },
    });
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
  }

  createItems = () => {
    // Create the geometry
    this.geometry = new THREE.BufferGeometry();

    // Create the material
    let shaderMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    });

    // Get the color palette
    const palette = colorPalettes[Math.floor(Math.random() * 50)];

    // Set particle variables
    const numItems = 800;
    const positions = new Float32Array(numItems * 3);
    const sizes = new Float32Array(numItems);
    const indexes = new Float32Array(numItems);
    const colors = new Float32Array(numItems * 3);

    for (let idx = 0, length = numItems; idx < length; idx++) {
      const x = Math.random() * 100 - 50;
      const y = Math.random() * 100 - 50;
      const z = Math.random() * 100 - 50;
      const randColor = palette[Math.floor(Math.random() * palette.length)];
      const color = new THREE.Color(randColor);
      positions[idx*3] = x;
      positions[idx*3 + 1] = y;
      positions[idx*3 + 2] = z;
      sizes[idx] = Math.random();
      indexes[idx] = idx;
      colors[idx*3] = color.r;
      colors[idx*3 + 1] = color.g;
      colors[idx*3 + 2] = color.b;
    }

    // Set buffer attributes
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage));
    this.geometry.setAttribute('index', new THREE.BufferAttribute(indexes, 1).setUsage(THREE.DynamicDrawUsage));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.particles = new THREE.Points(this.geometry, shaderMaterial);

    // Add particles to the scene
    this.scene.add(this.particles);
  }

  addEventListeners = () => {
    this.appContainer.addEventListener('mousemove', this.onMouseMove);
  }

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
  }

  updateMouse = () => {
    const mouseDiffX = (this.targetMouse.x - this.currentMouse.x) * this.settings.mouseEase;
    const mouseDiffY = (this.targetMouse.y - this.currentMouse.y) * this.settings.mouseEase;

    this.currentMouse.x += mouseDiffX;
    this.currentMouse.y += mouseDiffY;
  }

  updateItems = () => {

  }

  update = () => {
    if (window.APP.stats) window.APP.stats.begin();
    this.time = this.clock.getElapsedTime();

    this.updateMouse();
    this.updateUniforms();


    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.update);
    if (window.APP.stats) window.APP.stats.end();
  }
}

export default ThreeParticleExample;
