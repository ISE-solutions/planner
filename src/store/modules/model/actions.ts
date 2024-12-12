import { buildItem } from './utils';
import {
  ACTION_EDIT,
  ACTION_INCLUDE,
  REFERENCE_EVENT,
  REFERENCE_MODEL,
} from '~/config/constants';
import * as _ from 'lodash';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
import * as moment from 'moment';
import { Dispatch } from 'redux';
import { AppState } from '~/store';

export const createModel =
  (model: any, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>, getState: () => AppState) => {
    const { environmentReference } = getState();
    const { references } = environmentReference;

    return new Promise(async (resolve, reject) => {
      try {
        const reference = references?.find(
          (e) => e?.[`${PREFIX}nome`] === REFERENCE_MODEL
        );

        const fetchResponse = await fetch(reference?.[`${PREFIX}referencia`], {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(model),
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
  };
