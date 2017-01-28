// @flow
// import { Paper } from 'material-ui';
import { clearAbfahrten, fetchAbfahrten, setSelectedStation } from '../Actions/abfahrten';
import { connect } from 'react-redux';
import AbfahrtEntry from './AbfahrtEntry.jsx';
import Loading from './Loading.jsx';
import React from 'react';
import titleStore from '../Stores/titleStore.js';
import type { List, Map } from 'immutable';
import axios from 'axios';
import { fav, unfav } from '../Actions/favs';

type Props = {
  abfahrten?: List<Abfahrt>,
  error?: Error,
  params: {
    station: string,
  },
  favorites?: Map<number, bool>,
  selectedDetail?: Abfahrt,
}

@connect(state => ({
  abfahrten: state.abfahrten,
  error: state.error,
  favorites: state.favorites,
  selectedDetail: state.selectedDetail,
}))
export default class AbfahrtList extends React.PureComponent {
  props: Props;
  fav = () => {
    fav(this.props.params.station);
  };
  unfav = () => {
    unfav(this.props.params.station);
  };
  async getStation(stationString: string) {
    const possibleStations = (await axios.get(`/api/search/${stationString}`)).data;
    if (possibleStations.length) {
      const station = possibleStations[0];
      return station;
    }
    return { title: '', id: 0 };
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
  async getAbfahrten(station: string) {
    const st = await this.getStation(station);
    setSelectedStation(st);
    fetchAbfahrten(st);
    titleStore.changeTitle(titleStore.getTitle(station));
  }
  beautifyError(error: string) {
    if (error.includes('Got no results')) {
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
        <div css={style.wrapper}>
          <Loading/>
        </div>
      );
    }
    return (
      <div css={style.list}>
        {
          abfahrten.map((abfahrt, i) => {
            const key = abfahrt.train + (abfahrt.scheduledDeparture || abfahrt.scheduledArrival) + i;
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

const style = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  wrapper: {
    flex: 1,
    position: 'relative',
  },
};
