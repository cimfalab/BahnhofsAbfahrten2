import {Route, DefaultRoute} from 'react-router';
import App from './Components/app.jsx';
import AbfahrtList from './Components/abfahrtList.jsx';
import Home from './Components/home.jsx';

export var routes = (
  <Route handler={App} path="/">
  <DefaultRoute handler={Home}/>
  <Route name="abfahrten" path=":station" handler={AbfahrtList} />
  </Route>
);