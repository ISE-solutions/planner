import { PREFIX } from '~/config/database';
import { EActionType } from './types';
const initialState = {
  filters: [],
  loading: false,
};

const reducer = (state: any = initialState, action: any): number => {
  switch (action.type) {
    case EActionType.FETCH_ALL_REQUEST:
      return { ...state, loading: true };
    case EActionType.FETCH_ALL_SUCCESS:
      const newFilter = action.payload.data.items
        ?.map((tag) => ({
          ...tag,
          value: tag?.[`${PREFIX}filtroid`],
          label: tag?.[`${PREFIX}nome`] || '',
          title: tag?.[`${PREFIX}nome`] || '',
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
        customFilters: newFilter,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
