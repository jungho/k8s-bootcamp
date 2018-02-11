import actionTypes from '../actions/actionTypes'
import AuthUtil from '../utils/authUtil';

let user = AuthUtil.getUser();
let token = AuthUtil.getToken();

const initialState = {
  details: user ? { loggedIn: true, user } : {loggedIn: false},
  token : token ? token : '',
};

const authentication = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      return {
        details: {
          user: action.user,
          loggedIn: true
        },
        token: action.token
      };
    case actionTypes.LOGGED_OUT:
    case actionTypes.LOGIN_FAILURE:
      return {
        details: {
          loggedIn: false,
          user: {
            firstName:'',
            lasName: ''
          }
        },
        token : '',
      };
    default:
      return state
  }
};

export default authentication;