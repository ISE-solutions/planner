import api from '~/services/api';
import { DELIVERY, PREFIX, SCHEDULE_DAY, TASK, TEAM } from '~/config/database';
import { buildQuery, IFilterProps } from './utils';
import { Dispatch } from 'redux';
import { EActionType } from './types';
import { setValue } from '../common';
import BatchMultidata from '~/utils/BatchMultidata';
import { QueryBuilder } from 'odata-query-builder';

export const fetchAllTasks =
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
      const { data } = await api.get(`${TASK}${query}`, {
        headers,
      });

      dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, data?.value));
    } catch (error) {
      console.error(error);
      // handle your error
    }
  };

export const filterTask = (filter: IFilterProps) => {
  return new Promise<any[]>((resolve, reject) => {
    const query = buildQuery(filter);

    api({
      url: `${TASK}${query}`,
      method: 'GET',
    })
      .then(({ data }) => {
        resolve(data?.value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getDeliveryById = (id) => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) =>
      f.filterExpression(`${PREFIX}entregaid`, 'eq', id)
    );

    query.expand(`${PREFIX}Turma,${PREFIX}Entrega_CronogramadeDia`);
    query.count();

    api({
      url: `${DELIVERY}${query.toQuery()}`,
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

export const getDeliveryByTeamId = (teamId) => {
  return new Promise<any[]>((resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', teamId);
      f.filterExpression(`${PREFIX}ativo`, 'eq', true);

      return f;
    });

    query.expand(`${PREFIX}Turma,${PREFIX}Entrega_CronogramadeDia`);
    query.count();

    api({
      url: `${DELIVERY}${query.toQuery()}`,
      method: 'GET',
    })
      .then(({ data }) => {
        resolve(data?.value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addOrUpdateDelivery = (delivery, { onSuccess, onError }): any =>
  new Promise(async (resolve, reject) => {
    // tslint:disable-next-line: no-shadowed-variable
    const dataToSave: any = {
      [`${PREFIX}titulo`]: delivery.title,
      [`${PREFIX}gradefinal`]: delivery.finalGrid?.format(),
      [`${PREFIX}outlines`]: delivery.outlines?.format(),
      [`${PREFIX}horarios`]: delivery.times?.format(),
      [`${PREFIX}aprovacao`]: delivery.approval?.format(),
      [`${PREFIX}moodlepasta`]: delivery.moodleFolder?.format(),
      [`${PREFIX}conferirmoodle`]: delivery.checkMoodle?.format(),
      [`${PREFIX}Turma@odata.bind`]:
        delivery.teamId && `/${TEAM}(${delivery.teamId})`,
    };

    const batch = new BatchMultidata(api);
    let deliveryId = delivery.id;
    if (deliveryId) {
      batch.patch(DELIVERY, deliveryId, dataToSave);
    } else {
      const response = await api({
        url: DELIVERY,
        method: 'POST',
        headers: {
          Prefer: 'return=representation',
        },
        data: dataToSave,
      });

      deliveryId = response.data?.[`${PREFIX}entregaid`];
    }

    batch.bulkPostReferenceRelatioship(
      DELIVERY,
      SCHEDULE_DAY,
      deliveryId,
      'Entrega_CronogramadeDia',
      delivery?.days?.map((spc) => spc?.[`${PREFIX}cronogramadediaid`])
    );

    batch.bulkDeleteReferenceParent(
      DELIVERY,
      delivery?.daysToDelete?.map((spc) => spc?.[`${PREFIX}cronogramadediaid`]),
      deliveryId,
      'Entrega_CronogramadeDia'
    );

    try {
      await batch.execute();
      const newTag: any = await getDeliveryById(deliveryId);

      onSuccess?.(newTag?.value?.[0]);
      resolve(newTag?.value?.[0]);
    } catch (error) {
      console.log(error);
      onError?.(error);
      reject(error);
    }
  });

export const updateDelivery = (id, toSave, { onSuccess, onError }): any => {
  return new Promise(async (resolve, reject) => {
    const batch = new BatchMultidata(api);

    batch.patch(DELIVERY, id, toSave);

    try {
      await batch.execute();

      resolve('Sucesso');
      onSuccess?.('Sucesso');
    } catch (err) {
      reject?.(err);
      onError?.(err);
    }
  });
};
