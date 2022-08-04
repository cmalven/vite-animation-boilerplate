import {
  Renderer,
  Camera,
  Transform,
  Program,
  Mesh,
  Box,
  Orbit,
  OGLRenderingContext,
  Vec3,
} from 'ogl';

const vertex = `
    attribute vec3 position;
    attribute vec3 normal;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    varying vec3 vNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragment = `
    precision highp float;
    varying vec3 vNormal;
    void main() {
        vec3 normal = normalize(vNormal);
        float lighting = dot(normal, normalize(vec3(-0.1, 0.8, 0.6)));
        gl_FragColor.rgb = vec3(0.2, 0.8, 1.0) + lighting * 0.1;
        gl_FragColor.a = 1.0;
    }
`;

/**
 * Boilerplate module using OGL
 */

class OglBasicExample {
  // Container
  container: HTMLElement | null;

  // Time
  lastTime = performance.now() / 1000;
  time = 0;

  // OGL items
  renderer?: Renderer;
  gl?: OGLRenderingContext;
  camera?: Camera;
  scene?: Transform;
  program?: Program;
  controls?: Orbit;
  cube?: Mesh;

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
    this.renderer = new Renderer({ dpr: 2 });
    this.gl = this.renderer.gl;

    // If no GL context, return
    if (!this.gl) return;

    // Add to container
    this.container.appendChild(this.gl.canvas);

    // Set clear color
    this.gl.clearColor(0, 0, 0, 0);

    // Camera
    this.camera = new Camera(this.gl, { fov: 35 });
    this.camera.position.set(0, 1, 7);
    this.camera.lookAt(new Vec3(0, 0, 0));
    this.controls = new Orbit(this.camera);

    // Resizing
    window.addEventListener('resize', this.resize, false);
    this.resize();

    // Scene
    this.scene = new Transform();

    // Program
    this.program = new Program(this.gl, {
      vertex,
      fragment,
    });
  };

  createItems = () => {
    if (!this.gl || !this.scene) return;

    // Cube
    const cubeGeometry = new Box(this.gl);
    this.cube = new Mesh(this.gl, { geometry: cubeGeometry, program: this.program });
    this.cube.position.set(0, 0, 0);
    this.cube.setParent(this.scene);
  };

  updateItems = () => {
    if (!this.cube) return;

    const time = this.time;
    const amplitude = 0.3;
    const period = this.settings.scalePeriod;

    const baseScale = 0.7;
    const scaleEffect = baseScale + amplitude * Math.sin((Math.PI * 2) * (time / period));
    this.cube.scale = new Vec3(scaleEffect, scaleEffect, scaleEffect);
    this.cube.rotation.y -= 0.01;
  };

  resize = () => {
    if (!this.container || !this.renderer || !this.gl || !this.camera) return;
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.camera.perspective({ aspect: this.gl.canvas.width / this.gl.canvas.height });
  };

  update = () => {
    if (!this.controls || !this.renderer) return;

    // Update controls
    this.controls.update();

    // Update time
    const now = performance.now() / 1000;
    this.time += now - this.lastTime;
    this.lastTime = now;

    this.updateItems();

    // Render
    this.renderer.render({ scene: this.scene, camera: this.camera });

    window.requestAnimationFrame(this.update);
  };
}

export default OglBasicExample;
