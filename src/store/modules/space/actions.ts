import { AppState } from './../../index';
import api from '~/services/api';
import {
  PREFIX,
  TAG,
  SPACE,
  SPACE_ENVOLVED_PEOPLE,
  SPACE_CAPACITY,
  SPACE_FANTASY_NAME,
} from '~/config/database';
import {
  buildItem,
  buildItemCapacity,
  buildItemFantasyName,
  buildItemPeople,
  buildQuery,
  IFilterProps,
} from './utils';
import { Dispatch } from 'redux';
import { EActionType } from './types';
import { setValue } from '../common';
import { QueryBuilder } from 'odata-query-builder';
import * as moment from 'moment';
import { createFolder, deleteFiles, uploadFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import replaceSpecialCharacters from '~/utils/replaceSpecialCharacters';
import BatchMultidata from '~/utils/BatchMultidata';

export const fetchAllSpace =
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
      const { data } = await api.get(`${SPACE}${query}`, {
        headers,
      });

      dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, data?.value));
    } catch (error) {
      console.error(error);
      // handle your error
    }
  };

export const getSpaces = async (filter: IFilterProps): Promise<any> =>
  new Promise(async (resolve, reject) => {
    try {
      const query = buildQuery(filter);
      let headers = {};

      if (filter.rowsPerPage) {
        headers = {
          Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
      }
      const { data } = await api.get(`${SPACE}${query}`, {
        headers,
      });
      resolve(data.value);
    } catch (error) {
      console.error(error);
      // handle your error
    }
  });

export const getSpace = (id) => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) =>
      f.filterExpression(`${PREFIX}espacoid`, 'eq', id)
    );

    query.expand(
      `${PREFIX}Espaco_Etiqueta_Etiqueta,${PREFIX}Espaco_PessoasEnvolvidas,${PREFIX}Espaco_NomeEspaco,${PREFIX}Espaco_CapacidadeEspaco,${PREFIX}Espaco_PessoasEnvolvidas`
    );

    query.count();
    api({
      url: `${SPACE}${query.toQuery()}`,
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

export const getSpaceByName = (name): any => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      f.filterExpression(
        `${PREFIX}nome`,
        'eq',
        `${replaceSpecialCharacters(name)}`
      );

      f.filterExpression(`${PREFIX}ativo`, 'eq', true);
      f.filterExpression(`${PREFIX}excluido`, 'eq', false);

      return f;
    });

    query.count();
    api({
      url: `${SPACE}${query.toQuery()}`,
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

export const getSpaceByEmail = (email: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) =>
      f.filterExpression(`${PREFIX}email`, 'eq', email)
    );

    query.expand(
      `${PREFIX}Espaco_Etiqueta_Etiqueta,${PREFIX}Espaco_PessoasEnvolvidas,${PREFIX}Espaco_NomeEspaco,${PREFIX}Espaco_CapacidadeEspaco,${PREFIX}Espaco_PessoasEnvolvidas`
    );

    query.count();
    api({
      url: `${SPACE}${query.toQuery()}`,
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

export const addOrUpdateSpace =
  (space, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>, getState: () => AppState) => {
    return new Promise(async (resolve, reject) => {
      const dataToSave: any = buildItem(space);
      let spaceSaved = { ...space };

      const spacesSavedByName: any = await getSpaceByName(space.name);

      if (spacesSavedByName?.value?.length) {
        const err = {
          data: {
            error: {
              message: 'Espaço já cadastrado!',
            },
          },
        };

        if (space.id) {
          const othersSpaceSabedByName = spacesSavedByName?.value?.filter(
            (tg) => tg?.[`${PREFIX}espacoid`] !== space.id
          );

          if (othersSpaceSabedByName.length) {
            reject(err);
            onError?.(err);
            return;
          }
        } else {
          reject(err);
          onError?.(err);
          return;
        }
      }

      try {
        const batch = new BatchMultidata(api);
        let spaceId = space?.id;

        if (spaceId) {
          batch.patch(SPACE, spaceId, dataToSave);
        } else {
          const response = await api({
            url: SPACE,
            method: 'POST',
            headers: {
              Prefer: 'return=representation',
            },
            data: dataToSave,
          });

          spaceId = response.data?.[`${PREFIX}espacoid`];
          spaceSaved = response.data;
        }

        batch.bulkPostReferenceRelatioship(
          SPACE,
          TAG,
          spaceId,
          'Espaco_Etiqueta_Etiqueta',
          space?.tags?.map((spc) => spc?.[`${PREFIX}etiquetaid`])
        );

        batch.bulkDeleteReferenceParent(
          SPACE,
          space?.tagsToDelete?.map((spc) => spc?.[`${PREFIX}etiquetaid`]),
          spaceId,
          'Espaco_Etiqueta_Etiqueta'
        );

        batch.bulkPostRelationship(
          SPACE_FANTASY_NAME,
          SPACE,
          spaceId,
          'Espaco_NomeEspaco',
          space?.names?.map((e) => buildItemFantasyName(e))
        );

        batch.bulkPostRelationship(
          SPACE_CAPACITY,
          SPACE,
          spaceId,
          'Espaco_CapacidadeEspaco',
          space?.capacities?.map((e) => buildItemCapacity(e))
        );

        batch.bulkPostRelationship(
          SPACE_ENVOLVED_PEOPLE,
          SPACE,
          spaceId,
          'Espaco_PessoasEnvolvidas',
          space?.people
            ?.filter((e) => !(!e?.id && e.deleted))
            ?.map((e, i) => buildItemPeople(e))
        );

        if (space?.anexos?.length) {
          const folder = `Espaco/${moment(spaceSaved?.createdon).format(
            'YYYY'
          )}/${spaceId}`;

          const attachmentsToDelete = space?.anexos?.filter(
            (file) => file.relativeLink && file.deveExcluir
          );

          const attachmentsToSave = space?.anexos?.filter(
            (file) => !file.relativeLink && !file.deveExcluir
          );

          await deleteFiles(sp, attachmentsToDelete);
          await createFolder(sp, folder, 'Anexos Interno');

          const { context } = getState().app;

          await uploadFiles(
            sp,
            `${context.pageContext.web.serverRelativeUrl}/Anexos Interno/${folder}`,
            attachmentsToSave
          );
        }

        await batch.execute();

        const newSpace: any = await getSpace(spaceId);

        onSuccess?.(newSpace?.value?.[0]);
        resolve(newSpace);
      } catch (err) {
        console.error(err);
        onError?.(err);
        reject(err);
      }
    });
  };

export const desactiveSpace =
  (space, { onSuccess, onError }): any =>
  async () => {
    let data = {
      [`${PREFIX}tipodesativacao`]: space.type,
    };

    if (space.type === 'definitivo') {
      data[`${PREFIX}ativo`] = false;
    }

    if (space.type === 'temporario') {
      if (
        moment()
          .startOf('day')
          .isSame(moment(space.start.toISOString()).startOf('day'))
      ) {
        data[`${PREFIX}ativo`] = false;
      }

      data[`${PREFIX}iniciodesativacao`] = space.start
        .startOf('day')
        .toISOString();
      data[`${PREFIX}fimdesativacao`] = space.end.startOf('day').toISOString();
    }

    api({
      url: `${SPACE}(${space?.data?.[`${PREFIX}espacoid`]})`,
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

export const activeSpace =
  (space, { onSuccess, onError }): any =>
  async () => {
    api({
      url: `${SPACE}(${space?.[`${PREFIX}espacoid`]})`,
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

export const deleteSpace =
  (item, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    api({
      url: `${SPACE}(${item?.id})`,
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

export const updateSpace =
  (id, toSave, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(api);

      batch.patch(SPACE, id, toSave);

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

export const bulkUpdateSpace =
  (toUpdate, { onSuccess, onError }): any =>
  async () => {
    try {
      for (let i = 0; i < toUpdate.data.length; i++) {
        const space = toUpdate.data[i];
        await api({
          url: `${SPACE}(${space?.[`${PREFIX}espacoid`]})`,
          method: 'PATCH',
          data: {
            [`${PREFIX}escolaorigem`]: toUpdate.school,
          },
        });
      }
      onSuccess?.();
    } catch (e) {
      onError?.(e);
    }
  };
