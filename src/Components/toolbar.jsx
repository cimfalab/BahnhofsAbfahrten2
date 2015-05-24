import {AppBar, IconButton} from 'material-ui';
import Select from 'react-select';
import titleStore from '../Stores/titleStore.js';
import favStore from '../Stores/favStore.js';
import titleActions from '../Actions/titleActions.js';
import stationStore from '../Stores/stationStore.js';
import './toolbar.less';

@autoBind
export default class extends React.Component {
  searchButton = (
    <IconButton
      iconClassName="md md-search"
      onClick={this.openInput.bind(this)}/>
  )
  state = {
    title: titleStore.defaultTitle
  }
  componentDidUpdate() {
    const dom = React.findDOMNode(this);
    const inputs = dom.getElementsByTagName('input');
    if (inputs.length > 1) {
      inputs[1].focus();
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
  filterOptions(stations, input) {
    return stationStore.getFilteredOptions(input);
  }
  openInput() {
    titleActions.changeTitle(
      <Select
        filterOptions={this.filterOptions}
        onBlur={this.onBlur}
        onChange={this.submit}/>
    );
    this.setState({
      station: ''
    });
  }
  onBlur() {
    titleActions.revertTitle();
  }
  handleKeyDown(e) {
    switch (e.keyCode) {
      case 27: //Escape
        titleActions.revertTitle();
        break;
    }
  }
  submit(station, selectedOptions) {
    if (selectedOptions.length > 0) {
      station = selectedOptions[0].label;
    }
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
