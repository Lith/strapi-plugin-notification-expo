import produce from 'immer';

const initialState = {
  data: [],
  isLoading: true,
  sortBy: 'id',
  sortOrder: 'asc',
  pagination: {
    page: 1,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  },
};

const reducer = (state, action) =>
  produce(state, (draftState) => {
    switch (action.type) {
      case 'GET_DATA': {
        return initialState;
      }
      case 'GET_DATA_SUCCEEDED': {
        draftState.data = action.data;
        draftState.isLoading = false;
        draftState.pagination = action.pagination;
        break;
      }
      case 'CHANGE_SORT': {
        if (draftState.sortBy === action.sortBy) {
          let sortOrder = draftState.sortOrder === 'asc' ? 'desc' : 'asc';

          if (sortOrder === 'asc') {
            return {...draftState, sortOrder, sortBy: action.nextElement};
          }

          return {...draftState, sortOrder};
        }
        if (draftState.sortBy !== action.sortBy) {
          return {...draftState, sortOrder: 'asc', sortBy: action.sortBy};
        }

        draftState.sortBy = action.sortBy;
        draftState.sortOrder = action.sortOrder;
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

export {initialState, reducer};
