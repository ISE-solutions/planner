import api from '~/services/api';
import { PREFIX, CUSTOM_FILTER } from '~/config/database';
import { buildItem, buildQuery, IFilterProps } from './utils';
import { Dispatch } from 'redux';
import { EActionType } from './types';
import { setValue } from '../common';
import BatchMultidata from '~/utils/BatchMultidata';
import { QueryBuilder } from 'odata-query-builder';

export const fetchAllCustomFilter =
  (filter: IFilterProps): any =>
  async (dispatch: Dispatch<any>) => {
    dispatch(setValue(EActionType.FETCH_ALL_REQUEST, null));
    try {
      const query = buildQuery(filter);
      let headers = {};

      if (filter.rowsPerPage) {
        headers = {
          Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
      }
      const { data } = await api.get(`${CUSTOM_FILTER}${query}`, {
        headers,
      });

      dispatch(
        setValue(EActionType.FETCH_ALL_SUCCESS, {
          items: data?.value,
          isActive: filter?.active !== 'Inativo',
        })
      );
    } catch (error) {
      console.error(error);
      // handle your error
    }
  };

const getCustomFilterById = (id) => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) =>
      f.filterExpression(`${PREFIX}filtroid`, 'eq', id)
    );

    query.count();
    api({
      url: `${CUSTOM_FILTER}${query.toQuery()}`,
      method: 'GET',
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addOrUpdateCustomFilter =
  (customFilter, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    return new Promise(async (resolve, reject) => {
      let customFilterId = customFilter.id;

      const dataToSave = buildItem(customFilter);

      const batch = new BatchMultidata(api);

      if (customFilterId) {
        batch.patch(CUSTOM_FILTER, customFilterId, dataToSave);
      } else {
        const response = await api({
          url: CUSTOM_FILTER,
          method: 'POST',
          headers: {
            Prefer: 'return=representation',
          },
          data: dataToSave,
        });

        customFilterId = response.data?.[`${PREFIX}filtroid`];
      }

      try {
        await batch.execute();
        const newTag: any = await getCustomFilterById(customFilterId);

        onSuccess?.(newTag?.value?.[0]);
        resolve(newTag?.value?.[0]);
      } catch (error) {
        console.log(error);
        onError?.(error);
        reject(error);
      }
    });
  };

export const updateCustomFilter = (id, toSave, { onSuccess, onError }) => {
  return new Promise(async (resolve, reject) => {
    const batch = new BatchMultidata(api);

    batch.patch(CUSTOM_FILTER, id, toSave);

    try {
      await batch.execute();

      const item: any = await getCustomFilterById(id);
      resolve(item?.value?.[0]);
      onSuccess?.(item?.value?.[0]);
    } catch (err) {
      reject?.(err);
      onError?.(err);
    }
  });
};
