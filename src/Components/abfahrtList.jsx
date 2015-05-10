import abfahrtStore from '../Stores/abfahrtStore.js';
import abfahrtActions from '../Actions/abfahrtActions.js';
import titleActions from '../Actions/titleActions.js';

import AbfahrtEntry from './abfahrtEntry.jsx';

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      abfahrten: []
    };
  }
  componentWillReceiveProps(newProps) {
    abfahrtActions.clearAbfahrten();
    this.getAbfahrten(newProps.params.station);
  }
  componentDidMount() {
    this.unregister = abfahrtStore.listen(abfahrten => {
      this.setState({
        abfahrten
      });
    });
    this.getAbfahrten(this.props.params.station);
  }
  getAbfahrten(station) {
    abfahrtActions.requestAbfahrten(station);
    titleActions.changeTitle(station);
  }
  componentWillUnmount() {
    this.unregister();
  }
  render() {
    return (
      <div>
        {
          _.map(this.state.abfahrten, abfahrt => {
            const key = abfahrt.train + abfahrt.time;
            return (<AbfahrtEntry key={key} abfahrt={abfahrt}/>);
          })
        }
      </div>
    );
  }
}
