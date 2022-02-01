import regl from 'regl';
import vertShader from './shaders/regl_example_vert.glsl?raw';
import fragShader from './shaders/regl_example_frag.glsl?raw';

/**
 * Boilerplate module using regl
 */

class ReglExample {
  constructor(options = {
    containerSelector: '[data-app-container]',
  }) {
    this.options = options;
    this.container = document.querySelector(this.options.containerSelector);

    // Pixel ratio
    this.pixelRatio = Math.min(1.3, window.devicePixelRatio);

    // Regl
    this.regl = regl({
      container: this.container,
      pixelRatio: this.pixelRatio,
      attributes: { antialias: false },
    });

    // Time
    this.lastTime = performance.now() / 1000;
    this.time = 0;

    // Settings
    this.settings = {
      scalePeriod: 5,
    };

    // Size
    this.resolution = { width: 0, height: 0, max: 0, min: 0 };

    // Drawing offset
    this.offset = { x: 0, y: 0 };

    // Mouse
    this.mouse = { x: 0, y: 0 };

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

    window.APP.gui.add(this.settings, 'scalePeriod', 0.5, 20);
  };

  addEventListeners = () => {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
    window.dispatchEvent(new Event('resize'));
  };

  createRegl = () => {
    const meshSize = 2;

    this.draw = this.regl({
      vert: vertShader,
      frag: fragShader,

      attributes: {
        position: this.createMeshVertices(meshSize),
      },

      uniforms: {
        time: this.regl.prop('time'),
        resolution: this.regl.prop('resolution'),
        mouse: this.regl.prop('mouse'),
        offset: this.regl.prop('offset'),
      },

      count: meshSize*meshSize*6,
    });

    this.regl.frame(this.update);
  };

  createMeshVertices = (size) => {
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

  onMouseMove = (evt) => {
    this.mouse = { x: evt.clientX * this.pixelRatio, y: this.resolution.height - evt.clientY * this.pixelRatio };
  };

  update = ({ tick }) => {
    if (window.APP.stats) window.APP.stats.begin();

    // Update time
    const now = performance.now() / 1000;
    this.time += now - this.lastTime;
    this.lastTime = now;

    this.regl.clear({
      color: [0, 0, 0, 1],
    });

    this.draw({
      time: this.time,
      resolution: Object.values(this.resolution),
      offset: Object.values(this.offset),
      mouse: Object.values(this.mouse),
    });

    if (window.APP.stats) window.APP.stats.end();
  };
}

export default ReglExample;
