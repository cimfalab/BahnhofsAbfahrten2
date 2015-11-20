import React from 'react';
import Select from 'react-select';
import favStore from '../Stores/favStore.js';
import stationStore from '../Stores/stationStore.js';
import titleStore from '../Stores/titleStore.js';
import { AppBar, IconButton } from 'material-ui';
import ReactDOM from 'react-dom';

export default class Toolbar extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object,
  }
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }
  static style = {
    appBar: {
      alignItems: 'center',
      overflow: 'visible',
    },
    icon: {
      color: 'white',
      fill: 'white',
    },
    icons: {
      display: 'block',
      marginTop: -8,
    },
    selectWrap: {
      lineHeight: '32px',
    },
  }
  state = {
    title: titleStore.defaultTitle,
  }
  componentDidUpdate() {
    const dom = ReactDOM.findDOMNode(this);
    const inputs = dom.querySelectorAll('input');
    if (inputs[0]) {
      inputs[0].focus();
    }
  }
  handleTitle = (title, oldTitle) => {
    this.setState({
      title,
      oldTitle,
    });
  }
  handleFav = (fav) => {
    if (fav) {
      this.setState({
        fav: fav.type,
        favFn: fav.fn,
      });
    } else {
      this.setState({
        fav: null,
        favFn: null,
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
      <div style={Toolbar.style.selectWrap}>
        <Select placeholder="Bahnhof..." filterOptions={this.filterOptions} onBlur={this.onBlur} onChange={this.submit}/>
      </div>
    );
    this.setState({
      station: '',
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
  submit = (station, selectedOptions) => {
    if (selectedOptions.length > 0) {
      station = selectedOptions[0].label;
    }
    if (station) {
      titleStore.changeTitle(station);
    } else {
      titleStore.resetTitle();
    }
    this.context.history.pushState(null, `/${station.replace('/', '%F')}`);
  }
  render() {
    const style = Toolbar.style;
    const { fav, favFn, station } = this.state;
    const searchIcon = station ? '' : (
      <IconButton
        iconStyle={style.icon}
        iconClassName="mi mi-search"
        onClick={this.openInput}/>
    );
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
