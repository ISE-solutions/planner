import * as _ from 'lodash';
import {
  ACADEMIC_REQUESTS,
  ACADEMIC_REQUESTS_ENVOLVED_PEOPLE,
  ACTIVITY,
  ACTIVITY_DOCUMENTS,
  ACTIVITY_ENVOLVED_PEOPLE,
  ACTIVITY_NAME,
  FINITE_INFINITE_RESOURCES,
  PREFIX,
  SCHEDULE_DAY,
  SCHEDULE_DAY_ENVOLVED_PEOPLE,
  SCHEDULE_DAY_LOCALE,
  SPACE,
  TAG,
  TEAM,
  TEAM_ENVOLVED_PEOPLE,
  TEAM_NAME,
  TEAM_PARTICIPANTS,
} from '~/config/database';
import { Dispatch } from 'redux';
import BatchMultidata from '~/utils/BatchMultidata';
import api from '~/services/api';
import {
  buildItem as buildItemTeam,
  buildItemFantasyName,
  buildItemParticipant,
  buildItemPeopleTeam,
  buildItemPeople,
} from '../team/utils';
import {
  buildItemLocale,
  buildItem as buildItemSchedule,
} from '../schedule/utils';
import { EActivityTypeApplication } from '~/config/enums';
import {
  buildItem as buildItemActivity,
  buildItemAcademicRequest,
  buildItemDocument,
  buildItemPeopleAcademicRequest,
} from '../activity/utils';
import { addOrUpdateByActivities } from '../resource/actions';
import { AppState } from '~/store';
import { getActivityByTeamId } from '../activity/actions';
import { TypeBlockUpdated } from '~/config/constants';

export const executeBatchEdition =
  ({ teams, schedules, activities }, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>, getState: () => AppState) =>
    new Promise(async (resolve, reject) => {
      try {
        const batch = new BatchMultidata(api);

        teams.forEach((team) => {
          const teamId = team.id;

          batch.patch(TEAM, teamId, buildItemTeam(team));

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
        });

        schedules?.forEach((schedule) => {
          const scheduleId = schedule.id;

          batch.patch(
            SCHEDULE_DAY,
            scheduleId,
            buildItemSchedule({
              ...schedule,
            })
          );

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
        });

        activities?.forEach((activity) => {
          const activityId = activity?.id;

          batch.patch(
            ACTIVITY,
            activityId,
            buildItemActivity({ ...activity, changed: true })
          );

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
            }
          });
        });

        await batch.executeChuncked();

        const responseActivities = await getActivityByTeamId(teams[0].id);
        const newActivities = responseActivities?.value;

        const { tag, environmentReference } = getState();
        const { dictTag } = tag;
        const { references } = environmentReference;

        await addOrUpdateByActivities(
          newActivities,
          { references, dictTag },
          {
            teamId: teams[0].id,
          },
          {
            type: TypeBlockUpdated.Turma,
            id: teams[0].id,
            changeTemperature: false,
          }
        );

        onSuccess?.('Success');
        resolve('Success');
      } catch (err) {
        console.error(err);
        onError?.(err);
        reject(err);
      }
    });
