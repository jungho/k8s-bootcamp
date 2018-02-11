import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSearchFilter } from '../../actions/index';

import './search.css';
import AddTodo from '../addTodo/AddTodo';
import { Filters } from '../filters/Filters';

export class Search extends Component{
  constructor(props){
    super(props);
    this.state = {
      searchTerm: '',
      tags: [],
      showAddTodo: false,
      showFiltersPanel: false
    };

    this.onSearchInputChange  = this.onSearchInputChange.bind(this);
    this.onUpdateFormFilters  = this.onUpdateFormFilters.bind(this);
    this.onToggleChange  = this.onToggleChange.bind(this);
    this.toggleAddTodo  = this.toggleAddTodo.bind(this);
    this.toggleFiltersPanel  = this.toggleFiltersPanel.bind(this);
  }

  setSearchTerm(){
    this.props.setSearchFilter({searchTerm: this.state.searchTerm, tags:this.state.tags});
  }

  onUpdateFormFilters(event) {
    event.preventDefault();
  }

  onToggleChange(tag){
    if(this.state.tags.indexOf(tag) === -1){
      this.setState({tags: [...this.state.tags, tag]}, this.setSearchTerm);
    }
    else {
      const tags = this.state.tags;
      const index = this.state.tags.indexOf(tag);
      this.setState({tags: [ ...tags.slice(0, index), ...tags.slice(index + 1) ]}, this.setSearchTerm);
    }
  }

  onSearchInputChange(event){
    const searchTerm = event.target.value;
    this.setState({searchTerm});
    this.props.setSearchFilter({searchTerm: searchTerm, tags:[]});
  }

  toggleAddTodo(){
    let currentState = this.state.showAddTodo;
    this.setState({showAddTodo: !currentState, showFiltersPanel: false});
  }

  toggleFiltersPanel(){
    let currentFilterPanelState = this.state.showFiltersPanel;
    this.setState({showFiltersPanel: !currentFilterPanelState, showAddTodo: false});
  }

  render() {
    return(
      <div>
        <div className="search-container">
          <div className="container">
            <div className="row">
              <div className="hidden-xs col-sm-6 col-md-6">
                <button onClick={this.toggleAddTodo} className="btn btn-primary">
                  { this.state.showAddTodo ?
                    <div>
                      <i className="fa fa-close"/> Close
                    </div>:
                    <div>
                      <i className="fa fa-plus"/> Add To Do
                    </div>
                  }
                </button>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6 search-filter-container">
                <div className="search-filter">
                  <div className="input-group">
                    <input type="text" className="form-control" value={this.state.searchTerm} placeholder="Search" onChange={this.onSearchInputChange}/>
                    <span className="input-group-addon">
                     <i className="fa fa-search" aria-hidden="true"/>
                    </span>
                  </div>
                </div>
                <button className="btn btn-default filter-button" onClick={this.toggleFiltersPanel}>
                  Filters { this.state.showFiltersPanel ? <i className="fa fa-caret-up" aria-hidden="true"/> :  <i className="fa fa-caret-down" aria-hidden="true"/> }
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='container'>
          <div className="row">
            <div className="col-xs-12 hidden-sm hidden-md hidden-lg">
              <button onClick={this.toggleAddTodo} className="btn btn-primary mobile-add-todo">
                { this.state.showAddTodo ?
                  <div>
                    <i className="fa fa-close"/> Close
                  </div>:
                  <div>
                    <i className="fa fa-plus"/> Add To Do
                  </div>
                }
              </button>
            </div>
          </div>
          <div style={this.state.showAddTodo ? {display: 'block'} : {display: 'none'}}>
            <AddTodo onCancel={ () => { this.toggleAddTodo() }}/>
          </div>

        </div>
        <Filters showFilters={this.state.showFiltersPanel} onTagToggle={this.onToggleChange}/>
      </div>
    )
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators( { setSearchFilter }, dispatch );
}

export default connect(null, mapDispatchToProps)(Search);
