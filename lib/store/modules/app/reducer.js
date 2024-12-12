import { EActionType } from './types';
const initialState = {
    context: null,
    currentUser: null,
    tooltips: [],
    images: [],
};
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case EActionType.SET_CONTEXT:
            return Object.assign(Object.assign({}, state), { context: action.payload.data });
        case EActionType.SET_CURRENT_USER:
            return Object.assign(Object.assign({}, state), { currentUser: action.payload.data });
        case EActionType.FETCH_TOOLTIP_SUCCESS:
            return Object.assign(Object.assign({}, state), { tooltips: action.payload.data });
        case EActionType.FETCH_IMAGES_SUCCESS:
            return Object.assign(Object.assign({}, state), { images: action.payload.data });
        default:
            return state;
    }
};
export default reducer;
//# sourceMappingURL=reducer.js.map