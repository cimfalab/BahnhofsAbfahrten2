import {Route, DefaultRoute} from 'react-router';
import App from './Components/App.jsx';
import AbfahrtList from './Components/AbfahrtList.jsx';
import Home from './Components/Home.jsx';
import React from 'react';

export const routes = (
  <Route handler={App} path="/">
  <DefaultRoute handler={Home}/>
  <Route name="abfahrten" path=":station" handler={AbfahrtList} />
  </Route>
);
