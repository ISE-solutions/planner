import { PREFIX } from '~/config/database';
import { EActionType } from './types';
const initialState = {
    spaces: [],
    personsActive: [],
    dictSpace: {},
    loading: false,
};
const reducer = (state = initialState, action) => {
    var _a, _b;
    switch (action.type) {
        case EActionType.FETCH_ALL_REQUEST:
            return Object.assign(Object.assign({}, state), { loading: true });
        case EActionType.FETCH_ALL_SUCCESS:
            const newSpace = (_b = (_a = action.payload.data) === null || _a === void 0 ? void 0 : _a.map((tag) => (Object.assign(Object.assign({}, tag), { value: tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}espacoid`], label: (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) || '', title: (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) || '' })))) === null || _b === void 0 ? void 0 : _b.sort((a, b) => {
                if ((a === null || a === void 0 ? void 0 : a[`${PREFIX}nome`]) < (b === null || b === void 0 ? void 0 : b[`${PREFIX}nome`])) {
                    return -1;
                }
                if ((a === null || a === void 0 ? void 0 : a[`${PREFIX}nome`]) > (b === null || b === void 0 ? void 0 : b[`${PREFIX}nome`])) {
                    return 1;
                }
                return 0;
            });
            return Object.assign(Object.assign({}, state), { spaces: newSpace, dictSpace: newSpace === null || newSpace === void 0 ? void 0 : newSpace.reduce((dict, space) => {
                    dict[space === null || space === void 0 ? void 0 : space.value] = space;
                    return dict;
                }, {}), loading: false });
        default:
            return state;
    }
};
export default reducer;
//# sourceMappingURL=reducer.js.map