import todos from '../todos';
import actionTypes from '../../actions/actionTypes';
import priority from '../../constants/priority';
describe('Todos Reducer', ()=>{
  it('Should handle undefined initial state', () => {
    const finalState = [];
    const initialState = undefined;
    const action = {
      type: 'INIT',
    };
    const actualState = todos(initialState, action);

    expect(actualState).toEqual(finalState);
  });

  it('Should handle adding a todo', () => {
    const initialState = [];
    const todo = {
      id: 1,
      description: 'todo',
      priority: priority.HIGH,
      dueDate: '2017-12-10',
      done: false
    };
    const finalState = [todo];

    const action ={
      type: actionTypes.ADDED_TODO,
      todo
    };
    const actualState = todos(initialState, action);

    expect(actualState).toEqual(finalState);
  });

  it('Should handle toggling the status/completion of a todo', () => {
    const initalTodo = {
      id: 1,
      description: 'todo',
      priority: priority.HIGH,
      dueDate: '2017-12-10',
      done: false
    };
    const doneTodo = {
      id: 1,
      description: 'todo',
      priority: priority.HIGH,
      dueDate: '2017-12-10',
      done: true
    };
    const initialState = [initalTodo];
    const finalState = [doneTodo];
    const action = {
      type: actionTypes.TOGGLED_TODO,
      id: 1
    };
    const actualState = todos(initialState, action);

    expect(actualState).toEqual(finalState);
  });

  it('Should handle deleting a todo', () => {
    const todo = {
      id: 1,
      description: 'todo',
    };
    const tobeDeleted = {
      id: 2,
      description: 'delete me',
    };
    const initalState = [todo,tobeDeleted];
    const finalState = [todo];

    const action = {
      type: actionTypes.DELETED_TODO,
      id: tobeDeleted.id
    };

    const actualState = todos(initalState, action);

    expect(actualState).toEqual(finalState);
  });
});