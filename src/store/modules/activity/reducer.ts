import { EActionType } from './types';
const initialState = {
  activities: [],
  loading: false,
};

const reducer = (state: any = initialState, action: any): number => {
  switch (action.type) {
    case EActionType.FETCH_ALL_REQUEST:
      return { ...state, loading: true };
    case EActionType.FETCH_ALL_SUCCESS:
      return {
        ...state,
        activities: action.payload.data,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
