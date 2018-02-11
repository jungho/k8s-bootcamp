import searchFilter from '../searchFilter';
import actionTypes from '../../actions/actionTypes';


describe('SearchFilter Reducer', ()=> {
  it('Should handle undefined initial state', () => {
    const finalState = {
      searchTerm:'',
      tags:[]
    };
    const initialState = undefined;
    const action = {
      type: 'INIT',
    };

    const actualState = searchFilter(initialState, action);

    expect(actualState).toEqual(finalState);
  });

  it('should be able to set the search filter and tags', () => {
    const finalState = {
      searchTerm:'Get the dog',
      tags:['FAMILY']
    };
    const initialState = undefined;
    const action = {
      type: actionTypes.SET_SEARCH_FILTER,
      filter: {
        searchTerm: 'Get the dog',
        tags: ['FAMILY']
      }
    };

    const actualState = searchFilter(initialState, action);
    expect(actualState).toEqual(finalState);
  });
});