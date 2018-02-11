import actionTypes from '../actions/actionTypes';

const todos = (state = [], action) => {
  switch (action.type) {
    case actionTypes.ADDED_TODO:
      return [
        ...state,
        action.todo
      ];
    case actionTypes.TOGGLED_TODO:
      return state.map(todo =>
        (todo.id === action.id)
          ? {...todo, done: !todo.done}
          : todo
      );
    case actionTypes.RECEIVE_TODOS:
      return action.todos || [];
    case actionTypes.DELETED_TODO:
      const newState = Object.assign([], state);
      const todoDelete = state.findIndex(state => {
        return state.id === action.id;
      });
      newState.splice(todoDelete, 1);
      return newState;
    default:
      return state
  }
};

export default todos