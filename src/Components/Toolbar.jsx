import React from 'react';
import Select from 'react-select';
import favStore from '../Stores/favStore.js';
import stationStore from '../Stores/stationStore.js';
import titleActions from '../Actions/titleActions.js';
import titleStore from '../Stores/titleStore.js';
import {AppBar, IconButton} from 'material-ui';

export default class Toolbar extends React.Component {
  static style = {
    appBar: {
      alignItems: 'center'
    },
    icon: {
      color: 'white',
      fill: 'white'
    },
    icons: {
      display: 'block',
      marginTop: -8
    }
  }
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
    const fn = (fav) => {
      if (fav) {
        this.setState({
          fav: fav.type,
          favFn: fav.fn
        });
      } else {
        this.setState({
          fav: null,
          favFn: null
        });
      }
    };
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
  openInput = () => {
    titleActions.changeTitle(
      <Select filterOptions={this.filterOptions} onBlur={this.onBlur} onChange={this.submit}/>
    );
    this.setState({
      station: ''
    });
  }
  onBlur = () => {
    titleActions.revertTitle();
  }
  handleKeyDown = e => {
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
    const style = Toolbar.style;
    const {title, fav, favFn} = this.state;
    const searchIcon = _.isString(title) ? (
      <IconButton
        iconStyle={style.icon}
        iconClassName="mi mi-search"
        onClick={this.openInput}/>
    ) : '';
    let favClass;
    let favBtn;
    if (fav === 'fav') {
      favClass = 'mi mi-favorite-border';
      favBtn = (<IconButton iconStyle={style.icon} iconClassName={favClass} onClick={favFn}/>);
    } else if (fav === 'unfav') {
      favClass = 'mi mi-favorite';
      favBtn = (<IconButton iconStyle={style.icon} iconClassName={favClass} onClick={favFn}/>);
    }
    const icons = (<span style={style.icons}>{searchIcon}{favBtn}</span>);
    return (
      <AppBar style={style.appBar}
        showMenuIconButton={false}
        title={this.state.title}
        iconElementRight={icons}/>
    );
  }
}
