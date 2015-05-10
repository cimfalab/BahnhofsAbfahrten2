import {AppBar, IconButton} from 'material-ui';
import {Typeahead} from 'react-typeahead';
import titleStore from '../Stores/titleStore.js';
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
    this.submitButton = (
      <IconButton
        iconClassName="md md-send"
        onClick={this.submit.bind(this)}/>
    );
    this.state = {
      title: titleStore.defaultTitle,
      icon: this.searchButton
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
    this.unsubscribe = titleStore.listen(title => {
      this.setState({
        title
      });
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
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
        customClasses={style}/>
    );
    this.setState({
      icon: this.submitButton,
      station: ''
    });
  }
  submit(station) {
    this.setState({
      icon: this.searchButton
    });
    if (!station) {
      titleActions.resetTitle();
    } else {
      titleActions.changeTitle(station);
    }
    global.router.transitionTo('abfahrten', {
      station: station
    });
  }
  render() {
    return (
      <AppBar
        showMenuIconButton={false}
        title={this.state.title}
        iconElementRight={this.state.icon}/>
    );
  }
}
