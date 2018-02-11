import { connect } from 'react-redux';
import { toggleTodo, deleteTodo } from '../actions';
import TodoList from '../components/todoList/TodoList';
import * as moment from 'moment'
import TODO_SECTION from '../constants/todoSections';

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.done);
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.done);
    case 'SHOW_ALL':
    default:
      return todos
  }
};

const filterTodoInSections = (todos, section) => {
  switch(section) {
    case TODO_SECTION.UPCOMING:
      return todos.filter( todo => moment(todo.dueDate).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD") );

    case TODO_SECTION.TODAY:
      return todos.filter( todo => moment(todo.dueDate).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") );

    case TODO_SECTION.PAST_DUE:
      return todos.filter( todo => moment(todo.dueDate).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD") );

    default:
      return todos
  }
};

const searchedTodos = (todos, filter) => {
  if (!filter.searchTerm.length && !filter.tags.length){
    return todos
  }else {
    if(filter.searchTerm.length && !filter.tags.length)
      return todos
        .filter(todo => todo.description.includes(filter.searchTerm));

    else if(!filter.searchTerm.length && filter.tags.length)
      return todos
        .filter(todo => todo.tags.some(tag => filter.tags.indexOf(tag) >= 0));
    else return todos
      .filter(todo => todo.description.includes(filter.searchTerm))
      .filter(todo => todo.tags.some(tag => filter.tags.indexOf(tag) >= 0));
  }
};


const mapStateToProps = state => {
  const todos = searchedTodos(state.todos, state.searchFilter);
  return {
    pastDueTodos: filterTodoInSections(getVisibleTodos(todos, state.visibilityFilter), TODO_SECTION.PAST_DUE ) ,
    upcomingTodos: filterTodoInSections(getVisibleTodos(todos, state.visibilityFilter), TODO_SECTION.UPCOMING ),
    todayTodos: filterTodoInSections(getVisibleTodos(todos, state.visibilityFilter), TODO_SECTION.TODAY ),
    isLoading: state.loading.isLoading
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: (todo) => { dispatch(toggleTodo(todo)) },
    onDelete : (id) => { dispatch(deleteTodo(id)) }
  }
};

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);

export default VisibleTodoList;