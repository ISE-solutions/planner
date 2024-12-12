import { buildItem } from './utils';
import { REFERENCE_TEMPERATURE } from '~/config/constants';
import * as _ from 'lodash';
import { PREFIX } from '~/config/database';
import { Dispatch } from 'redux';
import { AppState } from '~/store';

export const executeChangeTemperature =
  (payload: any, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>, getState: () => AppState) =>
    new Promise(async (resolve, reject) => {
      const { environmentReference } = getState();
      const { references } = environmentReference;

      const dataToSave: any = _.omitBy(buildItem(payload), _.isNil);

      try {
        const reference = references?.find(
          (e) => e?.[`${PREFIX}nome`] === REFERENCE_TEMPERATURE
        );

        const fetchResponse = await fetch(reference?.[`${PREFIX}referencia`], {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSave),
        });
        const data = await fetchResponse.text();

        onSuccess?.(data);
        resolve(data);
      } catch (err) {
        console.error(err);
        onError?.(err);
        reject(err);
      }
    });
