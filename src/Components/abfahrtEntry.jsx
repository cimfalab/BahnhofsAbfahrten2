import { Paper } from 'material-ui';
import detailStore from '../Stores/detailStore.js';
import detailActions from '../Actions/detailActions.js';
require('./abfahrtEntry.less');

export default class extends React.Component {
  constructor() {
    super();
    autoBind(this);
    this.state = {
      detail: false
    };
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
      var className = classNames({
        cancelled: v.isCancelled,
        hbf: _.contains((v.name || v).toLowerCase(), 'hbf')
      });
      via.push(<span className={className}>{v.name || v}</span>);
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
    return info ? <div className="info">{info}</div> : null;
  }
  getDelay(abfahrt) {
    if (!abfahrt.delay || abfahrt.isCancelled) {
      return null;
    }
    return (<span className="delay">(+{abfahrt.delay})</span>);
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
      info = [this.getVia(abfahrt), info];
    }
    const delay = this.getDelay(abfahrt);
    const innerClass = classNames({
      entry: true,
      cancelled: abfahrt.isCancelled,
      detail: this.state.detail
    });
    const paperClasses = classNames({
      outerEntry: true
    });
    return (
      <Paper
        onClick={this.onClick}
        zIndex={1}
        className={paperClasses}
        innerClassName={innerClass}>
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
