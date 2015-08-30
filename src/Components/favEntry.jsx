import Radium from 'radium';
import React from 'react';
import {Paper} from 'material-ui';

@Radium
export default class FavEntry extends React.Component {
  static propTypes = {
    fav: React.PropTypes.string
  }
  static style = {
    fav: {
      boxShadow: '0 1px 0 rgba(0, 0, 0, 0.24)',
      cursor: 'pointer',
      fontSize: '3em',
      lineHeight: 1.3
    },
    station: {
      ':hover': {
        backgroundColor: 'rgb(238, 238, 238)'
      }
    }
  }
  transitionTo = () => {
    global.router.transitionTo('abfahrten', {
      station: this.props.fav
    });
  }
  render() {
    const station = this.props.fav.replace('%2F', '/');
    const style = FavEntry.style;
    return (
      <Paper onClick={this.transitionTo} style={style.fav}>
        <div style={style.station}>{station}</div>
      </Paper>
    );
  }
}
