var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import api from '~/services/api';
import { ACADEMIC_REQUESTS, ACADEMIC_REQUESTS_ENVOLVED_PEOPLE, ACTIVITY, ACTIVITY_DOCUMENTS, ACTIVITY_ENVOLVED_PEOPLE, ACTIVITY_NAME, FINITE_INFINITE_RESOURCES, PREFIX, PROGRAM, SCHEDULE_DAY, SCHEDULE_DAY_ENVOLVED_PEOPLE, SPACE, TAG, TEAM, TEAM_ENVOLVED_PEOPLE, TEAM_NAME, TEAM_PARTICIPANTS, } from '~/config/database';
import { buildItem, buildItemAcademicRequest, buildItemActivity, buildItemDocument, buildItemFantasyName, buildItemParticipant, buildItemPeople, buildItemPeopleAcademicRequest, buildItemPeopleTeam, buildItemSchedule, buildQuery, } from './utils';
import { EActionType } from './types';
import { setValue } from '../common';
import BatchMultidata from '~/utils/BatchMultidata';
import * as moment from 'moment';
import { createFolder, deleteFiles, uploadFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import { ACTION_DELETE, BASE_URL_API_NET, BUSINESS_UNITY, ENV, REFERENCE_DELETE, TypeBlockUpdated, } from '~/config/constants';
import { QueryBuilder } from 'odata-query-builder';
import { EActivityTypeApplication, EFatherTag, PRIORITY_TASK, STATUS_TASK, TYPE_TASK, } from '~/config/enums';
import { addOrUpdateTask, filterTask } from '../task/actions';
import { addOrUpdateByActivities, deleteByActivities, } from '../resource/actions';
import { getActivities, getActivityByTeamId } from '../activity/actions';
import { executeEventDeleteOutlook } from '../eventOutlook/actions';
import replaceSpecialCharacters from '~/utils/replaceSpecialCharacters';
export const fetchAllTeams = (filter) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    dispatch(setValue(EActionType.FETCH_ALL_REQUEST, null));
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${TEAM}${query}`, {
            headers,
        });
        dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, data === null || data === void 0 ? void 0 : data.value));
    }
    catch (error) {
        console.error(error);
        // handle your error
    }
});
export const fetchAdvancedTeams = (filter) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = yield api.post(`${BASE_URL_API_NET}Turma`, { queryString: filter || '', ev: ENV }, axiosConfig);
        resolve(data);
    }
    catch (error) {
        console.error(error);
    }
}));
export const getTeams = (filter) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${TEAM}${query}`, {
            headers,
        });
        resolve(data === null || data === void 0 ? void 0 : data.value);
    }
    catch (error) {
        console.error(error);
    }
}));
export const getTeamById = (teamId) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}turmaid`, 'eq', teamId));
        query.expand(`${PREFIX}Programa,${PREFIX}Turma_NomeTurma,${PREFIX}Temperatura,${PREFIX}Modalidade,${PREFIX}Turma_PessoasEnvolvidasTurma,${PREFIX}Turma_NomeTurma,${PREFIX}Turma_ParticipantesTurma,${PREFIX}CronogramadeDia_Turma,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}Turma_Compartilhamento`);
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
export const getTeamByIds = (teamIds) => {
    return new Promise((resolve, reject) => {
        if (!(teamIds === null || teamIds === void 0 ? void 0 : teamIds.length)) {
            resolve([]);
            return;
        }
        var query = new QueryBuilder().filter((f) => {
            f.or((p) => {
                teamIds.forEach((id) => p.filterExpression(`${PREFIX}turmaid`, 'eq', id));
                return p;
            });
            return f;
        });
        query.expand(`${PREFIX}Programa,${PREFIX}Turma_NomeTurma,${PREFIX}Temperatura,${PREFIX}Modalidade,${PREFIX}Turma_PessoasEnvolvidasTurma,${PREFIX}Turma_NomeTurma,${PREFIX}Turma_ParticipantesTurma,${PREFIX}CronogramadeDia_Turma,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}Turma_Compartilhamento`);
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
            f.filterExpression(`${PREFIX}nome`, 'eq', `${replaceSpecialCharacters(name)}`);
            if (programId) {
                f.filterExpression(`${PREFIX}Programa/${PREFIX}programaid`, 'eq', programId);
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
export const addOrUpdateTeam = (team, programId, { onSuccess, onError }, temperatureChanged, isUndo) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        const dataToSave = buildItem(team);
        let teamId = team === null || team === void 0 ? void 0 : team.id;
        let teamSaved;
        const teamSavedByName = yield getTeamByNameAndProgram(team.name, team.programId);
        if ((_a = teamSavedByName === null || teamSavedByName === void 0 ? void 0 : teamSavedByName.value) === null || _a === void 0 ? void 0 : _a.length) {
            const err = {
                data: {
                    error: {
                        message: 'Turma já cadastrada!',
                    },
                },
            };
            if (teamId) {
                const othersTagsSabedByName = (_b = teamSavedByName === null || teamSavedByName === void 0 ? void 0 : teamSavedByName.value) === null || _b === void 0 ? void 0 : _b.filter((tg) => (tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}turmaid`]) !== teamId);
                if (othersTagsSabedByName.length) {
                    reject(err);
                    onError === null || onError === void 0 ? void 0 : onError(err);
                    return;
                }
            }
            else {
                reject(err);
                onError === null || onError === void 0 ? void 0 : onError(err);
                return;
            }
        }
        try {
            const batch = new BatchMultidata(api);
            if (teamId) {
                const teamRequest = yield getTeamById(teamId);
                teamSaved = (_c = teamRequest === null || teamRequest === void 0 ? void 0 : teamRequest.value) === null || _c === void 0 ? void 0 : _c[0];
                const { currentUser } = getState().app;
                if ((teamSaved === null || teamSaved === void 0 ? void 0 : teamSaved[`_${PREFIX}editanto_value`]) &&
                    (teamSaved === null || teamSaved === void 0 ? void 0 : teamSaved[`_${PREFIX}editanto_value`]) !==
                        (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`])) {
                    const err = {
                        data: {
                            error: {
                                message: `Outra pessoa está editando esta turma!`,
                            },
                        },
                    };
                    reject(err);
                    onError === null || onError === void 0 ? void 0 : onError(err, teamSaved);
                    return;
                }
            }
            if (teamId) {
                batch.patch(TEAM, teamId, dataToSave);
            }
            else {
                const response = yield api({
                    url: TEAM,
                    method: 'POST',
                    headers: {
                        Prefer: 'return=representation',
                    },
                    data: dataToSave,
                });
                teamId = (_d = response.data) === null || _d === void 0 ? void 0 : _d[`${PREFIX}turmaid`];
                if (programId) {
                    yield api({
                        url: `${TEAM}(${teamId})/${PREFIX}Programa/$ref`,
                        method: 'PUT',
                        data: {
                            '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                            '@odata.id': `${PROGRAM}(${programId})`,
                        },
                    });
                }
            }
            batch.bulkPostRelationship(TEAM_NAME, TEAM, teamId, 'Turma_NomeTurma', (_e = team === null || team === void 0 ? void 0 : team.names) === null || _e === void 0 ? void 0 : _e.map((name) => buildItemFantasyName(name)));
            batch.bulkPostRelationship(TEAM_ENVOLVED_PEOPLE, TEAM, teamId, 'Turma_PessoasEnvolvidasTurma', (_g = (_f = team === null || team === void 0 ? void 0 : team.people) === null || _f === void 0 ? void 0 : _f.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _g === void 0 ? void 0 : _g.map((name, i) => buildItemPeopleTeam(name, i)));
            batch.bulkPostRelationship(TEAM_PARTICIPANTS, TEAM, teamId, 'Turma_ParticipantesTurma', (_h = team === null || team === void 0 ? void 0 : team.participants) === null || _h === void 0 ? void 0 : _h.map((name) => buildItemParticipant(name)));
            // If there are schedules.
            if ((_j = team === null || team === void 0 ? void 0 : team.schedules) === null || _j === void 0 ? void 0 : _j.length) {
                team.schedules.forEach((schedule) => {
                    var _a, _b;
                    const requestId = batch.post(SCHEDULE_DAY, buildItemSchedule(schedule));
                    batch.putReference(requestId, TEAM, teamId, 'Turma');
                    batch.bulkPostRelationshipReference(SCHEDULE_DAY_ENVOLVED_PEOPLE, requestId, 'CronogramadeDia_PessoasEnvolvidas', (_b = (_a = schedule === null || schedule === void 0 ? void 0 : schedule.people) === null || _a === void 0 ? void 0 : _a.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _b === void 0 ? void 0 : _b.map((pe) => buildItemPeople(pe)));
                    schedule.activities.forEach((activity) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                        const requestActivityId = batch.postRelationshipReference(ACTIVITY, requestId, 'CronogramadeDia_Atividade', buildItemActivity(Object.assign(Object.assign({}, activity), { teamId: teamId })));
                        batch.bulkPostRelationshipReference(ACTIVITY_ENVOLVED_PEOPLE, requestActivityId, 'Atividade_PessoasEnvolvidas', (_b = (_a = activity === null || activity === void 0 ? void 0 : activity.people) === null || _a === void 0 ? void 0 : _a.filter((e) => !!e.person && !(!e.id && e.deleted))) === null || _b === void 0 ? void 0 : _b.map((pe) => buildItemPeople(pe)));
                        batch.bulkPostRelationshipReference(ACTIVITY_DOCUMENTS, requestActivityId, 'Atividade_Documento', (_d = (_c = activity === null || activity === void 0 ? void 0 : activity.documents) === null || _c === void 0 ? void 0 : _c.filter((e) => !e.id && !e.deleted)) === null || _d === void 0 ? void 0 : _d.map((pe) => buildItemDocument(pe)));
                        batch.bulkPostReference(SPACE, (_e = activity === null || activity === void 0 ? void 0 : activity.spaces) === null || _e === void 0 ? void 0 : _e.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]), requestActivityId, 'Atividade_Espaco');
                        batch.bulkPostReference(TAG, (_f = activity === null || activity === void 0 ? void 0 : activity.equipments) === null || _f === void 0 ? void 0 : _f.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}etiquetaid`]), requestActivityId, 'Atividade_Equipamentos');
                        batch.bulkPostReference(FINITE_INFINITE_RESOURCES, (_g = activity === null || activity === void 0 ? void 0 : activity.finiteResource) === null || _g === void 0 ? void 0 : _g.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), requestActivityId, 'Atividade_RecursoFinitoInfinito');
                        batch.bulkDeleteReference(FINITE_INFINITE_RESOURCES, (_h = activity === null || activity === void 0 ? void 0 : activity.finiteResourceToDelete) === null || _h === void 0 ? void 0 : _h.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), activity === null || activity === void 0 ? void 0 : activity.id, 'Atividade_RecursoFinitoInfinito');
                        batch.bulkPostReference(FINITE_INFINITE_RESOURCES, (_j = activity === null || activity === void 0 ? void 0 : activity.infiniteResource) === null || _j === void 0 ? void 0 : _j.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), requestActivityId, 'Atividade_RecursoFinitoInfinito');
                        batch.bulkDeleteReference(FINITE_INFINITE_RESOURCES, (_k = activity === null || activity === void 0 ? void 0 : activity.infiniteResourceToDelete) === null || _k === void 0 ? void 0 : _k.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), requestActivityId, 'Atividade_RecursoFinitoInfinito');
                        batch.bulkPostRelationshipReference(ACTIVITY_NAME, requestActivityId, 'Atividade_NomeAtividade', (_l = activity === null || activity === void 0 ? void 0 : activity.names) === null || _l === void 0 ? void 0 : _l.map((name) => buildItemFantasyName(name)));
                        (_m = activity === null || activity === void 0 ? void 0 : activity.academicRequests) === null || _m === void 0 ? void 0 : _m.forEach((academicRequest) => {
                            var _a, _b;
                            const academicRequestToSave = buildItemAcademicRequest(Object.assign(Object.assign({}, academicRequest), { teamId }));
                            const academicRequestRefId = batch.postRelationshipReference(ACADEMIC_REQUESTS, requestActivityId, 'RequisicaoAcademica_Atividade', academicRequestToSave);
                            if (!academicRequest.deleted) {
                                batch.bulkPostRelationshipReference(ACADEMIC_REQUESTS_ENVOLVED_PEOPLE, academicRequestRefId, 'Requisicao_PessoasEnvolvidas', (_b = (_a = academicRequest === null || academicRequest === void 0 ? void 0 : academicRequest.people) === null || _a === void 0 ? void 0 : _a.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _b === void 0 ? void 0 : _b.map((pe) => buildItemPeopleAcademicRequest(Object.assign(Object.assign({}, pe), { activityId: requestActivityId }))));
                            }
                        });
                    });
                });
            }
            yield batch.execute();
            const { app, tag, environmentReference } = getState();
            const { context } = app;
            const { dictTag } = tag;
            const { references } = environmentReference;
            if (!team.model &&
                ((_k = team === null || team === void 0 ? void 0 : team.temperature) === null || _k === void 0 ? void 0 : _k[`${PREFIX}nome`]) === EFatherTag.CONTRATADO) {
                const task = yield filterTask({
                    teamId,
                    sequence: 1,
                });
                if (!(task === null || task === void 0 ? void 0 : task.length)) {
                    const programDirector = team.people.find((e) => { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.function) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) === EFatherTag.DIRETOR_PROGRAMA; }).person;
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
                    yield dispatch(addOrUpdateTask(newTask, {
                        onSuccess: () => null,
                        onError: () => null,
                    }));
                }
            }
            const activities = yield getActivities({
                teamId,
                typeApplication: EActivityTypeApplication.APLICACAO,
                active: 'Ativo',
            });
            if (((_l = team === null || team === void 0 ? void 0 : team.temperature) === null || _l === void 0 ? void 0 : _l[`${PREFIX}nome`]) !== EFatherTag.CONTRATADO &&
                temperatureChanged) {
                yield deleteByActivities(activities, { references }, { id: teamId, type: TypeBlockUpdated.Turma });
            }
            else if (((_m = team === null || team === void 0 ? void 0 : team.temperature) === null || _m === void 0 ? void 0 : _m[`${PREFIX}nome`]) === EFatherTag.CONTRATADO) {
                yield addOrUpdateByActivities(activities, { references, dictTag }, {
                    teamId,
                }, {
                    type: TypeBlockUpdated.Turma,
                    id: teamId,
                    temperatureId: (_o = team === null || team === void 0 ? void 0 : team.temperature) === null || _o === void 0 ? void 0 : _o[`${PREFIX}etiquetaid`],
                    changeTemperature: temperatureChanged,
                    isUndo,
                });
            }
            if (!(team === null || team === void 0 ? void 0 : team.isLoadModel)) {
                yield uploadTeamFiles(team, teamId, context);
            }
            const newTeam = yield getTeamById(teamId);
            resolve('Salvo com sucesso!');
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_p = newTeam === null || newTeam === void 0 ? void 0 : newTeam.value) === null || _p === void 0 ? void 0 : _p[0]);
        }
        catch (err) {
            console.error(err);
            reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err === null || err === void 0 ? void 0 : err.response);
        }
    }));
});
export const updateEnvolvedPerson = (id, teamId, toSave, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _q, _r;
        const batch = new BatchMultidata(api);
        batch.patch(TEAM_ENVOLVED_PEOPLE, id, toSave);
        try {
            yield batch.execute();
            const schedule = yield getTeamById(teamId);
            resolve((_q = schedule === null || schedule === void 0 ? void 0 : schedule.value) === null || _q === void 0 ? void 0 : _q[0]);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_r = schedule === null || schedule === void 0 ? void 0 : schedule.value) === null || _r === void 0 ? void 0 : _r[0]);
        }
        catch (err) {
            reject === null || reject === void 0 ? void 0 : reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
    }));
});
export const deleteTeam = (teamId, { onSuccess, onError }) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const eventsToDelete = [];
        const batch = new BatchMultidata(api);
        const { environmentReference, space, person, app } = getState();
        const { dictSpace } = space;
        const { dictPeople } = person;
        batch.patch(TEAM, teamId, {
            [`${PREFIX}ativo`]: false,
            [`${PREFIX}excluido`]: true,
        });
        const activityRequest = yield getActivityByTeamId(teamId);
        const activities = activityRequest === null || activityRequest === void 0 ? void 0 : activityRequest.value;
        activities === null || activities === void 0 ? void 0 : activities.forEach((elm) => {
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
                    Origem: 'Turma',
                    IDOrigem: teamId,
                    IDPessoa: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`],
                }),
            });
            yield executeEventDeleteOutlook({ id: teamId, type: TypeBlockUpdated.Turma }, { onSuccess: () => null, onError: () => null });
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
export const updateTeam = (id, toSave, { onSuccess, onError }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const batch = new BatchMultidata(api);
        batch.patch(TEAM, id, toSave);
        try {
            yield batch.execute();
            const activity = yield getTeamById(id);
            resolve((_a = activity === null || activity === void 0 ? void 0 : activity.value) === null || _a === void 0 ? void 0 : _a[0]);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_b = activity === null || activity === void 0 ? void 0 : activity.value) === null || _b === void 0 ? void 0 : _b[0]);
        }
        catch (err) {
            reject === null || reject === void 0 ? void 0 : reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
    }));
};
export const uploadTeamFiles = (team, teamId, context) => {
    return new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            if ((_a = team === null || team === void 0 ? void 0 : team.anexos) === null || _a === void 0 ? void 0 : _a.length) {
                const folder = `Turma/${moment(team === null || team === void 0 ? void 0 : team.createdon).format('YYYY')}/${teamId}`;
                const attachmentsToDelete = (_b = team === null || team === void 0 ? void 0 : team.anexos) === null || _b === void 0 ? void 0 : _b.filter((file) => file.relativeLink && file.deveExcluir);
                const attachmentsToSave = (_c = team === null || team === void 0 ? void 0 : team.anexos) === null || _c === void 0 ? void 0 : _c.filter((file) => !file.relativeLink && !file.deveExcluir);
                yield deleteFiles(sp, attachmentsToDelete);
                yield createFolder(sp, folder, 'Anexos Interno');
                yield uploadFiles(sp, `${context.pageContext.web.serverRelativeUrl}/Anexos Interno/${folder}`, attachmentsToSave);
            }
            res('Sucesso');
        }
        catch (err) {
            console.error(err);
            rej(err);
        }
    }));
};
//# sourceMappingURL=actions.js.map