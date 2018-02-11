import React from 'react';
import PropTypes from 'prop-types';
import './loading.css';

const Loading = ({isLoading})=> (
  <div className={isLoading ? 'loading' : ''}/>
);

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default Loading;
