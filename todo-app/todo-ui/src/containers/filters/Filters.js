import React, { Component } from 'react';
import TAG_LIST from '../../constants/tagList';
import TagToggle from '../../components/tagToggle/TagToggle';
import './filters.css';
import VisibilitySelector from '../../components/VisibilitySelector';

export class Filters extends Component{
  constructor(props){
    super(props);
  }

  render() {
    return(
    <div style={this.props.showFilters ? {'display': 'block'} : {'display': 'none'}}>
      <div className="container">
        <div className="row">
          <div className="filters-container">
            <div className="col-xs-8">
              <form>
                <div data-toggle="buttons">
                  {
                    Object.keys(TAG_LIST)
                      .map(tag => <TagToggle key={tag} onToggleChange={() => {this.props.onTagToggle(TAG_LIST[tag])} } tag={TAG_LIST[tag]}/>)
                  }
                </div>
              </form>
            </div>
            <div className="col-xs-4">
              <VisibilitySelector/>
            </div>
          </div>
        </div>
      </div>
    </div>

    )
  }
}