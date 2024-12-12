import { PREFIX } from '~/config/database';
import { EActionType } from './types';
const initialState = {
  finiteInfiniteResources: [],
  dictFiniteInfiniteResources: {},
  loading: false,
};

const reducer = (state: any = initialState, action: any): number => {
  switch (action.type) {
    case EActionType.FETCH_ALL_REQUEST:
      return { ...state, loading: true };
    case EActionType.FETCH_ALL_SUCCESS:
      const newFiniteInfiniteResources = action.payload.data.items
        ?.map((tag) => ({
          ...tag,
          value: tag?.[`${PREFIX}recursofinitoinfinitoid`],
          label: tag?.[`${PREFIX}nome`] || '',
        }))
        ?.sort((a, b) => {
          if (a?.[`${PREFIX}nome`] < b?.[`${PREFIX}nome`]) {
            return -1;
          }
          if (a?.[`${PREFIX}nome`] > b?.[`${PREFIX}nome`]) {
            return 1;
          }
          return 0;
        });

      return {
        ...state,
        allFiniteInfiniteResources: newFiniteInfiniteResources,
        finiteInfiniteResources: newFiniteInfiniteResources?.filter(
          (e) => e[`${PREFIX}ativo`]
        ),
        dictFiniteInfiniteResources: newFiniteInfiniteResources?.reduce(
          (acc, func) => {
            acc[func?.value] = func;
            return acc;
          },
          {}
        ),
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
