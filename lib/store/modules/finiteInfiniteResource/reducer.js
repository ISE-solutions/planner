import { PREFIX } from '~/config/database';
import { EActionType } from './types';
const initialState = {
    finiteInfiniteResources: [],
    dictFiniteInfiniteResources: {},
    loading: false,
};
const reducer = (state = initialState, action) => {
    var _a, _b;
    switch (action.type) {
        case EActionType.FETCH_ALL_REQUEST:
            return Object.assign(Object.assign({}, state), { loading: true });
        case EActionType.FETCH_ALL_SUCCESS:
            const newFiniteInfiniteResources = (_b = (_a = action.payload.data.items) === null || _a === void 0 ? void 0 : _a.map((tag) => (Object.assign(Object.assign({}, tag), { value: tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}recursofinitoinfinitoid`], label: (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) || '' })))) === null || _b === void 0 ? void 0 : _b.sort((a, b) => {
                if ((a === null || a === void 0 ? void 0 : a[`${PREFIX}nome`]) < (b === null || b === void 0 ? void 0 : b[`${PREFIX}nome`])) {
                    return -1;
                }
                if ((a === null || a === void 0 ? void 0 : a[`${PREFIX}nome`]) > (b === null || b === void 0 ? void 0 : b[`${PREFIX}nome`])) {
                    return 1;
                }
                return 0;
            });
            return Object.assign(Object.assign({}, state), { allFiniteInfiniteResources: newFiniteInfiniteResources, finiteInfiniteResources: newFiniteInfiniteResources === null || newFiniteInfiniteResources === void 0 ? void 0 : newFiniteInfiniteResources.filter((e) => e[`${PREFIX}ativo`]), dictFiniteInfiniteResources: newFiniteInfiniteResources === null || newFiniteInfiniteResources === void 0 ? void 0 : newFiniteInfiniteResources.reduce((acc, func) => {
                    acc[func === null || func === void 0 ? void 0 : func.value] = func;
                    return acc;
                }, {}), loading: false });
        default:
            return state;
    }
};
export default reducer;
//# sourceMappingURL=reducer.js.map