/* @flow */
import { Paper } from 'material-ui';
import FavEntry from './FavEntry.jsx';
import favStore from '../Stores/favStore.js';
import Radium from 'radium';
import React from 'react';
import Spenden from './Spenden';
import titleStore from '../Stores/titleStore.js';
import type { Map } from 'immutable';

type State = {
  favs: Map<string, bool>,
}

const style = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 0',
  },
};

@Radium
export default class extends React.Component {
  state: State = {
    favs: favStore.getAll(),
  };
  constructor() {
    super();
    titleStore.resetTitle();
  }
  render() {
    if (this.state.favs.size <= 0) {
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
        {this.state.favs.map((x, fav) => <FavEntry fav={fav} key={fav}/>)}
        <Spenden/>
      </div>
    );
  }
}
