// @flow
import _ from 'lodash';
import { Paper } from 'material-ui';
import AbfahrtEntry from './AbfahrtEntry.jsx';
import abfahrtStore from '../Stores/abfahrtStore.js';
import favStore from '../Stores/favStore.js';
import Loading from './Loading.jsx';
import Radium from 'radium';
import React from 'react';
import titleStore from '../Stores/titleStore.js';
import { autobind } from 'core-decorators';

type State = {
  abfahrten: Abfahrt[],
  error?: ?string,
}

type Props = {
  params: {
    station: string,
  },
}

/*::`*/
@Radium
/*::`*/
class AbfahrtList extends React.Component {
  props: Props;
  static style = {
    list: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
    },
  };
  state: State = {
    abfahrten: [],
  };
  @autobind
  fav() {
    favStore.fav(this.props.params.station);
  }
  @autobind
  unfav() {
    favStore.unfav(this.props.params.station);
  }
  componentWillReceiveProps(newProps: Props) {
    abfahrtStore.clearAbfahrten();
    this.getAbfahrten(newProps.params.station.replace('%2F', '/'));
  }
  @autobind
  handleAbfahrten(abfahrten: Abfahrt[]) {
    this.setState({
      abfahrten,
      error: null,
    });
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
  @autobind
  handleError(error: any) {
    this.setState({
      error,
    });
  }
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
  getAbfahrten(station: string) {
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
  beautifyError(error: string) {
    if (_.includes(error, 'Got no results')) {
      return 'Keine Abfahrten';
    }
    return undefined;
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
