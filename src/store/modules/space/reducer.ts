import { PREFIX } from '~/config/database';
import { EActionType } from './types';
const initialState = {
  spaces: [],
  personsActive: [],
  dictSpace: {},
  loading: false,
};

const reducer = (state: any = initialState, action: any): number => {
  switch (action.type) {
    case EActionType.FETCH_ALL_REQUEST:
      return { ...state, loading: true };
    case EActionType.FETCH_ALL_SUCCESS:
      const newSpace = action.payload.data
        ?.map((tag) => ({
          ...tag,
          value: tag?.[`${PREFIX}espacoid`],
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
        spaces: newSpace,
        dictSpace: newSpace?.reduce((dict, space) => {
          dict[space?.value] = space;
          return dict;
        }, {}),
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
