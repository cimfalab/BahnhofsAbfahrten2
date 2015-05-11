import {AppBar, IconButton} from 'material-ui';
import {Typeahead} from 'react-typeahead';
import titleStore from '../Stores/titleStore.js';
import favStore from '../Stores/favStore.js';
import favActions from '../Actions/favActions.js';
import titleActions from '../Actions/titleActions.js';
import abfahrtActions from '../Actions/abfahrtActions.js';
import stationStore from '../Stores/stationStore.js';
require('./toolbar.less');

export default class extends React.Component {
  constructor() {
    super();
    this.searchButton = (
      <IconButton
        iconClassName="md md-search"
        onClick={this.openInput.bind(this)}/>
    );
    this.state = {
      title: titleStore.defaultTitle
    };
  }
  componentDidUpdate() {
    const dom = React.findDOMNode(this);
    const inputs = dom.getElementsByTagName('input');
    if (inputs.length > 0) {
      inputs[0].focus();
    }
  }
  componentDidMount() {
    this.unsubscribe1 = titleStore.listen((title, oldTitle) => {
      this.setState({
        title,
        oldTitle
      });
    });
    const fn = fav => this.setState({fav});
    favStore.emitter.addListener('favButton', fn);
    this.unsubscribe2 = () => favStore.emitter.removeListener('favButton', fn);
  }
  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribe2();
  }
  openInput() {
    const style = {
      input: 'autocomplete'
    };
    titleActions.changeTitle(
      <Typeahead
        options={stationStore.getNames()}
        maxVisible={7}
        onOptionSelected={this.submit.bind(this)}
        customClasses={style}
        onKeyDown={this.handleKeyDown.bind(this)}/>
    );
    this.setState({
      station: ''
    });
  }
  handleKeyDown(e) {
    switch (e.keyCode) {
      case 27: //Escape
        titleActions.revertTitle();
        break;
    }
  }
  submit(station) {
    if (!station) {
      titleActions.resetTitle();
    } else {
      titleActions.changeTitle(station);
    }
    global.router.transitionTo('abfahrten', {
      station: station.replace('/', '%2F')
    });
  }
  render() {
    var searchIcon = _.isString(this.state.title) ? this.searchButton : '';
    var icons = (<span>{searchIcon}{this.state.fav}</span>);
    return (
      <AppBar
        showMenuIconButton={false}
        title={this.state.title}
        iconElementRight={icons}/>
    );
  }
}
