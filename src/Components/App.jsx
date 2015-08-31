import AppCss from './App.CSS';
import Radium, {Style} from 'radium';
import React from 'react';
import Toolbar from './Toolbar.jsx';
import {RouteHandler} from 'react-router';
import {Styles} from 'material-ui';

const ThemeManager = new Styles.ThemeManager();

@Radium
export default class App extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired
  }
  static style = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }
  render() {
    const style = App.style;
    return (
      <div style={style.wrapper}>
        <Toolbar/>
        <RouteHandler/>
        <Style rules={AppCss}/>
      </div>
    );
  }
}
