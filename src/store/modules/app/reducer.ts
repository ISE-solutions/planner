import { EActionType } from './types';
const initialState = {
  context: null,
  currentUser: null,
  tooltips: [],
  images: [],
};

const reducer = (state: any = initialState, action: any): number => {
  switch (action.type) {
    case EActionType.SET_CONTEXT:
      return { ...state, context: action.payload.data };
    case EActionType.SET_CURRENT_USER:
      return { ...state, currentUser: action.payload.data };
    case EActionType.FETCH_TOOLTIP_SUCCESS:
      return { ...state, tooltips: action.payload.data };
    case EActionType.FETCH_IMAGES_SUCCESS:
      return { ...state, images: action.payload.data };
    default:
      return state;
  }
};

export default reducer;
