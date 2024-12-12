import api from '~/services/api';
import {
  ACADEMIC_REQUESTS,
  ACADEMIC_REQUESTS_ENVOLVED_PEOPLE,
  ACTIVITY,
  ACTIVITY_DOCUMENTS,
  ACTIVITY_ENVOLVED_PEOPLE,
  ACTIVITY_NAME,
  FINITE_INFINITE_RESOURCES,
  PERSON,
  PREFIX,
  SCHEDULE_DAY,
  SPACE,
  TAG,
} from '~/config/database';
import {
  buildAdvancedQuery,
  buildItem,
  buildItemAcademicRequest,
  buildItemDocument,
  buildItemFantasyName,
  buildItemPeople,
  buildItemPeopleAcademicRequest,
  buildQuery,
  IFilterProps,
} from './utils';
import { Dispatch } from 'redux';
import { EActionType } from './types';
import { setValue } from '../common';
import BatchMultidata from '~/utils/BatchMultidata';
import * as moment from 'moment';
import {
  ACTION_DELETE,
  BASE_URL_API_NET,
  BUSINESS_UNITY,
  ENV,
  TypeBlockUpdated,
} from '~/config/constants';
import { QueryBuilder } from 'odata-query-builder';
import {
  EActivityTypeApplication,
  EFatherTag,
  TYPE_ACTIVITY,
  TYPE_TASK,
} from '~/config/enums';
import {
  addOrUpdateByActivities,
  addOrUpdateByActivity,
  deleteByActivity,
} from '../resource/actions';
import replaceSpecialCharacters from '~/utils/replaceSpecialCharacters';
import { AppState } from '~/store';
import { addOrUpdateTask } from '../task/actions';
import { executeEventDeleteOutlook } from '../eventOutlook/actions';

export const fetchAllActivities =
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
      const { data } = await api.get(`${ACTIVITY}${query}`, {
        headers,
      });

      dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, data?.value));
    } catch (error) {
      console.error(error);
      // handle your error
    }
  };

export const fetchAdvancedActivities = (filter: string): any =>
  new Promise(async (resolve, reject) => {
    try {
      let axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await api.post(
        `${BASE_URL_API_NET}Atividade`,
        { queryString: filter || '', ev: ENV },
        axiosConfig
      );

      resolve(data);
    } catch (error) {
      console.error(error);
    }
  });

export const getActivities = (filter: IFilterProps): any =>
  new Promise(async (resolve, reject) => {
    try {
      const query = buildQuery(filter);
      let headers = {};

      if (filter.rowsPerPage) {
        headers = {
          Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
      }
      const { data } = await api.get(`${ACTIVITY}${query}`, {
        headers,
      });

      resolve(data?.value);
    } catch (error) {
      console.error(error);
    }
  });

export const getActivity = (id): Promise<any> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) =>
      f.filterExpression(`${PREFIX}atividadeid`, 'eq', id)
    );

    query.expand(
      `${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por,${PREFIX}Programa,${PREFIX}Turma`
    );

    query.count();
    api({
      url: `${ACTIVITY}${query.toQuery()}`,
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

export const getActivityByIds = (ids: string[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!ids.length) {
      resolve({ value: [] });
      return;
    }
    var query = new QueryBuilder().filter((f) => {
      f.or((p) => {
        ids.forEach((id) =>
          p.filterExpression(`${PREFIX}atividadeid`, 'eq', id)
        );

        return p;
      });

      return f;
    });

    query.expand(
      `${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por,${PREFIX}Programa,${PREFIX}Turma`
    );

    query.count();
    api({
      url: `${ACTIVITY}${query.toQuery()}`,
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

export const getActivityPermitions = (id): Promise<any> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) =>
      f.filterExpression(`${PREFIX}atividadeid`, 'eq', id)
    );

    query.expand(
      `${PREFIX}Atividade_Compartilhamento,${PREFIX}Programa,${PREFIX}Turma`
    );

    query.count();
    api({
      url: `${ACTIVITY}${query.toQuery()}`,
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

export const getActivityByScheduleId = (
  scheduleId: string,
  onlyActive: boolean = true
): Promise<any> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      f.filterPhrase(
        `${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}cronogramadediaid eq '${scheduleId}')`
      );

      if (onlyActive) {
        f.filterExpression(`${PREFIX}ativo`, 'eq', true);
        f.filterExpression(`${PREFIX}excluido`, 'eq', false);
      }

      return f;
    });

    query.expand(
      `${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por`
    );

    query.orderBy(`${PREFIX}datahorainicio asc`);

    query.count();
    api({
      url: `${ACTIVITY}${query.toQuery()}`,
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

export const getActivityByTeamId = (teamId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', teamId);
      f.filterExpression(`${PREFIX}ativo`, 'eq', true);

      return f;
    });

    query.expand(
      `${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por`
    );

    query.count();
    api({
      url: `${ACTIVITY}${query.toQuery()}`,
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

export const getActivityByProgramId = (programId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      f.filterExpression(
        `${PREFIX}Programa/${PREFIX}programaid`,
        'eq',
        programId
      );
      f.filterExpression(`${PREFIX}ativo`, 'eq', true);

      return f;
    });

    query.expand(
      `${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por`
    );

    query.count();
    api({
      url: `${ACTIVITY}${query.toQuery()}`,
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

export const getActivityByName = (name, type) => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      // f.filterPhrase(`startswith(${PREFIX}nome,'${name}')`);
      f.filterExpression(
        `${PREFIX}nome`,
        'eq',
        `${replaceSpecialCharacters(name)}`
      );
      f.filterExpression(`${PREFIX}tipo`, 'eq', type);

      f.filterExpression(
        `${PREFIX}tipoaplicacao`,
        'eq',
        EActivityTypeApplication.PLANEJAMENTO
      );
      f.filterExpression(`${PREFIX}ativo`, 'eq', true);
      f.filterExpression(`${PREFIX}excluido`, 'eq', false);

      return f;
    });

    query.count();
    api({
      url: `${ACTIVITY}${query.toQuery()}`,
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

export const getAcademicRequestsByActivityId = (
  activityId: string
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      f.filterPhrase(
        `_ise_requisicaoacademica_atividade_value eq '${activityId}'`
      );

      f.filterExpression(`${PREFIX}ativo`, 'eq', true);
      f.filterExpression(`${PREFIX}excluido`, 'eq', false);

      return f;
    });

    query.expand(`${PREFIX}Equipamentos,${PREFIX}RequisicaoAcademica_Recurso`);

    query.count();
    api({
      url: `${ACADEMIC_REQUESTS}${query.toQuery()}`,
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

export const getAcademicRequestsByTeamId = (teamId: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      f.filterPhrase(`_${PREFIX}turma_value eq '${teamId}'`);

      f.filterExpression(`${PREFIX}ativo`, 'eq', true);
      f.filterExpression(`${PREFIX}excluido`, 'eq', false);

      return f;
    });

    query.expand(`${PREFIX}Equipamentos,${PREFIX}RequisicaoAcademica_Recurso`);

    query.count();
    api({
      url: `${ACADEMIC_REQUESTS}${query.toQuery()}`,
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

export const addOrUpdateActivity =
  (activity, { onSuccess, onError }): any =>
  (dispatch: Dispatch<any>, getState: () => AppState) => {
    return new Promise(async (resolve, reject): Promise<any> => {
      if (activity.typeApplication === EActivityTypeApplication.PLANEJAMENTO) {
        const activitySavedByName: any = await getActivityByName(
          activity.name,
          activity.type
        );

        if (activitySavedByName?.value?.length) {
          const err = {
            data: {
              error: {
                message: `${
                  activity.type === TYPE_ACTIVITY.ACADEMICA
                    ? 'Atividade acadêmica'
                    : activity.type === TYPE_ACTIVITY.NON_ACADEMICA
                    ? 'Atividade não acadêmica'
                    : 'Atividade interna'
                } já cadastrada!`,
              },
            },
          };

          if (activity.id) {
            const othersActivitySavedByName =
              activitySavedByName?.value?.filter(
                (tg) => tg?.[`${PREFIX}atividadeid`] !== activity.id
              );

            if (othersActivitySavedByName.length) {
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
      }

      let dataToSave = buildItem(activity);

      if (activity.id) {
        const newSpaces = activity.spaces?.map((tag) => tag.value);
        for (let j = 0; j < activity.previousSpace.length; j++) {
          const rel = activity.previousSpace[j];

          if (!newSpaces?.includes(rel[`${PREFIX}espacoid`])) {
            await api({
              url: `${SPACE}(${
                rel[`${PREFIX}espacoid`]
              })/${PREFIX}Atividade_Espaco(${activity.id})/$ref`,
              method: 'DELETE',
            });
          }
        }
      }

      api({
        url: activity.id ? `${ACTIVITY}(${activity.id})` : `${ACTIVITY}`,
        method: activity?.id ? 'PATCH' : 'POST',
        headers: {
          Prefer: 'return=representation',
        },
        data: dataToSave,
      })
        .then(async ({ data }) => {
          if (activity?.spaces?.length) {
            for (let j = 0; j < activity.spaces.length; j++) {
              const rel = activity.spaces[j];

              await api({
                url: `${ACTIVITY}(${
                  data?.[`${PREFIX}atividadeid`]
                })/${PREFIX}Atividade_Espaco/$ref`,
                method: 'PUT',
                data: {
                  '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                  '@odata.id': `${SPACE}(${rel.value})`,
                },
              });
            }
          }

          const newActv: any = await getActivity(
            data?.[`${PREFIX}atividadeid`]
          );

          onSuccess?.(newActv?.value?.[0]);
          resolve(data);
        })
        .catch(({ response }) => {
          onError?.(response);
          reject(response);
        });
    });
  };

export const updateActivityAll =
  (activity, { onSuccess, onError }): any =>
  (dispatch: Dispatch<any>, getState: () => AppState) =>
    new Promise(async (resolve, reject) => {
      try {
        if (
          activity.typeApplication === EActivityTypeApplication.PLANEJAMENTO
        ) {
          const activitySavedByName: any = await getActivityByName(
            activity.name,
            activity.type
          );

          if (activitySavedByName?.value?.length) {
            const err = {
              data: {
                error: {
                  message: `${
                    activity.type === TYPE_ACTIVITY.ACADEMICA
                      ? 'Atividade acadêmica'
                      : activity.type === TYPE_ACTIVITY.NON_ACADEMICA
                      ? 'Atividade não acadêmica'
                      : 'Atividade interna'
                  } já cadastrada!`,
                },
              },
            };

            if (activity.id) {
              const othersActivitySavedByName =
                activitySavedByName?.value?.filter(
                  (tg) => tg?.[`${PREFIX}atividadeid`] !== activity.id
                );

              if (othersActivitySavedByName.length) {
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
        }

        let dataToSave = buildItem(activity);
        const batch = new BatchMultidata(api);

        let activityId = activity?.[`${PREFIX}atividadeid`];

        if (activityId) {
          const activityRequest = await getActivity(activityId);
          const actvSaved = activityRequest?.value?.[0];
          const { currentUser } = getState().app;

          if (
            actvSaved?.[`_${PREFIX}editanto_value`] &&
            activity.typeApplication === EActivityTypeApplication.APLICACAO &&
            actvSaved?.[`_${PREFIX}editanto_value`] !==
              currentUser?.[`${PREFIX}pessoaid`]
          ) {
            const err = {
              data: {
                error: {
                  message: `Outra pessoa está editando esta atividade!`,
                },
              },
            };

            reject(err);
            onError?.(err, actvSaved);
            return;
          }

          batch.patch(ACTIVITY, activity?.[`${PREFIX}atividadeid`], dataToSave);
        } else {
          const response = await api({
            url: ACTIVITY,
            method: 'POST',
            headers: {
              Prefer: 'return=representation',
            },
            data: dataToSave,
          });

          activityId = response.data?.[`${PREFIX}atividadeid`];
        }

        batch.bulkPostRelationship(
          ACTIVITY_ENVOLVED_PEOPLE,
          ACTIVITY,
          activityId,
          'Atividade_PessoasEnvolvidas',
          activity?.people?.map((pe) => buildItemPeople(pe))
        );

        batch.bulkPostReferenceRelatioship(
          ACTIVITY,
          SPACE,
          activityId,
          'Atividade_Espaco',
          activity?.spaces?.map((spc) => spc?.[`${PREFIX}espacoid`])
        );

        batch.bulkDeleteReferenceParent(
          ACTIVITY,
          activity?.spacesToDelete?.map((spc) => spc?.[`${PREFIX}espacoid`]),
          activityId,
          'Atividade_Espaco'
        );

        if (activity?.scheduleId) {
          batch.bulkPostReferenceRelatioship(
            ACTIVITY,
            SCHEDULE_DAY,
            activityId,
            'CronogramadeDia_Atividade',
            [activity?.scheduleId]
          );
        }

        batch.bulkDeleteReferenceParent(
          ACTIVITY,
          activity?.spacesToDelete?.map((spc) => spc?.[`${PREFIX}espacoid`]),
          activityId,
          'Atividade_Espaco'
        );

        batch.bulkPostRelationship(
          ACTIVITY_NAME,
          ACTIVITY,
          activityId,
          'Atividade_NomeAtividade',
          activity?.names?.map((name) => buildItemFantasyName(name))
        );

        batch.bulkPostRelationship(
          ACTIVITY_DOCUMENTS,
          ACTIVITY,
          activityId,
          'Atividade_Documento',
          activity?.documents
            ?.filter((e) => !(!e.id && e.deleted))
            ?.map((pe) => buildItemDocument(pe))
        );

        activity?.academicRequests?.forEach((academicRequest) => {
          const academicRequestId = academicRequest.id;

          const academicRequestToSave = buildItemAcademicRequest({
            ...academicRequest,
            teamId: activity?.teamId,
            scheduleId: activity?.scheduleId,
          });

          const academicRequestRefId = batch.postRelationship(
            ACADEMIC_REQUESTS,
            ACTIVITY,
            activityId,
            'RequisicaoAcademica_Atividade',
            academicRequestToSave
          );

          batch.bulkPostReference(
            TAG,
            academicRequest?.equipments?.map(
              (spc) => spc?.[`${PREFIX}etiquetaid`]
            ),
            academicRequestRefId,
            'Equipamentos'
          );

          batch.bulkPostReference(
            FINITE_INFINITE_RESOURCES,
            academicRequest?.finiteResource?.map(
              (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
            ),
            academicRequestRefId,
            'RequisicaoAcademica_Recurso'
          );

          batch.bulkPostReference(
            FINITE_INFINITE_RESOURCES,
            academicRequest?.infiniteResource?.map(
              (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
            ),
            academicRequestRefId,
            'RequisicaoAcademica_Recurso'
          );

          if (academicRequestId) {
            batch.bulkDeleteReference(
              TAG,
              academicRequest?.equipmentsToDelete?.map(
                (spc) => spc?.[`${PREFIX}etiquetaid`]
              ),
              academicRequestId,
              'Equipamentos'
            );

            batch.bulkDeleteReference(
              FINITE_INFINITE_RESOURCES,
              academicRequest?.finiteResourceToDelete?.map(
                (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
              ),
              academicRequestId,
              'RequisicaoAcademica_Recurso'
            );

            batch.bulkDeleteReference(
              FINITE_INFINITE_RESOURCES,
              academicRequest?.infiniteResourceToDelete?.map(
                (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
              ),
              academicRequestId,
              'RequisicaoAcademica_Recurso'
            );
          }

          if (!academicRequest.deleted) {
            batch.bulkPostRelationshipReference(
              ACADEMIC_REQUESTS_ENVOLVED_PEOPLE,
              academicRequestRefId,
              'Requisicao_PessoasEnvolvidas',
              academicRequest?.people
                ?.filter((e) => !(!e.id && e.deleted))
                ?.map((pe) =>
                  buildItemPeopleAcademicRequest({
                    ...pe,
                    activityId,
                  })
                )
            );
          }

          if (
            !academicRequest.deleted &&
            !academicRequest.id &&
            activity.typeApplication === EActivityTypeApplication.APLICACAO
          ) {
            const responsible = [];
            const group = [];

            academicRequest?.people?.forEach((e) => {
              if (e.person) {
                responsible.push(e.person);
              } else {
                group.push(e.function);
              }
            });

            dispatch(
              addOrUpdateTask(
                {
                  title: academicRequest.description,
                  type: TYPE_TASK.REQUISICAO_ACADEMICA,
                  responsible: responsible,
                  group: group?.[0],
                  completionForecast: academicRequest.deliveryDate
                    ? academicRequest.deliveryDate
                    : moment().add('d', academicRequest.deadline),
                  programId: activity?.programId,
                  teamId: activity?.teamId,
                  activityId: activityId,
                },
                {
                  onSuccess: () => null,
                  onError: () => null,
                }
              )
            );
          }
        });

        activity?.activities?.forEach((elm) => {
          batch.patch(ACTIVITY, elm?.id, buildItem(elm));
        });

        await batch.execute();
        let actv: any = await getActivity(activityId);

        const { tag, environmentReference } = getState();
        const { dictTag } = tag;
        const { references } = environmentReference;

        await addOrUpdateByActivities(
          actv?.value,
          { dictTag, references },
          {
            activityId: activityId,
          },
          {
            type: TypeBlockUpdated.Atividade,
            id: activityId,
          }
        );

        resolve('Success');
        onSuccess?.(actv?.value?.[0]);
      } catch (err) {
        onError?.(err);
        reject(err);
      }
    });

export const batchUpdateActivityAll =
  (
    activities,
    activityRef,
    { programId, teamId, scheduleId },
    { onSuccess, onError }
  ): any =>
  (dispatch: Dispatch<any>, getState: () => AppState) =>
    new Promise(async (resolve, reject) => {
      try {
        const batch = new BatchMultidata(api);
        const activityRefId =
          activityRef?.id || activityRef?.[`${PREFIX}atividadeid`];

        const activityRequest = await getActivity(activityRefId);
        const actvSaved = activityRequest?.value?.[0];
        const { currentUser } = getState().app;

        if (
          actvSaved?.[`_${PREFIX}editanto_value`] &&
          activityRef.typeApplication === EActivityTypeApplication.APLICACAO &&
          actvSaved?.[`_${PREFIX}editanto_value`] !==
            currentUser?.[`${PREFIX}pessoaid`]
        ) {
          const err = {
            data: {
              error: {
                message: `Outra pessoa está editando esta atividade!`,
              },
            },
          };

          reject(err);
          onError?.(err, actvSaved);
          return;
        }

        activities?.forEach(async (activity) => {
          let dataToSave = buildItem(activity);

          let activityId = activity?.[`${PREFIX}atividadeid`];

          if (activityId) {
            batch.patch(
              ACTIVITY,
              activity?.[`${PREFIX}atividadeid`],
              dataToSave
            );
          } else {
            const response = await api({
              url: ACTIVITY,
              method: 'POST',
              headers: {
                Prefer: 'return=representation',
              },
              data: dataToSave,
            });

            activityId = response.data?.[`${PREFIX}atividadeid`];
          }

          batch.bulkPostRelationship(
            ACTIVITY_ENVOLVED_PEOPLE,
            ACTIVITY,
            activityId,
            'Atividade_PessoasEnvolvidas',
            activity?.people?.map((pe) => buildItemPeople(pe))
          );

          batch.bulkPostReferenceRelatioship(
            ACTIVITY,
            SPACE,
            activityId,
            'Atividade_Espaco',
            activity?.spaces?.map((spc) => spc?.[`${PREFIX}espacoid`])
          );

          if (activity?.scheduleId) {
            batch.bulkPostReferenceRelatioship(
              ACTIVITY,
              SCHEDULE_DAY,
              activityId,
              'CronogramadeDia_Atividade',
              [activity?.scheduleId]
            );
          }

          batch.bulkDeleteReferenceParent(
            ACTIVITY,
            activity?.spacesToDelete?.map((spc) => spc?.[`${PREFIX}espacoid`]),
            activityId,
            'Atividade_Espaco'
          );

          batch.bulkPostRelationship(
            ACTIVITY_NAME,
            ACTIVITY,
            activityId,
            'Atividade_NomeAtividade',
            activity?.names?.map((name) => buildItemFantasyName(name))
          );

          batch.bulkPostRelationship(
            ACTIVITY_DOCUMENTS,
            ACTIVITY,
            activityId,
            'Atividade_Documento',
            activity?.documents
              ?.filter((e) => !(!e.id && e.deleted))
              ?.map((pe) => buildItemDocument(pe))
          );

          activity?.academicRequests?.forEach((academicRequest) => {
            const academicRequestId = academicRequest.id;

            const academicRequestToSave = buildItemAcademicRequest({
              ...academicRequest,
              teamId: activity?.teamId,
              scheduleId: activity?.scheduleId,
            });

            const academicRequestRefId = batch.postRelationship(
              ACADEMIC_REQUESTS,
              ACTIVITY,
              activityId,
              'RequisicaoAcademica_Atividade',
              academicRequestToSave
            );

            batch.bulkPostReference(
              TAG,
              academicRequest?.equipments?.map(
                (spc) => spc?.[`${PREFIX}etiquetaid`]
              ),
              academicRequestRefId,
              'Equipamentos'
            );

            batch.bulkPostReference(
              FINITE_INFINITE_RESOURCES,
              academicRequest?.finiteResource?.map(
                (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
              ),
              academicRequestRefId,
              'RequisicaoAcademica_Recurso'
            );

            batch.bulkPostReference(
              FINITE_INFINITE_RESOURCES,
              academicRequest?.infiniteResource?.map(
                (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
              ),
              academicRequestRefId,
              'RequisicaoAcademica_Recurso'
            );

            if (academicRequestId) {
              batch.bulkDeleteReference(
                TAG,
                academicRequest?.equipmentsToDelete?.map(
                  (spc) => spc?.[`${PREFIX}etiquetaid`]
                ),
                academicRequestId,
                'Equipamentos'
              );

              batch.bulkDeleteReference(
                FINITE_INFINITE_RESOURCES,
                academicRequest?.finiteResourceToDelete?.map(
                  (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
                ),
                academicRequestId,
                'RequisicaoAcademica_Recurso'
              );

              batch.bulkDeleteReference(
                FINITE_INFINITE_RESOURCES,
                academicRequest?.infiniteResourceToDelete?.map(
                  (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
                ),
                academicRequestId,
                'RequisicaoAcademica_Recurso'
              );
            }

            if (!academicRequest.deleted) {
              batch.bulkPostRelationshipReference(
                ACADEMIC_REQUESTS_ENVOLVED_PEOPLE,
                academicRequestRefId,
                'Requisicao_PessoasEnvolvidas',
                academicRequest?.people
                  ?.filter((e) => !(!e.id && e.deleted))
                  ?.map((pe) =>
                    buildItemPeopleAcademicRequest({
                      ...pe,
                      activityId,
                    })
                  )
              );
            }

            if (
              !academicRequest.deleted &&
              !academicRequest.id &&
              activity.typeApplication === EActivityTypeApplication.APLICACAO
            ) {
              const responsible = [];
              const group = [];

              academicRequest?.people?.forEach((e) => {
                if (e.person) {
                  responsible.push(e.person);
                } else {
                  group.push(e.function);
                }
              });

              dispatch(
                addOrUpdateTask(
                  {
                    title: academicRequest.description,
                    type: TYPE_TASK.REQUISICAO_ACADEMICA,
                    responsible: responsible,
                    group: group?.[0],
                    completionForecast: academicRequest.deliveryDate
                      ? academicRequest.deliveryDate
                      : moment().add('d', academicRequest.deadline),
                    programId: activity?.programId,
                    teamId: activity?.teamId,
                    activityId: activityId,
                  },
                  {
                    onSuccess: () => null,
                    onError: () => null,
                  }
                )
              );
            }
          });

          activity?.activities?.forEach((elm) => {
            batch.patch(ACTIVITY, elm?.id, buildItem(elm));
          });
        });

        await batch.execute();

        if (
          activityRef?.[`${PREFIX}tipoaplicacao`] ===
          EActivityTypeApplication.APLICACAO
        ) {
          const { tag, environmentReference } = getState();
          const { dictTag } = tag;
          const { references } = environmentReference;
          const responseActivities = await getActivityByScheduleId(scheduleId);
          const activities = responseActivities?.value?.map((e) => ({
            ...e,
            teamId,
            programId,
            scheduleId,
          }));

          await addOrUpdateByActivities(
            activities,
            { dictTag, references },
            {
              scheduleId,
            },
            {
              type: TypeBlockUpdated.DiaAula,
              id: scheduleId,
            }
          );
        }

        let actv: any = await getActivity(activityRefId);

        resolve('Success');
        onSuccess?.(actv?.value?.[0]);
      } catch (err) {
        onError?.(err);
        reject(err);
      }
    });

export const updateActivity = (id, toSave, { onSuccess, onError }) => {
  return new Promise(async (resolve, reject) => {
    const batch = new BatchMultidata(api);

    batch.patch(ACTIVITY, id, toSave);

    try {
      await batch.execute();

      const activity: any = await getActivity(id);
      resolve(activity?.value?.[0]);
      onSuccess?.(activity?.value?.[0]);
    } catch (err) {
      console.error(err);
      reject?.(err);
      onError?.(err);
    }
  });
};

export const batchUpdateActivity = (activities, { onSuccess, onError }) => {
  return new Promise(async (resolve, reject) => {
    const batch = new BatchMultidata(api);

    activities.forEach((elm) => {
      batch.patch(ACTIVITY, elm.id, elm.data);
    });

    try {
      await batch.execute();

      resolve('Sucesso');
      onSuccess?.('Sucesso');
    } catch (err) {
      console.error(err);
      reject?.(err);
      onError?.(err);
    }
  });
};

export const updateEnvolvedPerson = (
  id,
  activityId,
  toSave,
  { onSuccess, onError }
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const batch = new BatchMultidata(api);

    batch.patch(ACTIVITY_ENVOLVED_PEOPLE, id, toSave);

    try {
      await batch.execute();

      const activity: any = await getActivity(activityId);
      resolve(activity?.value?.[0]);
      onSuccess?.(activity?.value?.[0]);
    } catch (err) {
      reject?.(err);
      onError?.(err);
    }
  });
};

export const deleteActivity =
  (item, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>, getState: () => AppState) => {
    api({
      url: `${ACTIVITY}(${item?.id})`,
      method: 'PATCH',
      data: {
        [`${PREFIX}excluido`]: true,
        [`${PREFIX}ativo`]: false,
      },
    })
      .then(async () => {
        const { environmentReference, space, person } = getState();
        const { dictSpace } = space;
        const { dictPeople } = person;
        const { references } = environmentReference;
        const eventsToDelete = [];

        item?.activity?.[`${PREFIX}recursos_Atividade`].forEach(
          (resourceToDelete) => {
            const spaceid = resourceToDelete?.[`_${PREFIX}espaco_value`];
            const personid = resourceToDelete?.[`_${PREFIX}pessoa_value`];

            eventsToDelete.push({
              action: ACTION_DELETE,
              title: item?.activity?.[`${PREFIX}nome`],
              activity: item.activity,
              email:
                dictSpace?.[spaceid]?.[`${PREFIX}email`] ||
                dictPeople?.[personid]?.[`${PREFIX}email`],
              start: moment(resourceToDelete?.[`${PREFIX}inicio`]).format(),
              end: moment(resourceToDelete?.[`${PREFIX}fim`]).format(),
              resourceId: resourceToDelete?.[`${PREFIX}recursosid`],
              eventId: resourceToDelete?.[`${PREFIX}eventoid`],
            });
          }
        );

        await executeEventDeleteOutlook(
          { id: item?.id, type: TypeBlockUpdated.Atividade },
          {
            onSuccess: () => {
              onSuccess?.();
            },
            onError: () => null,
          }
        );
      })
      .catch(({ response }) => {
        onError?.(response);
      });
  };

export const changeActivityDate =
  (activity, previousSchedule, newSchedule, { onSuccess, onError }): any =>
  (dispatch: Dispatch<any>, getState: () => AppState) => {
    return new Promise(async (resolve, reject) => {
      try {
        let dataToSave = buildItem(activity);
        const batch = new BatchMultidata(api);

        const requestId = batch.patch(
          ACTIVITY,
          activity?.[`${PREFIX}atividadeid`],
          {
            ...dataToSave,
            [`${PREFIX}CronogramaDia@odata.bind`]: `/${SCHEDULE_DAY}(${newSchedule})`,
          }
        );

        batch.deleteReference(
          ACTIVITY,
          activity?.[`${PREFIX}atividadeid`],
          previousSchedule,
          'CronogramadeDia_Atividade'
        );

        batch.addReference(
          SCHEDULE_DAY,
          requestId,
          newSchedule,
          'CronogramadeDia_Atividade'
        );

        await batch.execute();

        if (
          activity?.[`${PREFIX}tipoaplicacao`] ===
          EActivityTypeApplication.APLICACAO
        ) {
          const { tag, environmentReference } = getState();
          const { dictTag } = tag;
          const { references } = environmentReference;
          const responseActivities = await getActivityByScheduleId(newSchedule);
          const activities = responseActivities?.value?.map((e) => ({
            ...e,
            programId: activity?.[`_${PREFIX}_programa_value`],
            teamId: activity?.[`_${PREFIX}turma_value`],
            scheduleId: newSchedule,
          }));

          await addOrUpdateByActivities(
            activities,
            { dictTag, references },
            {
              scheduleId: newSchedule,
            },
            {
              type: TypeBlockUpdated.DiaAula,
              id: newSchedule,
            }
          );
        }

        resolve('Success');
        onSuccess?.();
      } catch (err) {
        onError?.(err);
        reject(err);
      }
    });
  };

export const addOrUpdateClassroom = async (
  activity,
  { onSuccess, onError },
  returnNewValue: boolean = true
) => {
  return new Promise(async (resolve, reject) => {
    const dataToUpdate = {
      [`${PREFIX}temaaula`]: activity.theme,
      [`${PREFIX}descricaoobjetivo`]: activity.description,
    };

    const batch = new BatchMultidata(api);
    const requestId = batch.patch(ACTIVITY, activity?.id, dataToUpdate);

    batch.bulkPostReference(
      TAG,
      activity?.equipments?.map((spc) => spc?.[`${PREFIX}etiquetaid`]),
      requestId,
      'Atividade_Equipamentos'
    );

    batch.bulkPostReference(
      FINITE_INFINITE_RESOURCES,
      activity?.finiteResource?.map(
        (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
      ),
      requestId,
      'Atividade_RecursoFinitoInfinito'
    );

    batch.bulkPostReference(
      FINITE_INFINITE_RESOURCES,
      activity?.infiniteResource?.map(
        (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
      ),
      requestId,
      'Atividade_RecursoFinitoInfinito'
    );

    batch.bulkDeleteReference(
      TAG,
      activity?.equipmentsToDelete?.map((spc) => spc?.[`${PREFIX}etiquetaid`]),
      activity?.id,
      'Atividade_Equipamentos'
    );

    batch.bulkDeleteReferenceParent(
      ACTIVITY,
      activity?.finiteInfiniteResourceToDelete?.map(
        (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
      ),
      activity?.id,
      'Atividade_RecursoFinitoInfinito'
    );

    await batch.execute();

    if (returnNewValue) {
      const newActv: any = await getActivity(activity.id);

      onSuccess?.(newActv?.value?.[0]);
    }

    resolve('Success');
  });
};

export const addOrUpdateDocuments = async (
  activity,
  { onSuccess, onError },
  returnNewValue: boolean = true
) => {
  return new Promise(async (resolve, reject) => {
    const tagNames = [];

    try {
      if (activity?.documents?.length) {
        for (let i = 0; i < activity.documents.length; i++) {
          const tagName = activity.documents[i];

          const { data } = await api({
            url: tagName?.id
              ? `${ACTIVITY_DOCUMENTS}(${tagName?.id})?$select=${PREFIX}documentosatividadeid`
              : `${ACTIVITY_DOCUMENTS}?$select=${PREFIX}documentosatividadeid`,
            method: tagName?.id ? 'PATCH' : 'POST',
            headers: {
              Prefer: 'return=representation',
            },
            data: {
              [`${PREFIX}fonte`]: tagName.font,
              [`${PREFIX}link`]: tagName.link,
              [`${PREFIX}entrega`]: tagName.delivery,
              [`${PREFIX}nome`]: tagName.name,
            },
          });

          if (!tagName?.id) {
            tagNames.push(
              `${ACTIVITY_DOCUMENTS}(${
                data?.[`${PREFIX}documentosatividadeid`]
              })`
            );
          }
        }
      }

      if (activity.id) {
        for (let j = 0; j < activity.previousDocuments?.length; j++) {
          const rel = activity.previousDocuments[j];
          const newNames = activity.documents.map((e) => e.id).filter((e) => e);

          if (!newNames?.includes(rel[`${PREFIX}documentosatividadeid`])) {
            await api({
              url: `${ACTIVITY_DOCUMENTS}(${
                rel[`${PREFIX}documentosatividadeid`]
              })`,
              method: 'DELETE',
            });
          }
        }
      }

      for (let j = 0; j < tagNames?.length; j++) {
        const rel = tagNames[j];

        await api({
          url: `${ACTIVITY}(${activity?.id})/${PREFIX}Atividade_Documento/$ref`,
          method: 'PUT',
          data: {
            '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
            '@odata.id': rel,
          },
        });
      }

      if (returnNewValue) {
        const newActv: any = await getActivity(activity.id);

        onSuccess?.(newActv?.value?.[0]);
      }

      resolve('Success');
    } catch (error) {
      onError?.(error);
      reject(error);
    }
  });
};

export const addOrUpdatePerson = async (
  activity,
  { onSuccess, onError },
  returnNewValue: boolean = true
) => {
  return new Promise(async (resolve, reject) => {
    const tagNames = [];

    try {
      if (activity?.people?.length) {
        for (let i = 0; i < activity.people.length; i++) {
          const tagName = activity.people[i];

          const { data } = await api({
            url: tagName?.id
              ? `${ACTIVITY_ENVOLVED_PEOPLE}(${tagName?.id})?$select=${PREFIX}pessoasenvolvidasatividadeid`
              : `${ACTIVITY_ENVOLVED_PEOPLE}?$select=${PREFIX}pessoasenvolvidasatividadeid`,
            method: tagName?.id ? 'PATCH' : 'POST',
            headers: {
              Prefer: 'return=representation',
            },
            data: {
              [`${PREFIX}Pessoa@odata.bind`]: `/${PERSON}(${
                tagName?.person?.value || tagName?.[`_${PREFIX}pessoa_value`]
              })`,
              [`${PREFIX}Funcao@odata.bind`]: `/${TAG}(${
                tagName?.function?.value || tagName?.[`_${PREFIX}funcao_value`]
              })`,
            },
          });

          if (!tagName?.id) {
            tagNames.push(
              `${ACTIVITY_ENVOLVED_PEOPLE}(${
                data?.[`${PREFIX}pessoasenvolvidasatividadeid`]
              })`
            );
          }
        }
      }

      if (activity.id) {
        for (let j = 0; j < activity.previousPeople?.length; j++) {
          const rel = activity.previousPeople[j];
          const newNames = activity.people.map((e) => e.id).filter((e) => e);

          if (
            !newNames?.includes(rel[`${PREFIX}pessoasenvolvidasatividadeid`])
          ) {
            await api({
              url: `${ACTIVITY_ENVOLVED_PEOPLE}(${
                rel[`${PREFIX}pessoasenvolvidasatividadeid`]
              })`,
              method: 'DELETE',
            });
          }
        }
      }

      for (let j = 0; j < tagNames.length; j++) {
        const rel = tagNames[j];

        await api({
          url: `${ACTIVITY}(${activity?.id})/${PREFIX}Atividade_PessoasEnvolvidas/$ref`,
          method: 'PUT',
          data: {
            '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
            '@odata.id': rel,
          },
        });
      }

      if (returnNewValue) {
        const newActv: any = await getActivity(activity.id);
        onSuccess?.(newActv?.value?.[0]);
      }

      resolve('Success');
    } catch (error) {
      onError?.(error);
      reject(error);
    }
  });
};

export const addOrUpdateObservation = (activity, { onSuccess, onError }) => {
  return new Promise(async (resolve, reject) => {
    api({
      url: `${ACTIVITY}(${activity.id})`,
      method: 'PATCH',
      headers: {
        Prefer: 'return=representation',
      },
      data: {
        [`${PREFIX}observacao`]: activity.description,
      },
    })
      .then(async () => {
        const newActv: any = await getActivity(activity.id);

        onSuccess?.(newActv?.value?.[0]);
        resolve('Success');
      })
      .catch(({ response }) => {
        onError?.(response);
      });
  });
};

export const addOrUpdateFantasyName = async (
  activity,
  { onSuccess, onError },
  returnNewValue: boolean = true
) => {
  return new Promise(async (resolve, reject) => {
    const tagNames = [];

    try {
      if (activity?.names?.length) {
        for (let i = 0; i < activity.names.length; i++) {
          const tagName = activity.names[i];

          const { data } = await api({
            url: tagName?.id
              ? `${ACTIVITY_NAME}(${tagName?.id})`
              : `${ACTIVITY_NAME}`,
            method: tagName?.id ? 'PATCH' : 'POST',
            headers: {
              Prefer: 'return=representation',
            },
            data: {
              [`${PREFIX}nome`]: tagName.name,
              [`${PREFIX}nomeen`]: tagName.nameEn,
              [`${PREFIX}nomees`]: tagName.nameEs,
              [`${PREFIX}uso`]: tagName.use,
            },
          });

          if (!tagName?.id) {
            tagNames.push(
              `${ACTIVITY_NAME}(${data?.[`${PREFIX}nomeatividadeid`]})`
            );
          }
        }
      }

      if (activity.id) {
        for (let j = 0; j < activity.previousNames?.length; j++) {
          const rel = activity.previousNames[j];
          const newNames = activity.names.map((e) => e.id).filter((e) => e);

          if (!newNames?.includes(rel[`${PREFIX}nomeatividadeid`])) {
            await api({
              url: `${ACTIVITY_NAME}(${rel[`${PREFIX}nomeatividadeid`]})`,
              method: 'DELETE',
            });
          }
        }
      }

      for (let j = 0; j < tagNames?.length; j++) {
        const rel = tagNames[j];

        await api({
          url: `${ACTIVITY}(${activity?.id})/${PREFIX}Atividade_NomeAtividade/$ref`,
          method: 'PUT',
          data: {
            '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
            '@odata.id': rel,
          },
        });
      }

      if (returnNewValue) {
        const newActv: any = await getActivity(activity.id);

        onSuccess?.(newActv?.value?.[0]);
      }
      resolve('Success');
    } catch (error) {
      onError?.(error);
      reject(error);
    }
  });
};

export const desactiveActivity =
  (activity, { onSuccess, onError }): any =>
  (dispatch: Dispatch<any>) => {
    new Promise(async (resolve, reject) => {
      try {
        let data = {
          [`${PREFIX}tipodesativacao`]: activity.type,
        };

        if (activity.type === 'definitivo') {
          data[`${PREFIX}ativo`] = false;
        }

        if (activity.type === 'temporario') {
          if (
            moment()
              .startOf('day')
              .isSame(moment(activity.start.toISOString()).startOf('day'))
          ) {
            data[`${PREFIX}ativo`] = false;
          }

          data[`${PREFIX}iniciodesativacao`] = activity.start
            .startOf('day')
            .toISOString();
          data[`${PREFIX}fimdesativacao`] = activity.end
            .startOf('day')
            .toISOString();
        }

        api({
          url: `${ACTIVITY}(${activity?.data?.[`${PREFIX}atividadeid`]})`,
          method: 'PATCH',
          data,
        })
          .then(({ data }) => {
            if (
              activity?.data?.[`${PREFIX}tipoaplicacao`] !==
              EActivityTypeApplication.PLANEJAMENTO
            ) {
              dispatch(
                deleteByActivity(activity?.data?.[`${PREFIX}atividadeid`])
              );
            }
            onSuccess?.();
            resolve(data);
          })
          .catch(({ response }) => {
            onError?.(response);
            reject(response);
          });
      } catch (error) {
        reject(error);
      }
    });
  };

export const activeActivity = (activity, { onSuccess, onError }) => {
  api({
    url: `${ACTIVITY}(${activity?.[`${PREFIX}atividadeid`]})`,
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

export const bulkUpdateActivity = async (toUpdate, { onSuccess, onError }) => {
  try {
    for (let i = 0; i < toUpdate.data.length; i++) {
      const activity = toUpdate.data[i];
      await api({
        url: `${ACTIVITY}(${activity?.[`${PREFIX}atividadeid`]})`,
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
