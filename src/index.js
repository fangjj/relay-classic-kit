import 'todomvc-common';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import TodoApp from './components/TodoApp';
import TodoList from './components/TodoList';
import ViewerQueries from './queries/ViewerQueries';
import {createHashHistory} from 'history';
import {IndexRoute, Route, Router, applyRouterMiddleware, useRouterHistory} from 'react-router';

const history = useRouterHistory(createHashHistory)({ queryKey: false });
const mountNode = document.getElementById('root');
import useRelay from 'react-router-relay';
import './stylesheets/app/index.css';
import './stylesheets/app/base.css';
import './stylesheets/main.less';
import './assets/learn.json';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:5000/graphql-relay')
);

ReactDOM.render(
  <Router forceFetch environment={Relay.Store} history={history} render={applyRouterMiddleware(useRelay)}>
    <Route path="/" component={TodoApp} queries={ViewerQueries}>
      <IndexRoute component={TodoList} queries={ViewerQueries} prepareParams={() => ({status: 'any'})} />
      <Route path=":status" component={TodoList} queries={ViewerQueries} />
    </Route>
  </Router>,
  mountNode
);
