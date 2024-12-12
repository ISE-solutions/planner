var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { QueryBuilder } from 'odata-query-builder';
import { ACADEMIC_REQUESTS, ACADEMIC_REQUESTS_ENVOLVED_PEOPLE, ACTIVITY, ACTIVITY_DOCUMENTS, ACTIVITY_ENVOLVED_PEOPLE, ACTIVITY_NAME, FINITE_INFINITE_RESOURCES, PREFIX, RESOURCES, SCHEDULE_DAY, SCHEDULE_DAY_ENVOLVED_PEOPLE, SCHEDULE_DAY_LOCALE, SPACE, TAG, TEAM, } from '~/config/database';
import api from '~/services/api';
import { buildItem, buildItemLocale, buildItemPeopleAcademicRequest, } from './utils';
import { addOrUpdateByActivities, } from '../resource/actions';
import { getActivityByScheduleId } from '../activity/actions';
import BatchMultidata from '~/utils/BatchMultidata';
import { buildItemAcademicRequest, buildItem as buildItemActivity, buildItemDocument, buildItemFantasyName, buildItemPeople, } from '../activity/utils';
import { ACTION_DELETE, BASE_URL_API_NET, BUSINESS_UNITY, ENV, REFERENCE_DELETE, TypeBlockUpdated, } from '~/config/constants';
import { createFolder, deleteFiles, uploadFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import * as moment from 'moment';
import { executeEventDeleteOutlook } from '../eventOutlook/actions';
import { buildQuery } from './utils';
export const getSchedules = (filter) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${SCHEDULE_DAY}${query}`, {
            headers,
        });
        resolve(data === null || data === void 0 ? void 0 : data.value);
    }
    catch (error) {
        console.error(error);
    }
}));
export const getScheduleByIds = (scheduleIds) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => {
            f.or((p) => {
                scheduleIds.forEach((id) => p.filterExpression(`${PREFIX}cronogramadediaid`, 'eq', id));
                return p;
            });
            return f;
        });
        query.expand(`${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Local,${PREFIX}Temperatura,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento,${PREFIX}Ferramenta,${PREFIX}FerramentaBackup,${PREFIX}Programa`);
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
export const getScheduleId = (scheduleId) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}cronogramadediaid`, 'eq', scheduleId));
        query.expand(`${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Temperatura,${PREFIX}Local,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento`);
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
export const getScheduleByDateAndTeam = (date, teamId) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => {
            f.filterExpression(`${PREFIX}data`, 'eq', date);
            f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', teamId);
            f.filterExpression(`${PREFIX}ativo`, 'eq', true);
            return f;
        });
        query.expand(`${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Temperatura,${PREFIX}Local,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento`);
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
export const fetchAdvancedSchedules = (filter) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = yield api.post(`${BASE_URL_API_NET}Dia`, { queryString: filter || '', ev: ENV }, axiosConfig);
        resolve(data);
    }
    catch (error) {
        console.error(error);
    }
}));
export const addUpdateSchedule = (schedule, teamId, programId, { onSuccess, onError }, temperatureChanged, isUndo) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const eventsToDelete = [];
        let schSaved;
        const { app, tag, space, person, environmentReference } = getState();
        const { context } = app;
        const { dictTag } = tag;
        const { dictSpace } = space;
        const { dictPeople } = person;
        const { references } = environmentReference;
        const batch = new BatchMultidata(api);
        let scheduleId = schedule === null || schedule === void 0 ? void 0 : schedule.id;
        if (scheduleId) {
            const scheduleRequest = yield getScheduleId(scheduleId);
            schSaved = (_a = scheduleRequest === null || scheduleRequest === void 0 ? void 0 : scheduleRequest.value) === null || _a === void 0 ? void 0 : _a[0];
            const { currentUser } = getState().app;
            if ((schSaved === null || schSaved === void 0 ? void 0 : schSaved[`_${PREFIX}editanto_value`]) &&
                (schSaved === null || schSaved === void 0 ? void 0 : schSaved[`_${PREFIX}editanto_value`]) !==
                    (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`])) {
                const err = {
                    data: {
                        error: {
                            message: `Outra pessoa está editando este dia de aula!`,
                        },
                    },
                };
                reject(err);
                onError === null || onError === void 0 ? void 0 : onError(err, schSaved);
                return;
            }
        }
        try {
            let dataToSave = buildItem(Object.assign(Object.assign({}, schedule), { teamId: teamId, programId: programId }));
            if (scheduleId) {
                batch.patch(SCHEDULE_DAY, scheduleId, dataToSave);
            }
            else {
                const response = yield api({
                    url: SCHEDULE_DAY,
                    method: 'POST',
                    headers: {
                        Prefer: 'return=representation',
                    },
                    data: dataToSave,
                });
                scheduleId = (_b = response.data) === null || _b === void 0 ? void 0 : _b[`${PREFIX}cronogramadediaid`];
                if (teamId) {
                    yield api({
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
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
                if (!(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`])) {
                    const requestId = batch.postRelationship(ACTIVITY, SCHEDULE_DAY, scheduleId, 'CronogramadeDia_Atividade', buildItemActivity(Object.assign(Object.assign({}, activity), { teamId: teamId, scheduleId: scheduleId, programId: programId })));
                    batch.bulkPostRelationshipReference(ACTIVITY_ENVOLVED_PEOPLE, requestId, 'Atividade_PessoasEnvolvidas', (_b = (_a = activity === null || activity === void 0 ? void 0 : activity.people) === null || _a === void 0 ? void 0 : _a.filter((e) => !(!e.id && e.deleted))) === null || _b === void 0 ? void 0 : _b.map((pe) => buildItemPeople(pe)));
                    batch.bulkPostRelationshipReference(ACTIVITY_DOCUMENTS, requestId, 'Atividade_Documento', (_d = (_c = activity === null || activity === void 0 ? void 0 : activity.documents) === null || _c === void 0 ? void 0 : _c.filter((e) => !e.id && !e.deleted)) === null || _d === void 0 ? void 0 : _d.map((pe) => buildItemDocument(pe)));
                    batch.bulkPostReference(SPACE, (_e = activity === null || activity === void 0 ? void 0 : activity.spaces) === null || _e === void 0 ? void 0 : _e.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]), requestId, 'Atividade_Espaco');
                    batch.bulkPostReference(TAG, (_f = activity === null || activity === void 0 ? void 0 : activity.equipments) === null || _f === void 0 ? void 0 : _f.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}etiquetaid`]), requestId, 'Atividade_Equipamentos');
                    batch.bulkPostReference(FINITE_INFINITE_RESOURCES, (_g = activity === null || activity === void 0 ? void 0 : activity.finiteResource) === null || _g === void 0 ? void 0 : _g.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), requestId, 'Atividade_RecursoFinitoInfinito');
                    batch.bulkDeleteReference(FINITE_INFINITE_RESOURCES, (_h = activity === null || activity === void 0 ? void 0 : activity.finiteResourceToDelete) === null || _h === void 0 ? void 0 : _h.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), requestId, 'Atividade_RecursoFinitoInfinito');
                    batch.bulkPostReference(FINITE_INFINITE_RESOURCES, (_j = activity === null || activity === void 0 ? void 0 : activity.infiniteResource) === null || _j === void 0 ? void 0 : _j.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), requestId, 'Atividade_RecursoFinitoInfinito');
                    batch.bulkDeleteReference(FINITE_INFINITE_RESOURCES, (_k = activity === null || activity === void 0 ? void 0 : activity.infiniteResourceToDelete) === null || _k === void 0 ? void 0 : _k.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), activity === null || activity === void 0 ? void 0 : activity.id, 'Atividade_RecursoFinitoInfinito');
                    batch.bulkPostRelationshipReference(ACTIVITY_NAME, requestId, 'Atividade_NomeAtividade', (_l = activity === null || activity === void 0 ? void 0 : activity.names) === null || _l === void 0 ? void 0 : _l.map((name) => buildItemFantasyName(name)));
                    (_m = activity === null || activity === void 0 ? void 0 : activity.academicRequests) === null || _m === void 0 ? void 0 : _m.forEach((academicRequest) => {
                        var _a, _b;
                        const academicRequestToSave = buildItemAcademicRequest(Object.assign(Object.assign({}, academicRequest), { teamId,
                            scheduleId }));
                        const academicRequestRefId = batch.postRelationshipReference(ACADEMIC_REQUESTS, requestId, 'RequisicaoAcademica_Atividade', academicRequestToSave);
                        if (!academicRequest.deleted) {
                            batch.bulkPostRelationshipReference(ACADEMIC_REQUESTS_ENVOLVED_PEOPLE, academicRequestRefId, 'Requisicao_PessoasEnvolvidas', (_b = (_a = academicRequest === null || academicRequest === void 0 ? void 0 : academicRequest.people) === null || _a === void 0 ? void 0 : _a.filter((e) => !(!e.id && e.deleted))) === null || _b === void 0 ? void 0 : _b.map((pe) => buildItemPeopleAcademicRequest(Object.assign(Object.assign({}, pe), { activityId: requestId }))));
                        }
                    });
                }
                else if (!activity.deleted) {
                    const activityId = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`];
                    batch.bulkPostRelationship(ACTIVITY_ENVOLVED_PEOPLE, ACTIVITY, activityId, 'Atividade_PessoasEnvolvidas', (_p = (_o = activity === null || activity === void 0 ? void 0 : activity.people) === null || _o === void 0 ? void 0 : _o.filter((e) => !(!e.id && e.deleted))) === null || _p === void 0 ? void 0 : _p.map((pe) => buildItemPeople(pe)));
                    const requestId = batch.patch(ACTIVITY, activityId, buildItemActivity(Object.assign(Object.assign({}, activity), { teamId: teamId, scheduleId: scheduleId, programId: programId })));
                    batch.bulkPostReference(SPACE, (_q = activity === null || activity === void 0 ? void 0 : activity.spaces) === null || _q === void 0 ? void 0 : _q.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]), requestId, 'Atividade_Espaco');
                    batch.bulkDeleteReferenceParent(ACTIVITY, (_r = activity === null || activity === void 0 ? void 0 : activity.spacesToDelete) === null || _r === void 0 ? void 0 : _r.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]), activityId, 'Atividade_Espaco');
                }
                if ((activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) && activity.deleted) {
                    batch.patch(ACTIVITY, activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], {
                        [`${PREFIX}ativo`]: false,
                        [`${PREFIX}excluido`]: true,
                    });
                    (_s = activity === null || activity === void 0 ? void 0 : activity.resources) === null || _s === void 0 ? void 0 : _s.forEach((resourceToDelete) => {
                        var _a, _b;
                        batch.patch(RESOURCES, resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}recursosid`], { [`${PREFIX}excluido`]: true });
                        const spaceid = resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`_${PREFIX}espaco_value`];
                        const personid = resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`_${PREFIX}pessoa_value`];
                        eventsToDelete.push({
                            action: ACTION_DELETE,
                            title: activity === null || activity === void 0 ? void 0 : activity.name,
                            email: ((_a = dictSpace === null || dictSpace === void 0 ? void 0 : dictSpace[spaceid]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}email`]) ||
                                ((_b = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[personid]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}email`]),
                            start: moment(resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}inicio`]).format(),
                            end: moment(resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}fim`]).format(),
                            resourceId: resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}recursosid`],
                            eventId: resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}eventoid`],
                        });
                    });
                }
            });
            batch.bulkPostRelationship(SCHEDULE_DAY_ENVOLVED_PEOPLE, SCHEDULE_DAY, scheduleId, 'CronogramadeDia_PessoasEnvolvidas', (_d = (_c = schedule === null || schedule === void 0 ? void 0 : schedule.people) === null || _c === void 0 ? void 0 : _c.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _d === void 0 ? void 0 : _d.map((pe) => buildItemPeople(pe)));
            batch.bulkPostRelationship(SCHEDULE_DAY_LOCALE, SCHEDULE_DAY, scheduleId, 'CronogramadeDia_LocalCronogramaDia', (_f = (_e = schedule === null || schedule === void 0 ? void 0 : schedule.locale) === null || _e === void 0 ? void 0 : _e.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _f === void 0 ? void 0 : _f.map((pe) => buildItemLocale(pe)));
            yield batch.execute();
            if (!(schedule === null || schedule === void 0 ? void 0 : schedule.isLoadModel)) {
                yield uploadScheduleFiles(schedule, scheduleId, context);
            }
            if (!schedule.model) {
                const responseActivities = yield getActivityByScheduleId(scheduleId, false);
                const activities = (_g = responseActivities === null || responseActivities === void 0 ? void 0 : responseActivities.value) === null || _g === void 0 ? void 0 : _g.map((e) => (Object.assign(Object.assign({}, e), { teamId,
                    programId,
                    scheduleId })));
                yield addOrUpdateByActivities(activities, { references, dictTag }, {
                    scheduleId,
                }, {
                    type: TypeBlockUpdated.DiaAula,
                    id: scheduleId,
                    temperatureId: (_h = schedule === null || schedule === void 0 ? void 0 : schedule.temperature) === null || _h === void 0 ? void 0 : _h[`${PREFIX}etiquetaid`],
                    changeTemperature: temperatureChanged,
                    isUndo,
                });
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
            const newSchedule = yield getScheduleId(scheduleId);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_j = newSchedule === null || newSchedule === void 0 ? void 0 : newSchedule.value) === null || _j === void 0 ? void 0 : _j[0]);
            resolve(newSchedule);
        }
        catch (error) {
            console.error(error);
            onError === null || onError === void 0 ? void 0 : onError(error);
            reject();
        }
    }));
});
export const updateSchedule = (id, toSave, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const batch = new BatchMultidata(api);
        batch.patch(SCHEDULE_DAY, id, toSave);
        try {
            yield batch.execute();
            resolve('sucesso');
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        }
        catch (err) {
            reject === null || reject === void 0 ? void 0 : reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
    }));
});
export const deleteSchedule = (id, activities, { onSuccess, onError }) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const eventsToDelete = [];
        const batch = new BatchMultidata(api);
        const { environmentReference, space, person, app } = getState();
        const { dictSpace } = space;
        const { dictPeople } = person;
        batch.patch(SCHEDULE_DAY, id, {
            [`${PREFIX}ativo`]: false,
            [`${PREFIX}excluido`]: true,
        });
        activities === null || activities === void 0 ? void 0 : activities.forEach((elm) => {
            batch.patch(ACTIVITY, elm === null || elm === void 0 ? void 0 : elm[`${PREFIX}atividadeid`], {
                [`${PREFIX}ativo`]: false,
                [`${PREFIX}excluido`]: true,
            });
            elm === null || elm === void 0 ? void 0 : elm[`${PREFIX}recursos_Atividade`].forEach((resourceToDelete) => {
                var _a, _b;
                const spaceid = resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`_${PREFIX}espaco_value`];
                const personid = resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`_${PREFIX}pessoa_value`];
                eventsToDelete.push({
                    action: ACTION_DELETE,
                    title: elm === null || elm === void 0 ? void 0 : elm[`${PREFIX}nome`],
                    email: ((_a = dictSpace === null || dictSpace === void 0 ? void 0 : dictSpace[spaceid]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}email`]) ||
                        ((_b = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[personid]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}email`]),
                    activity: elm,
                    start: moment(resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}inicio`]).format(),
                    end: moment(resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}fim`]).format(),
                    resourceId: resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}recursosid`],
                    eventId: resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}eventoid`],
                });
            });
        });
        try {
            yield batch.execute();
            const { references } = environmentReference;
            const { currentUser } = app;
            const reference = references === null || references === void 0 ? void 0 : references.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === REFERENCE_DELETE);
            const fetchResponse = yield fetch(reference === null || reference === void 0 ? void 0 : reference[`${PREFIX}referencia`], {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Origem: 'Cronograma de Dia',
                    IDOrigem: id,
                    IDPessoa: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`],
                }),
            });
            yield executeEventDeleteOutlook({ id: id, type: TypeBlockUpdated.DiaAula }, { onSuccess: () => null, onError: () => null });
            yield fetchResponse.text();
            resolve('Sucesso');
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        }
        catch (err) {
            console.error(err);
            reject === null || reject === void 0 ? void 0 : reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
    }));
});
const uploadScheduleFiles = (schedule, scheduleId, context) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _k, _l, _m;
        try {
            if ((_k = schedule === null || schedule === void 0 ? void 0 : schedule.anexos) === null || _k === void 0 ? void 0 : _k.length) {
                const folder = `Cronograma Dia/${moment(schedule === null || schedule === void 0 ? void 0 : schedule.createdon).format('YYYY')}/${scheduleId}`;
                const attachmentsToDelete = (_l = schedule === null || schedule === void 0 ? void 0 : schedule.anexos) === null || _l === void 0 ? void 0 : _l.filter((file) => file.relativeLink && file.deveExcluir);
                const attachmentsToSave = (_m = schedule === null || schedule === void 0 ? void 0 : schedule.anexos) === null || _m === void 0 ? void 0 : _m.filter((file) => !file.relativeLink && !file.deveExcluir);
                yield deleteFiles(sp, attachmentsToDelete);
                yield createFolder(sp, folder, 'Anexos Interno');
                yield uploadFiles(sp, `${context.pageContext.web.serverRelativeUrl}/Anexos Interno/${folder}`, attachmentsToSave);
            }
            resolve('Sucesso');
        }
        catch (err) {
            console.error(err);
            reject(err);
        }
    }));
});
//# sourceMappingURL=actions.js.map