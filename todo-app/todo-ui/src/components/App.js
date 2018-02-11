import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import VisibleTodoList from '../containers/VisibleTodoList';
import Heading from '../containers/heading/Heading';
import Search from '../containers/search/Search';
import ErrorAlert from '../components/errorAlert/ErrorAlert';
import { bindActionCreators } from 'redux';
import { logOut } from '../actions/index';
import { fetchTodos } from '../actions/index';

class App extends Component {
  constructor(props){
    super(props);
  }

  componentDidUpdate(){
    if(!this.props.loggedIn){
      this.props.history.push('/login');
    }
  }

  componentWillMount() {
    if(!this.props.loggedIn){
      this.props.history.push('/login');
    } else {
      this.props.fetchTodos();
    }
  }

  render() {
    return (
      <div>
        <Heading logOut={this.props.logOut}/>
        <Search/>
        <div className="container">
          <VisibleTodoList/>
        </div>
        <ErrorAlert/>
      </div>
    );
  }
}

App.propTypes = {
  loggedIn: PropTypes.bool,
  logOut: PropTypes.func
};

const mapStateToProps = state => {
  return {
    loggedIn: state.authentication.details.loggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators( { logOut, fetchTodos }, dispatch );
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
