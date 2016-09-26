import 'babel-polyfill';
import './vendor.js';
import { routes } from './config.js';
import ReactDOM from 'react-dom';
import taps from 'react-tap-event-plugin';
taps();

setTimeout(() => {
  ReactDOM.render(routes, document.querySelector('#dorfmapWrapper'));
}, 500);
