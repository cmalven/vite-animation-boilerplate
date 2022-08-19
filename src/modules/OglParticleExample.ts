import {
  Renderer,
  Camera,
  Transform,
  Program,
  Mesh,
  Geometry,
  Orbit,
  OGLRenderingContext,
  Vec3,
  Texture,
} from 'ogl';
import vertex from './shaders/ogl_particle_example_vert.glsl';
import fragment from './shaders/ogl_particle_example_frag.glsl';

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
  particles?: Mesh;
  geometry?: Geometry;

  // Uniforms
  uniforms: { [key: string]: { value: number | number[] | Texture | undefined } } = {};

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
    this.updateUniforms();
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
    this.renderer = new Renderer({ depth: false });
    this.gl = this.renderer.gl;

    // If no GL context, return
    if (!this.gl) return;

    // Add to container
    this.container.appendChild(this.gl.canvas);

    // Set clear color
    this.gl.clearColor(1, 1, 1, 1);

    // Camera
    this.camera = new Camera(this.gl, { fov: 15 });
    this.camera.position.set(0, 0, 15);
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
      uniforms: this.uniforms,
      depthTest: false,
      transparent: true,
    });
  };

  createItems = () => {
    if (!this.gl || !this.scene) return;

    const num = 300;
    const position = new Float32Array(num * 3);
    const random = new Float32Array(num * 4);

    for (let i = 0; i < num; i++) {
      position.set([Math.random(), Math.random(), Math.random()], i * 3);
      random.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    }

    this.geometry = new Geometry(this.gl, {
      position: { size: 3, data: position },
      random: { size: 4, data: random },
    });

    this.particles = new Mesh(this.gl, {
      mode: this.gl.POINTS,
      geometry: this.geometry,
      program: this.program,
    });
  };

  updateItems = () => {
    if (!this.particles) return;

    this.particles.rotation.x = Math.sin(this.time * 0.0002) * 0.1;
    this.particles.rotation.y = Math.cos(this.time * 0.0005) * 0.15;
    this.particles.rotation.z += 0.01;
  };

  resize = () => {
    if (!this.container || !this.renderer || !this.gl || !this.camera) return;
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.camera.perspective({ aspect: this.gl.canvas.width / this.gl.canvas.height });
  };

  updateUniforms = () => {
    if (!this.program) return;

    this.uniforms = {
      uTime: { value: this.time },
    };

    this.program.uniforms = this.uniforms;
  };

  update = () => {
    if (!this.controls || !this.renderer) return;

    // Update controls
    this.controls.update();

    // Update uniforms
    this.updateUniforms();

    // Update time
    const now = performance.now() / 1000;
    this.time += now - this.lastTime;
    this.lastTime = now;

    this.updateItems();

    // Render
    this.renderer.render({ scene: this.particles, camera: this.camera });

    window.requestAnimationFrame(this.update);
  };
}

export default OglBasicExample;
