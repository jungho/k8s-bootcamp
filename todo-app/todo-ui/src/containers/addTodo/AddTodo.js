import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as moment from 'moment';
import priority from '../../constants/priority';
import { createTodo } from '../../actions/index';
import TAG_OPTIONS from '../../constants/tagOptions';
import Select from 'react-select';
import './addTodo.css';
import 'react-select/dist/react-select.css';


export class AddTodo extends Component{
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      priority: priority.LOW,
      dueDate: moment().format("YYYY-MM-DD"),
      tags: [],
    };

    this.onFormSubmit  = this.onFormSubmit.bind(this);
    this.handleTagInputChange = this.handleTagInputChange.bind(this);
    this.handleCancel  = this.handleCancel.bind(this);
  }

  handleTagInputChange(tags){
    if(this.state.tags.length && this.state.tags.split(',').length === 2){
      return false
    }
    this.setState({ tags });
  }


  resetInput() {
    return {
      description: '',
      priority: priority.LOW,
      dueDate: moment().format("YYYY-MM-DD"),
      tags: [],
    };
  }

  onFormSubmit(event) {
    event.preventDefault();
    if (!this.state.description.trim()) {
      return
    }
    this.props.createTodo({
      description: this.state.description,
      priority: this.state.priority,
      dueDate: this.state.dueDate,
      tags: this.state.tags.length ? this.state.tags.split(",") : []
    });
    this.setState(this.resetInput());
  }

  handleCancel() {
    this.setState(this.resetInput());
    this.props.onCancel();
  }

  render() {
    return(
      <div className="add-todo-container">
        <form onSubmit={this.onFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <div className="form-inline">
                <div className="add-todo-row">
                  <div className="form-group col-xs-12 col-sm-4 col-md-5">
                    <label className="hidden-sm hidden-md hidden-lg">Description:</label>
                    <input
                      id="todo-description"
                      value={this.state.description}
                      placeholder="Enter To Do"
                      onChange={(event) => {this.setState({description: event.target.value})}}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-group col-xs-12 col-sm-4 col-md-4">
                    <label>Tags:</label>

                    <Select
                      closeOnSelect={false}
                      multi
                      onChange={this.handleTagInputChange}
                      options={TAG_OPTIONS}
                      removeSelected={true}
                      simpleValue
                      value={this.state.tags}
                    />
                  </div>
                  <div className="form-group col-xs-12 col-sm-4 col-md-3">
                    <label>Due:</label>
                    <input
                      value={this.state.dueDate}
                      onChange={(event) => {this.setState({dueDate: event.target.value})}}
                      type="date"
                      className="form-control"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 text-center add-todo-actions">
              <button className="btn btn-primary" type="submit">
                Add
              </button>
              <button className="btn btn-default" type="button" onClick={this.handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </form>
        <hr/>
      </div>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators( { createTodo }, dispatch );
}


export default connect(null, mapDispatchToProps)(AddTodo);
