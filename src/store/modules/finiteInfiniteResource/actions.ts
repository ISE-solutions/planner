import api from '~/services/api';
import { FINITE_INFINITE_RESOURCES, PREFIX, TAG } from '~/config/database';
import { buildQuery, IFilterProps } from './utils';
import { Dispatch } from 'redux';
import { EActionType } from './types';
import { setValue } from '../common';
import replaceSpecialCharacters from '~/utils/replaceSpecialCharacters';
import { QueryBuilder } from 'odata-query-builder';
import { TYPE_RESOURCE } from '~/config/enums';
import * as moment from 'moment';
import { BUSINESS_UNITY } from '~/config/constants';
import BatchMultidata from '~/utils/BatchMultidata';

export const fetchAllFiniteInfiniteResources =
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
      const { data } = await api.get(`${FINITE_INFINITE_RESOURCES}${query}`, {
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

export const getFiniteInfiniteResources = async (
  filter: IFilterProps
): Promise<any> =>
  new Promise(async (resolve, reject) => {
    try {
      const query = buildQuery(filter);
      let headers = {};

      if (filter.rowsPerPage) {
        headers = {
          Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
      }
      const { data } = await api.get(`${FINITE_INFINITE_RESOURCES}${query}`, {
        headers,
      });
      resolve(data.value);
    } catch (error) {
      console.error(error);
      // handle your error
    }
  });

const getResourceByName = (name, type) => {
  return new Promise(async (resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      // f.filterPhrase(
      //   `startswith(${PREFIX}nome,'${replaceSpecialCharacters(name)}')`
      // );
      f.filterExpression(
        `${PREFIX}nome`,
        'eq',
        `${replaceSpecialCharacters(name)}`
      );
      f.filterExpression(`${PREFIX}tiporecurso`, 'eq', type);

      f.filterExpression(`${PREFIX}ativo`, 'eq', true);
      f.filterExpression(`${PREFIX}excluido`, 'eq', false);
      return f;
    });

    query.count();
    await api({
      url: `${FINITE_INFINITE_RESOURCES}${query.toQuery()}`,
      headers: {
        Prefer: `odata.maxpagesize=${10}`,
      },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addOrUpdateFiniteInfiniteResource = (
  finiteResource,
  { onSuccess, onError }
) =>
  new Promise(async (resolve, reject) => {
    const finiteSavedByName: any = await getResourceByName(
      finiteResource.name,
      finiteResource.typeResource
    );

    if (finiteSavedByName?.value?.length) {
      const err = {
        data: {
          error: {
            message: `${
              finiteResource.typeResource === TYPE_RESOURCE.FINITO
                ? 'Recurso Finito'
                : 'Recurso Infinito'
            } já cadastrado!`,
          },
        },
      };

      if (finiteResource.id) {
        const othersFiniteSabedByName = finiteSavedByName?.value?.filter(
          (tg) => tg?.[`${PREFIX}recursofinitoinfinitoid`] !== finiteResource.id
        );

        if (othersFiniteSabedByName.length) {
          onError?.(err);
          return;
        }
      } else {
        onError?.(err);
        return;
      }
    }

    const data = {
      [`${PREFIX}nome`]: finiteResource.name,
      [`${PREFIX}limitacao`]: finiteResource.limit,
      [`${PREFIX}quantidade`]: finiteResource.quantity,
      [`${PREFIX}tiporecurso`]: finiteResource.typeResource,
    };

    if (finiteResource.type?.value) {
      data[
        `${PREFIX}Tipo@odata.bind`
      ] = `/${TAG}(${finiteResource.type?.value})`;
    }
    try {
      await api({
        url: finiteResource.id
          ? `${FINITE_INFINITE_RESOURCES}(${finiteResource.id})`
          : `${FINITE_INFINITE_RESOURCES}`,
        method: finiteResource?.id ? 'PATCH' : 'POST',
        headers: {
          Prefer: 'return=representation',
        },
        data: data,
      });

      onSuccess?.('Salvo');
      resolve('Salvo');
    } catch (error) {
      console.log(error);
      onError?.(error);
      reject(error);
    }
  });

export const desactiveFiniteInfiniteResource = (
  finiteResource,
  { onSuccess, onError }
) => {
  let data = {
    [`${PREFIX}tipodesativacao`]: finiteResource.type,
  };

  if (finiteResource.type === 'definitivo') {
    data[`${PREFIX}ativo`] = false;
  }

  if (finiteResource.type === 'temporario') {
    if (
      moment()
        .startOf('day')
        .isSame(moment(finiteResource.start.toISOString()).startOf('day'))
    ) {
      data[`${PREFIX}ativo`] = false;
    }

    data[`${PREFIX}iniciodesativacao`] = finiteResource.start
      .startOf('day')
      .toISOString();
    data[`${PREFIX}fimdesativacao`] = finiteResource.end
      .startOf('day')
      .toISOString();
  }

  api({
    url: `${FINITE_INFINITE_RESOURCES}(${
      finiteResource?.data?.[`${PREFIX}recursofinitoinfinitoid`]
    })`,
    method: 'PATCH',
    data,
  })
    .then(({ data }) => {
      onSuccess?.();
    })
    .catch(({ response }) => {
      onError?.(response);
    });
};

export const activeFiniteInfiniteResource = (
  finiteResource,
  { onSuccess, onError }
) => {
  api({
    url: `${FINITE_INFINITE_RESOURCES}(${
      finiteResource?.[`${PREFIX}recursofinitoinfinitoid`]
    })`,
    method: 'PATCH',
    data: {
      [`${PREFIX}ativo`]: true,
    },
  })
    .then(({ data }) => {
      onSuccess?.();
    })
    .catch(({ response }) => {
      onError?.(response);
    });
};

export const updateResource =
  (id, toSave, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(api);

      batch.patch(FINITE_INFINITE_RESOURCES, id, toSave);

      try {
        await batch.execute();

        resolve('sucesso');
        onSuccess?.();
      } catch (err) {
        reject?.(err);
        onError?.(err);
      }
    });
  };


export const bulkUpdateFiniteInfiniteResource = async (
  toUpdate,
  { onSuccess, onError }
) => {
  try {
    for (let i = 0; i < toUpdate.data.length; i++) {
      const finiteResource = toUpdate.data[i];
      const data = {};

      if (toUpdate.school) {
        data[`${PREFIX}escolaorigem`] = toUpdate.school;
      }

      if (toUpdate.title?.value) {
        data[
          `${PREFIX}Titulo@odata.bind`
        ] = `/${TAG}(${toUpdate.title?.value})`;
      }

      if (toUpdate?.tag?.length) {
        for (let j = 0; j < toUpdate.tag.length; j++) {
          const rel = toUpdate.tag[j];

          await api({
            url: `${FINITE_INFINITE_RESOURCES}(${
              finiteResource?.[`${PREFIX}recursofinitoinfinitoid`]
            })/ise_Pessoa_Etiqueta_Etiqueta/$ref`,
            method: 'PATCH',
            data: {
              '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.0/$metadata#$ref`,
              '@odata.id': `${TAG}(${rel.value})`,
            },
          });
        }
      }

      await api({
        url: `${FINITE_INFINITE_RESOURCES}(${
          finiteResource?.[`${PREFIX}recursofinitoinfinitoid`]
        })`,
        method: 'PATCH',
        data,
      });
    }
    onSuccess?.();
  } catch (e) {
    onError?.(e);
  }
};

export const deleteResource =
  (item, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    api({
      url: `${FINITE_INFINITE_RESOURCES}(${item?.id})`,
      method: 'PATCH',
      data: {
        [`${PREFIX}excluido`]: true,
        [`${PREFIX}ativo`]: false,
      },
    })
      .then(() => {
        onSuccess?.();
      })
      .catch(({ response }) => {
        onError?.(response);
      });
  };
