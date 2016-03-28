/* @flow */
import _ from 'lodash';
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

/*::`*/
@Radium
/*::`*/
export default class extends React.Component {
  state: State = {
    favs: favStore.getAll(),
  };
  constructor() {
    super();
    titleStore.resetTitle();
  }
  render() {
    if (_.isEmpty(this.state.favs)) {
      return (
        <div style={style.wrap}>
          <Paper>
            Leider keine Favs :(
            </Paper>
            <Spenden/>
          </div>
        );
      }
      return (
        <div style={style.wrap}>
          {_.map(this.state.favs, (x, fav) => <FavEntry fav={fav} key={fav}/>)}
          <Spenden/>
        </div>
      );
    }
  }
