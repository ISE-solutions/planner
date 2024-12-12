import api from '~/services/api';
import { PREFIX, RESOURCES } from '~/config/database';
import { buildItem, buildQuery, IFilterResourceProps } from './utils';
import { Dispatch } from 'redux';
import { EActionType } from './types';
import { setValue } from '../common';
import * as moment from 'moment';
import BatchMultidata from '~/utils/BatchMultidata';
import {
  ACTION_DELETE,
  ACTION_EDIT,
  ACTION_INCLUDE,
  IBlockUpdated,
  TypeBlockUpdated,
} from '~/config/constants';
import {
  executeEventOutlook,
  addOrUpdateEventsByResources,
  deleteEventsByResources,
} from '../eventOutlook/actions';
import { QueryBuilder } from 'odata-query-builder';
import { EFatherTag } from '~/config/enums';
import { AppState } from '~/store';

export const fetchAllResources =
  (filter: IFilterResourceProps): any =>
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
      const { data } = await api.get(`${RESOURCES}${query}`, {
        headers,
      });

      dispatch(
        setValue(EActionType.FETCH_ALL_SUCCESS, {
          items: data?.value,
          isActive: filter?.active === 'Ativo',
        })
      );
    } catch (error) {
      console.error(error);
      // handle your error
    }
  };

export const getResources = (filtro: IFilterResourceProps): Promise<any> => {
  return new Promise((resolve, reject) => {
    var query = buildQuery(filtro);

    api({
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

export const getResourcesByActivityId = (activityId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      f.filterExpression(
        `${PREFIX}Atividade/${PREFIX}atividadeid`,
        'eq',
        activityId
      );

      return f;
    });

    query.expand(
      `${PREFIX}Programa,${PREFIX}Turma,${PREFIX}Espaco,${PREFIX}Pessoa,${PREFIX}Atividade,${PREFIX}Recurso_RecursoFinitoeInfinito,${PREFIX}CronogramaDia`
    );

    api({
      url: `${RESOURCES}${query.toQuery()}`,
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

export const addOrUpdateByActivities = async (
  activities: any[],
  { dictTag }: any,
  filterEvent: IFilterResourceProps,
  blockUpdated: IBlockUpdated
) => {
  return new Promise(async (resolve, reject) => {
    const batch = new BatchMultidata(api);

    activities
      .filter((e) => !e?.[`${PREFIX}ativo`])
      .forEach((activity) => {
        activity?.[`${PREFIX}recursos_Atividade`]?.forEach((res) => {
          batch.patch(RESOURCES, res?.[`${PREFIX}recursosid`], {
            [`${PREFIX}excluido`]: true,
          });
        });
      });

    activities
      ?.filter((e) => e?.[`${PREFIX}ativo`])
      ?.forEach((activity) => {
        const resourcesSpaceSaved = activity?.[
          `${PREFIX}recursos_Atividade`
        ]?.filter(
          (e) => !e?.[`${PREFIX}excluido`] && e?.[`_${PREFIX}espaco_value`]
        );

        const dictResourcesSpaceSaved = resourcesSpaceSaved?.reduce(
          (acc, curr) => {
            acc[curr?.[`_${PREFIX}espaco_value`]] = curr;
            return acc;
          },
          {}
        );

        activity?.[`${PREFIX}Atividade_Espaco`]?.forEach((space) => {
          const resource =
            dictResourcesSpaceSaved[space?.[`${PREFIX}espacoid`]];

          if (!resource) {
            batch.post(
              RESOURCES,
              buildItem({
                ...space,
                programId:
                  activity?.[`_${PREFIX}programa_value`] || activity.programId,
                teamId: activity?.[`_${PREFIX}turma_value`] || activity.teamId,
                scheduleId:
                  activity?.[`_${PREFIX}cronogramadia_value`] ||
                  activity.scheduleId,
                activityId: activity?.[`${PREFIX}atividadeid`] || activity.id,
                startDate: activity?.[`${PREFIX}datahorainicio`]
                  ? moment.utc(activity?.[`${PREFIX}datahorainicio`])
                  : activity.startDate,
                endDate: activity?.[`${PREFIX}datahorafim`]
                  ? moment.utc(activity?.[`${PREFIX}datahorafim`])
                  : activity.endDate,
              })
            );
          } else if (
            activity?.[`${PREFIX}datahorainicio`] !=
              resource?.[`${PREFIX}inicio`] ||
            activity?.[`${PREFIX}datahorafim`] != resource?.[`${PREFIX}fim`]
          ) {
            batch.patch(
              RESOURCES,
              resource?.[`${PREFIX}recursosid`],
              buildItem({
                createInvite: true,
                programId:
                  activity?.[`_${PREFIX}programa_value`] || activity.programId,
                teamId: activity?.[`_${PREFIX}turma_value`] || activity.teamId,
                scheduleId:
                  activity?.[`_${PREFIX}cronogramadia_value`] ||
                  activity.scheduleId,
                activityId: activity?.[`${PREFIX}atividadeid`] || activity.id,
                startDate: activity?.[`${PREFIX}datahorainicio`]
                  ? moment.utc(activity?.[`${PREFIX}datahorainicio`])
                  : activity.startDate,
                endDate: activity?.[`${PREFIX}datahorafim`]
                  ? moment.utc(activity?.[`${PREFIX}datahorafim`])
                  : activity.endDate,
              })
            );
          }
        });

        resourcesSpaceSaved?.forEach((res) => {
          const spaceExists = activity?.[`${PREFIX}Atividade_Espaco`]?.find(
            (e) => e?.[`${PREFIX}espacoid`] === res?.[`_${PREFIX}espaco_value`]
          );
          if (!spaceExists) {
            batch.patch(RESOURCES, res?.[`${PREFIX}recursosid`], {
              [`${PREFIX}excluido`]: true,
            });
          }
        });

        const resourcesPersonSaved = activity?.[
          `${PREFIX}recursos_Atividade`
        ]?.filter(
          (e) => !e?.[`${PREFIX}excluido`] && e?.[`_${PREFIX}pessoa_value`]
        );

        const dictResourcesPersonSaved = resourcesPersonSaved?.reduce(
          (acc, curr) => {
            acc[curr?.[`_${PREFIX}pessoa_value`]] = curr;
            return acc;
          },
          {}
        );

        activity?.[`${PREFIX}Atividade_PessoasEnvolvidas`]
          ?.filter((e) => e?.[`_${PREFIX}pessoa_value`])
          ?.forEach((person) => {
            const resource =
              dictResourcesPersonSaved[person?.[`_${PREFIX}pessoa_value`]];
            const func = dictTag?.[person?.[`_${PREFIX}funcao_value`]];
            const isTeacher = func?.[`${PREFIX}nome`]
              ?.toLocaleLowerCase()
              ?.includes(EFatherTag.PROFESSOR.toLocaleLowerCase());

            if (!resource) {
              batch.post(
                RESOURCES,
                buildItem({
                  ...person,
                  createInvite: isTeacher,
                  programId:
                    activity?.[`_${PREFIX}programa_value`] ||
                    activity.programId,
                  teamId:
                    activity?.[`_${PREFIX}turma_value`] || activity.teamId,
                  scheduleId:
                    activity?.[`_${PREFIX}cronogramadia_value`] ||
                    activity.scheduleId,
                  activityId: activity?.[`${PREFIX}atividadeid`] || activity.id,
                  startDate: activity?.[`${PREFIX}datahorainicio`]
                    ? moment.utc(activity?.[`${PREFIX}datahorainicio`])
                    : activity.startDate,
                  endDate: activity?.[`${PREFIX}datahorafim`]
                    ? moment.utc(activity?.[`${PREFIX}datahorafim`])
                    : activity.endDate,
                })
              );
            } else if (
              activity?.[`${PREFIX}datahorainicio`] !=
                resource?.[`${PREFIX}inicio`] ||
              activity?.[`${PREFIX}datahorafim`] !=
                resource?.[`${PREFIX}fim`] ||
              isTeacher != resource?.[`${PREFIX}criarevento`]
            ) {
              batch.patch(
                RESOURCES,
                resource?.[`${PREFIX}recursosid`],
                buildItem({
                  ...person,
                  createInvite: isTeacher,
                  programId:
                    activity?.[`_${PREFIX}programa_value`] ||
                    activity.programId,
                  teamId:
                    activity?.[`_${PREFIX}turma_value`] || activity.teamId,
                  scheduleId:
                    activity?.[`_${PREFIX}cronogramadia_value`] ||
                    activity.scheduleId,
                  activityId: activity?.[`${PREFIX}atividadeid`] || activity.id,
                  startDate: activity?.[`${PREFIX}datahorainicio`]
                    ? moment.utc(activity?.[`${PREFIX}datahorainicio`])
                    : activity.startDate,
                  endDate: activity?.[`${PREFIX}datahorafim`]
                    ? moment.utc(activity?.[`${PREFIX}datahorafim`])
                    : activity.endDate,
                })
              );
            }
          });

        resourcesPersonSaved?.forEach((res) => {
          const personExists = activity?.[
            `${PREFIX}Atividade_PessoasEnvolvidas`
          ]?.find(
            (e) =>
              e?.[`_${PREFIX}pessoa_value`] === res?.[`_${PREFIX}pessoa_value`]
          );
          if (!personExists) {
            // batch.delete(RESOURCES, res?.[`${PREFIX}recursosid`])
            batch.patch(RESOURCES, res?.[`${PREFIX}recursosid`], {
              [`${PREFIX}excluido`]: true,
            });
          }
        });
      });

    await batch.execute();

    const resourcesRequest = await getResources({
      ...filterEvent,
      filterDeleted: false,
    });
    const resourcesSaved = resourcesRequest.value;

    try {
      await addOrUpdateEventsByResources(blockUpdated);
    } catch (err) {
      reject(err);
      console.error(err);
    }

    resolve('Sucesso');
  });
};

export const deleteByActivities = async (
  activities: any[],
  { references, dictSpace, dictPeople }: any,
  blockUpdated: IBlockUpdated
) => {
  return new Promise(async (resolve, reject) => {
    const batch = new BatchMultidata(api);
    let resourcesToDelete = [];
    activities?.forEach((activity) => {
      const resourcesSaved = activity?.[`${PREFIX}recursos_Atividade`]?.filter(
        (e) => !e?.[`${PREFIX}excluido`]
      );

      resourcesToDelete = resourcesToDelete.concat(resourcesSaved);
      resourcesSaved?.forEach((res) => {
        batch.patch(RESOURCES, res?.[`${PREFIX}recursosid`], {
          [`${PREFIX}excluido`]: true,
        });
      });
    });

    await batch.execute();

    try {
      await deleteEventsByResources(
        resourcesToDelete,
        {
          references,
          dictSpace,
          dictPeople,
        },
        blockUpdated
      );
    } catch (err) {
      reject(err);
      console.error(err);
    }

    resolve('Sucesso');
  });
};

export const addOrUpdateByActivity = async (
  activity,
  { references, dictTag }
) => {
  return new Promise(async (resolve, reject) => {
    const batch = new BatchMultidata(api);
    const eventsToCreate = [];

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
            createInvite: true,
            programId: activity?.programId,
            teamId: activity?.teamId,
            scheduleId: activity?.scheduleId,
            activityId: activity?.[`${PREFIX}atividadeid`] || activity.id,
            startDate: activity?.[`${PREFIX}datahorainicio`]
              ? moment.utc(activity?.[`${PREFIX}datahorainicio`])
              : activity.startDate,
            endDate: activity?.[`${PREFIX}datahorafim`]
              ? moment.utc(activity?.[`${PREFIX}datahorafim`])
              : activity.endDate,
          })
        );
      } else {
        batch.patch(
          RESOURCES,
          resourceSpace?.[`${PREFIX}recursosid`],
          buildItem({
            programId: activity?.programId,
            teamId: activity?.teamId,
            scheduleId: activity?.scheduleId,
            activityId: activity?.[`${PREFIX}atividadeid`] || activity.id,
            startDate: activity?.[`${PREFIX}datahorainicio`]
              ? moment.utc(activity?.[`${PREFIX}datahorainicio`])
              : activity.startDate,
            endDate: activity?.[`${PREFIX}datahorafim`]
              ? moment.utc(activity?.[`${PREFIX}datahorafim`])
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

        eventsToCreate.push({
          action: ACTION_DELETE,
          title: activity?.[`${PREFIX}nome`],
          email: space?.[`${PREFIX}email`],
          start: moment(resourceToDelete?.[`${PREFIX}inicio`]).format(),
          end: moment(resourceToDelete?.[`${PREFIX}fim`]).format(),
          resourceId: resourceToDelete?.[`${PREFIX}recursosid`],
          // eventId: resourceToDelete?.[`${PREFIX}eventoid`] || eventId,
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

    resourcesPersonSaved.forEach((res) => {
      if (
        !activity?.people.some(
          (es) =>
            (es?.[`_${PREFIX}pessoa_value`] ||
              es?.person?.[`${PREFIX}pessoaid`]) ===
            res?.[`_${PREFIX}pessoa_value`]
        )
      ) {
        batch.patch(RESOURCES, res?.[`${PREFIX}recursosid`], {
          [`${PREFIX}excluido`]: true,
        });
        eventsToCreate.push({
          action: ACTION_DELETE,
          title: activity?.[`${PREFIX}nome`],
          email: 'teste@example.com',
          start: moment(res?.[`${PREFIX}inicio`]).format(),
          end: moment(res?.[`${PREFIX}fim`]).format(),
          resourceId: res?.[`${PREFIX}recursosid`],
          // eventId: res?.[`${PREFIX}eventoid`] || eventId,
        });
      }
    });

    activity?.people?.forEach((person) => {
      const personId =
        person?.[`_${PREFIX}pessoa_value`] ||
        person?.person?.[`${PREFIX}pessoaid`];
      const funcId =
        person?.[`_${PREFIX}funcao_value`] ||
        person?.function?.[`${PREFIX}etiquetaid`];

      if (person?.deleted) {
        const resourcePeopleToDelete = dictPersonResource?.[personId];
        if (resourcePeopleToDelete) {
          batch.patch(
            RESOURCES,
            resourcePeopleToDelete?.[`${PREFIX}recursosid`],
            { [`${PREFIX}excluido`]: true }
          );

          eventsToCreate.push({
            action: ACTION_DELETE,
            title: activity?.[`${PREFIX}nome`],
            email: person?.[`${PREFIX}email`],
            start: moment(resourcePeopleToDelete?.[`${PREFIX}inicio`]).format(),
            end: moment(resourcePeopleToDelete?.[`${PREFIX}fim`]).format(),
            resourceId: resourcePeopleToDelete?.[`${PREFIX}recursosid`],
            // eventId: resourcePeopleToDelete?.[`${PREFIX}eventoid`] || eventId,
          });
        }
      } else if (person?.person) {
        const resourcePeople = dictPersonResource[personId];
        const isTeacher = dictTag?.[funcId]

          ?.toLocaleLowerCase()
          ?.includes(EFatherTag.PROFESSOR.toLocaleLowerCase());

        if (!resourcePeople) {
          batch.post(
            RESOURCES,
            buildItem({
              ...person,
              createInvite: isTeacher,
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
              createInvite: isTeacher,
              startDate: activity?.[`${PREFIX}datahorainicio`]
                ? moment.utc(activity?.[`${PREFIX}datahorainicio`])
                : activity.startDate,
              endDate: activity?.[`${PREFIX}datahorafim`]
                ? moment.utc(activity?.[`${PREFIX}datahorafim`])
                : activity.endDate,
            })
          );
        }
      }
    });

    await batch.execute();

    const resourcesSaved = await getResourcesByActivityId(
      activity?.[`${PREFIX}atividadeid`] || activity.id
    );

    resourcesSaved?.forEach((res) => {
      const temperatureId =
        res?.[`${PREFIX}Atividade`]?.[`_${PREFIX}temperatura_value`] ||
        res?.[`${PREFIX}CronogramaDia`]?.[`_${PREFIX}temperatura_value`] ||
        res?.[`${PREFIX}Turma`]?.[`_${PREFIX}temperatura_value`] ||
        res?.[`${PREFIX}Programa`]?.[`_${PREFIX}temperatura_value`];

      const temperature = dictTag?.[temperatureId];

      if (
        temperature &&
        temperature?.[`${PREFIX}nome`] !== EFatherTag.RASCUNHO &&
        (res?.[`${PREFIX}Pessoa`] || res?.[`${PREFIX}Espaco`])
      ) {
        const academicArea =
          dictTag?.[
            res?.[`${PREFIX}Atividade`]?.[`_${PREFIX}areaacademica_value`]
          ];

        const title = [];

        title.push(res?.[`${PREFIX}Programa`]?.[`${PREFIX}sigla`]);
        title.push(res?.[`${PREFIX}Turma`]?.[`${PREFIX}nome`]);
        title.push(res?.[`${PREFIX}Atividade`]?.[`${PREFIX}nome`]);
        title.push(academicArea?.[`${PREFIX}nome`]);
      }
    });

    if (eventsToCreate.length) {
      // await executeEventOutlook(
      //   { references, events: eventsToCreate },
      //   {
      //     onSuccess: () => null,
      //     onError: () => null,
      //   }
      // );
    }

    resolve('Sucesso');
  });
};

export const deleteByActivity =
  (activityId): any =>
  (dispatch: Dispatch<any>, getState: () => AppState) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(api);

      const { tag, person, space, environmentReference } = getState();
      const { dictTag } = tag;
      const { dictSpace } = space;
      const { dictPeople } = person;
      const { references } = environmentReference;

      const resourcesRequest = await getResources({
        activityId,
        filterDeleted: false,
      });

      const resourcesSaved = resourcesRequest.value;

      resourcesSaved?.forEach((res) => {
        batch.patch(RESOURCES, res?.[`${PREFIX}recursosid`], {
          [`${PREFIX}excluido`]: true,
        });
      });

      try {
        await deleteEventsByResources(
          resourcesSaved,
          {
            references,
            dictPeople,
            dictSpace,
          },
          { id: activityId, type: TypeBlockUpdated.Atividade }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }

      await batch.execute();
      resolve('Sucesso');
    });
  };

export const deleteBySchedule =
  (scheduleId): any =>
  (dispatch: Dispatch<any>, getState: () => AppState) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(api);

      const { tag, environmentReference } = getState();
      const { dictTag } = tag;
      const { references } = environmentReference;

      const resourcesRequest = await getResources({
        scheduleId,
        filterDeleted: false,
      });

      const resourcesSaved = resourcesRequest.value;

      resourcesSaved?.forEach((res) => {
        batch.patch(RESOURCES, res?.[`${PREFIX}recursosid`], {
          [`${PREFIX}excluido`]: true,
        });
      });

      try {
        await addOrUpdateEventsByResources({
          type: TypeBlockUpdated.DiaAula,
          id: scheduleId,
        });
      } catch (err) {
        reject(err);
        console.error(err);
      }

      await batch.execute();
      resolve('Sucesso');
    });
  };

export const deleteByTeam =
  (teamId): any =>
  (dispatch: Dispatch<any>, getState: () => AppState) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(api);

      const { tag, environmentReference } = getState();
      const { dictTag } = tag;
      const { references } = environmentReference;

      const resourcesRequest = await getResources({
        teamId,
        filterDeleted: false,
      });

      const resourcesSaved = resourcesRequest.value;

      resourcesSaved?.forEach((res) => {
        batch.patch(RESOURCES, res?.[`${PREFIX}recursosid`], {
          [`${PREFIX}excluido`]: true,
        });
      });

      try {
        await addOrUpdateEventsByResources({
          type: TypeBlockUpdated.Turma,
          id: teamId,
        });
      } catch (err) {
        reject(err);
        console.error(err);
      }

      await batch.execute();
      resolve('Sucesso');
    });
  };

export const deleteByProgram =
  (programId): any =>
  (dispatch: Dispatch<any>, getState: () => AppState) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(api);

      const { tag, environmentReference } = getState();
      const { dictTag } = tag;
      const { references } = environmentReference;

      const resourcesRequest = await getResources({
        programId,
        filterDeleted: false,
      });

      const resourcesSaved = resourcesRequest.value;

      resourcesSaved?.forEach((res) => {
        batch.patch(RESOURCES, res?.[`${PREFIX}recursosid`], {
          [`${PREFIX}excluido`]: true,
        });
      });

      try {
        await addOrUpdateEventsByResources({
          type: TypeBlockUpdated.Programa,
          id: programId,
        });
      } catch (err) {
        reject(err);
        console.error(err);
      }

      await batch.execute();
      resolve('Sucesso');
    });
  };
