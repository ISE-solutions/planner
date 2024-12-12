import { QueryBuilder } from 'odata-query-builder';
import {
  ACADEMIC_REQUESTS,
  ACADEMIC_REQUESTS_ENVOLVED_PEOPLE,
  ACTIVITY,
  ACTIVITY_DOCUMENTS,
  ACTIVITY_ENVOLVED_PEOPLE,
  ACTIVITY_NAME,
  FINITE_INFINITE_RESOURCES,
  PREFIX,
  RESOURCES,
  SCHEDULE_DAY,
  SCHEDULE_DAY_ENVOLVED_PEOPLE,
  SCHEDULE_DAY_LOCALE,
  SPACE,
  TAG,
  TEAM,
} from '~/config/database';
import api from '~/services/api';
import {
  buildItem,
  buildItemLocale,
  buildItemPeopleAcademicRequest,
} from './utils';
import {
  addOrUpdateByActivities,
  deleteByActivities,
} from '../resource/actions';
import { getActivityByScheduleId } from '../activity/actions';
import BatchMultidata from '~/utils/BatchMultidata';
import {
  buildItemAcademicRequest,
  buildItem as buildItemActivity,
  buildItemDocument,
  buildItemFantasyName,
  buildItemPeople,
} from '../activity/utils';
import {
  ACTION_DELETE,
  BASE_URL_API_NET,
  BUSINESS_UNITY,
  ENV,
  REFERENCE_DELETE,
  TypeBlockUpdated,
} from '~/config/constants';
import { createFolder, deleteFiles, uploadFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import * as moment from 'moment';
import { Dispatch } from 'react';
import { AppState } from '~/store';
import { executeEventDeleteOutlook } from '../eventOutlook/actions';
import { IFilterProps, buildQuery } from './utils';
import { EFatherTag } from '~/config/enums';

export const getSchedules = (filter: IFilterProps): any =>
  new Promise(async (resolve, reject) => {
    try {
      const query = buildQuery(filter);
      let headers = {};

      if (filter.rowsPerPage) {
        headers = {
          Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
      }
      const { data } = await api.get(`${SCHEDULE_DAY}${query}`, {
        headers,
      });

      resolve(data?.value);
    } catch (error) {
      console.error(error);
    }
  });

export const getScheduleByIds = (scheduleIds: string[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      f.or((p) => {
        scheduleIds.forEach((id) =>
          p.filterExpression(`${PREFIX}cronogramadediaid`, 'eq', id)
        );

        return p;
      });

      return f;
    });

    query.expand(
      `${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Local,${PREFIX}Temperatura,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento,${PREFIX}Ferramenta,${PREFIX}FerramentaBackup,${PREFIX}Programa`
    );

    api({
      url: `${SCHEDULE_DAY}${query.toQuery()}`,
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

export const getScheduleId = (scheduleId): Promise<any> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) =>
      f.filterExpression(`${PREFIX}cronogramadediaid`, 'eq', scheduleId)
    );

    query.expand(
      `${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Temperatura,${PREFIX}Local,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento`
    );

    api({
      url: `${SCHEDULE_DAY}${query.toQuery()}`,
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

export const getScheduleByDateAndTeam = (
  date: string,
  teamId: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) => {
      f.filterExpression(`${PREFIX}data`, 'eq', date);
      f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', teamId);

      f.filterExpression(`${PREFIX}ativo`, 'eq', true);
      return f;
    });

    query.expand(
      `${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Temperatura,${PREFIX}Local,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento`
    );

    api({
      url: `${SCHEDULE_DAY}${query.toQuery()}`,
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

export const fetchAdvancedSchedules = (filter: string): any =>
  new Promise(async (resolve, reject) => {
    try {
      let axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await api.post(
        `${BASE_URL_API_NET}Dia`,
        { queryString: filter || '', ev: ENV },
        axiosConfig
      );

      resolve(data);
    } catch (error) {
      console.error(error);
    }
  });

export const addUpdateSchedule =
  (
    schedule: any,
    teamId: string,
    programId: string,
    { onSuccess, onError },
    temperatureChanged?: boolean,
    isUndo?: boolean
  ): any =>
  async (dispatch: Dispatch<any>, getState: () => AppState) =>
    new Promise(async (resolve, reject) => {
      const eventsToDelete = [];
      let schSaved;

      const { app, tag, space, person, environmentReference } = getState();
      const { context } = app;
      const { dictTag } = tag;
      const { dictSpace } = space;
      const { dictPeople } = person;
      const { references } = environmentReference;

      const batch = new BatchMultidata(api);
      let scheduleId = schedule?.id;

      if (scheduleId) {
        const scheduleRequest = await getScheduleId(scheduleId);
        schSaved = scheduleRequest?.value?.[0];

        const { currentUser } = getState().app;

        if (
          schSaved?.[`_${PREFIX}editanto_value`] &&
          schSaved?.[`_${PREFIX}editanto_value`] !==
            currentUser?.[`${PREFIX}pessoaid`]
        ) {
          const err = {
            data: {
              error: {
                message: `Outra pessoa está editando este dia de aula!`,
              },
            },
          };

          reject(err);
          onError?.(err, schSaved);
          return;
        }
      }

      try {
        let dataToSave = buildItem({
          ...schedule,
          teamId: teamId,
          programId: programId,
        });

        if (scheduleId) {
          batch.patch(SCHEDULE_DAY, scheduleId, dataToSave);
        } else {
          const response = await api({
            url: SCHEDULE_DAY,
            method: 'POST',
            headers: {
              Prefer: 'return=representation',
            },
            data: dataToSave,
          });

          scheduleId = response.data?.[`${PREFIX}cronogramadediaid`];

          if (teamId) {
            await api({
              url: `${SCHEDULE_DAY}(${scheduleId})/${PREFIX}Turma/$ref`,
              method: 'PUT',
              data: {
                '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                '@odata.id': `${TEAM}(${teamId})`,
              },
            });
          }
        }

        schedule.activities.forEach((activity) => {
          if (!activity?.[`${PREFIX}atividadeid`]) {
            const requestId = batch.postRelationship(
              ACTIVITY,
              SCHEDULE_DAY,
              scheduleId,
              'CronogramadeDia_Atividade',
              buildItemActivity({
                ...activity,
                teamId: teamId,
                scheduleId: scheduleId,
                programId: programId,
              })
            );

            batch.bulkPostRelationshipReference(
              ACTIVITY_ENVOLVED_PEOPLE,
              requestId,
              'Atividade_PessoasEnvolvidas',
              activity?.people
                ?.filter((e) => !(!e.id && e.deleted))
                ?.map((pe) => buildItemPeople(pe))
            );

            batch.bulkPostRelationshipReference(
              ACTIVITY_DOCUMENTS,
              requestId,
              'Atividade_Documento',
              activity?.documents
                ?.filter((e) => !e.id && !e.deleted)
                ?.map((pe) => buildItemDocument(pe))
            );

            batch.bulkPostReference(
              SPACE,
              activity?.spaces?.map((spc) => spc?.[`${PREFIX}espacoid`]),
              requestId,
              'Atividade_Espaco'
            );

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

            batch.bulkDeleteReference(
              FINITE_INFINITE_RESOURCES,
              activity?.finiteResourceToDelete?.map(
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
              FINITE_INFINITE_RESOURCES,
              activity?.infiniteResourceToDelete?.map(
                (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
              ),
              activity?.id,
              'Atividade_RecursoFinitoInfinito'
            );

            batch.bulkPostRelationshipReference(
              ACTIVITY_NAME,
              requestId,
              'Atividade_NomeAtividade',
              activity?.names?.map((name) => buildItemFantasyName(name))
            );

            activity?.academicRequests?.forEach((academicRequest) => {
              const academicRequestToSave = buildItemAcademicRequest({
                ...academicRequest,
                teamId,
                scheduleId,
              });

              const academicRequestRefId = batch.postRelationshipReference(
                ACADEMIC_REQUESTS,
                requestId,
                'RequisicaoAcademica_Atividade',
                academicRequestToSave
              );

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
                        activityId: requestId,
                      })
                    )
                );
              }
            });
          } else if (!activity.deleted) {
            const activityId = activity?.[`${PREFIX}atividadeid`];

            batch.bulkPostRelationship(
              ACTIVITY_ENVOLVED_PEOPLE,
              ACTIVITY,
              activityId,
              'Atividade_PessoasEnvolvidas',
              activity?.people
                ?.filter((e) => !(!e.id && e.deleted))
                ?.map((pe) => buildItemPeople(pe))
            );

            const requestId = batch.patch(
              ACTIVITY,
              activityId,
              buildItemActivity({
                ...activity,
                teamId: teamId,
                scheduleId: scheduleId,
                programId: programId,
              })
            );

            batch.bulkPostReference(
              SPACE,
              activity?.spaces?.map((spc) => spc?.[`${PREFIX}espacoid`]),
              requestId,
              'Atividade_Espaco'
            );

            batch.bulkDeleteReferenceParent(
              ACTIVITY,
              activity?.spacesToDelete?.map(
                (spc) => spc?.[`${PREFIX}espacoid`]
              ),
              activityId,
              'Atividade_Espaco'
            );
          }

          if (activity?.[`${PREFIX}atividadeid`] && activity.deleted) {
            batch.patch(ACTIVITY, activity?.[`${PREFIX}atividadeid`], {
              [`${PREFIX}ativo`]: false,
              [`${PREFIX}excluido`]: true,
            });

            activity?.resources?.forEach((resourceToDelete) => {
              batch.patch(
                RESOURCES,
                resourceToDelete?.[`${PREFIX}recursosid`],
                { [`${PREFIX}excluido`]: true }
              );

              const spaceid = resourceToDelete?.[`_${PREFIX}espaco_value`];
              const personid = resourceToDelete?.[`_${PREFIX}pessoa_value`];

              eventsToDelete.push({
                action: ACTION_DELETE,
                title: activity?.name,
                email:
                  dictSpace?.[spaceid]?.[`${PREFIX}email`] ||
                  dictPeople?.[personid]?.[`${PREFIX}email`],
                start: moment(resourceToDelete?.[`${PREFIX}inicio`]).format(),
                end: moment(resourceToDelete?.[`${PREFIX}fim`]).format(),
                resourceId: resourceToDelete?.[`${PREFIX}recursosid`],
                eventId: resourceToDelete?.[`${PREFIX}eventoid`],
              });
            });
          }
        });

        batch.bulkPostRelationship(
          SCHEDULE_DAY_ENVOLVED_PEOPLE,
          SCHEDULE_DAY,
          scheduleId,
          'CronogramadeDia_PessoasEnvolvidas',
          schedule?.people
            ?.filter((e) => !(!e?.id && e.deleted))
            ?.map((pe) => buildItemPeople(pe))
        );

        batch.bulkPostRelationship(
          SCHEDULE_DAY_LOCALE,
          SCHEDULE_DAY,
          scheduleId,
          'CronogramadeDia_LocalCronogramaDia',
          schedule?.locale
            ?.filter((e) => !(!e?.id && e.deleted))
            ?.map((pe) => buildItemLocale(pe))
        );

        await batch.execute();

        if (!schedule?.isLoadModel) {
          await uploadScheduleFiles(schedule, scheduleId, context);
        }

        if (!schedule.model) {
          const responseActivities = await getActivityByScheduleId(
            scheduleId,
            false
          );
          const activities = responseActivities?.value?.map((e) => ({
            ...e,
            teamId,
            programId,
            scheduleId,
          }));

          await addOrUpdateByActivities(
            activities,
            { references, dictTag },
            {
              scheduleId,
            },
            {
              type: TypeBlockUpdated.DiaAula,
              id: scheduleId,
              temperatureId: schedule?.temperature?.[`${PREFIX}etiquetaid`],
              changeTemperature: temperatureChanged,
              isUndo,
            }
          );

          // if (
          //   schedule?.temperature?.[`${PREFIX}nome`] === EFatherTag.RASCUNHO &&
          //   temperatureChanged
          // ) {
          //   await deleteByActivities(activities, { references });
          // } else if (
          //   schedule?.temperature?.[`${PREFIX}nome`] !== EFatherTag.RASCUNHO
          // ) {
          //   await addOrUpdateByActivities(
          //     activities,
          //     { references, dictTag },
          //     {
          //       scheduleId,
          //     },
          //     temperatureChanged,
          //     schedule?.temperature?.[`${PREFIX}nome`] === EFatherTag.CONTRATADO
          //   );
          // }
        }

        const newSchedule = await getScheduleId(scheduleId);

        onSuccess?.(newSchedule?.value?.[0]);
        resolve(newSchedule);
      } catch (error) {
        console.error(error);
        onError?.(error);
        reject();
      }
    });

export const updateSchedule =
  (id, toSave, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(api);

      batch.patch(SCHEDULE_DAY, id, toSave);

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

export const deleteSchedule =
  (id: string, activities: any[], { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>, getState: () => AppState) =>
    new Promise(async (resolve, reject) => {
      const eventsToDelete = [];
      const batch = new BatchMultidata(api);
      const { environmentReference, space, person, app } = getState();
      const { dictSpace } = space;
      const { dictPeople } = person;

      batch.patch(SCHEDULE_DAY, id, {
        [`${PREFIX}ativo`]: false,
        [`${PREFIX}excluido`]: true,
      });

      activities?.forEach((elm) => {
        batch.patch(ACTIVITY, elm?.[`${PREFIX}atividadeid`], {
          [`${PREFIX}ativo`]: false,
          [`${PREFIX}excluido`]: true,
        });

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
            Origem: 'Cronograma de Dia',
            IDOrigem: id,
            IDPessoa: currentUser?.[`${PREFIX}pessoaid`],
          }),
        });

        await executeEventDeleteOutlook(
          { id: id, type: TypeBlockUpdated.DiaAula },
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

const uploadScheduleFiles = async (schedule, scheduleId, context) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (schedule?.anexos?.length) {
        const folder = `Cronograma Dia/${moment(schedule?.createdon).format(
          'YYYY'
        )}/${scheduleId}`;

        const attachmentsToDelete = schedule?.anexos?.filter(
          (file) => file.relativeLink && file.deveExcluir
        );

        const attachmentsToSave = schedule?.anexos?.filter(
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

      resolve('Sucesso');
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};
