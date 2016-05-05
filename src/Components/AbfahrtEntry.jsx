/* @flow */
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Paper } from 'material-ui';
import { setDetail } from '../Actions/abfahrten';
import Radium from 'radium';
import React from 'react';
import PureRender from 'pure-render-decorator';


function normalizeName(name: string) {
  let normalizedName = name.replace(/([^ ])\(/, '$1 (');
  normalizedName = name.replace(/\)(.)/, ') $1');
  normalizedName = name.replace(/Frankfurt \(M\)/, 'Frankfurt (Main)');
  return normalizedName;
}

type Props = {
  abfahrt: Abfahrt,
  detail: bool,
}

const style = {
  wrapper: {
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.24)',
    cursor: 'pointer',
    flexShrink: 0,
    marginBottom: 5,
    overflow: 'hidden',
    paddingLeft: 15,
    paddingRight: 15,
  },
  entry: {
    display: 'flex',
    flexShrink: 0,
    fontSize: '0.6em',
    lineHeight: 1,
    paddingTop: 5,
    userSelect: 'none',
    '@media screen and (max-width: 1200px)': {
      fontSize: '0.3em',
    },
  },
  cancelled: {
    textDecoration: 'line-through',
  },
  detail: {
    mid: {
      whiteSpace: 'normal',
    },
    hbf: {
      fontWeight: 'bold',
    },
  },
  train: {
    flex: 1,
    fontSize: '3em',
    lineHeight: 1.2,
    maxWidth: 280,
    '@media screen and (max-width: 1200px)': {
      maxWidth: 75,
    },
  },
  mid: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    lineHeight: 1.2,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  destination: {
    fontSize: '4em',
  },
  via: {
    fontSize: '2.1em',
    lineHeight: 1.2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  info: {
    textDecoration: 'none',
    color: 'red',
    fontSize: '2.1em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  end: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 15,
  },
  time: {
    fontSize: '2.4em',
  },
  early: {
    color: 'green',
    fontSize: '3em',
    marginRight: '0.4em',
  },
  delay: {
    color: 'red',
    fontSize: '3em',
    marginRight: '0.4em',
  },
  platform: {
    fontSize: '3em',
  },
  additional: {
    color: 'red',
  },
};

@PureRender
@Radium
export default class AbfahrtEntry extends React.Component {
  props: Props;
  getAbfahrt(name: string, index: number, length: number, abfahrt: Abfahrt, isCancelled?: ?number, isAdditional?: ?number): Array<any> {
    const via = [];
    const lowerName = name.toLowerCase();
    const isHbf = _.includes(lowerName, 'hbf') || _.includes(lowerName, 'centraal') || _.includes(lowerName, 'centrale') || _.includes(lowerName, 'termini');
    via.push(<span key={`${index}i`} style={[isCancelled && style.cancelled, isAdditional && style.additional, isHbf && style.detail.hbf]}>{normalizeName(name)}</span>);
    if (index + 1 !== length) {
      via.push(<span key={index}> - </span>);
    }
    return via;
  }
  getDetailedVia(abfahrt: Abfahrt, isCancelled?: number): Array<any> {
    let via = [];
    const abfahrten = abfahrt.route;
    abfahrten.forEach((v, index) => {
      via = via.concat(this.getAbfahrt(v.name, index, abfahrten.length, abfahrt, v.isCancelled || isCancelled, v.isAdditional));
    });
    return via;
  }
  getNormalVia(abfahrt: Abfahrt, isCancelled?: number): Array<any> {
    let via = [];
    const abfahrten = abfahrt.via;
    abfahrten.forEach((v, index) => {
      via = via.concat(this.getAbfahrt(v, index, abfahrten.length, abfahrt, isCancelled));
    });
    return via;
  }
  getVia(abfahrt: Abfahrt, isCancelled?: number) {
    let via = [];
    if (this.props.detail) {
      via = this.getDetailedVia(abfahrt, isCancelled);
    } else {
      via = this.getNormalVia(abfahrt, isCancelled);
    }
    return via.length ? <div key="v" style={[style.via, isCancelled && style.cancelled]}>{via}</div> : null;
  }

  getInfo(abfahrt: Abfahrt) {
    let info = '';
    if (abfahrt.messages.delay.length > 0) {
      info += abfahrt.messages.delay[0].text;
    }
    _.forEach(abfahrt.messages.qos, q => {
      if (info.length > 0) {
        info += ' +++ ';
      }
      info += q.text;
    });
    for (let i = 1; i < abfahrt.messages.delay.length; i++) {
      info += ` +++ ${abfahrt.messages.delay[i].text}`;
    }
    return info ? <div key="i" style={style.info}>{info}</div> : null;
  }
  getDelay(abfahrt: Abfahrt) {
    if ((!abfahrt.delayDeparture && !abfahrt.delayArrival) || abfahrt.isCancelled) {
      return null;
    }
    let delay = abfahrt.delayDeparture || abfahrt.delayArrival;
    if ((abfahrt.delayDeparture || abfahrt.delayArrival) > 0) {
      delay = `+${delay}`;
    } else {
      delay = `-${Math.abs(delay)}`;
    }
    return (<span style={(abfahrt.delayDeparture || abfahrt.delayArrival) > 0 ? style.delay : style.early}>({delay})</span>);
  }
  @autobind
  onClick() {
    if (this.props.detail) {
      setDetail(null);
    } else {
      setDetail(this.props.abfahrt);
    }
  }
  render() {
    const { abfahrt, detail } = this.props;
    let info = this.getInfo(abfahrt);
    const cancel = abfahrt.isCancelled;
    if (!detail && !info) {
      info = this.getVia(abfahrt, cancel);
    }
    if (detail) {
      info = [info, this.getVia(abfahrt)];
    }
    const delay = this.getDelay(abfahrt);
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
            <div style={style.time}>{abfahrt.scheduledDeparture || abfahrt.scheduledArrival}</div>
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
