import regl from 'regl';
import vertShader from './shaders/regl_example_vert.glsl';
import fragShader from './shaders/regl_example_frag.glsl';

type ReglProps = {
  time: number,
  resolution: [number, number, number, number],
  mouse: [number, number],
  offset: [number, number],
  scale: number,
}

/**
 * Boilerplate module using regl
 */

class ReglExample {
  // Container
  container: HTMLElement | null;

  // Pixel ratio
  pixelRatio = Math.min(1.3, window.devicePixelRatio);

  // Regl
  regl?: regl.Regl;
  draw?: regl.DrawCommand;

  // Time
  lastTime = performance.now() / 1000;
  time = 0;

  // Settings
  settings = {
    scale: 1,
  };

  // Size
  resolution = { width: 0, height: 0, max: 0, min: 0 };

  // Drawing offset
  offset = { x: 0, y: 0 };

  // Mouse
  mouse = { x: 0, y: 0 };

  constructor(containerSelector = '[data-app-container]') {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    // Initial regl setup
    this.regl = regl({
      container: this.container,
      pixelRatio: this.pixelRatio,
      attributes: { antialias: false },
    });

    this.init();
  }

  init = () => {
    this.createGui();
    this.addEventListeners();
    this.createRegl();
  };

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('ReglExample');
    folder.open();

    window.APP.gui.add(this.settings, 'scale', 0.01, 2);
  };

  addEventListeners = () => {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
    window.dispatchEvent(new Event('resize'));
  };

  createRegl = () => {
    if (!this.regl) return;

    const meshSize = 2;

    this.draw = this.regl({
      vert: vertShader,
      frag: fragShader,

      attributes: {
        position: this.createMeshVertices(meshSize),
      },

      uniforms: {
        time: this.reglProp('time'),
        resolution: this.reglProp('resolution'),
        mouse: this.reglProp('mouse'),
        offset: this.reglProp('offset'),
        scale: this.reglProp('scale'),
      },

      count: meshSize*meshSize*6,
    });

    this.regl.frame(this.update);
  };

  reglProp = (name: keyof ReglProps) => {
    return this.regl?.prop<ReglProps, keyof ReglProps>(name);
  };

  createMeshVertices = (size: number) => {
    return new Array(size*size).fill(0).reduce((acc, val, idx) => {
      const unitSize = 2 / size;
      const idxX = idx % size;
      const idxY = Math.floor(idx / size);
      const x = -1 + idxX * unitSize;
      const y = -1 + idxY * unitSize;

      return acc.concat([
        [x, y],
        [x, y + unitSize],
        [x + unitSize, y],

        [x + unitSize, y],
        [x, y + unitSize],
        [x + unitSize, y + unitSize],
      ]);
    }, []);
  };

  onResize = () => {
    if (!this.container) return;

    const width = this.container.offsetWidth * this.pixelRatio;
    const height = this.container.offsetHeight * this.pixelRatio;
    const max = Math.max(width, height);
    const min = Math.min(width, height);
    const offset = (max - min) / 2;
    const x = width < height ? offset : 0;
    const y = width > height ? offset : 0;

    this.resolution = { width, height, max, min };
    this.offset = { x, y };
  };

  onMouseMove = (evt: MouseEvent) => {
    this.mouse = { x: evt.clientX * this.pixelRatio, y: this.resolution.height - evt.clientY * this.pixelRatio };
  };

  update = (context: regl.DefaultContext) => {
    if (window.APP.stats) window.APP.stats.begin();

    // Update time
    const now = performance.now() / 1000;
    this.time += now - this.lastTime;
    this.lastTime = now;

    if (this.regl && this.draw) {
      this.regl.clear({
        color: [0, 0, 0, 1],
      });

      this.draw({
        time: this.time,
        resolution: Object.values(this.resolution),
        offset: Object.values(this.offset),
        mouse: Object.values(this.mouse),
        scale: this.settings.scale,
      } as ReglProps);
    }

    if (window.APP.stats) window.APP.stats.end();
  };
}

export default ReglExample;
