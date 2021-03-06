import './styles/index.scss';

import Example from './modules/CurtainsExample';

window.APP = window.APP || {
  devMode: true,
};

const readyPromises = [];

if (window.APP.devMode) {
  const guiPromise = import('@malven/gui').then(({ default: Gui }) => {
    // Add Gui and connect knobs for MidiFighter Twister
    window.APP.gui = new Gui();
    window.APP.gui.configureDevice('Midi Fighter Twister');
  }).catch(error => 'An error occurred while loading GUI');

  const statsPromise = import('stats.js').then(({ default: Stats }) => {
    // Add stats
    window.APP.stats = new Stats();
    window.APP.stats.showPanel(0);
    document.body.appendChild(window.APP.stats.dom);
  }).catch(error => 'An error occurred while loading stats.js');

  readyPromises.push(guiPromise);
  readyPromises.push(statsPromise);
}

Promise.all(readyPromises).then(() => {
  // Initialize custom code…
  new Example();
});
