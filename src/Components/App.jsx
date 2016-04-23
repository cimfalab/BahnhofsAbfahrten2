// @flow
import AppCss from './App.CSS';
import Radium, { Style, StyleRoot } from 'radium';
import React from 'react';
import Toolbar from './Toolbar.jsx';
import reduxPromise from 'redux-promise';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware, bindActionCreators } from 'redux';
import Reducer from '../Reducers';
import { each } from 'lodash';

const reduxActions = require('redux-actions');
reduxActions.createAction = (function(old) {
  return function(type, payloadCreator, metaCreator) {
    const action = old.call(this, type, payloadCreator, metaCreator);
    return bindActionCreators(action, store.dispatch);
  };
}(reduxActions.createAction));

reduxActions.handleActions = (function(old) {
  return function(reducerMap: Object, ...rest) {
    each(reducerMap, (r, index) => {
      reducerMap[index] = function(state, action) {
        const newState = r(state, action);
        return {
          ...state,
          ...newState,
        };
      };
    });
    return old.call(this, reducerMap, ...rest);
  };
}(reduxActions.handleActions));

type Props = {
  children?: any,
}
const store = compose(
  applyMiddleware(reduxPromise),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
)(createStore)(Reducer);

if (module.hot) {
  module.hot.accept('../Reducers', () => {
    const nextRootReducer = require('../Reducers/index');
    store.replaceReducer(nextRootReducer);
  });
}

const style = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
};

@Radium
export default class App extends React.Component {
  props: Props;
  render() {
    const { children } = this.props;
    return (
      <Provider store={store}>
        <StyleRoot style={style.wrapper}>
          <Toolbar/>
          {children}
          <Style rules={AppCss}/>
        </StyleRoot>
      </Provider>
    );
  }
}
