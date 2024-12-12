import { buildItem } from './utils';
import {
  ACTION_DELETE,
  BASE_URL_API_NET,
  IBlockUpdated,
} from '~/config/constants';
import * as _ from 'lodash';
import { PREFIX } from '~/config/database';
import * as moment from 'moment';
import api from '~/services/api';

export const executeEventOutlook = (
  blockUpdated: IBlockUpdated,
  { onSuccess, onError }
): any =>
  new Promise(async (resolve, reject) => {
    try {
      let axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await api.post(
        `${BASE_URL_API_NET}Calendario`,
        blockUpdated,
        axiosConfig
      );

      onSuccess?.('');
      resolve('');
    } catch (err) {
      console.error(err);
      onError?.(err);
      reject(err);
    }
  });

export const executeEventDeleteOutlook = (
  blockUpdated: IBlockUpdated,
  { onSuccess, onError }
): any =>
  new Promise(async (resolve, reject) => {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await api.post(
      `${BASE_URL_API_NET}Calendario`,
      blockUpdated,
      axiosConfig
    );

    try {
      // const reference = references?.find(
      //   (e) => e?.[`${PREFIX}nome`] === REFERENCE_EVENT
      // );

      // const fetchResponse = await fetch(reference?.[`${PREFIX}referencia`], {
      //   method: 'POST',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ Agendamento: dataToSave }),
      // });
      // const data = await fetchResponse.text();

      onSuccess?.('');
      resolve('');
    } catch (err) {
      console.error(err);
      onError?.(err);
      reject(err);
    }
  });

export const addOrUpdateEventsByResources = async (
  blockUpdated: IBlockUpdated
) =>
  new Promise(async (resolve, reject) => {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await api.post(
      `${BASE_URL_API_NET}Calendario`,
      blockUpdated,
      axiosConfig
    );

    resolve('Salvo');
  });

export const deleteEventsByResources = async (
  resources,
  { references, dictPeople, dictSpace },
  blockUpdated: IBlockUpdated
) =>
  new Promise(async (resolve, reject) => {
    const eventsToDelete = [];

    resources?.forEach((res) => {
      eventsToDelete.push({
        action: ACTION_DELETE,
        title: 'Exclusão',
        email:
          dictSpace?.[res?.[`_${PREFIX}espaco_value`]]?.[`${PREFIX}email`] ||
          dictPeople?.[res?.[`_${PREFIX}pessoa_value`]]?.[`${PREFIX}email`] ||
          'teste@ise.org.br',
        activity: res?.[`${PREFIX}Atividade`],
        activityId: res?.[`_${PREFIX}atividade_value`],
        start: moment(res?.[`${PREFIX}inicio`]).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(res?.[`${PREFIX}fim`]).format('YYYY-MM-DD HH:mm:ss'),
        resourceId: res?.[`${PREFIX}recursosid`],
        eventId: res?.[`${PREFIX}eventoid`],
      });
    });

    await executeEventDeleteOutlook(blockUpdated, {
      onSuccess: () => null,
      onError: () => null,
    });

    resolve('Salvo');
  });
