import actionTypes from '../../actions/actionTypes';
import loading from '../loading';

describe('SearchFilter Reducer', ()=> {
  it('Should handle undefined initial state', () => {
    const finalState = {
      isLoading: false
    };
    const initialState = undefined;
    const action = {
      type: 'INIT',
    };

    const actualState = loading(initialState, action);

    expect(actualState).toEqual(finalState);
  });
  it('Should handle setting a new loading state', () => {
    const finalState = {
      isLoading: true
    };
    const initialState = undefined;
    const action = {
      type: actionTypes.LOADING,
      loading: true
    };

    const actualState = loading(initialState, action);

    expect(actualState).toEqual(finalState);
  });
});