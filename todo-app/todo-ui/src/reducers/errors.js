import actionTypes from '../actions/actionTypes';

const initialErrorState = {
  error: false,
  errorMessage: ''
};

const error = (state = initialErrorState, action) => {
  switch (action.type) {
    case actionTypes.SET_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        errorMessage: action.errorMessage
      });
    default:
      return state;
  }
};

export default error