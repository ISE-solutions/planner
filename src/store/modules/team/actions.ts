import api from '~/services/api';
import {
  ACADEMIC_REQUESTS,
  ACADEMIC_REQUESTS_ENVOLVED_PEOPLE,
  ACTIVITY,
  ACTIVITY_DOCUMENTS,
  ACTIVITY_ENVOLVED_PEOPLE,
  ACTIVITY_NAME,
  FINITE_INFINITE_RESOURCES,
  PREFIX,
  PROGRAM,
  SCHEDULE_DAY,
  SCHEDULE_DAY_ENVOLVED_PEOPLE,
  SPACE,
  TAG,
  TEAM,
  TEAM_ENVOLVED_PEOPLE,
  TEAM_NAME,
  TEAM_PARTICIPANTS,
} from '~/config/database';
import {
  buildAdvancedQuery,
  buildItem,
  buildItemAcademicRequest,
  buildItemActivity,
  buildItemDocument,
  buildItemFantasyName,
  buildItemParticipant,
  buildItemPeople,
  buildItemPeopleAcademicRequest,
  buildItemPeopleTeam,
  buildItemSchedule,
  buildQuery,
  IFilterProps,
} from './utils';
import { Dispatch } from 'redux';
import { EActionType } from './types';
import { setValue } from '../common';
import BatchMultidata from '~/utils/BatchMultidata';
import * as moment from 'moment';
import { createFolder, deleteFiles, uploadFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import {
  ACTION_DELETE,
  BASE_URL_API_NET,
  BUSINESS_UNITY,
  ENV,
  REFERENCE_DELETE,
  TypeBlockUpdated,
} from '~/config/constants';
import { AppState } from '~/store';
import { QueryBuilder } from 'odata-query-builder';
import {
  EActivityTypeApplication,
  EFatherTag,
  PRIORITY_TASK,
  STATUS_TASK,
  TYPE_TASK,
} from '~/config/enums';
import { addOrUpdateTask, filterTask } from '../task/actions';
import {
  addOrUpdateByActivities,
  deleteByActivities,
} from '../resource/actions';
import { getActivities, getActivityByTeamId } from '../activity/actions';
import { executeEventDeleteOutlook } from '../eventOutlook/actions';
import replaceSpecialCharacters from '~/utils/replaceSpecialCharacters';

export const fetchAllTeams =
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
      const { data } = await api.get(`${TEAM}${query}`, {
        headers,
      });

      dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, data?.value));
    } catch (error) {
      console.error(error);
      // handle your error
    }
  };

export const fetchAdvancedTeams = (filter: string): any =>
  new Promise(async (resolve, reject) => {
    try {
      let axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await api.post(
        `${BASE_URL_API_NET}Turma`,
        { queryString: filter || '', ev: ENV },
        axiosConfig
      );

      resolve(data);
    } catch (error) {
      console.error(error);
    }
  });

export const getTeams = (filter: IFilterProps): any =>
  new Promise(async (resolve, reject) => {
    try {
      const query = buildQuery(filter);
      let headers = {};

      if (filter.rowsPerPage) {
        headers = {
          Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
      }
      const { data } = await api.get(`${TEAM}${query}`, {
        headers,
      });

      resolve(data?.value);
    } catch (error) {
      console.error(error);
    }
  });

export const getTeamById = (teamId): Promise<any> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) =>
      f.filterExpression(`${PREFIX}turmaid`, 'eq', teamId)
    );

    query.expand(
      `${PREFIX}Programa,${PREFIX}Turma_NomeTurma,${PREFIX}Temperatura,${PREFIX}Modalidade,${PREFIX}Turma_PessoasEnvolvidasTurma,${PREFIX}Turma_NomeTurma,${PREFIX}Turma_ParticipantesTurma,${PREFIX}CronogramadeDia_Turma,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}Turma_Compartilhamento`
    );

    api({
      url: `${TEAM}${query.toQuery()}`,
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

export const getTeamByIds = (teamIds: string[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!teamIds?.length) {
      resolve([]);
      return;
    }

    var query = new QueryBuilder().filter((f) => {
      f.or((p) => {
        teamIds.forEach((id) =>
          p.filterExpression(`${PREFIX}turmaid`, 'eq', id)
        );

        return p;
      });

      return f;
    });

    query.expand(
      `${PREFIX}Programa,${PREFIX}Turma_NomeTurma,${PREFIX}Temperatura,${PREFIX}Modalidade,${PREFIX}Turma_PessoasEnvolvidasTurma,${PREFIX}Turma_NomeTurma,${PREFIX}Turma_ParticipantesTurma,${PREFIX}CronogramadeDia_Turma,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}Turma_Compartilhamento`
    );

    api({
      url: `${TEAM}${query.toQuery()}`,
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

export const getTeamByNameAndProgram = (name, programId) => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      f.filterExpression(
        `${PREFIX}nome`,
        'eq',
        `${replaceSpecialCharacters(name)}`
      );

      if (programId) {
        f.filterExpression(
          `${PREFIX}Programa/${PREFIX}programaid`,
          'eq',
          programId
        );
      }

      f.filterExpression(`${PREFIX}modelo`, 'eq', false);
      f.filterExpression(`${PREFIX}ativo`, 'eq', true);
      f.filterExpression(`${PREFIX}excluido`, 'eq', false);

      return f;
    });

    query.count();
    api({
      url: `${TEAM}${query.toQuery()}`,
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

export const addOrUpdateTeam =
  (
    team,
    programId,
    { onSuccess, onError },
    temperatureChanged?: boolean,
    isUndo?: boolean
  ): any =>
  async (dispatch: Dispatch<any>, getState: () => AppState) => {
    return new Promise(async (resolve, reject) => {
      const dataToSave: any = buildItem(team);
      let teamId = team?.id;
      let teamSaved;

      const teamSavedByName: any = await getTeamByNameAndProgram(
        team.name,
        team.programId
      );

      if (teamSavedByName?.value?.length) {
        const err = {
          data: {
            error: {
              message: 'Turma já cadastrada!',
            },
          },
        };

        if (teamId) {
          const othersTagsSabedByName = teamSavedByName?.value?.filter(
            (tg) => tg?.[`${PREFIX}turmaid`] !== teamId
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

      try {
        const batch = new BatchMultidata(api);

        if (teamId) {
          const teamRequest = await getTeamById(teamId);
          teamSaved = teamRequest?.value?.[0];

          const { currentUser } = getState().app;

          if (
            teamSaved?.[`_${PREFIX}editanto_value`] &&
            teamSaved?.[`_${PREFIX}editanto_value`] !==
              currentUser?.[`${PREFIX}pessoaid`]
          ) {
            const err = {
              data: {
                error: {
                  message: `Outra pessoa está editando esta turma!`,
                },
              },
            };

            reject(err);
            onError?.(err, teamSaved);
            return;
          }
        }

        if (teamId) {
          batch.patch(TEAM, teamId, dataToSave);
        } else {
          const response = await api({
            url: TEAM,
            method: 'POST',
            headers: {
              Prefer: 'return=representation',
            },
            data: dataToSave,
          });

          teamId = response.data?.[`${PREFIX}turmaid`];

          if (programId) {
            await api({
              url: `${TEAM}(${teamId})/${PREFIX}Programa/$ref`,
              method: 'PUT',
              data: {
                '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                '@odata.id': `${PROGRAM}(${programId})`,
              },
            });
          }
        }

        batch.bulkPostRelationship(
          TEAM_NAME,
          TEAM,
          teamId,
          'Turma_NomeTurma',
          team?.names?.map((name) => buildItemFantasyName(name))
        );

        batch.bulkPostRelationship(
          TEAM_ENVOLVED_PEOPLE,
          TEAM,
          teamId,
          'Turma_PessoasEnvolvidasTurma',
          team?.people
            ?.filter((e) => !(!e?.id && e.deleted))
            ?.map((name, i) => buildItemPeopleTeam(name, i))
        );

        batch.bulkPostRelationship(
          TEAM_PARTICIPANTS,
          TEAM,
          teamId,
          'Turma_ParticipantesTurma',
          team?.participants?.map((name) => buildItemParticipant(name))
        );

        // If there are schedules.
        if (team?.schedules?.length) {
          team.schedules.forEach((schedule) => {
            const requestId = batch.post(
              SCHEDULE_DAY,
              buildItemSchedule(schedule)
            );

            batch.putReference(requestId, TEAM, teamId, 'Turma');

            batch.bulkPostRelationshipReference(
              SCHEDULE_DAY_ENVOLVED_PEOPLE,
              requestId,
              'CronogramadeDia_PessoasEnvolvidas',
              schedule?.people
                ?.filter((e) => !(!e?.id && e.deleted))
                ?.map((pe) => buildItemPeople(pe))
            );

            schedule.activities.forEach((activity) => {
              const requestActivityId = batch.postRelationshipReference(
                ACTIVITY,
                requestId,
                'CronogramadeDia_Atividade',
                buildItemActivity({ ...activity, teamId: teamId })
              );

              batch.bulkPostRelationshipReference(
                ACTIVITY_ENVOLVED_PEOPLE,
                requestActivityId,
                'Atividade_PessoasEnvolvidas',
                activity?.people
                  ?.filter((e) => !!e.person && !(!e.id && e.deleted))
                  ?.map((pe) => buildItemPeople(pe))
              );

              batch.bulkPostRelationshipReference(
                ACTIVITY_DOCUMENTS,
                requestActivityId,
                'Atividade_Documento',
                activity?.documents
                  ?.filter((e) => !e.id && !e.deleted)
                  ?.map((pe) => buildItemDocument(pe))
              );

              batch.bulkPostReference(
                SPACE,
                activity?.spaces?.map((spc) => spc?.[`${PREFIX}espacoid`]),
                requestActivityId,
                'Atividade_Espaco'
              );

              batch.bulkPostReference(
                TAG,
                activity?.equipments?.map(
                  (spc) => spc?.[`${PREFIX}etiquetaid`]
                ),
                requestActivityId,
                'Atividade_Equipamentos'
              );

              batch.bulkPostReference(
                FINITE_INFINITE_RESOURCES,
                activity?.finiteResource?.map(
                  (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
                ),
                requestActivityId,
                'Atividade_RecursoFinitoInfinito'
              );

              batch.bulkDeleteReference(
                FINITE_INFINITE_RESOURCES,
                activity?.finiteResourceToDelete?.map(
                  (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
                ),
                activity?.id,
                'Atividade_RecursoFinitoInfinito'
              );

              batch.bulkPostReference(
                FINITE_INFINITE_RESOURCES,
                activity?.infiniteResource?.map(
                  (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
                ),
                requestActivityId,
                'Atividade_RecursoFinitoInfinito'
              );

              batch.bulkDeleteReference(
                FINITE_INFINITE_RESOURCES,
                activity?.infiniteResourceToDelete?.map(
                  (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
                ),
                requestActivityId,
                'Atividade_RecursoFinitoInfinito'
              );

              batch.bulkPostRelationshipReference(
                ACTIVITY_NAME,
                requestActivityId,
                'Atividade_NomeAtividade',
                activity?.names?.map((name) => buildItemFantasyName(name))
              );

              activity?.academicRequests?.forEach((academicRequest) => {
                const academicRequestToSave = buildItemAcademicRequest({
                  ...academicRequest,
                  teamId,
                });

                const academicRequestRefId = batch.postRelationshipReference(
                  ACADEMIC_REQUESTS,
                  requestActivityId,
                  'RequisicaoAcademica_Atividade',
                  academicRequestToSave
                );

                if (!academicRequest.deleted) {
                  batch.bulkPostRelationshipReference(
                    ACADEMIC_REQUESTS_ENVOLVED_PEOPLE,
                    academicRequestRefId,
                    'Requisicao_PessoasEnvolvidas',
                    academicRequest?.people
                      ?.filter((e) => !(!e?.id && e.deleted))
                      ?.map((pe) =>
                        buildItemPeopleAcademicRequest({
                          ...pe,
                          activityId: requestActivityId,
                        })
                      )
                  );
                }
              });
            });
          });
        }

        await batch.execute();
        const { app, tag, environmentReference } = getState();
        const { context } = app;
        const { dictTag } = tag;
        const { references } = environmentReference;

        if (
          !team.model &&
          team?.temperature?.[`${PREFIX}nome`] === EFatherTag.CONTRATADO
        ) {
          const task = await filterTask({
            teamId,
            sequence: 1,
          });

          if (!task?.length) {
            const programDirector = team.people.find(
              (e) =>
                e?.function?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_PROGRAMA
            ).person;

            const newTask = {
              title: `Montar Estrutura (Reservas)`,
              sequence: 1,
              programId,
              teamId,
              priority: PRIORITY_TASK.Baixa,
              status: STATUS_TASK['Não Iniciada'],
              type: TYPE_TASK.CONSTRUCAO_BLOCO,
              responsible: [programDirector],
            };

            await dispatch(
              addOrUpdateTask(newTask, {
                onSuccess: () => null,
                onError: () => null,
              })
            );
          }
        }

        const activities = await getActivities({
          teamId,
          typeApplication: EActivityTypeApplication.APLICACAO,
          active: 'Ativo',
        });

        if (
          team?.temperature?.[`${PREFIX}nome`] !== EFatherTag.CONTRATADO &&
          temperatureChanged
        ) {
          await deleteByActivities(
            activities,
            { references },
            { id: teamId, type: TypeBlockUpdated.Turma }
          );
        } else if (
          team?.temperature?.[`${PREFIX}nome`] === EFatherTag.CONTRATADO
        ) {
          await addOrUpdateByActivities(
            activities,
            { references, dictTag },
            {
              teamId,
            },
            {
              type: TypeBlockUpdated.Turma,
              id: teamId,
              temperatureId: team?.temperature?.[`${PREFIX}etiquetaid`],
              changeTemperature: temperatureChanged,
              isUndo,
            }
          );
        }

        if (!team?.isLoadModel) {
          await uploadTeamFiles(team, teamId, context);
        }

        const newTeam = await getTeamById(teamId);

        resolve('Salvo com sucesso!');
        onSuccess?.(newTeam?.value?.[0]);
      } catch (err) {
        console.error(err);
        reject(err);
        onError?.(err?.response);
      }
    });
  };

export const updateEnvolvedPerson =
  (id, teamId, toSave, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(api);

      batch.patch(TEAM_ENVOLVED_PEOPLE, id, toSave);

      try {
        await batch.execute();

        const schedule: any = await getTeamById(teamId);
        resolve(schedule?.value?.[0]);
        onSuccess?.(schedule?.value?.[0]);
      } catch (err) {
        reject?.(err);
        onError?.(err);
      }
    });
  };

export const deleteTeam =
  (teamId: string, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>, getState: () => AppState) =>
    new Promise(async (resolve, reject) => {
      const eventsToDelete = [];
      const batch = new BatchMultidata(api);
      const { environmentReference, space, person, app } = getState();
      const { dictSpace } = space;
      const { dictPeople } = person;

      batch.patch(TEAM, teamId, {
        [`${PREFIX}ativo`]: false,
        [`${PREFIX}excluido`]: true,
      });

      const activityRequest = await getActivityByTeamId(teamId);
      const activities = activityRequest?.value;

      activities?.forEach((elm) => {
        elm?.[`${PREFIX}recursos_Atividade`].forEach((resourceToDelete) => {
          const spaceid = resourceToDelete?.[`_${PREFIX}espaco_value`];
          const personid = resourceToDelete?.[`_${PREFIX}pessoa_value`];

          eventsToDelete.push({
            action: ACTION_DELETE,
            title: elm?.[`${PREFIX}nome`],
            email:
              dictSpace?.[spaceid]?.[`${PREFIX}email`] ||
              dictPeople?.[personid]?.[`${PREFIX}email`],
            activity: elm,
            start: moment(resourceToDelete?.[`${PREFIX}inicio`]).format(),
            end: moment(resourceToDelete?.[`${PREFIX}fim`]).format(),
            resourceId: resourceToDelete?.[`${PREFIX}recursosid`],
            eventId: resourceToDelete?.[`${PREFIX}eventoid`],
          });
        });
      });

      try {
        await batch.execute();
        const { references } = environmentReference;
        const { currentUser } = app;

        const reference = references?.find(
          (e) => e?.[`${PREFIX}nome`] === REFERENCE_DELETE
        );

        const fetchResponse = await fetch(reference?.[`${PREFIX}referencia`], {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Origem: 'Turma',
            IDOrigem: teamId,
            IDPessoa: currentUser?.[`${PREFIX}pessoaid`],
          }),
        });
        await executeEventDeleteOutlook(
          { id: teamId, type: TypeBlockUpdated.Turma },
          { onSuccess: () => null, onError: () => null }
        );

        await fetchResponse.text();
        resolve('Sucesso');
        onSuccess?.();
      } catch (err) {
        console.error(err);
        reject?.(err);
        onError?.(err);
      }
    });

export const updateTeam = (id, toSave, { onSuccess, onError }) => {
  return new Promise(async (resolve, reject) => {
    const batch = new BatchMultidata(api);

    batch.patch(TEAM, id, toSave);

    try {
      await batch.execute();

      const activity: any = await getTeamById(id);
      resolve(activity?.value?.[0]);
      onSuccess?.(activity?.value?.[0]);
    } catch (err) {
      reject?.(err);
      onError?.(err);
    }
  });
};

export const uploadTeamFiles = (team, teamId, context) => {
  return new Promise(async (res, rej) => {
    try {
      if (team?.anexos?.length) {
        const folder = `Turma/${moment(team?.createdon).format(
          'YYYY'
        )}/${teamId}`;

        const attachmentsToDelete = team?.anexos?.filter(
          (file) => file.relativeLink && file.deveExcluir
        );

        const attachmentsToSave = team?.anexos?.filter(
          (file) => !file.relativeLink && !file.deveExcluir
        );

        await deleteFiles(sp, attachmentsToDelete);
        await createFolder(sp, folder, 'Anexos Interno');
        await uploadFiles(
          sp,
          `${context.pageContext.web.serverRelativeUrl}/Anexos Interno/${folder}`,
          attachmentsToSave
        );
      }

      res('Sucesso');
    } catch (err) {
      console.error(err);
      rej(err);
    }
  });
};
