import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import Login from './login/Login';

const Root = ({ store, requireAuth }) => (
  <Provider store={store}>
    <Router>
      <div>
        <Route path="/" exact component={App}/>
        <Route path="/login" component={Login}/>
      </div>
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;