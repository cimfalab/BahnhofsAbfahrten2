import AppCss from './App.CSS';
import Radium, { Style } from 'radium';
import React from 'react';
import Toolbar from './Toolbar.jsx';


@Radium
export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.any,
  }
  static style = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
  }
  render() {
    const style = App.style;
    const { children } = this.props;
    return (
      <div style={style.wrapper}>
        <Toolbar/>
        {children}
        <Style rules={AppCss}/>
      </div>
    );
  }
}
