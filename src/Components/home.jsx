import favStore from '../Stores/favStore.js';
import FavEntry from '../Components/favEntry.jsx';
import titleActions from '../Actions/titleActions.js';

import { Paper } from 'material-ui';

export default class extends React.Component {
  state = {
    favs: favStore.getAll()
  }
  constructor() {
    super();
    titleActions.resetTitle();
  }
  componentDidMount() {
    this.unregister = favStore.listen(list => this.setState({ favs: list }));
  }
  componentWillUnmount() {
    this.unregister();
  }
  render() {
    if (_.isEmpty(this.state.favs)) {
      return (
        <Paper className="fav">
          Leider keine Favs :(
        </Paper>
      );
    }
    return (
      <div>
        {_.map(this.state.favs, (x, fav) => {
          return (
            <FavEntry fav={fav} key={fav}/>
          );
        })}
      </div>
    );
  }
}
