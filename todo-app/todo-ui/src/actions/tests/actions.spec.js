import * as actions from '../index';
import actionTypes from '../actionTypes';
import priority from '../../constants/priority';

describe('actions', () => {
  it('should create an action to add a todo', () => {
    const newTodo = {
      description: 'Finish docs',
      priority: priority.LOW,
      dueDate: '2017-10-2'
    };
    const expectedAction = {
      type: actionTypes.ADDED_TODO,
      todo: newTodo
    };
    expect(actions.addedTodo(newTodo)).toEqual(expectedAction)
  });

  it('should create an action to toggle a todo', () => {
    const id = 0;
    const expectedAction = {
      id: 0,
      type: actionTypes.TOGGLED_TODO,
    };
    expect(actions.toggledTodo(id)).toEqual(expectedAction)
  });

  it('should create an action to set the visibility filter', () => {
    const filter = 'SHOW_ALL';
    const expectedAction = {
      filter,
      type: actionTypes.SET_VISIBILITY_FILTER
    };

    expect(actions.setVisibilityFilter(filter)).toEqual(expectedAction)
  });

  it('should create the right action to delete a todo', () => {
      const todoID = 4;
      const expectedAction = {
        id: todoID,
        type: actionTypes.DELETED_TODO
      };

      expect(actions.deletedTodo(todoID)).toEqual(expectedAction)
  });
});