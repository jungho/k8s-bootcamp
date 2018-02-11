import React from 'react';
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import './index.css';
import todoApp from './reducers';
import registerServiceWorker from './registerServiceWorker';
// import { fetchTodos } from './actions/index';
import Root from './components/Root';

let store = createStore(
  todoApp,
  applyMiddleware(thunk)
);

// store
//   .dispatch(fetchTodos())
//   .then(() => console.log(store.getState()));

render(
  <Root store={store} />,
  document.getElementById('root')
);


registerServiceWorker();