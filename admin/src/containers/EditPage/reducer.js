import produce from 'immer';

const initialState = {
  id: 1,
  entity: {},
  isLoading: true,
};

const reducer = (state, action) =>
  produce(state, (draftState) => {
    switch (action.type) {
      case 'GET_DATA': {

return initialState;
      }
      case 'GET_DATA_SUCCEEDED': {
        draftState.id = action.entity.id;
        draftState.entity = action.entity;
        draftState.isLoading = false;
        break;
      }
      case 'UPDATE_ENTITY': {
        draftState.entity[action.name] = action.value;
        break;
      }
      case 'SAVE_DATA_SUCCEED': {
        draftState.isLoading = false;
        break;
      }
      case 'SET_IS_LOADING': {
        draftState.isLoading = true;
        break;
      }
      case 'UNSET_IS_LOADING': {
        draftState.isLoading = false;
        break;
      }
      default:
        return draftState;
    }
  });

export { initialState, reducer };
