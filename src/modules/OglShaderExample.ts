import {
  Renderer,
  Program,
  Mesh,
  Triangle,
  OGLRenderingContext,
  Texture,
} from 'ogl';
import vertex from './shaders/ogl_shader_example_vert.glsl';
import fragment from './shaders/ogl_shader_example_frag.glsl';

/**
 * Boilerplate shader module using OGL
 */

class OglShaderExample {
  // Container
  container: HTMLElement | null;

  // Time
  lastTime = performance.now() / 1000;
  time = 0;

  // OGL items
  renderer?: Renderer;
  gl?: OGLRenderingContext;
  program?: Program;
  mesh?: Mesh;

  // Resolution
  resolution = { width: 0, height: 0, max: 0, min: 0 };
  offset = { x: 0, y: 0 };

  // Mouse
  mouse = { x: 0, y: 0 };

  // Uniforms
  uniforms: { [key: string]: { value: number | number[] | boolean | Texture | undefined } } = {};

  // Settings
  settings = {
    scale: 1,
  };

  constructor(containerSelector = '[data-app-container]') {
    this.container = document.querySelector(containerSelector);

    this.init();
  }

  init = () => {
    this.createGui();
    this.createApp();
    this.addEventListeners();
    this.createItems();
    this.updateUniforms();
    this.update();
  };

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('OglShaderExample');
    folder.open();

    window.APP.gui.add(this.settings, 'scale', 0.01, 2);
  };

  addEventListeners = () => {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.resize, false);
    this.resize();
  };

  createApp = () => {
    if (!this.container) return;

    // Renderer
    this.renderer = new Renderer();
    this.gl = this.renderer.gl;

    // If no GL context, return
    if (!this.gl) return;

    // Add to container
    this.container.appendChild(this.gl.canvas);

    // Set clear color
    this.gl.clearColor(1, 1, 1, 1);

    // Program
    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: this.uniforms,
    });
  };

  createItems = () => {
    if (!this.gl) return;

    // Triangle Mesh
    const geometry = new Triangle(this.gl);
    this.mesh = new Mesh(this.gl, { geometry, program: this.program });
  };

  updateItems = () => {
    // Update items here
  };

  onMouseMove = (evt: MouseEvent) => {
    this.mouse = { x: evt.clientX, y: this.resolution.height - evt.clientY };
  };

  resize = () => {
    if (!this.renderer) return;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const width = this.renderer.width;
    const height = this.renderer.height;
    const max = Math.max(width, height);
    const min = Math.min(width, height);
    const offset = (max - min) / 2;
    const x = width < height ? offset : 0;
    const y = width > height ? offset : 0;

    this.resolution = { width, height, max, min };
    this.offset = { x, y };
  };

  updateUniforms = () => {
    if (!this.program) return;

    this.uniforms = {
      uTime: { value: this.time },
      uResolution: { value: Object.values(this.resolution) },
      uOffset: { value: Object.values(this.offset) },
      uScale: { value: this.settings.scale },
      uMouse: { value: Object.values(this.mouse) },
    };

    this.program.uniforms = this.uniforms;
  };

  update = () => {
    if (!this.renderer) return;
    if (window.APP.stats) window.APP.stats.begin();

    // Update uniforms
    this.updateUniforms();

    // Update time
    const now = performance.now() / 1000;
    this.time += now - this.lastTime;
    this.lastTime = now;

    this.updateItems();

    // Render
    this.renderer.render({ scene: this.mesh });

    window.requestAnimationFrame(this.update);
    if (window.APP.stats) window.APP.stats.end();
  };
}

export default OglShaderExample;
