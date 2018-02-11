import { combineReducers } from 'redux';
import todos from './todos';
import visibilityFilter from './visibilityFilter';
import searchFilter from './searchFilter';
import loading from './loading';
import error from './errors';
import authentication from './authentication';

const todoApp = combineReducers({
  authentication,
  todos,
  visibilityFilter,
  searchFilter,
  loading,
  error
});

export default todoApp;