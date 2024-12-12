import { PREFIX } from '~/config/database';
import { EActionType } from './types';
const initialState = {
  persons: [],
  personsActive: [],
  dictPeople: {},
  loading: false,
};

const reducer = (state: any = initialState, action: any): number => {
  switch (action.type) {
    case EActionType.FETCH_ALL_REQUEST:
      return { ...state, loading: true };
    case EActionType.FETCH_ALL_SUCCESS:
      const newPersons = action.payload.data.items?.map((person) => ({
        ...person,
        value: person?.[`${PREFIX}pessoaid`],
        label: person?.[`${PREFIX}nome`] + ' ' + person?.[`${PREFIX}sobrenome`],
      }));

      return {
        ...state,
        persons: newPersons,
        personsActive: action.payload.data.isActive
          ? newPersons
          : state.personsActive,
        dictPeople: newPersons?.reduce((acc, person) => {
          acc[person?.value] = person;
          return acc;
        }, {}),
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
