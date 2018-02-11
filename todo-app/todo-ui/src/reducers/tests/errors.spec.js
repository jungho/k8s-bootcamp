import actionTypes from '../../actions/actionTypes';
import error from '../errors';

describe('SearchFilter Reducer', ()=> {
  it('Should handle undefined initial state', () => {
    const finalState = {
      error: false,
      errorMessage: ''
    };
    const initialState = undefined;
    const action = {
      type: 'INIT',
    };

    const actualState = error(initialState, action);

    expect(actualState).toEqual(finalState);
  });

  it('Should handle setting the error and error message', () => {
    const finalState = {
      error: true,
      errorMessage: '403 Denied Access'
    };
    const initialState = undefined;
    const action = {
      type: actionTypes.SET_ERROR,
      error: true,
      errorMessage: '403 Denied Access'
    };

    const actualState = error(initialState, action);

    expect(actualState).toEqual(finalState);
  });
});