import abfahrtStore from '../Stores/abfahrtStore.js';
import abfahrtActions from '../Actions/abfahrtActions.js';
import titleActions from '../Actions/titleActions.js';
import favStore from '../Stores/favStore.js';
import favActions from '../Actions/favActions.js';

import { IconButton, Paper } from 'material-ui';

import AbfahrtEntry from './abfahrtEntry.jsx';
import Loading from './loading.jsx';

require('./abfahrtList.less');

export default class extends React.Component {
  constructor() {
    super();
    this.favButton = (
      <IconButton
        iconClassName="md md-favorite-outline"
        onClick={this.fav.bind(this)}/>
    );
    this.unfavButton = (
      <IconButton
        iconClassName="md md-favorite"
        onClick={this.unfav.bind(this)}/>
    );
    this.state = {
      abfahrten: []
    };
  }
  fav() {
    favActions.fav(this.props.params.station);
  }
  unfav() {
    favActions.unfav(this.props.params.station);
  }
  componentWillReceiveProps(newProps) {
    abfahrtActions.clearAbfahrten();
    this.getAbfahrten(newProps.params.station.replace('%2F', '/'));
  }
  componentDidMount() {
    this.unregister = abfahrtStore.listen(abfahrten => {
      this.setState({
        abfahrten,
        error: null
      });
    });
    this.unregister2 = favStore.listen(favList => {
      if (favStore.isFaved(this.props.params.station)) {
        favActions.favButton(this.unfavButton);
      } else {
        favActions.favButton(this.favButton);
      }
    });
    var fn = this.handleError.bind(this);
    abfahrtStore.emitter.addListener('error', fn);
    this.unregister3 = () => abfahrtStore.emitter.removeListener('error', fn);
    this.getAbfahrten(this.props.params.station.replace('%2F', '/'));
  }
  handleError(error) {
    this.setState({
      error
    });
  }
  getAbfahrten(station) {
    abfahrtActions.requestAbfahrten(station);
    titleActions.changeTitle(station);
    if (favStore.isFaved(station)) {
      favActions.favButton(this.unfavButton);
    } else {
      favActions.favButton(this.favButton);
    }
  }
  componentWillUnmount() {
    this.unregister();
    this.unregister2();
    this.unregister3();
  }
  render() {
    if (this.state.error) {
      return (
        <Paper className="error">
          Well this did not work :(<br/>
          {this.state.error}<br/>
        <a href="https://github.com/marudor/BahnhofsAbfahrten2/issues" target="_new">Issue erstellen</a>
        </Paper>
      );
    }
    if (_.isEmpty(this.state.abfahrten)) {
      return (
        <Loading/>
      );
    }
    return (
      <div className="abfahrtList">
        {
          _.map(this.state.abfahrten, abfahrt => {
            const key = abfahrt.train + abfahrt.time;
            return (<AbfahrtEntry key={key} abfahrt={abfahrt}/>);
          })
        }
      </div>
    );
  }
}
