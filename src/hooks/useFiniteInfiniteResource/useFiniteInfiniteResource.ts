import { QueryBuilder } from 'odata-query-builder';
import * as moment from 'moment';
import replaceSpecialCharacters from '~/utils/replaceSpecialCharacters';
import { BUSINESS_UNITY } from '../../config/constants';
import { FINITE_INFINITE_RESOURCES, PREFIX, TAG } from '../../config/database';
import { IExceptionOption } from '../types';
import axios from '../useAxios/useAxios';
import { TYPE_RESOURCE } from '~/config/enums';
import useContextWebpart from '../useContextWebpart';

interface IUseFiniteInfiniteResource {
  resources: any[];
  count: number;
  loading: boolean;
  postLoading: boolean;
  nextLink: string;
  addOrUpdateFiniteInfiniteResource: (
    finiteResource: any,
    options?: IExceptionOption
  ) => void;
  bulkUpdateFiniteInfiniteResource: (
    toUpdate: any,
    options?: IExceptionOption
  ) => void;
  desactiveFiniteInfiniteResource: (
    toUpdate: any,
    options?: IExceptionOption
  ) => void;
  activeFiniteInfiniteResource: (
    toUpdate: any,
    options?: IExceptionOption
  ) => void;
  deleteResource: (res: any, options?: IExceptionOption) => void;
  refetch: any;
  error: any;
}

interface IFilterProps {
  searchQuery?: string;
  active?: 'Todos' | 'Ativo' | 'Inativo';
  order?: 'desc' | 'asc';
  orderBy?: string;
  rowsPerPage?: number;
  top?: number;
  typeResource?: TYPE_RESOURCE.FINITO | TYPE_RESOURCE.INFINITO;
}

interface IOptions {
  manual?: boolean;
}

const buildQuery = (filtro: IFilterProps) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');

    // tslint:disable-next-line: no-unused-expression
    filtro?.searchQuery &&
      f.or((p) => {
        p.filterPhrase(`contains(${PREFIX}nome,'${filtro.searchQuery}')`);
        p.filterPhrase(
          `contains(${PREFIX}Tipo/${PREFIX}nome,'${filtro.searchQuery}')`
        );

        if (parseInt(filtro.searchQuery)) {
          p.filterExpression(
            `${PREFIX}limitacao`,
            'eq',
            parseInt(filtro.searchQuery)
          );
          p.filterExpression(
            `${PREFIX}quantidade`,
            'eq',
            parseInt(filtro.searchQuery)
          );
        }

        return p;
      });

    if (filtro.typeResource) {
      f.filterExpression(`${PREFIX}tiporecurso`, 'eq', filtro.typeResource);
    }

    // tslint:disable-next-line: no-unused-expression
    filtro.active &&
      filtro.active !== 'Todos' &&
      f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');

    f.filterExpression(`${PREFIX}excluido`, 'eq', false);

    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  } else {
    query.orderBy(`${PREFIX}nome asc`);
  }

  if (filtro.top) {
    query.top(filtro.top);
  }

  query.expand(`${PREFIX}Tipo`);

  query.count();
  return query.toQuery();
};

const useFiniteInfiniteResource = (
  filter: IFilterProps,
  options?: IOptions
): IUseFiniteInfiniteResource[] => {
  const query = buildQuery(filter);
  const { context } = useContextWebpart();
  const useAxios = axios({ context: context });

  let headers = {};

  if (filter.rowsPerPage) {
    headers = {
      Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
    };
  }

  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: `${FINITE_INFINITE_RESOURCES}${query}`,
      headers,
    },
    {
      useCache: false,
      manual: !!options?.manual,
    }
  );

  const [
    { data: postData, loading: postLoading, error: postError },
    executePost,
  ] = useAxios(
    {
      url: `${FINITE_INFINITE_RESOURCES}`,
      method: 'POST',
    },
    { manual: true }
  );

  const getResourceByName = (name, type) => {
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
        f.filterExpression(`${PREFIX}tiporecurso`, 'eq', type);

        f.filterExpression(`${PREFIX}ativo`, 'eq', true);
        f.filterExpression(`${PREFIX}excluido`, 'eq', false);
        return f;
      });

      query.count();
      executePost({
        url: `${FINITE_INFINITE_RESOURCES}${query.toQuery()}`,
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

  const addOrUpdateFiniteInfiniteResource = async (
    finiteResource,
    { onSuccess, onError }
  ) => {
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

    executePost({
      url: finiteResource.id
        ? `${FINITE_INFINITE_RESOURCES}(${finiteResource.id})`
        : `${FINITE_INFINITE_RESOURCES}`,
      method: finiteResource?.id ? 'PATCH' : 'POST',
      data,
    })
      .then(async ({ data }) => {
        onSuccess?.(data);
        refetch();
      })
      .catch(({ response }) => {
        onError?.(response);
      });
  };

  const desactiveFiniteInfiniteResource = (
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

    executePost({
      url: `${FINITE_INFINITE_RESOURCES}(${
        finiteResource?.data?.[`${PREFIX}recursofinitoinfinitoid`]
      })`,
      method: 'PATCH',
      data,
    })
      .then(({ data }) => {
        onSuccess?.();
        refetch();
      })
      .catch(({ response }) => {
        onError?.(response);
      });
  };

  const activeFiniteInfiniteResource = (
    finiteResource,
    { onSuccess, onError }
  ) => {
    executePost({
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
        refetch();
      })
      .catch(({ response }) => {
        onError?.(response);
      });
  };

  const bulkUpdateFiniteInfiniteResource = async (
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

            await executePost({
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

        await executePost({
          url: `${FINITE_INFINITE_RESOURCES}(${
            finiteResource?.[`${PREFIX}recursofinitoinfinitoid`]
          })`,
          method: 'PATCH',
          data,
        });
      }
      onSuccess?.();
      refetch();
    } catch (e) {
      onError?.(e);
    }
  };

  const deleteResource = (res, { onSuccess, onError }) => {
    executePost({
      url: `${FINITE_INFINITE_RESOURCES}(${res?.id})`,
      method: 'PATCH',
      data: {
        [`${PREFIX}excluido`]: true,
        [`${PREFIX}ativo`]: false,
      },
    })
      .then(() => {
        onSuccess?.();
        refetch();
      })
      .catch(({ response }) => {
        onError?.(response);
      });
  };

  return [
    {
      resources: data?.value,
      count: data?.['@odata.count'],
      nextLink: data?.['@odata.nextLink'],
      postLoading,
      loading,
      error,
      addOrUpdateFiniteInfiniteResource,
      bulkUpdateFiniteInfiniteResource,
      desactiveFiniteInfiniteResource,
      activeFiniteInfiniteResource,
      deleteResource,
      refetch,
    },
  ];
};

export default useFiniteInfiniteResource;
