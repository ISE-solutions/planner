import api from '~/services/api';
import { PREFIX, TAG, TAG_NAME } from '~/config/database';
import { buildItemFantasyName, buildQuery, IFilterProps } from './utils';
import { Dispatch } from 'redux';
import { EActionType } from './types';
import { setValue } from '../common';
import { QueryBuilder } from 'odata-query-builder';
import BatchMultidata from '~/utils/BatchMultidata';
import * as moment from 'moment';
import replaceSpecialCharacters from '~/utils/replaceSpecialCharacters';

export const fetchAllTags =
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
      const { data } = await api.get(`${TAG}${query}`, {
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

export const getTags = async (filter: IFilterProps): Promise<any> =>
  new Promise(async (resolve, reject) => {
    try {
      const query = buildQuery(filter);
      let headers = {};

      if (filter.rowsPerPage) {
        headers = {
          Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
      }
      const { data } = await api.get(`${TAG}${query}`, {
        headers,
      });
      resolve(data.value);
    } catch (error) {
      console.error(error);
      // handle your error
    }
  });

const getTag = (id) => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) =>
      f.filterExpression(`${PREFIX}etiquetaid`, 'eq', id)
    );

    query.expand(`${PREFIX}Etiqueta_Pai,${PREFIX}Etiqueta_NomeEtiqueta`);

    query.count();
    api({
      url: `${TAG}${query.toQuery()}`,
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

export const getTagByName = (name) => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      // f.filterPhrase(
      //   `startswith(${PREFIX}nome,'${replaceSpecialCharacters(name)}')`
      // );

      f.filterExpression(
        `${PREFIX}nome`,
        'eq',
        `${replaceSpecialCharacters(name)}`
      );
      f.filterExpression(`${PREFIX}ativo`, 'eq', true);
      f.filterExpression(`${PREFIX}excluido`, 'eq', false);

      return f;
    });

    query.expand(`${PREFIX}Etiqueta_Pai,${PREFIX}Etiqueta_NomeEtiqueta`);

    query.count();

    api
      .get(`${TAG}${query.toQuery()}`)
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addOrUpdateTag =
  (tag, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    return new Promise(async (resolve, reject) => {
      let tagId = tag.id;

      const tagsSavedByName: any = await getTagByName(tag.name);

      if (tagsSavedByName?.value?.length) {
        const err = {
          data: {
            error: {
              message: 'Etiqueta já cadastrada!',
            },
          },
        };

        if (tagId) {
          const othersTagsSabedByName = tagsSavedByName?.value?.filter(
            (tg) => tg?.[`${PREFIX}etiquetaid`] !== tagId
          );

          if (othersTagsSabedByName.length) {
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

      const dataToSave = {
        [`${PREFIX}descricao`]: tag.description,
        [`${PREFIX}ordem`]: tag.order,
        [`${PREFIX}nome`]: tag.name,
        [`${PREFIX}nomeen`]: tag.nameEn,
        [`${PREFIX}nomees`]: tag.nameEs,
      };

      const batch = new BatchMultidata(api);

      if (tagId) {
        batch.patch(TAG, tagId, dataToSave);
      } else {
        const response = await api({
          url: TAG,
          method: 'POST',
          headers: {
            Prefer: 'return=representation',
          },
          data: dataToSave,
        });

        tagId = response.data?.[`${PREFIX}etiquetaid`];
      }

      batch.bulkPostReferenceRelatioship(
        TAG,
        TAG,
        tagId,
        'Etiqueta_Pai',
        tag?.fatherTag?.map((spc) => spc?.[`${PREFIX}etiquetaid`])
      );

      batch.bulkDeleteReferenceParent(
        TAG,
        tag?.fatherTagToDelete?.map((spc) => spc?.[`${PREFIX}etiquetaid`]),
        tagId,
        'Etiqueta_Pai'
      );

      batch.bulkPostRelationship(
        TAG_NAME,
        TAG,
        tagId,
        'Etiqueta_NomeEtiqueta',
        tag?.names?.map((name) => buildItemFantasyName(name))
      );

      try {
        await batch.execute();
        const newTag: any = await getTag(tagId);

        onSuccess?.(newTag?.value?.[0]);
        resolve(newTag?.value?.[0]);
      } catch (error) {
        console.log(error);
        onError?.(error);
        reject(error);
      }
    });
  };

export const updateTag =
  (id, toSave, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(api);

      batch.patch(TAG, id, toSave);

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

export const desactiveTag =
  (tag, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    let data = {
      [`${PREFIX}tipodesativacao`]: tag.type,
    };

    if (tag.type === 'definitivo') {
      data[`${PREFIX}ativo`] = false;
    }

    if (tag.type === 'temporario') {
      if (
        moment()
          .startOf('day')
          .isSame(moment(tag.start.toISOString()).startOf('day'))
      ) {
        data[`${PREFIX}ativo`] = false;
      }

      data[`${PREFIX}iniciodesativacao`] = tag.start
        .startOf('day')
        .toISOString();
      data[`${PREFIX}fimdesativacao`] = tag.end.startOf('day').toISOString();
    }

    api({
      url: `${TAG}(${tag?.data?.[`${PREFIX}etiquetaid`]})`,
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

export const activeTag =
  (tag, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    api({
      url: `${TAG}(${tag?.[`${PREFIX}etiquetaid`]})`,
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

export const deleteTag =
  (tag, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    api({
      url: `${TAG}(${tag?.id})`,
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

export const bulkUpdateTag =
  (toUpdate, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    try {
      for (let i = 0; i < toUpdate.data.length; i++) {
        const tag = toUpdate.data[i];
        await api({
          url: `${TAG}(${tag?.[`${PREFIX}etiquetaid`]})`,
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
