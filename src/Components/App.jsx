// @flow
import AppCss from './App.CSS';
import Radium, { Style, StyleRoot } from 'radium';
import React from 'react';
import reduxPromise from 'redux-promise';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware, bindActionCreators } from 'redux';
import { each } from 'lodash';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const reduxActions = require('redux-actions');
reduxActions.createAction = (function(old) {
  return function(type, payloadCreator, metaCreator) {
    const action = old.call(this, type, payloadCreator, metaCreator);
    return bindActionCreators(action, store.dispatch);
  };
}(reduxActions.createAction));

reduxActions.handleActions = (function(old) {
  return function(reducerMap: Object, ...rest) {
    each(reducerMap, (r, index: number) => {
      reducerMap[index] = function(state, action) {
        const newState = r(state, action);
        if (state === newState) {
          return state;
        }
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

const Reducer = require('../Reducers').default;
const store = compose(
  applyMiddleware(reduxPromise),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
)(createStore)(Reducer);

if (process.env.node_env !== 'production') {
  global.store = store;
}

if (module.hot) {
  // $FlowFixMe
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

const Toolbar = require('./Toolbar').default;

@Radium
export default class App extends React.Component {
  props: Props;
  render() {
    const { children } = this.props;
    return (
      <Provider store={store}>
        <MuiThemeProvider>
          <StyleRoot style={style.wrapper}>
            <Toolbar/>
            {children}
            <Style rules={AppCss}/>
          </StyleRoot>
        </MuiThemeProvider>
      </Provider>
    );
  }
}
