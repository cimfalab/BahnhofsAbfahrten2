/* @flow */
import FavEntry from './FavEntry.jsx';
import React from 'react';
import favStore from '../Stores/favStore.js';
import titleStore from '../Stores/titleStore.js';
import { Paper } from 'material-ui';
import _ from 'lodash';
import Radium from 'radium';
import Spenden from './Spenden';

type State = {
  favs: string[],
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
