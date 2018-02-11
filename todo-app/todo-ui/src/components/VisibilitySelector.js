import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setVisibilityFilter } from '../actions';
import filter from '../constants/filter';

const VisibilitySelector = ({currentSelection, onSelection}) => {
  return (
    <select className="form-control" onChange={e => onSelection(e.target.value)} value={currentSelection}>
      <option value={filter.SHOW_ALL}>
        All
      </option>
      <option value={filter.SHOW_COMPLETED}>
        Completed
      </option>
      <option value={filter.SHOW_ACTIVE}>
        Active
      </option>
    </select>
  )
};


VisibilitySelector.propTypes = {
  currentSelection: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    currentSelection: state.visibilityFilter
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelection: (filter) => {
      dispatch(setVisibilityFilter(filter))
    }
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(VisibilitySelector);