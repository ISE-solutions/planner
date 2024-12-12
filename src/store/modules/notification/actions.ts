import api from '~/services/api';
import { NOTIFICATIONS, PREFIX } from '~/config/database';
import { buildItem, buildQuery, IFilterProps } from './utils';
import { Dispatch } from 'redux';
import { EActionType } from './types';
import { setValue } from '../common';
import BatchMultidata from '~/utils/BatchMultidata';

export const fetchAllNotification =
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
      const { data } = await api.get(`${NOTIFICATIONS}${query}`, {
        headers,
      });

      dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, data?.value));
    } catch (error) {
      console.error(error);
      // handle your error
    }
  };

export const addOrUpdateNotification = (
  notification,
  { onSuccess, onError }
): any =>
  new Promise(async (resolve, reject) => {
    try {
      const dataToSave = buildItem(notification);

      await api({
        url: NOTIFICATIONS,
        method: 'POST',
        headers: {
          Prefer: 'return=representation',
        },
        data: dataToSave,
      });

      onSuccess?.('Salvo');
      resolve('Salvo');
    } catch (error) {
      console.log(error);
      onError?.(error);
      reject(error);
    }
  });

export const batchAddNotification = (
  notifications: any[],
  { onSuccess, onError }
): any =>
  new Promise(async (resolve, reject) => {
    try {
      const batch = new BatchMultidata(api);

      notifications.forEach((not) => {
        batch.post(NOTIFICATIONS, buildItem(not));
      });

      await batch.execute();

      onSuccess?.('Salvo');
      resolve('Salvo');
    } catch (error) {
      console.log(error);
      onError?.(error);
      reject(error);
    }
  });

export const readAllNotification = (
  ids,
  { onSuccess, onError }
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const batch = new BatchMultidata(api);

    ids.forEach((id) => {
      batch.patch(NOTIFICATIONS, id, {
        [`${PREFIX}lido`]: true,
      });
    });

    try {
      await batch.execute();

      resolve({});
      onSuccess?.();
    } catch (err) {
      reject?.(err);
      onError?.(err);
    }
  });
};

export const readNotification = (id, { onSuccess, onError }): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const batch = new BatchMultidata(api);

    batch.patch(NOTIFICATIONS, id, {
      [`${PREFIX}lido`]: true,
    });

    try {
      await batch.execute();

      resolve({});
      onSuccess?.();
    } catch (err) {
      reject?.(err);
      onError?.(err);
    }
  });
};
