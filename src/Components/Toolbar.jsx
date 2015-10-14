import React from 'react';
import Select from 'react-select';
import favStore from '../Stores/favStore.js';
import stationStore from '../Stores/stationStore.js';
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
  handleTitle = (title, oldTitle) => {
    this.setState({
      title,
      oldTitle
    });
  }
  handleFav = (fav) => {
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
  }
  componentDidMount() {
    titleStore.on('title', this.handleTitle);
    titleStore.on('openInput', this.openInput);
    favStore.on('favButton', this.handleFav);
  }
  componentWillUnmount() {
    titleStore.off('title', this.handleTitle);
    titleStore.off('openInput', this.openInput);
    favStore.off('favButton', this.handleFav);
  }
  filterOptions(stations, input) {
    return stationStore.getFilteredOptions(input);
  }
  openInput = () => {
    titleStore.changeTitle(
      <Select filterOptions={this.filterOptions} onBlur={this.onBlur} onChange={this.submit}/>
    );
    this.setState({
      station: ''
    });
  }
  onBlur = () => {
    titleStore.revertTitle();
  }
  handleKeyDown = e => {
    switch (e.keyCode) {
      case 27: //Escape
      titleStore.revertTitle();
      break;
    }
  }
  submit(station, selectedOptions) {
    if (selectedOptions.length > 0) {
      station = selectedOptions[0].label;
    }
    if (!station) {
      titleStore.resetTitle();
    } else {
      titleStore.changeTitle(station);
    }
    global.router.transitionTo('abfahrten', {
      station: station.replace('/', '%2F')
    });
  }
  render() {
    const style = Toolbar.style;
    const {fav, favFn, station} = this.state;
    const searchIcon = !station ? (
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
