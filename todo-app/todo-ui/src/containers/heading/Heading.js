import React from 'react';
import { connect } from 'react-redux';
import './heading.css';

const Heading = ({user, logOut}) => (
  <div className="header">
    { user
      ? <div onClick={() => { logOut() }} className="current-user">{user.firstName} {user.lastName} <i className="fa fa-sign-out"/></div>
      : ''
    }
    <div className="row">
      <div className="col-sm-12 text-center">
        <h1>To Do</h1>
      </div>
    </div>
  </div>
);

const mapStateToProps = state => {
  return {
    user: state.authentication.details.user
  }
};


export default connect(mapStateToProps, null)(Heading);
