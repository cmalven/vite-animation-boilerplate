import { getGPUTier } from 'detect-gpu';
import Example from './modules/CanvasExample';

import type Gui from '@malven/gui';
import type { TierResult } from 'detect-gpu';
import type Stats from 'stats.js';

interface App {
  devMode: boolean,
  gui?: Gui,
  gpu?: TierResult,
  stats?: Stats,
}

declare global {
  interface Window {
    APP: App;
  }
}

window.APP = {
  devMode: true,
};

const readyPromises = [];

// Detect GPU capabilities
readyPromises.push(getGPUTier().then(gpuDetails => {
  window.APP.gpu = gpuDetails;
}));

if (window.APP.devMode) {
  const guiPromise = import('@malven/gui').then(({ default: Gui }) => {
    // Add Gui and connect knobs for MidiFighter Twister
    window.APP.gui = new Gui({
      midi: window.location.hostname === 'localhost',
    });
    window.APP.gui.configureDevice('Midi Fighter Twister');
  }).catch(error => 'An error occurred while loading GUI');
  readyPromises.push(guiPromise);

  const statsPromise = import('stats.js').then(({ default: Stats }) => {
    // Add stats
    window.APP.stats = new Stats();
    window.APP.stats.showPanel(0);
    document.body.appendChild(window.APP.stats.dom);
  }).catch(error => 'An error occurred while loading stats.js');
  readyPromises.push(statsPromise);
}

Promise.all(readyPromises).then(() => {
  // Initialize custom code…
  new Example();
});
