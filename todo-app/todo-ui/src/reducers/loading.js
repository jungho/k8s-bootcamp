import actionTypes from '../actions/actionTypes';

const loadingState = {
 isLoading: false
};

const loading = (state = loadingState, action) => {
  switch (action.type) {
    case actionTypes.LOADING:
      return Object.assign({}, state, {
      isLoading: action.loading
    });
    default:
      return state;
  }
};

export default loading