import * as PIXI from 'pixi.js';
import colors from 'nice-color-palettes';

/**
 * Boilerplate module using PIXI.js
 */

interface ItemSprite extends PIXI.Sprite {
  baseScale: number
}

class PixiExample {
  // Container
  container: HTMLElement | null;

  // Pixi
  app?: PIXI.Application;
  particleContainer?: PIXI.ParticleContainer;

  // Set an arbitrary size for purposes of scaling the scene
  width = 2000;
  height = 2000;

  // Time
  time = 0;

  // Settings
  settings = {
    scalePeriod: 5,
  };

  constructor(containerSelector = '[data-app-container]') {
    this.container = document.querySelector(containerSelector);

    this.init();
  }

  init = () => {
    this.createGui();
    this.createApp();
    this.createItems();
  };

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('PixiExample');
    folder.open();

    window.APP.gui.add(this.settings, 'scalePeriod', 0.5, 20);
  };

  createApp = () => {
    if (!this.container) return;
    
    if (PIXI.settings.RENDER_OPTIONS?.hello) PIXI.settings.RENDER_OPTIONS.hello = false;
    this.app = new PIXI.Application<HTMLCanvasElement>({
      backgroundColor: 0x212322,
      width: 1000,
      height: 1000,
    });
    this.container.appendChild(this.app.view);
    this.app.ticker.add(this.update);

    // Resize the renderer on window resize
    window.addEventListener('resize', () => {
      if (!this.container || !this.app) return;

      this.app.renderer.resize(this.container.offsetWidth, this.container.offsetHeight);
      const scale = Math.max(this.app.view.width / this.width, this.app.view.height / this.height);
      this.app.stage.scale.set(scale, scale);
      this.app.stage.position.set(this.app.view.width/2, this.app.view.height/2);
    }, true);
    window.dispatchEvent(new Event('resize'));
  };

  createItems = () => {
    if (!this.app) return;

    // Create the particle container
    this.particleContainer = new PIXI.ParticleContainer(700, {
      position: true,
      rotation: true,
      vertices: true,
      tint: true,
    });
    this.app.stage.addChild(this.particleContainer);

    // Get the color palette
    const palette = colors[Math.floor(Math.random() * 50)];

    const textureGraphic = new PIXI.Graphics();
    textureGraphic.lineStyle(0);
    textureGraphic.beginFill(0xeeeeee);
    textureGraphic.drawEllipse(0, 0, 30, 30);
    textureGraphic.endFill();
    const spriteTexture = this.app.renderer.generateTexture(textureGraphic);

    const itemCount = 200;
    for (let idx = 0, length = itemCount; idx < length; idx++) {
      const randColor = palette[Math.floor(Math.random() * palette.length)];
      const sprite = new PIXI.Sprite(spriteTexture) as ItemSprite;
      sprite.baseScale = Math.random();
      sprite.anchor.set(0.5, 0.5);
      sprite.position.x = (Math.random() - 0.5) * this.width;
      sprite.position.y = (Math.random() - 0.5) * this.height;
      sprite.tint = new PIXI.Color(randColor).toNumber();
      this.particleContainer.addChild(sprite);
    }
  };

  updateItems = () => {
    if (!this.particleContainer) return;

    this.particleContainer.children.forEach((sprite) => {
      const itemSprite = sprite as ItemSprite;
      const iteration = this.time + itemSprite.baseScale * this.settings.scalePeriod;
      const amplitude = 0.8;
      const period = this.settings.scalePeriod;

      const scaleEffect = amplitude * Math.sin((Math.PI * 2) * (iteration / period));
      itemSprite.scale.x = itemSprite.scale.y = scaleEffect + itemSprite.baseScale;
    });
  };

  update = () => {
    if (window.APP.stats) window.APP.stats.begin();
    this.time += (PIXI.Ticker.shared.elapsedMS / 1000);

    this.updateItems();
    if (window.APP.stats) window.APP.stats.end();
  };
}

export default PixiExample;
