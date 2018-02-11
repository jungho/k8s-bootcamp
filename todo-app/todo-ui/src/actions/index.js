import fetch from 'cross-fetch';
import actionTypes from './actionTypes';
import BASE_API_URL from '../constants/api';
import handleErrors from '../utils/fetchErrorHandler';
import AuthenticationContext from 'adal-vanilla';
import adalConfig from '../constants/adalConfig';
import AuthUtil from '../utils/authUtil';

export const loginRequest = () => {
  return {
    type: actionTypes.LOGIN_REQUEST
  }
};

export const successfulLogin = (user, token) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    token: token,
    user: user
  }
};

export const authenticationSuccess = (token) => {
  return function (dispatch) {
    //get user
    fetch('/api/user/', { headers: {'Authorization': 'Bearer ' + token } })
      .then((response) => {
        if (response.statusCode === 401) {
          throw new Error()
        }else return response.json()
      })
      .then((user) => {
        AuthUtil.setAuthenticatedUser(user, token);
        dispatch(successfulLogin(user, token));
      })
      .catch((err) => {
        console.log('error',err);
        fetch('/api/user/', { method: 'post', headers: {'Authorization': 'Bearer ' + token } })
          .then(handleErrors)
          .then((user) => {
            AuthUtil.setAuthenticatedUser(user, token);
            dispatch(successfulLogin(user, token));
          })
      });
  };
};

export const loginFailed = (error) => {
  return {
    type: actionTypes.LOGIN_FAILURE,
    error: error
  }
};

export const ADLogin = () => {
  return function (dispatch) {
    dispatch(loginRequest());
    new AuthenticationContext(adalConfig).login();
  };
};

export const loggedOut = () => {
  return {
    type: actionTypes.LOGGED_OUT
  }
};

export const logOut = () => {
  return function (dispatch) {
    AuthUtil.clearUser();
    dispatch(loggedOut());
  }
};

export const setLoading = (loading) => {
  return {
    type: actionTypes.LOADING,
    loading
  }
};

export const setError = ({error, errorMessage}) => {
  return {
    type: actionTypes.SET_ERROR,
    error,
    errorMessage
  }
};

export const addTodo = () => {
  return {
    type: actionTypes.ADD_TODO,
  }
};

export const addedTodo = todo => {
  return {
    type: actionTypes.ADDED_TODO,
    todo
  }
};

export const createTodo = (todo) => {
  return function (dispatch) {
    dispatch(addTodo());
    dispatch(setLoading(true));

    return fetch(BASE_API_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        ...AuthUtil.getAuthHeader()
      },
      body: JSON.stringify(
        {
          "owner": "87897",
          "description": todo.description,
          "done": false,
          "priority": todo.priority,
          "dueDate": todo.dueDate,
          "tags": todo.tags
        }
      )
    })
      .then((response) => {
          return unauthorizedHandler(response, dispatch, response => {
              if (!response.ok) {
                  throw Error(response.statusText);
              }
              return response.json();
          });
        }
      )
      .then(newTodo => {
        dispatch(addedTodo(newTodo));
        dispatch(setLoading(false));
        dispatch(setError({error:false, errorMessage:''}))
      })
      .catch(err => {
        dispatch(setError({error: true, errorMessage: err.message}));
        dispatch(setLoading(false));
      })
  }
};

export const toggledTodo = id => {
  return {
    type: actionTypes.TOGGLED_TODO,
    id
  }
};

export const toggleTodo = todo => {
  return function (dispatch) {
    dispatch(setLoading(true));
    return fetch(BASE_API_URL, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        ...AuthUtil.getAuthHeader()
      },
      body: JSON.stringify({...todo, done: !todo.done})
    }).then(response => unauthorizedHandler(response, dispatch, handleErrors))
      .then(() => {
        dispatch(toggledTodo(todo.id));
        dispatch(setLoading(false));
        dispatch(setError({error:false, errorMessage:''}))
      })
      .catch(err => {
        dispatch(setError({error: true, errorMessage: err.message}));
        dispatch(setLoading(false));
      })
  }
};

export const deletedTodo = id => {
  return {
    type: actionTypes.DELETED_TODO,
    id
  }
};

export const deleteTodo = id => {
  return function (dispatch) {
    dispatch(setLoading(true));
    return fetch(BASE_API_URL + '/' + id, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        ...AuthUtil.getAuthHeader()
      }
    }).then(response => unauthorizedHandler(response, dispatch, handleErrors))
      .then(() => {
          dispatch(deletedTodo(id));
          dispatch(setLoading(false));
          dispatch(setError({error:false, errorMessage:''}))
        }
      )
      .catch(err => {
        dispatch(setError({error: true, errorMessage: err.message}));
        dispatch(setLoading(false));
      })
  };
};

export const setVisibilityFilter = filter => {
  return {
    type: actionTypes.SET_VISIBILITY_FILTER,
    filter
  }
};

export const setSearchFilter = ({searchTerm, tags}) => {
  return {
    type: actionTypes.SET_SEARCH_FILTER,
    filter: {
      searchTerm,
      tags
    }
  }
};

export const requestTodos = () => {
  return {
    type: actionTypes.REQUEST_TODOS
  }
};

export const receiveTodos = (todos) => {
  return {
    type: actionTypes.RECEIVE_TODOS,
    todos: todos
  }
};

export const fetchTodos = () => {
  return function (dispatch) {
    dispatch(setLoading(true));
    dispatch(requestTodos());
    return fetch(BASE_API_URL, {
      headers: AuthUtil.getAuthHeader()
    })
      .then(response => unauthorizedHandler(response, dispatch, response => response.json()))
      .then(response => {
        dispatch(receiveTodos(response));
        dispatch(setLoading(false));
        dispatch(setError({error:false, errorMessage:''}))
      })
      .catch(err => {
        if (err.statusCode === 401){
          AuthUtil.clearUser();
        }
        dispatch(setError({error: true, errorMessage: err.message}));
        dispatch(setLoading(false));
      })
  }
};

const unauthorizedHandler = (response, dispatch, cb) => {
  console.log(response);

  if (response.status === 500 && response._bodyText && (response._bodyText.includes("JWT") || response._bodyText.includes("JWK"))) {
    dispatch(logOut());
    throw Error("Invalid JWT");
  }
  return cb(response);
};
