import { QueryBuilder } from 'odata-query-builder';
import * as moment from 'moment';
import { BUSINESS_UNITY } from '../../config/constants';
import { TASK, PREFIX, TAG } from '../../config/database';
import { IExceptionOption } from '../types';
import axios from '../useAxios/useAxios';
import useContextWebpart from '../useContextWebpart';
import BatchMultidata from '~/utils/BatchMultidata';

interface IUseTask {
  tasks: any[];
  count: number;
  loading: boolean;
  postLoading: boolean;
  nextLink: string;
  bulkAddTaks: (tasks: any[], options?: IExceptionOption) => Promise<any>;
  bulkUpdatePerson: (toUpdate: any, options?: IExceptionOption) => void;
  desactivePerson: (toUpdate: any, options?: IExceptionOption) => void;
  activePerson: (toUpdate: any, options?: IExceptionOption) => void;
  deletePerson: (toUpdate: any, options?: IExceptionOption) => any;
  refetch: any;
  error: any;
}

interface IOptions {
  manual?: boolean;
}

interface IFilterProps {
  searchQuery?: string;
  active?: 'Todos' | 'Ativo' | 'Inativo';
  order?: 'desc' | 'asc';
  orderBy?: string;
  rowsPerPage?: number;
}

const buildQuery = (filtro: IFilterProps) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');

    // tslint:disable-next-line: no-unused-expression
    filtro?.searchQuery &&
      f.or((p) => {
        p.filterPhrase(`contains(${PREFIX}nome,'${filtro.searchQuery}')`);
        p.filterPhrase(`contains(${PREFIX}descricao,'${filtro.searchQuery}')`);
        //p.filterPhrase(
        //  `contains(${PREFIX}nomepreferido,'${filtro.searchQuery}')`
        //);
        //p.filterPhrase(`contains(${PREFIX}email,'${filtro.searchQuery}')`);
        //p.filterPhrase(
        //  `contains(${PREFIX}emailsecundario,'${filtro.searchQuery}')`
        //);
        //p.filterPhrase(`contains(${PREFIX}celular,'${filtro.searchQuery}')`);

        p.filterPhrase(
          `contains(${PREFIX}Programa/${PREFIX}titulo,'${filtro.searchQuery}')`
        );
        p.filterPhrase(
          `contains(${PREFIX}Turma/${PREFIX}nome,'${filtro.searchQuery}')`
        );
        p.filterPhrase(
          `contains(${PREFIX}Atividade/${PREFIX}nome,'${filtro.searchQuery}')`
        );

        p.filterPhrase(
          `contains(${PREFIX}Pessoa/${PREFIX}nome,'${filtro.searchQuery}')`
        );

        return p;
      });

    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  }

  query.expand(
    `${PREFIX}Programa,${PREFIX}Turma,${PREFIX}Grupo,${PREFIX}Atividade,${PREFIX}tarefas_responsaveis_ise_pessoa`
  );

  query.count();
  return query.toQuery();
};

const useTask = (filter: IFilterProps, options?: IOptions): IUseTask[] => {
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
      url: `${TASK}${query}`,
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
      url: `${TASK}`,
      method: 'POST',
    },
    { manual: true }
  );

  const bulkAddTaks = async (tasks, { onSuccess, onError }) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(executePost);

      tasks.forEach((elm) => {
        batch.post(TASK, elm);
      });

      try {
        await batch.execute();
        resolve('Success');
        onSuccess?.();
      } catch (err) {
        onError?.(err);
        reject(err);
      }
    });
  };

  const desactivePerson = (person, { onSuccess, onError }) => {
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

    executePost({
      url: `${TASK}(${person?.data?.[`${PREFIX}pessoaid`]})`,
      method: 'PATCH',
      data,
    })
      .then(() => {
        onSuccess?.();
        refetch();
      })
      .catch(({ response }) => {
        onError?.(response);
      });
  };

  const deletePerson = (person, { onSuccess, onError }) => {
    executePost({
      url: `${TASK}(${person?.id})`,
      method: 'PATCH',
      data: {
        [`${PREFIX}excluido`]: true,
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

  const activePerson = (person, { onSuccess, onError }) => {
    executePost({
      url: `${TASK}(${person?.[`${PREFIX}pessoaid`]})`,
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

  const bulkUpdatePerson = async (toUpdate, { onSuccess, onError }) => {
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

            await executePost({
              url: `${TASK}(${
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

        await executePost({
          url: `${TASK}(${person?.[`${PREFIX}pessoaid`]})`,
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

  return [
    {
      tasks: data?.value,
      count: data?.['@odata.count'],
      nextLink: data?.['@odata.nextLink'],
      postLoading,
      loading,
      error,
      bulkAddTaks,
      bulkUpdatePerson,
      desactivePerson,
      activePerson,
      deletePerson,
      refetch,
    },
  ];
};

export default useTask;
