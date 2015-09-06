import Radium from 'radium';
import React from 'react';
import detailStore from '../Stores/detailStore.js';
import {Paper} from 'material-ui';


function normalizeName(name) {
  name = name.replace(/([^ ])\(/, '$1 (');
  name = name.replace(/\)(.)/, ') $1');
  name = name.replace(/Frankfurt \(M\)/, 'Frankfurt (Main)');
  return name;
}

@Radium
export default class AbfahrtEntry extends React.Component {
  static propTypes = {
    abfahrt: React.PropTypes.object
  }
  static style = {
    wrapper: {
      boxShadow: '0 1px 0 rgba(0, 0, 0, 0.24)',
      overflow: 'hidden',
      marginBottom: 5
    },
    entry: {
      display: 'flex',
      flexShrink: 0,
      fontSize: '0.6em',
      lineHeight: 1,
      paddingTop: 5,
      userSelect: 'none',
      '@media screen and (max-width: 1200px)': {
        fontSize: '0.3em'
      }
    },
    cancelled: {
      textDecoration: 'line-through'
    },
    detail: {
      mid: {
        whiteSpace: 'normal'
      },
      hbf: {
        fontWeight: 'bold'
      }
    },
    train: {
      flex: 1,
      fontSize: '3em',
      lineHeight: 1.2,
      maxWidth: 280,
      '@media screen and (max-width: 1200px)': {
        maxWidth: 75
      }
    },
    mid: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      lineHeight: 1.2,
      whiteSpace: 'nowrap'
    },
    destination: {
      fontSize: '4em'
    },
    via: {
      fontSize: '2.1em',
      lineHeight: 1.2,
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    info: {
      textDecoration: 'none',
      color: 'red',
      fontSize: '2.1em',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    end: {
      alignItems: 'flex-end',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginLeft: 15
    },
    time: {
      fontSize: '2.4em'
    },
    early: {
      color: 'green',
      fontSize: '3em',
      marginRight: '0.4em'
    },
    delay: {
      color: 'red',
      fontSize: '3em',
      marginRight: '0.4em'
    },
    platform: {
      fontSize: '3em'
    },
    additional: {
      color: 'red'
    }
  }
  state = {
    detail: false
  }
  handleDetail = entry => {
    if (entry !== this) {
      this.setState({
        detail: false
      });
    }
  }
  componentWillUnmount() {
    detailStore.off('detail', this.handleDetail);
  }
  getVia(abfahrt, isCancelled) {
    const via = [];
    const abfahrten = this.state.detail ? abfahrt.route : abfahrt.via;
    const style = AbfahrtEntry.style;
    _.each(abfahrten, (v, index) => {
      if (_.isObject(v) && v.name == null) {
        return;
      }
      const name = v.name || v;
      const lowerName = name.toLowerCase();
      const isHbf = _.contains(lowerName, 'hbf') || _.contains(lowerName, 'centraal') || _.contains(lowerName, 'centrale') || _.contains(lowerName, 'termini');
      via.push(<span key={`${index}i`} style={[v.isCancelled && style.cancelled, v.isAdditional && style.additional, isHbf && style.hbf]}>{normalizeName(name)}</span>);
      if (index + 1 !== abfahrten.length) {
        via.push(<span key={index}> - </span>);
      }
    });
    return via ? <div key="v" style={[style.via, isCancelled && style.cancelled]}>{via}</div> : null;
  }
  getInfo(abfahrt) {
    let info = '';
    if (abfahrt.messages.delay.length > 0) {
      info += abfahrt.messages.delay[0].text;
    }
    _.each(abfahrt.messages.qos, q => {
      if (info.length > 0) {
        info += ' +++ ';
      }
      info += q.text;
    });
    for (let i = 1; i < abfahrt.messages.delay.length; i++) {
      info += ` +++ ${abfahrt.messages.delay[i].text}`;
    }
    const style = AbfahrtEntry.style;
    return info ? <div key="i" style={style.info}>{info}</div> : null;
  }
  getDelay(abfahrt) {
    if (!abfahrt.delay || abfahrt.isCancelled) {
      return null;
    }
    const style = AbfahrtEntry.style;
    let delay = abfahrt.delay;
    if (abfahrt.delay > 0) {
      delay = `+${delay}`;
    } else {
      delay = `-${Math.abs(delay)}`;
    }
    return (<span style={delay > 0 ? style.delay : style.early}>({delay})</span>);
  }
  onClick = () => {
    detailStore.setDetail(this);
    detailStore.on('detail', this.handleDetail);
    const newVal = !this.state.detail;
    this.setState({
      detail: newVal
    });
  }
  render() {
    const {detail} = this.state;
    const abfahrt = this.props.abfahrt;
    let info = this.getInfo(abfahrt);
    const cancel = abfahrt.isCancelled;
    if (!detail && !info) {
      info = this.getVia(abfahrt, cancel);
    }
    if (detail) {
      info = [info, this.getVia(abfahrt)];
    }
    const delay = this.getDelay(abfahrt);
    const style = AbfahrtEntry.style;
    const entryStyle = style.entry;
    return (
      <Paper key="p"
        style={style.wrapper}
        onClick={this.onClick}
        zIndex={1}>
        <div style={entryStyle}>
          <div key="t" style={[style.train, cancel && style.cancelled]}>{abfahrt.train}</div>
          <div style={[style.mid, detail && style.detail.mid]}>
            {info}
            <div style={[style.destination, cancel && style.cancelled]}>{normalizeName(abfahrt.destination)}</div>
          </div>
          <div style={[style.end, cancel && style.cancelled]}>
            <div style={style.time}>{abfahrt.time}</div>
            <div>
              {delay}
              <span style={style.platform}>{abfahrt.platform}</span>
            </div>
          </div>
        </div>
      </Paper>
    );
  }
}
