import { PREFIX } from '~/config/database';
import { EActionType } from './types';
const initialState = {
    filters: [],
    loading: false,
};
const reducer = (state = initialState, action) => {
    var _a, _b;
    switch (action.type) {
        case EActionType.FETCH_ALL_REQUEST:
            return Object.assign(Object.assign({}, state), { loading: true });
        case EActionType.FETCH_ALL_SUCCESS:
            const newFilter = (_b = (_a = action.payload.data.items) === null || _a === void 0 ? void 0 : _a.map((tag) => (Object.assign(Object.assign({}, tag), { value: tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}filtroid`], label: (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) || '', title: (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) || '' })))) === null || _b === void 0 ? void 0 : _b.sort((a, b) => {
                if ((a === null || a === void 0 ? void 0 : a[`${PREFIX}nome`]) < (b === null || b === void 0 ? void 0 : b[`${PREFIX}nome`])) {
                    return -1;
                }
                if ((a === null || a === void 0 ? void 0 : a[`${PREFIX}nome`]) > (b === null || b === void 0 ? void 0 : b[`${PREFIX}nome`])) {
                    return 1;
                }
                return 0;
            });
            return Object.assign(Object.assign({}, state), { customFilters: newFilter, loading: false });
        default:
            return state;
    }
};
export default reducer;
//# sourceMappingURL=reducer.js.map