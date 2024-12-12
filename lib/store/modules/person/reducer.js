import { PREFIX } from '~/config/database';
import { EActionType } from './types';
const initialState = {
    persons: [],
    personsActive: [],
    dictPeople: {},
    loading: false,
};
const reducer = (state = initialState, action) => {
    var _a, _b;
    switch (action.type) {
        case EActionType.FETCH_ALL_REQUEST:
            return Object.assign(Object.assign({}, state), { loading: true });
        case EActionType.FETCH_ALL_SUCCESS:
            const newPersons = (_b = (_a = action.payload.data.items) === null || _a === void 0 ? void 0 : _a.map((person) => (Object.assign(Object.assign({}, person), { value: person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`], label: (person === null || person === void 0 ? void 0 : person[`${PREFIX}nomecompleto`]) || '', title: (person === null || person === void 0 ? void 0 : person[`${PREFIX}nomecompleto`]) || '' })))) === null || _b === void 0 ? void 0 : _b.sort((a, b) => {
                if ((a === null || a === void 0 ? void 0 : a[`${PREFIX}nome`]) < (b === null || b === void 0 ? void 0 : b[`${PREFIX}nome`])) {
                    return -1;
                }
                if ((a === null || a === void 0 ? void 0 : a[`${PREFIX}nome`]) > (b === null || b === void 0 ? void 0 : b[`${PREFIX}nome`])) {
                    return 1;
                }
                return 0;
            });
            return Object.assign(Object.assign({}, state), { persons: newPersons, personsActive: action.payload.data.isActive
                    ? newPersons
                    : state.personsActive, dictPeople: newPersons === null || newPersons === void 0 ? void 0 : newPersons.reduce((acc, person) => {
                    acc[person === null || person === void 0 ? void 0 : person.value] = person;
                    return acc;
                }, {}), loading: false });
        default:
            return state;
    }
};
export default reducer;
//# sourceMappingURL=reducer.js.map