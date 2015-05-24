import { Paper } from 'material-ui';
import detailStore from '../Stores/detailStore.js';
import detailActions from '../Actions/detailActions.js';
import './abfahrtEntry.less';


function normalizeName(name) {
  name = name.replace(/([^ ])\(/, '$1 (');
  name = name.replace(/\)(.)/, ') $1');
  name = name.replace(/Frankfurt \(M\)/, 'Frankfurt (Main)');
  return name;
}

@autoBind
class AbfahrtEntry extends React.Component {
  state = {
    detail: false
  }
  componentDidMount() {
    this.unreg = detailStore.listen(entry => {
      if (entry !== this) {
        this.setState({
          detail: false
        });
      }
    });
  }
  componentWillUnmount() {
    this.unreg();
  }
  getVia(abfahrt) {
    var via = [];
    const abfahrten = this.state.detail ? abfahrt.route : abfahrt.via;
    _.each(abfahrten, (v, index) => {
      if (_.isObject(v) && v.name == null) {
        return;
      }
      const name = v.name || v;
      const lowerName = name.toLowerCase();
      var className = classNames({
        cancelled: v.isCancelled,
        additional: v.isAdditional,
        hbf: _.contains(lowerName, 'hbf') || _.contains(lowerName, 'centraal') || _.contains(lowerName, 'centrale') || _.contains(lowerName, 'termini')
      });
      via.push(<span className={className}>{normalizeName(name)}</span>);
      if (index + 1 !== abfahrten.length) {
        via.push(<span> - </span>);
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
    for (let i = 1; i < abfahrt.messages.delay.length; i++) {
      info += ` +++ ${abfahrt.messages.delay[i].text}`;
    }
    return info ? <div className="info">{info}</div> : null;
  }
  getDelay(abfahrt) {
    if (!abfahrt.delay || abfahrt.isCancelled) {
      return null;
    }
    const className = classNames({
      delay: abfahrt.delay > 0,
      early: abfahrt.delay < 0
    });
    let delay = abfahrt.delay;
    if (abfahrt.delay > 0) {
      delay = `+${delay}`;
    } else {
      delay = `-${Math.abs(delay)}`;
    }
    return (<span className={className}>({delay})</span>);
  }
  onClick() {
    detailActions.setDetail(this);
    let newVal = !this.state.detail;
    this.setState({
      detail: newVal
    });
  }
  render() {
    const abfahrt = this.props.abfahrt;
    var info = this.getInfo(abfahrt);
    if (!this.state.detail && !info) {
      info = this.getVia(abfahrt);
    }
    if (this.state.detail) {
      info = [info, this.getVia(abfahrt)];
    }
    const delay = this.getDelay(abfahrt);
    const innerClass = classNames({
      entry: true,
      cancelled: abfahrt.isCancelled,
      detail: this.state.detail
    });
    return (
      <Paper
        onClick={this.onClick}
        zIndex={1}
        className="outerEntry"
        innerClassName={innerClass}>
        <div className="train">{abfahrt.train}</div>
        <div className="mid">
          {info}
          <div className="destination">{normalizeName(abfahrt.destination)}</div>
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


export default AbfahrtEntry;
