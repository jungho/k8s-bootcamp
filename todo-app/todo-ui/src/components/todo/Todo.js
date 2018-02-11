import React from 'react';
import PropTypes from 'prop-types';
import './todo.css';
import TagLabel from '../TagLabel';

const Todo = ({ onClick, onDelete, done, description, priority, dueDate, tags }) => (
  <div className="row">
    <div className="col-xs-12 todo-container">
      <div className={"col-sm-12 col-xs-10 todo-item " + (done ? 'done' : 'not-done') } onClick={onClick}>
        <div className="col-xs-12 col-sm-5">
          <i className={"fa " + (done ? 'fa-check-square-o fa-lg' : 'fa-square-o fa-lg')}/>
          <span className="description">
      {description}
    </span>
        </div>
        <div className="col-xs-8 col-sm-4 tag-container">
          {
            tags.length ?
              tags.map(tag =>  <TagLabel key={tags.indexOf(tag)} tag={tag}/>)
              : ''
          }
        </div>
        <div className="col-xs-4 col-sm-3 date-container">
          <span>{dueDate}</span>
        </div>
      </div>
      <div className="col-xs-2 col-sm-1 hidden-lg text-right todo-action">
        <button className="btn btn-default todo-delete" type="button" onClick={onDelete}>
          <i className="fa fa-trash-o" aria-hidden="true"/>
        </button>
      </div>
      <div className="todo-action hidden-md hidden-sm hidden-xs">
        <button className="btn btn-default todo-delete" type="button" onClick={onDelete}>
          <i className="fa fa-trash-o" aria-hidden="true"/>
        </button>
      </div>
    </div>
  </div>
);

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  done: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  dueDate: PropTypes.string.isRequired,
  tags: PropTypes.array
};

export default Todo;