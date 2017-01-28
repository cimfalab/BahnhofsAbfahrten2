// @flow
import { connect } from 'react-redux';
import { Paper } from 'material-ui';
import FavEntry from './FavEntry.jsx';
import React from 'react';
import titleStore from '../Stores/titleStore.js';
import type { Map } from 'immutable';
import axios from 'axios';

type Props = {
  favorites?: Map<string, bool>,
}

type State = {
  favorites: {
    id: number,
    title: string,
    evaId: string,
    recursive: bool,
  }[],
}

const style = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 0',
  },
};

@connect(state => ({
  favorites: state.favorites,
}))
export default class extends React.Component {
  props: Props;
  state: State = {
    favorites: [],
  };
  constructor() {
    super();
    titleStore.resetTitle();
  }
  componentWillMount() {
    this.updateFavs(this.props);
  }
  componentWillReceiveProps(props: Props) {
    this.updateFavs(props);
  }
  async updateFavs(props: Props) {
    if (!props.favorites) {
      return;
    }
    const newFavs = await Promise.all(
      props.favorites.map(async (x, favEntry) => {
        const favs = (await axios.get(`/api/station/${favEntry}`)).data;
        return favs;
      }).toArray()
    );
    this.setState({
      favorites: newFavs,
    });
  }
  render() {
    const { favorites } = this.state;
    if (!favorites || favorites.length <= 0) {
      return (
        <div css={style.wrap}>
          <Paper>
            Bisher hast du keine Favoriten.
          </Paper>
        </div>
      );
    }
    return (
      <div css={style.wrap}>
        {
          favorites.map(fav => (
            <FavEntry key={fav.id} fav={fav.title}/>
          ))
        }
      </div>
    );
  }
}
