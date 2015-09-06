import FavEntry from './FavEntry.jsx';
import React from 'react';
import favStore from '../Stores/favStore.js';
import titleStore from '../Stores/titleStore.js';
import {Paper} from 'material-ui';

export default class extends React.Component {
  state = {
    favs: favStore.getAll()
  }
  constructor() {
    super();
    titleStore.resetTitle();
  }
  componentDidMount() {
    favStore.on('fav', this.handleFav);
  }
  componentWillUnmount() {
    favStore.off('fav', this.handleFav);
  }
  render() {
    if (_.isEmpty(this.state.favs)) {
      return (
        <Paper>
          Leider keine Favs :(
        </Paper>
      );
    }
    return (
      <div>
        {_.map(this.state.favs, (x, fav) => {
          return (
            <FavEntry fav={fav} key={fav}/>
          );
        })}
      </div>
    );
  }
}
