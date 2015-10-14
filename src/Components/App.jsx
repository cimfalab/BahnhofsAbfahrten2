import AppCss from './App.CSS';
import Radium, {Style} from 'radium';
import React from 'react';
import Toolbar from './Toolbar.jsx';
import {RouteHandler} from 'react-router';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import LightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';

const theme = ThemeManager.getMuiTheme(LightRawTheme);

@Radium
export default class App extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired
  }
  getChildContext() {
    return {
      muiTheme: theme
    };
  }
  static style = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
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
