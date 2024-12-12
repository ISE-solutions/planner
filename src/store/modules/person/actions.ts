import api from '~/services/api';
import { PREFIX, TAG, PERSON } from '~/config/database';
import { buildQuery, IFilterProps } from './utils';
import { Dispatch } from 'redux';
import { EActionType } from './types';
import { setValue } from '../common';
import { QueryBuilder } from 'odata-query-builder';
import { BUSINESS_UNITY } from '~/config/constants';
import * as moment from 'moment';
import BatchMultidata from '~/utils/BatchMultidata';

export const fetchAllPerson =
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
      const { data } = await api.get(`${PERSON}${query}`, {
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

export const getPeople = async (filter: IFilterProps): Promise<any> =>
  new Promise(async (resolve, reject) => {
    try {
      const query = buildQuery(filter);
      let headers = {};

      if (filter.rowsPerPage) {
        headers = {
          Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
      }
      const { data } = await api.get(`${PERSON}${query}`, {
        headers,
      });
      resolve(data.value);
    } catch (error) {
      console.error(error);
      // handle your error
    }
  });

export const getPerson = (email, emailType): Promise<any> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      f.filterExpression(
        emailType == 'main' ? `${PREFIX}email` : `${PREFIX}emailsecundario`,
        'eq',
        email
      );

      f.filterExpression(`${PREFIX}ativo`, 'eq', true);
      f.filterExpression(`${PREFIX}excluido`, 'eq', false);

      return f;
    });

    api({
      url: `${PERSON}${query.toQuery()}`,
      method: 'GET',
    })
      .then(({ data }) => {
        resolve(data.value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addOrUpdatePerson =
  (person, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    const batch = new BatchMultidata(api);
    // tslint:disable-next-line: no-shadowed-variable
    const data: any = {
      [`${PREFIX}nome`]: person.name,
      [`${PREFIX}sobrenome`]: person.lastName,
      [`${PREFIX}nomecompleto`]: `${person.name} ${person.lastName}`,
      [`${PREFIX}nomepreferido`]: person.favoriteName,
      [`${PREFIX}email`]: person.email,
      [`${PREFIX}emailsecundario`]: person.emailSecondary,
      [`${PREFIX}celular`]: person.phone,
      [`${PREFIX}EscolaOrigem@odata.bind`]:
        person.school && `/${TAG}(${person.school?.value})`,
      // [`${PREFIX}AreaResponsavel@odata.bind`]:
      //   person.areaChief && `/${TAG}(${person.areaChief?.value})`,
    };

    if (person.title?.value) {
      data[`${PREFIX}Titulo@odata.bind`] = `/${TAG}(${person.title?.value})`;
    }

    if (person.id) {
      const newTags = person.tags?.map((tag) => tag.value);

      for (let j = 0; j < person.previousTag.length; j++) {
        const rel = person.previousTag[j];

        if (!newTags?.includes(rel[`${PREFIX}etiquetaid`])) {
          await api({
            url: `${TAG}(${
              rel[`${PREFIX}etiquetaid`]
            })/${PREFIX}Pessoa_Etiqueta_Etiqueta(${person.id})/$ref`,
            method: 'DELETE',
          });
        }
      }
    }

    api({
      url: person.id
        ? `${PERSON}(${person.id})?$select=${PREFIX}id,${PREFIX}nome,`
        : `${PERSON}?$select=${PREFIX}id,${PREFIX}nome,`,
      method: person?.id ? 'PATCH' : 'POST',
      data,
      headers: {
        Prefer: 'return=representation',
      },
    })
      .then(async ({ data }) => {
        if (person?.tag?.length) {
          for (let j = 0; j < person.tag.length; j++) {
            const rel = person.tag[j];

            await api({
              url: `${PERSON}(${
                data?.[`${PREFIX}pessoaid`]
              })/ise_Pessoa_Etiqueta_Etiqueta/$ref`,
              method: 'PUT',
              data: {
                '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                '@odata.id': `${TAG}(${rel.value})`,
              },
            });
          }
        }

        batch.bulkPostReferenceRelatioship(
          PERSON,
          TAG,
          data?.[`${PREFIX}pessoaid`],
          'Pessoa_AreaResponsavel',
          person?.areaChief?.map((tg) => tg?.[`${PREFIX}etiquetaid`])
        );

        batch.bulkDeleteReferenceParent(
          PERSON,
          person?.areaChiefToDelete?.map((tg) => tg?.[`${PREFIX}etiquetaid`]),
          data?.[`${PREFIX}pessoaid`],
          'Pessoa_AreaResponsavel'
        );

        await batch.execute();

        onSuccess?.();
      })
      .catch(({ response }) => {
        console.error(response);
        onError?.(response);
      });
  };

export const desactivePerson =
  (person, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    let data: any = {
      [`${PREFIX}tipodesativacao`]: person.type,
    };

    if (person.type === 'definitivo') {
      data[`${PREFIX}ativo`] = false;
    }

    if (person.type === 'temporario') {
      if (
        moment()
          .startOf('day')
          .isSame(moment(person.start.toISOString()).startOf('day'))
      ) {
        data[`${PREFIX}ativo`] = false;
      }

      data[`${PREFIX}iniciodesativacao`] = person.start
        .startOf('day')
        .toISOString();
      data[`${PREFIX}fimdesativacao`] = person.end.startOf('day').toISOString();
    }

    api({
      url: `${PERSON}(${person?.data?.[`${PREFIX}pessoaid`]})`,
      method: 'PATCH',
      data,
    })
      .then(() => {
        onSuccess?.();
      })
      .catch(({ response }) => {
        onError?.(response);
      });
  };

export const updatePerson =
  (id, toSave, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(api);

      batch.patch(PERSON, id, toSave);

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

export const deletePerson =
  (person, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    api({
      url: `${PERSON}(${person?.id})`,
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

export const activePerson =
  (person, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    api({
      url: `${PERSON}(${person?.[`${PREFIX}pessoaid`]})`,
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

export const bulkUpdatePerson =
  (toUpdate, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    try {
      for (let i = 0; i < toUpdate.data.length; i++) {
        const person = toUpdate.data[i];
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
              url: `${PERSON}(${
                person?.[`${PREFIX}pessoaid`]
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
          url: `${PERSON}(${person?.[`${PREFIX}pessoaid`]})`,
          method: 'PATCH',
          data,
        });
      }
      onSuccess?.();
    } catch (e) {
      onError?.(e);
    }
  };
