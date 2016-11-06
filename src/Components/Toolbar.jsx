// @flow
import { AppBar, IconButton } from 'material-ui';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { fav, unfav } from '../Actions/favs';
import Radium from 'radium';
import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import titleStore from '../Stores/titleStore.js';
import type { Map } from 'immutable';
import axios from 'axios';

type Props = {
  favorites?: Map<number, bool>,
  selectedStation?: Station,
}
type State = {
  title: string,
  oldTitle?: string,
  station?: string,
}

const style = {
  appBar: {
    alignItems: 'center',
    overflow: 'visible',
    flexShrink: 0,
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
    marginTop: 16,
  },
};

@connect(state => ({
  favorites: state.favorites,
  selectedStation: state.selectedStation,
}))
@Radium
export default class Toolbar extends React.Component {
  props: Props;
  static contextTypes = {
    router: React.PropTypes.object,
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
  componentDidMount() {
    titleStore.on('title', this.handleTitle);
    titleStore.on('openInput', this.openInput);
  }
  componentWillUnmount() {
    titleStore.off('title', this.handleTitle);
    titleStore.off('openInput', this.openInput);
  }
  async stationLoad(input: string) {
    const stations = (await axios.get(`/api/search/${input}`)).data;
    return {
      options: stations,
    };
  }
  @autobind
  openInput() {
    titleStore.changeTitle(
      <div style={style.selectWrap}>
        <Select.Async
          autoload={false}
          ignoreAccents={false}
          loadOptions={this.stationLoad}
          valueKey="id"
          labelKey="title"
          placeholder="Bahnhof..."
          onBlur={this.onBlur}
          onChange={this.submit}/>
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
    const stationLabel = station.title;
    if (station) {
      titleStore.changeTitle(stationLabel);
    } else {
      titleStore.resetTitle();
    }
    this.context.router.push(`/${stationLabel.replace('/', '$SLASH$')}`);
  }
  @autobind
  handleUnfav() {
    const { selectedStation } = this.props;
    if (selectedStation) {
      unfav(selectedStation.id);
    }
  }
  @autobind
  handleFav() {
    const { selectedStation } = this.props;
    if (selectedStation) {
      fav(selectedStation.id);
    }
  }
  @autobind
  goHome() {
    this.context.router.push('/');
  }
  render() {
    const { favorites, selectedStation } = this.props;
    const { station } = this.state;
    const searchIcon = station ? '' : (
      <IconButton
        iconStyle={style.icon}
        iconClassName="mdi mdi-search"
        onClick={this.openInput}/>
    );
    let favClass;
    let favBtn;
    if (selectedStation && favorites) {
      const favved = favorites.has(selectedStation.id);
      if (favved) {
        favClass = 'mdi mdi-favorite';
        favBtn = (<IconButton iconStyle={style.icon} iconClassName={favClass} onClick={this.handleUnfav}/>);
      } else {
        favClass = 'mdi mdi-favorite-border';
        favBtn = (<IconButton iconStyle={style.icon} iconClassName={favClass} onClick={this.handleFav}/>);
      }
    }
    const icons = (<span style={style.icons}>{searchIcon}{favBtn}</span>);
    const homeIcon = (
      <span style={style.icons}>
        <IconButton onClick={this.goHome} iconStyle={style.icon} style={style.icon} iconClassName="mdi mdi-home"/>
      </span>
    );
    return (
      <AppBar style={style.appBar}
        title={this.state.title}
        iconElementLeft={homeIcon}
        iconElementRight={icons}/>
    );
  }
}
