// @flow
import { AppBar, IconButton } from 'material-ui';
import { autobind } from 'core-decorators';
import favStore from '../Stores/favStore.js';
import Radium from 'radium';
import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import stationStore from '../Stores/stationStore.js';
import titleStore from '../Stores/titleStore.js';

type State = {
  title: string,
  oldTitle?: string,
  station?: string,
  fav?: string,
  favFn?: Function,
}

/*::`*/
@Radium
/*::`*/
export default class Toolbar extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  };
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
  };
  state: State = {
    title: titleStore.defaultTitle,
  };
  componentDidUpdate() {
    const dom = ReactDOM.findDOMNode(this);
    const inputs = dom.querySelectorAll('input');
    if (inputs[0]) {
      inputs[0].focus();
    }
  }
  @autobind
  handleTitle(title: string, oldTitle: string) {
    this.setState({
      title,
      oldTitle,
    });
  }
  @autobind
  handleFav(fav?: { type: string, fn: Function }) {
    if (fav) {
      this.setState({
        fav: fav.type,
        favFn: fav.fn,
      });
    } else {
      this.setState({
        fav: undefined,
        favFn: undefined,
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
  filterOptions(stations: any, input: string): Station[] {
    return stationStore.getFilteredOptions(input);
  }
  @autobind
  openInput() {
    titleStore.changeTitle(
      <div style={Toolbar.style.selectWrap}>
        <Select placeholder="Bahnhof..." filterOptions={this.filterOptions} onBlur={this.onBlur} onChange={this.submit}/>
      </div>
    );
    this.setState({
      station: '',
    });
  }
  onBlur() {
    titleStore.revertTitle();
  }
  handleKeyDown(e: SyntheticKeyboardEvent) {
    switch (e.keyCode) {
      case 27: //Escape
      titleStore.revertTitle();
      break;
      default:
      break;
    }
  }
  @autobind
  submit(station: Station) {
    if (!station) {
      return;
    }
    const stationLabel = station.label;
    if (station) {
      titleStore.changeTitle(stationLabel);
    } else {
      titleStore.resetTitle();
    }
    this.context.router.push(`/${stationLabel.replace('/', '%F')}`);
  }
  render() {
    const style = Toolbar.style;
    const { fav, favFn, station } = this.state;
    const searchIcon = station ? '' : (
      <IconButton
        iconStyle={style.icon}
        iconClassName="mdi mdi-search"
        onClick={this.openInput}/>
    );
    let favClass;
    let favBtn;
    if (fav === 'fav') {
      favClass = 'mdi mdi-favorite-border';
      favBtn = (<IconButton iconStyle={style.icon} iconClassName={favClass} onClick={favFn}/>);
    } else if (fav === 'unfav') {
      favClass = 'mdi mdi-favorite';
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
