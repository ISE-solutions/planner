import { PREFIX } from '~/config/database';
import { EActionType } from './types';
const initialState = {
  tags: [],
  tagsActive: [],
  dictTag: {},
  loading: false,
};

const reducer = (state: any = initialState, action: any): number => {
  switch (action.type) {
    case EActionType.FETCH_ALL_REQUEST:
      return { ...state, loading: true };
    case EActionType.FETCH_ALL_SUCCESS:
      const newTags = action.payload.data.items
        ?.map((tag) => ({
          ...tag,
          value: tag?.[`${PREFIX}etiquetaid`],
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
        tags: newTags,
        tagsActive: action.payload.data.isActive ? newTags : state.tagsActive,
        dictTag: newTags?.reduce((acc, func) => {
          acc[func?.value] = func;
          return acc;
        }, {}),
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
