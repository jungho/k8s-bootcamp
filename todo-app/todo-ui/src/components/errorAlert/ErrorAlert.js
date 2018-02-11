import React from 'react';
import { connect } from 'react-redux';
import './errorAlert.css';

const ErrorAlert = ({error, errorMessage}) => (
  <div style={error ? {display: 'block'} : {display: 'none'}} className="alert alert-danger alert-dismissable" id="errorAlert">
    <a className="close" data-dismiss="alert" aria-label="close">&times;</a>
    <strong>Error: </strong> {errorMessage}
  </div>
);


const mapStateToProps = state => {
  const errorState = state.error;
  return {
    error: errorState.error,
    errorMessage: errorState.errorMessage
  }
};

export default connect(mapStateToProps, null)(ErrorAlert);
