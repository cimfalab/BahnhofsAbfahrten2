import _ from 'lodash';
import { Paper } from 'material-ui';
import AbfahrtEntry from './AbfahrtEntry.jsx';
import abfahrtStore from '../Stores/abfahrtStore.js';
import favStore from '../Stores/favStore.js';
import Loading from './Loading.jsx';
import Radium from 'radium';
import React from 'react';
import titleStore from '../Stores/titleStore.js';

@Radium
class AbfahrtList extends React.Component {
  static propTypes = {
    params: React.PropTypes.shape({
      station: React.PropTypes.string,
    }),
  };
  static style = {
    list: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
    },
  };
  state = {
    abfahrten: [],
  };
  fav = () => {
    favStore.fav(this.props.params.station);
  };
  unfav = () => {
    favStore.unfav(this.props.params.station);
  };
  componentWillReceiveProps(newProps) {
    abfahrtStore.clearAbfahrten();
    this.getAbfahrten(newProps.params.station.replace('%2F', '/'));
  }
  handleAbfahrten = abfahrten => {
    this.setState({
      abfahrten,
      error: null,
    });
  };
  handleFav = () => {
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
  };
  handleError = error => {
    this.setState({
      error,
    });
  };
  componentDidMount() {
    abfahrtStore.on('abfahrten', this.handleAbfahrten);
    abfahrtStore.on('error', this.handleError);
    favStore.on('fav', this.handleFav);
    this.getAbfahrten(this.props.params.station.replace('%2F', '/'));
  }
  componentWillUnmount() {
    abfahrtStore.off('abfahrten', this.handleAbfahrten);
    abfahrtStore.off('error', this.handleError);
    favStore.off('fav', this.handleFav);
  }
  getAbfahrten(station: Station) {
    abfahrtStore.requestAbfahrten(station);
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
  beautifyError(error) {
    if (_.includes(error, 'Got no results')) {
      return 'Keine Abfahrten';
    }
  }
  render() {
    if (this.state.error) {
      let errorContent = this.beautifyError(this.state.error);
      if (!errorContent) {
        errorContent = (
          <span>
          Well this did not work.
          <br/>
          {this.state.error}
          <br/>
          <a
          href="https://github.com/marudor/BahnhofsAbfahrten/issues"
          target="_new">Issue erstellen</a>
          </span>
        );
      }
      return (
        <Paper className="error">
        {errorContent}
        </Paper>
      );
    }
    if (_.isEmpty(this.state.abfahrten)) {
      return (
        <Loading/>
      );
    }
    const style = AbfahrtList.style;
    return (
      <div style={style.list}>
      {
        _.map(this.state.abfahrten, (abfahrt) => {
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
