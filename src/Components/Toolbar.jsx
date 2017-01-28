// @flow
import { AppBar, IconButton } from 'material-ui';
import { connect } from 'react-redux';
import { fav, unfav } from '../Actions/favs';
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

@connect(state => ({
  favorites: state.favorites,
  selectedStation: state.selectedStation,
}))
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
  handleTitle = (title: string, oldTitle: string) => {
    this.setState({
      title,
      oldTitle,
    });
  };
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
  openInput = () => {
    titleStore.changeTitle(
      <div css={style.selectWrap}>
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
  };
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
  submit = (station: Station) => {
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
  };
  handleUnfav = () => {
    const { selectedStation } = this.props;
    if (selectedStation) {
      unfav(selectedStation.id);
    }
  };
  handleFav = () => {
    const { selectedStation } = this.props;
    if (selectedStation) {
      fav(selectedStation.id);
    }
  };
  goHome = () => {
    this.context.router.push('/');
  };
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
    const icons = (<span css={style.icons}>{searchIcon}{favBtn}</span>);
    const homeIcon = (
      <span css={style.icons}>
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
