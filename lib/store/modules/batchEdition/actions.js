var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ACADEMIC_REQUESTS, ACADEMIC_REQUESTS_ENVOLVED_PEOPLE, ACTIVITY, ACTIVITY_DOCUMENTS, ACTIVITY_ENVOLVED_PEOPLE, ACTIVITY_NAME, FINITE_INFINITE_RESOURCES, PREFIX, SCHEDULE_DAY, SCHEDULE_DAY_ENVOLVED_PEOPLE, SCHEDULE_DAY_LOCALE, SPACE, TAG, TEAM, TEAM_ENVOLVED_PEOPLE, TEAM_NAME, TEAM_PARTICIPANTS, } from '~/config/database';
import BatchMultidata from '~/utils/BatchMultidata';
import api from '~/services/api';
import { buildItem as buildItemTeam, buildItemFantasyName, buildItemParticipant, buildItemPeopleTeam, buildItemPeople, } from '../team/utils';
import { buildItemLocale, buildItem as buildItemSchedule, } from '../schedule/utils';
import { EActivityTypeApplication } from '~/config/enums';
import { buildItem as buildItemActivity, buildItemAcademicRequest, buildItemDocument, buildItemPeopleAcademicRequest, } from '../activity/utils';
import { addOrUpdateByActivities } from '../resource/actions';
import { getActivityByTeamId } from '../activity/actions';
import { TypeBlockUpdated } from '~/config/constants';
export const executeBatchEdition = ({ teams, schedules, activities }, { onSuccess, onError }) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const batch = new BatchMultidata(api);
            teams.forEach((team) => {
                var _a, _b, _c, _d;
                const teamId = team.id;
                batch.patch(TEAM, teamId, buildItemTeam(team));
                batch.bulkPostRelationship(TEAM_NAME, TEAM, teamId, 'Turma_NomeTurma', (_a = team === null || team === void 0 ? void 0 : team.names) === null || _a === void 0 ? void 0 : _a.map((name) => buildItemFantasyName(name)));
                batch.bulkPostRelationship(TEAM_ENVOLVED_PEOPLE, TEAM, teamId, 'Turma_PessoasEnvolvidasTurma', (_c = (_b = team === null || team === void 0 ? void 0 : team.people) === null || _b === void 0 ? void 0 : _b.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _c === void 0 ? void 0 : _c.map((name, i) => buildItemPeopleTeam(name, i)));
                batch.bulkPostRelationship(TEAM_PARTICIPANTS, TEAM, teamId, 'Turma_ParticipantesTurma', (_d = team === null || team === void 0 ? void 0 : team.participants) === null || _d === void 0 ? void 0 : _d.map((name) => buildItemParticipant(name)));
            });
            schedules === null || schedules === void 0 ? void 0 : schedules.forEach((schedule) => {
                var _a, _b, _c, _d;
                const scheduleId = schedule.id;
                batch.patch(SCHEDULE_DAY, scheduleId, buildItemSchedule(Object.assign({}, schedule)));
                batch.bulkPostRelationship(SCHEDULE_DAY_ENVOLVED_PEOPLE, SCHEDULE_DAY, scheduleId, 'CronogramadeDia_PessoasEnvolvidas', (_b = (_a = schedule === null || schedule === void 0 ? void 0 : schedule.people) === null || _a === void 0 ? void 0 : _a.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _b === void 0 ? void 0 : _b.map((pe) => buildItemPeople(pe)));
                batch.bulkPostRelationship(SCHEDULE_DAY_LOCALE, SCHEDULE_DAY, scheduleId, 'CronogramadeDia_LocalCronogramaDia', (_d = (_c = schedule === null || schedule === void 0 ? void 0 : schedule.locale) === null || _c === void 0 ? void 0 : _c.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _d === void 0 ? void 0 : _d.map((pe) => buildItemLocale(pe)));
            });
            activities === null || activities === void 0 ? void 0 : activities.forEach((activity) => {
                var _a, _b, _c, _d, _e, _f, _g;
                const activityId = activity === null || activity === void 0 ? void 0 : activity.id;
                batch.patch(ACTIVITY, activityId, buildItemActivity(Object.assign(Object.assign({}, activity), { changed: true })));
                batch.bulkPostRelationship(ACTIVITY_ENVOLVED_PEOPLE, ACTIVITY, activityId, 'Atividade_PessoasEnvolvidas', (_a = activity === null || activity === void 0 ? void 0 : activity.people) === null || _a === void 0 ? void 0 : _a.map((pe) => buildItemPeople(pe)));
                batch.bulkPostReferenceRelatioship(ACTIVITY, SPACE, activityId, 'Atividade_Espaco', (_b = activity === null || activity === void 0 ? void 0 : activity.spaces) === null || _b === void 0 ? void 0 : _b.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]));
                if (activity === null || activity === void 0 ? void 0 : activity.scheduleId) {
                    batch.bulkPostReferenceRelatioship(ACTIVITY, SCHEDULE_DAY, activityId, 'CronogramadeDia_Atividade', [activity === null || activity === void 0 ? void 0 : activity.scheduleId]);
                }
                batch.bulkDeleteReferenceParent(ACTIVITY, (_c = activity === null || activity === void 0 ? void 0 : activity.spacesToDelete) === null || _c === void 0 ? void 0 : _c.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]), activityId, 'Atividade_Espaco');
                batch.bulkPostRelationship(ACTIVITY_NAME, ACTIVITY, activityId, 'Atividade_NomeAtividade', (_d = activity === null || activity === void 0 ? void 0 : activity.names) === null || _d === void 0 ? void 0 : _d.map((name) => buildItemFantasyName(name)));
                batch.bulkPostRelationship(ACTIVITY_DOCUMENTS, ACTIVITY, activityId, 'Atividade_Documento', (_f = (_e = activity === null || activity === void 0 ? void 0 : activity.documents) === null || _e === void 0 ? void 0 : _e.filter((e) => !(!e.id && e.deleted))) === null || _f === void 0 ? void 0 : _f.map((pe) => buildItemDocument(pe)));
                (_g = activity === null || activity === void 0 ? void 0 : activity.academicRequests) === null || _g === void 0 ? void 0 : _g.forEach((academicRequest) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                    const academicRequestId = academicRequest.id;
                    const academicRequestToSave = buildItemAcademicRequest(Object.assign(Object.assign({}, academicRequest), { teamId: activity === null || activity === void 0 ? void 0 : activity.teamId, scheduleId: activity === null || activity === void 0 ? void 0 : activity.scheduleId }));
                    const academicRequestRefId = batch.postRelationship(ACADEMIC_REQUESTS, ACTIVITY, activityId, 'RequisicaoAcademica_Atividade', academicRequestToSave);
                    batch.bulkPostReference(TAG, (_a = academicRequest === null || academicRequest === void 0 ? void 0 : academicRequest.equipments) === null || _a === void 0 ? void 0 : _a.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}etiquetaid`]), academicRequestRefId, 'Equipamentos');
                    batch.bulkPostReference(FINITE_INFINITE_RESOURCES, (_b = academicRequest === null || academicRequest === void 0 ? void 0 : academicRequest.finiteResource) === null || _b === void 0 ? void 0 : _b.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), academicRequestRefId, 'RequisicaoAcademica_Recurso');
                    batch.bulkPostReference(FINITE_INFINITE_RESOURCES, (_c = academicRequest === null || academicRequest === void 0 ? void 0 : academicRequest.infiniteResource) === null || _c === void 0 ? void 0 : _c.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), academicRequestRefId, 'RequisicaoAcademica_Recurso');
                    if (academicRequestId) {
                        batch.bulkDeleteReference(TAG, (_d = academicRequest === null || academicRequest === void 0 ? void 0 : academicRequest.equipmentsToDelete) === null || _d === void 0 ? void 0 : _d.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}etiquetaid`]), academicRequestId, 'Equipamentos');
                        batch.bulkDeleteReference(FINITE_INFINITE_RESOURCES, (_e = academicRequest === null || academicRequest === void 0 ? void 0 : academicRequest.finiteResourceToDelete) === null || _e === void 0 ? void 0 : _e.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), academicRequestId, 'RequisicaoAcademica_Recurso');
                        batch.bulkDeleteReference(FINITE_INFINITE_RESOURCES, (_f = academicRequest === null || academicRequest === void 0 ? void 0 : academicRequest.infiniteResourceToDelete) === null || _f === void 0 ? void 0 : _f.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), academicRequestId, 'RequisicaoAcademica_Recurso');
                    }
                    if (!academicRequest.deleted) {
                        batch.bulkPostRelationshipReference(ACADEMIC_REQUESTS_ENVOLVED_PEOPLE, academicRequestRefId, 'Requisicao_PessoasEnvolvidas', (_h = (_g = academicRequest === null || academicRequest === void 0 ? void 0 : academicRequest.people) === null || _g === void 0 ? void 0 : _g.filter((e) => !(!e.id && e.deleted))) === null || _h === void 0 ? void 0 : _h.map((pe) => buildItemPeopleAcademicRequest(Object.assign(Object.assign({}, pe), { activityId }))));
                    }
                    if (!academicRequest.deleted &&
                        !academicRequest.id &&
                        activity.typeApplication === EActivityTypeApplication.APLICACAO) {
                        const responsible = [];
                        const group = [];
                        (_j = academicRequest === null || academicRequest === void 0 ? void 0 : academicRequest.people) === null || _j === void 0 ? void 0 : _j.forEach((e) => {
                            if (e.person) {
                                responsible.push(e.person);
                            }
                            else {
                                group.push(e.function);
                            }
                        });
                    }
                });
            });
            yield batch.executeChuncked();
            const responseActivities = yield getActivityByTeamId(teams[0].id);
            const newActivities = responseActivities === null || responseActivities === void 0 ? void 0 : responseActivities.value;
            const { tag, environmentReference } = getState();
            const { dictTag } = tag;
            const { references } = environmentReference;
            yield addOrUpdateByActivities(newActivities, { references, dictTag }, {
                teamId: teams[0].id,
            }, {
                type: TypeBlockUpdated.Turma,
                id: teams[0].id,
                changeTemperature: false,
            });
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess('Success');
            resolve('Success');
        }
        catch (err) {
            console.error(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
            reject(err);
        }
    }));
});
//# sourceMappingURL=actions.js.map