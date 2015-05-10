import { Paper } from 'material-ui';
require('./abfahrtEntry.less');

export default class extends React.Component {
  getVia(abfahrt) {
    var via = '';
    _.each(abfahrt.via, (v, index) => {
      via += v;
      if (index + 1 !== abfahrt.via.length) {
        via += ' - ';
      }
    });
    return via ? <div className="via">{via}</div> : null;
  }
  getInfo(abfahrt) {
    var info = '';
    if (abfahrt.messages.delay.length > 0) {
      info += abfahrt.messages.delay[0].text;
    }
    _.each(abfahrt.messages.qos, q => {
      if (info.length > 0) {
        info += ' +++ ';
      }
      info += q.text;
    });
    return info ? <div className="info">{info}</div> : null;
  }
  getDelay(abfahrt) {
    if (!abfahrt.delay || abfahrt.isCancelled) {
      return null;
    }
    return (<span className="delay">(+{abfahrt.delay})</span>);
  }
  render() {
    const abfahrt = this.props.abfahrt;
    var info = this.getInfo(abfahrt);
    if (!info) {
      info = this.getVia(abfahrt);
    }
    const delay = this.getDelay(abfahrt);
    var innerClass = 'entry';
    if (abfahrt.isCancelled) {
      innerClass += ' cancelled';
    }
    return (
      <Paper zIndex={1} className="outerEntry" innerClassName={innerClass}>
        <div className="train">{abfahrt.train}</div>
        <div className="mid">
          {info}
          <div className="destination">{abfahrt.destination}</div>
        </div>
        <div className="end">
          <div className="time">{abfahrt.time}</div>
          <div>
            {delay}
            <span className="platform">{abfahrt.platform}</span>
          </div>
        </div>
      </Paper>
    );
  }
}
