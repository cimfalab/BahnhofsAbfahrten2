import { Paper } from 'material-ui';
import { Link } from 'react-router';
require('./favEntry.less');

export default class extends React.Component {
  transitionTo() {
    router.transitionTo('abfahrten', {
      station: this.props.fav
    });
  }
  render() {
    const station = {
      station: this.props.fav
    };
    return (
      <Paper onClick={this.transitionTo.bind(this)} className="fav">
      {station}</Paper>
    );
  }
}
