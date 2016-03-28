// @flow
import AppCss from './App.CSS';
import Radium, { Style, StyleRoot } from 'radium';
import React from 'react';
import Toolbar from './Toolbar.jsx';

type Props = {
  children?: any,
}

/*::`*/
@Radium
/*::`*/
export default class App extends React.Component {
  props: Props;
  static style = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
  };
  render() {
    const style = App.style;
    const { children } = this.props;
    return (
      <StyleRoot style={style.wrapper}>
        <Toolbar/>
        {children}
        <Style rules={AppCss}/>
      </StyleRoot>
    );
  }
}
