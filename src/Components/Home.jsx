/* @flow */
import { connect } from 'react-redux';
import { Paper } from 'material-ui';
import FavEntry from './FavEntry.jsx';
import Radium from 'radium';
import React from 'react';
import Spenden from './Spenden';
import titleStore from '../Stores/titleStore.js';
import type { Map } from 'immutable';

type Props = {
  favorites?: Map<string, bool>,
  stations?: Map<string, Station>,
}

const style = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 0',
  },
};

@Radium
@connect(state => ({
  favorites: state.favorites,
  stations: state.stations,
}))
export default class extends React.Component {
  props: Props;
  constructor() {
    super();
    titleStore.resetTitle();
  }
  render() {
    const { favorites, stations } = this.props;
    if (!favorites || favorites.size <= 0 || !stations) {
      return (
        <div style={style.wrap}>
          <Paper>
            Bisher hast du keine Favoriten.
          </Paper>
          <Spenden/>
        </div>
      );
    }
    return (
      <div style={style.wrap}>
        {
          favorites.map((x, stationVal) => stations.find(x => x.value === stationVal) || {}).map((fav) => <FavEntry fav={fav.label} key={fav.value}/>).toList()
        }
        <Spenden/>
      </div>
    );
  }
}
