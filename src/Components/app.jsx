import {RouteHandler} from 'react-router';
import Toolbar from './toolbar.jsx';

export default class App extends React.Component {
  render() {
    return (
      <div className="mainWrapper">
        <Toolbar/>
        <RouteHandler/>
      </div>
    );
  }
}
