// @flow
// import { Paper } from 'material-ui';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { clearAbfahrten, fetchAbfahrten, setSelectedStation } from '../Actions/abfahrten';
import { connect } from 'react-redux';
import AbfahrtEntry from './AbfahrtEntry.jsx';
import Loading from './Loading.jsx';
import Radium from 'radium';
import React from 'react';
import titleStore from '../Stores/titleStore.js';
import type { List, Map } from 'immutable';
import { fav, unfav } from '../Actions/favs';

type Props = {
  abfahrten?: List<Abfahrt>,
  error?: Error,
  params: {
    station: string,
  },
  favorites?: Map<string, bool>,
  stations?: Map<string, Station>,
  selectedDetail?: Abfahrt,
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
  favorites: state.favorites,
  stations: state.stations,
  selectedDetail: state.selectedDetail,
}))
class AbfahrtList extends React.Component {
  props: Props;
  @autobind
  fav() {
    fav(this.props.params.station);
  }
  @autobind
  unfav() {
    unfav(this.props.params.station);
  }
  getStation(stationString: string) {
    if (this.props.stations) {
      return this.props.stations.get(stationString.replace('%2F', '/'));
    }
    return { label: '', value: '' };
  }
  componentWillReceiveProps(newProps: Props) {
    if (newProps.params.station !== this.props.params.station) {
      clearAbfahrten();
      this.getAbfahrten(newProps.params.station);
    }
  }
  componentDidMount() {
    this.getAbfahrten(this.props.params.station);
  }
  getAbfahrten(station: string) {
    const st = this.getStation(station);
    setSelectedStation(st);
    fetchAbfahrten(st);
    titleStore.changeTitle(titleStore.getTitle(station));
  }
  beautifyError(error: string) {
    if (_.includes(error, 'Got no results')) {
      return 'Keine Abfahrten';
    }
    return undefined;
  }
  render() {
    const { abfahrten, error, selectedDetail } = this.props;
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
                detail={selectedDetail === abfahrt}
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
