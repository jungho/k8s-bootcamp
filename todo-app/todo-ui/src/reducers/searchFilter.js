import actionTypes from '../actions/actionTypes'

const searchFilterState = {
  searchTerm:'',
  tags:[]
};

const searchFilter = (state = searchFilterState , action) => {
  switch (action.type) {
    case actionTypes.SET_SEARCH_FILTER:
      return {
        searchTerm: action.filter.searchTerm,
        tags: action.filter.tags
      };
    default:
      return state;
  }
};

export default searchFilter;
