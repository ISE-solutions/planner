import { EActionType } from './types';
const initialState = {
    tasks: [],
    loading: false,
};
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case EActionType.FETCH_ALL_REQUEST:
            return Object.assign(Object.assign({}, state), { loading: true });
        case EActionType.FETCH_ALL_SUCCESS:
            return Object.assign(Object.assign({}, state), { tasks: action.payload.data, loading: false });
        default:
            return state;
    }
};
export default reducer;
//# sourceMappingURL=reducer.js.map