import { ACTIVITY, PROGRAM, SCHEDULE_DAY, TEAM } from '~/config/database';
import { QueryBuilder } from 'odata-query-builder';
import * as moment from 'moment';
import {
  FINITE_INFINITE_RESOURCES,
  PERSON,
  PREFIX,
  RESOURCES,
  SPACE,
} from '~/config/database';
import axios from '../useAxios/useAxios';
import BatchMultidata from '~/utils/BatchMultidata';
import useContextWebpart from '../useContextWebpart';

interface IUseResource {
  resources: any[];
  count: number;
  loading: boolean;
  postLoading: boolean;
  nextLink: string;
  fetchResources: (ft: IFilterResourceProps) => void;
  addOrUpdateByActivities: (activities: any[]) => void;
  addOrUpdateByActivity: (activities: any) => void;
  deleteByActivity: (activity: any) => void;
  getResources: (filtro: IFilterResourceProps) => Promise<any>;
  refetch: any;
  error: any;
}

export interface IFilterResourceProps {
  searchQuery?: string;
  active?: 'Todos' | 'Ativo' | 'Inativo';
  order?: 'desc' | 'asc';
  orderBy?: string;
  deleted?: boolean;
  rowsPerPage?: number;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  dayDate?: moment.Moment;
  people?: any[];
  spaces?: any[];
}

interface IOptions {
  manual?: boolean;
}

const buildQuery = (filtro: IFilterResourceProps) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');

    // tslint:disable-next-line: no-unused-expression
    if (filtro?.people?.length || filtro?.spaces?.length) {
      f.or((p) => {
        filtro?.people?.forEach((item) => {
          p.filterExpression(
            `${PREFIX}Pessoa/${PREFIX}pessoaid`,
            'eq',
            item.value
          );
        });

        filtro?.spaces?.forEach((item) => {
          p.filterExpression(
            `${PREFIX}Espaco/${PREFIX}espacoid`,
            'eq',
            item.value
          );
        });

        return p;
      });
    }

    if (filtro.startDate && filtro.endDate) {
      f.filterPhrase(
        `${PREFIX}inicio gt '${filtro.startDate
          .clone()
          .startOf('day')
          .format()}' and ${PREFIX}inicio lt '${filtro.endDate
          .clone()
          .endOf('day')
          .format()}'`
      );
    }

    if (filtro.dayDate) {
      f.filterPhrase(
        `${PREFIX}inicio gt '${filtro.dayDate.format(
          'YYYY-MM-DD'
        )}' and ${PREFIX}fim lt '${filtro.dayDate
          .add(1, 'day')
          .format('YYYY-MM-DD')}'`
      );
    }

    // tslint:disable-next-line: no-unused-expression
    // filtro.active &&
    //   filtro.active !== 'Todos' &&
    //   f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');

    // f.filterExpression(`${PREFIX}excluido`, 'eq', false);

    f.filterExpression(`${PREFIX}excluido`, 'eq', Boolean(filtro.deleted));

    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  }

  query.expand(
    `${PREFIX}Programa,${PREFIX}Turma,${PREFIX}Espaco,${PREFIX}Pessoa,${PREFIX}Atividade,${PREFIX}Recurso_RecursoFinitoeInfinito,${PREFIX}CronogramaDia`
  );

  query.count();
  return query.toQuery();
};

const useResource = (
  filter: IFilterResourceProps,
  options?: IOptions
): IUseResource[] => {
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
      url: `${RESOURCES}${query}`,
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
      url: `${RESOURCES}`,
      method: 'POST',
    },
    { manual: true }
  );

  const buildItem = (item) => {
    return {
      [`${PREFIX}Espaco@odata.bind`]:
        item?.[`${PREFIX}espacoid`] &&
        `/${SPACE}(${item?.[`${PREFIX}espacoid`]})`,
      [`${PREFIX}Pessoa@odata.bind`]:
        item?.[`_${PREFIX}pessoa_value`] &&
        `/${PERSON}(${item?.[`_${PREFIX}pessoa_value`]})`,
      [`${PREFIX}Recurso_RecursoFinitoeInfinito@odata.bind`]:
        item?.resourceFiniteInfiniteId &&
        `/${FINITE_INFINITE_RESOURCES}(${item?.resourceFiniteInfiniteId})`,
      [`${PREFIX}Atividade@odata.bind`]:
        item?.activityId && `/${ACTIVITY}(${item?.activityId})`,
      [`${PREFIX}Programa@odata.bind`]:
        item?.programId && `/${PROGRAM}(${item?.programId})`,
      [`${PREFIX}Turma@odata.bind`]:
        item?.teamId && `/${TEAM}(${item?.teamId})`,
      [`${PREFIX}CronogramaDia@odata.bind`]:
        item?.scheduleId && `/${SCHEDULE_DAY}(${item?.scheduleId})`,
      [`${PREFIX}inicio`]: item.startDate && moment(item.startDate).format(),
      [`${PREFIX}fim`]: item.endDate && moment(item.endDate).format(),
    };
  };

  const fetchResources = (ft: IFilterResourceProps) => {
    // const query = buildQuery(ft);
    // refetch({
    //   url: `${RESOURCES}${query}`,
    //   headers,
    // });
  };

  const getResources = (filtro: IFilterResourceProps) => {
    return new Promise((resolve, reject) => {
      var query = buildQuery(filtro);

      executePost({
        url: `${RESOURCES}${query}`,
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

  const addOrUpdateByActivities = async (activities) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(executePost);

      activities?.forEach((activity) => {
        const resourcesSpaceSaved = activity?.[`${PREFIX}recursos_Atividade`]
          ?.filter((e) => e?.[`_${PREFIX}espaco_value`])
          ?.reduce((acc, curr) => {
            acc[curr?.[`_${PREFIX}espaco_value`]] = curr;
            return acc;
          }, {});

        activity?.[`${PREFIX}Atividade_Espaco`]?.forEach((space) => {
          if (!resourcesSpaceSaved[space?.[`${PREFIX}espacoid`]]) {
            batch.post(
              RESOURCES,
              buildItem({
                ...space,
                programId: activity?.programId,
                teamId: activity?.teamId,
                scheduleId: activity?.scheduleId,
                activityId: activity?.[`${PREFIX}atividadeid`] || activity.id,
                startDate: activity?.[`${PREFIX}datahorainicio`]
                  ? moment(activity?.[`${PREFIX}datahorainicio`])
                  : activity.startDate,
                endDate: activity?.[`${PREFIX}datahorafim`]
                  ? moment(activity?.[`${PREFIX}datahorafim`])
                  : activity.endDate,
              })
            );
          }
        });

        const resourcesPersonSaved = activity?.[`${PREFIX}recursos_Atividade`]
          ?.filter((e) => e?.[`_${PREFIX}pessoa_value`])
          ?.reduce((acc, curr) => {
            acc[curr?.[`_${PREFIX}pessoa_value`]] = curr;
            return acc;
          }, {});

        activity?.[`${PREFIX}Atividade_PessoasEnvolvidas`]?.forEach(
          (person) => {
            if (!resourcesPersonSaved[person?.[`_${PREFIX}pessoa_value`]]) {
              batch.post(
                RESOURCES,
                buildItem({
                  ...person,
                  programId: activity?.programId,
                  teamId: activity?.teamId,
                  scheduleId: activity?.scheduleId,
                  activityId: activity?.[`${PREFIX}atividadeid`] || activity.id,
                  startDate: activity?.[`${PREFIX}datahorainicio`]
                    ? moment(activity?.[`${PREFIX}datahorainicio`])
                    : activity.startDate,
                  endDate: activity?.[`${PREFIX}datahorafim`]
                    ? moment(activity?.[`${PREFIX}datahorafim`])
                    : activity.endDate,
                })
              );
            }
          }
        );
      });

      await batch.execute();
      resolve('Sucesso');
    });
  };

  const addOrUpdateByActivity = async (activity) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(executePost);

      const resourcesSpaceSaved = activity?.[`${PREFIX}recursos_Atividade`]
        ?.filter((e) => e?.[`_${PREFIX}espaco_value`])
        ?.reduce((acc, curr) => {
          acc[curr?.[`_${PREFIX}espaco_value`]] = curr;
          return acc;
        }, {});

      activity?.spaces?.forEach((space) => {
        const resourceSpace = resourcesSpaceSaved[space?.[`${PREFIX}espacoid`]];

        if (!resourceSpace) {
          batch.post(
            RESOURCES,
            buildItem({
              ...space,
              programId: activity?.programId,
              teamId: activity?.teamId,
              scheduleId: activity?.scheduleId,
              activityId: activity?.[`${PREFIX}atividadeid`] || activity.id,
              startDate: activity?.[`${PREFIX}datahorainicio`]
                ? moment(activity?.[`${PREFIX}datahorainicio`])
                : activity.startDate,
              endDate: activity?.[`${PREFIX}datahorafim`]
                ? moment(activity?.[`${PREFIX}datahorafim`])
                : activity.endDate,
            })
          );
        } else {
          batch.patch(
            RESOURCES,
            resourceSpace?.[`${PREFIX}recursosid`],
            buildItem({
              startDate: activity?.[`${PREFIX}datahorainicio`]
                ? moment(activity?.[`${PREFIX}datahorainicio`])
                : activity.startDate,
              endDate: activity?.[`${PREFIX}datahorafim`]
                ? moment(activity?.[`${PREFIX}datahorafim`])
                : activity.endDate,
            })
          );
        }
      });

      const resourcesFiniteSaved = activity?.[`${PREFIX}recursos_Atividade`]
        ?.filter((e) => e?.[`_${PREFIX}recurso_recursofinitoeinfinito_value`])
        ?.reduce((acc, curr) => {
          acc[curr?.[`_${PREFIX}recurso_recursofinitoeinfinito_value`]] = curr;
          return acc;
        }, {});

      activity?.finiteResource?.forEach((finite) => {
        const resourceFinite =
          resourcesFiniteSaved[finite?.[`${PREFIX}recursofinitoinfinitoid`]];

        if (!resourceFinite) {
          batch.post(
            RESOURCES,
            buildItem({
              ...finite,
              programId: activity?.programId,
              teamId: activity?.teamId,
              scheduleId: activity?.scheduleId,
              resourceFiniteInfiniteId:
                finite?.[`${PREFIX}recursofinitoinfinitoid`],
              activityId: activity?.[`${PREFIX}atividadeid`] || activity.id,
              startDate: activity?.[`${PREFIX}datahorainicio`]
                ? moment(activity?.[`${PREFIX}datahorainicio`])
                : activity.startDate,
              endDate: activity?.[`${PREFIX}datahorafim`]
                ? moment(activity?.[`${PREFIX}datahorafim`])
                : activity.endDate,
            })
          );
        } else {
          batch.patch(
            RESOURCES,
            resourceFinite?.[`${PREFIX}recursosid`],
            buildItem({
              startDate: activity?.[`${PREFIX}datahorainicio`]
                ? moment(activity?.[`${PREFIX}datahorainicio`])
                : activity.startDate,
              endDate: activity?.[`${PREFIX}datahorafim`]
                ? moment(activity?.[`${PREFIX}datahorafim`])
                : activity.endDate,
            })
          );
        }
      });

      activity?.infiniteResource?.forEach((infinite) => {
        const resourceInfinite =
          resourcesFiniteSaved[infinite?.[`${PREFIX}recursofinitoinfinitoid`]];

        if (!resourceInfinite) {
          batch.post(
            RESOURCES,
            buildItem({
              ...infinite,
              programId: activity?.programId,
              teamId: activity?.teamId,
              scheduleId: activity?.scheduleId,
              resourceFiniteInfiniteId:
                infinite?.[`${PREFIX}recursofinitoinfinitoid`],
              activityId: activity?.[`${PREFIX}atividadeid`] || activity.id,
              startDate: activity?.[`${PREFIX}datahorainicio`]
                ? moment(activity?.[`${PREFIX}datahorainicio`])
                : activity.startDate,
              endDate: activity?.[`${PREFIX}datahorafim`]
                ? moment(activity?.[`${PREFIX}datahorafim`])
                : activity.endDate,
            })
          );
        } else {
          batch.patch(
            RESOURCES,
            resourceInfinite?.[`${PREFIX}recursosid`],
            buildItem({
              startDate: activity?.[`${PREFIX}datahorainicio`]
                ? moment(activity?.[`${PREFIX}datahorainicio`])
                : activity.startDate,
              endDate: activity?.[`${PREFIX}datahorafim`]
                ? moment(activity?.[`${PREFIX}datahorafim`])
                : activity.endDate,
            })
          );
        }
      });

      activity?.finiteResource?.forEach((finite) => {
        const resourceFinite =
          resourcesFiniteSaved[finite?.[`${PREFIX}recursofinitoinfinitoid`]];

        if (!resourceFinite) {
          batch.post(
            RESOURCES,
            buildItem({
              ...finite,
              programId: activity?.programId,
              teamId: activity?.teamId,
              scheduleId: activity?.scheduleId,
              resourceFiniteInfiniteId:
                finite?.[`${PREFIX}recursofinitoinfinitoid`],
              activityId: activity?.[`${PREFIX}atividadeid`] || activity.id,
              startDate: activity?.[`${PREFIX}datahorainicio`]
                ? moment(activity?.[`${PREFIX}datahorainicio`])
                : activity.startDate,
              endDate: activity?.[`${PREFIX}datahorafim`]
                ? moment(activity?.[`${PREFIX}datahorafim`])
                : activity.endDate,
            })
          );
        } else {
          batch.patch(
            RESOURCES,
            resourceFinite?.[`${PREFIX}recursosid`],
            buildItem({
              startDate: activity?.[`${PREFIX}datahorainicio`]
                ? moment(activity?.[`${PREFIX}datahorainicio`])
                : activity.startDate,
              endDate: activity?.[`${PREFIX}datahorafim`]
                ? moment(activity?.[`${PREFIX}datahorafim`])
                : activity.endDate,
            })
          );
        }
      });

      activity?.infiniteResource?.forEach((infinite) => {
        const resourceInfinite =
          resourcesFiniteSaved[infinite?.[`${PREFIX}recursofinitoinfinitoid`]];

        if (!resourceInfinite) {
          batch.post(
            RESOURCES,
            buildItem({
              ...infinite,
              programId: activity?.programId,
              teamId: activity?.teamId,
              scheduleId: activity?.scheduleId,
              resourceFiniteInfiniteId:
                infinite?.[`${PREFIX}recursofinitoinfinitoid`],
              activityId: activity?.[`${PREFIX}atividadeid`] || activity.id,
              startDate: activity?.[`${PREFIX}datahorainicio`]
                ? moment(activity?.[`${PREFIX}datahorainicio`])
                : activity.startDate,
              endDate: activity?.[`${PREFIX}datahorafim`]
                ? moment(activity?.[`${PREFIX}datahorafim`])
                : activity.endDate,
            })
          );
        } else {
          batch.patch(
            RESOURCES,
            resourceInfinite?.[`${PREFIX}recursosid`],
            buildItem({
              startDate: activity?.[`${PREFIX}datahorainicio`]
                ? moment(activity?.[`${PREFIX}datahorainicio`])
                : activity.startDate,
              endDate: activity?.[`${PREFIX}datahorafim`]
                ? moment(activity?.[`${PREFIX}datahorafim`])
                : activity.endDate,
            })
          );
        }
      });

      activity?.spacesToDelete?.forEach((space) => {
        const resourceToDelete =
          resourcesSpaceSaved?.[space?.[`${PREFIX}espacoid`]];
        if (resourceToDelete) {
          batch.patch(RESOURCES, resourceToDelete?.[`${PREFIX}recursosid`], {
            [`${PREFIX}excluido`]: true,
          });
        }
      });

      activity?.finiteInfiniteResourceToDelete?.forEach((space) => {
        const resourceToDelete =
          resourcesFiniteSaved?.[space?.[`${PREFIX}recursofinitoinfinitoid`]];
        if (resourceToDelete) {
          batch.patch(RESOURCES, resourceToDelete?.[`${PREFIX}recursosid`], {
            [`${PREFIX}excluido`]: true,
          });
        }
      });

      const resourcesPersonSaved = activity?.[
        `${PREFIX}recursos_Atividade`
      ]?.filter((e) => e?.[`_${PREFIX}pessoa_value`]);

      const dictPersonResource = resourcesPersonSaved?.reduce((acc, curr) => {
        acc[curr?.[`_${PREFIX}pessoa_value`]] = curr;
        return acc;
      }, {});

      activity?.people?.forEach((person) => {
        const personId =
          person?.[`_${PREFIX}pessoa_value`] ||
          person?.person?.[`${PREFIX}pessoaid`];

        if (person?.deleted) {
          const resourcePeopleToDelete = dictPersonResource?.[personId];
          if (resourcePeopleToDelete) {
            batch.delete(
              RESOURCES,
              resourcePeopleToDelete?.[`${PREFIX}recursosid`]
            );
          }
        } else if (person?.person) {
          const resourcePeople = dictPersonResource[personId];

          if (!resourcePeople) {
            batch.post(
              RESOURCES,
              buildItem({
                ...person,
                [`_${PREFIX}pessoa_value`]: personId,
                programId: activity?.programId,
                teamId: activity?.teamId,
                scheduleId: activity?.scheduleId,
                activityId: activity?.[`${PREFIX}atividadeid`] || activity.id,
                startDate: activity?.[`${PREFIX}datahorainicio`]
                  ? moment(activity?.[`${PREFIX}datahorainicio`])
                  : activity.startDate,
                endDate: activity?.[`${PREFIX}datahorafim`]
                  ? moment(activity?.[`${PREFIX}datahorafim`])
                  : activity.endDate,
              })
            );
          } else {
            batch.patch(
              RESOURCES,
              resourcePeople?.[`${PREFIX}recursosid`],
              buildItem({
                startDate: activity?.[`${PREFIX}datahorainicio`]
                  ? moment(activity?.[`${PREFIX}datahorainicio`])
                  : activity.startDate,
                endDate: activity?.[`${PREFIX}datahorafim`]
                  ? moment(activity?.[`${PREFIX}datahorafim`])
                  : activity.endDate,
              })
            );
          }
        }
      });

      resourcesPersonSaved?.forEach((personSaved) => {
        if (
          !activity?.people?.find((person) => {
            const personId =
              person?.[`_${PREFIX}pessoa_value`] ||
              person?.person?.[`${PREFIX}pessoaid`];
            return personId === personSaved?.[`_${PREFIX}pessoa_value`];
          })
        ) {
          batch.patch(RESOURCES, personSaved?.[`${PREFIX}recursosid`], {
            [`${PREFIX}excluido`]: true,
          });
        }
      });
      await batch.execute();
      resolve('Sucesso');
    });
  };

  const deleteByActivity = async (activity) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(executePost);

      activity?.[`${PREFIX}recursos_Atividade`]?.forEach((res) => {
        batch.patch(RESOURCES, res?.[`${PREFIX}recursosid`], {
          [`${PREFIX}excluido`]: true,
        });
      });

      await batch.execute();
      resolve('Sucesso');
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
      fetchResources,
      addOrUpdateByActivities,
      addOrUpdateByActivity,
      deleteByActivity,
      getResources,
      refetch,
    },
  ];
};

export default useResource;
