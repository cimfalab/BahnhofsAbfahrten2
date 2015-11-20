import { createHistory } from 'history';
import { Router, Route } from 'react-router';
import App from './Components/App.jsx';
import AbfahrtList from './Components/AbfahrtList.jsx';
import Home from './Components/Home.jsx';
import React from 'react';

export const routes = (
  <Router history={createHistory()}>
    <Route component={App}>
      <Route path="/" component={Home}/>
      <Route path="/:station" component={AbfahrtList}/>
    </Route>
  </Router>
);
