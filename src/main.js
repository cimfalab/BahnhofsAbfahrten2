import 'babel-regenerator-runtime';
import './babelHelper';
import './vendor.js';
import { routes } from './config.js';
import axios from 'axios';
import ReactDOM from 'react-dom';
import taps from 'react-tap-event-plugin';
taps();

axios.interceptors.response.use(c => c.data);

setTimeout(() => {
  ReactDOM.render(routes, document.querySelector('#dorfmapWrapper'));
}, 500);
