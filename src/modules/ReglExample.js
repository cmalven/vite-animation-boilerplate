import r from 'regl';
const regl = r();
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

    // Canvas
    this.canvas = null;

    // Time
    this.lastTime = performance.now() / 1000;
    this.time = 0;

    // Settings
    this.settings = {
      scalePeriod: 5,
    };

    this.init();
  }

  init = () => {
    this.createGui();
    this.createCanvas();
    this.createRegl();
  };

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('ReglExample');
    folder.open();

    window.APP.gui.add(this.settings, 'scalePeriod', 0.5, 20);
  };

  createCanvas = () => {
    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);
  };

  createRegl = () => {
    const meshSize = 8;

    this.draw = regl({
      vert: vertShader,
      frag: fragShader,

      attributes: {
        position: this.createMeshVertices(meshSize),
      },

      uniforms: {
        time: regl.prop('time'),
      },

      count: meshSize*meshSize*6,
    });

    regl.frame(this.update);
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

  update = ({ tick }) => {
    if (window.APP.stats) window.APP.stats.begin();

    // Update time
    const now = performance.now() / 1000;
    this.time += now - this.lastTime;
    this.lastTime = now;

    regl.clear({
      color: [0, 0, 0, 1],
    });

    this.draw({
      time: this.time,
    });

    if (window.APP.stats) window.APP.stats.end();
  };
}

export default ReglExample;
