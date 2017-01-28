// @flow
import 'babel-polyfill';
import './cxsRender';
import './vendor.js';
import { routes } from './config.js';
import ReactDOM from 'react-dom';


setTimeout(() => {
  ReactDOM.render(routes, document.querySelector('#dorfmapWrapper'));
}, 500);
