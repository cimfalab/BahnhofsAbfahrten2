import {Route, DefaultRoute} from 'react-router';
import App from './Components/app.jsx';
import AbfahrtList from './Components/abfahrtList.jsx';

export var routes = (
  <Route handler={App} path="/">
  <Route name="abfahrten" path=":station" handler={AbfahrtList} />
  </Route>
);
