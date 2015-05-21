import { Paper } from 'material-ui';
require('./favEntry.less');

export default class extends React.Component {
  transitionTo() {
    router.transitionTo('abfahrten', {
      station: this.props.fav
    });
  }
  render() {
    const station = {
      station: this.props.fav.replace('%2F', '/')
    };
    return (
      <Paper onClick={this.transitionTo.bind(this)} className="fav">
      {station}</Paper>
    );
  }
}
