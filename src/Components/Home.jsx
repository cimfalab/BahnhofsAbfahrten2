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
}))
export default class extends React.Component {
  props: Props;
  constructor() {
    super();
    titleStore.resetTitle();
  }
  render() {
    const { favorites } = this.props;
    if (!favorites || favorites.size <= 0) {
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
          favorites.map((x, fav) => <FavEntry fav={fav} key={fav}/>).toList()
        }
        <Spenden/>
      </div>
    );
  }
}
