// @flow
// import { Paper } from 'material-ui';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { clearAbfahrten, fetchAbfahrten } from '../Actions/abfahrten';
import { connect } from 'react-redux';
import AbfahrtEntry from './AbfahrtEntry.jsx';
import favStore from '../Stores/favStore.js';
import Loading from './Loading.jsx';
import Radium from 'radium';
import React from 'react';
import titleStore from '../Stores/titleStore.js';
import type { List } from 'immutable';

type Props = {
  abfahrten?: List<Abfahrt>,
  error?: Error,
  params: {
    station: string,
  },
}

const style = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
};

@Radium
@connect(state => ({
  abfahrten: state.abfahrten,
  error: state.error,
}))
class AbfahrtList extends React.Component {
  props: Props;
  @autobind
  fav() {
    favStore.fav(this.props.params.station);
  }
  @autobind
  unfav() {
    favStore.unfav(this.props.params.station);
  }
  componentWillReceiveProps(newProps: Props) {
    if (newProps.params.station !== this.props.params.station) {
      clearAbfahrten();
      this.getAbfahrten(newProps.params.station.replace('%2F', '/'));
    }
  }
  @autobind
  handleFav() {
    if (favStore.isFaved(this.props.params.station)) {
      favStore.favButton({
        type: 'unfav',
        fn: this.unfav,
      });
    } else {
      favStore.favButton({
        type: 'fav',
        fn: this.fav,
      });
    }
  }
  componentDidMount() {
    favStore.on('fav', this.handleFav);
    this.getAbfahrten(this.props.params.station.replace('%2F', '/'));
  }
  componentWillUnmount() {
    favStore.off('fav', this.handleFav);
  }
  getAbfahrten(station: string) {
    fetchAbfahrten(station);
    titleStore.changeTitle(titleStore.getTitle(station));
    if (favStore.isFaved(station)) {
      favStore.favButton({
        type: 'unfav',
        fn: this.unfav,
      });
    } else {
      favStore.favButton({
        type: 'fav',
        fn: this.fav,
      });
    }
  }
  beautifyError(error: string) {
    if (_.includes(error, 'Got no results')) {
      return 'Keine Abfahrten';
    }
    return undefined;
  }
  render() {
    const { abfahrten, error } = this.props;
    if (error) {
      return (
        <div>
          Whoops!
          <br/>
          {error}
        </div>
      );
    }
    if (!abfahrten) {
      return (
        <Loading/>
      );
    }
    return (
      <div style={style.list}>
        {
          abfahrten.map(abfahrt => {
            const key = abfahrt.train + (abfahrt.scheduledDeparture || abfahrt.scheduledArrival);
            return (
              <AbfahrtEntry
                key={key}
                abfahrt={abfahrt}/>
            );
          })
        }
      </div>
    );
  }
}

export default AbfahrtList;
