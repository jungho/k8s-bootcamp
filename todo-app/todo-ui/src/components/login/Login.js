import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ADLogin, authenticationSuccess, loginFailed } from '../../actions/index';
import AuthenticationContext from 'adal-vanilla';
import adalConfig from '../../constants/adalConfig';
import TEST_MODE from '../../constants/appMode';

import './login.css';

class Login extends Component {
  constructor(props){
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      email: '',
      firstName: '',
      lastName: ''
    }
  }

  onFormSubmit(event) {
    event.preventDefault();

    // create BASE 64 token
    let stateStr = JSON.stringify(this.state);
    let token = new Buffer(stateStr).toString("base64");
    this.props.authenticationSuccess(token);
  }

  ADLogin() {
    this.props.ADLogin();
  }

  handleUserLoggedIn() {
    if(this.props.loggedIn){
      this.props.history.push('/');
    }
  }

  componentDidUpdate(){
    this.handleUserLoggedIn()
  }

  componentDidMount() {
    this.handleUserLoggedIn();
  }

  componentWillMount() {
    let authContext = new AuthenticationContext(adalConfig);
    if (authContext.isCallback(window.location.hash) && !authContext.getLoginError()) {
      authContext.handleWindowCallback();
      let user = authContext.getCachedUser();
      let token = authContext.acquireToken(adalConfig.clientId, (err, token) => {
        if (err) {
          this.props.loginFailed(err);
          console.log(err);
          return;
        }

        this.props.authenticationSuccess(token);

      });
    } else {
      this.handleUserLoggedIn()
    }
  }

  render() {
    //TODO: set flag for test mode and sho form if in test mode
    return (
      <div className="login-container">
          <div className="login">
            <div className="panel">
              <div className="panel-heading text-center"><h2>Login Todo</h2></div>
              <div className="panel-body">
                <div className="col-xs-12 text-center">
                  <button className="btn btn-primary" type="button" onClick={() => {this.ADLogin();}}>
                    Login With Active Directory <i className="fa fa-sitemap"/>
                  </button>
                </div>
                {
                  TEST_MODE ?
                    <form className="form-horizontal col-xs-12 test-mode-form" onSubmit={this.onFormSubmit}>
                      <div className="form-group">
                        <label className="control-label">*Email:</label>
                        <div>
                          <input onChange={(event) => { this.setState({email: event.target.value}) }} type="email" className="form-control" id="email" placeholder="Enter email" name="email" required="true"/>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="control-label">*First Name:</label>
                        <div>
                          <input onChange={(event) => { this.setState({firstName: event.target.value}) }}  type="text" className="form-control" placeholder="Enter First Name" name="firstName" required="true"/>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="control-label">*Last Name:</label>
                        <div>
                          <input onChange={(event) => { this.setState({lastName: event.target.value}) }}  type="text" className="form-control" placeholder="Enter Last Name" name="lastName" required="true"/>
                        </div>
                      </div>

                      <div className="form-group">
                        <button type="submit" className="btn btn-primary">Submit <i className="fa fa-sign-in"/></button>
                      </div>
                    </form>
                    : ''
                }

              </div>
            </div>
          </div>
      </div>
    );
  }
}

Login.propTypes = {
  loggedIn: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    loggedIn: state.authentication.details.loggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators( { ADLogin, authenticationSuccess, loginFailed }, dispatch );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);