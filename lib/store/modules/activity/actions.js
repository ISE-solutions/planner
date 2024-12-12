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
import { ACADEMIC_REQUESTS, ACADEMIC_REQUESTS_ENVOLVED_PEOPLE, ACTIVITY, ACTIVITY_DOCUMENTS, ACTIVITY_ENVOLVED_PEOPLE, ACTIVITY_NAME, FINITE_INFINITE_RESOURCES, PERSON, PREFIX, SCHEDULE_DAY, SPACE, TAG, } from '~/config/database';
import { buildItem, buildItemAcademicRequest, buildItemDocument, buildItemFantasyName, buildItemPeople, buildItemPeopleAcademicRequest, buildQuery, } from './utils';
import { EActionType } from './types';
import { setValue } from '../common';
import BatchMultidata from '~/utils/BatchMultidata';
import * as moment from 'moment';
import { ACTION_DELETE, BASE_URL_API_NET, BUSINESS_UNITY, ENV, TypeBlockUpdated, } from '~/config/constants';
import { QueryBuilder } from 'odata-query-builder';
import { EActivityTypeApplication, TYPE_ACTIVITY, TYPE_TASK, } from '~/config/enums';
import { addOrUpdateByActivities, deleteByActivity, } from '../resource/actions';
import replaceSpecialCharacters from '~/utils/replaceSpecialCharacters';
import { addOrUpdateTask } from '../task/actions';
import { executeEventDeleteOutlook } from '../eventOutlook/actions';
export const fetchAllActivities = (filter) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    dispatch(setValue(EActionType.FETCH_ALL_REQUEST, null));
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${ACTIVITY}${query}`, {
            headers,
        });
        dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, data === null || data === void 0 ? void 0 : data.value));
    }
    catch (error) {
        console.error(error);
        // handle your error
    }
});
export const fetchAdvancedActivities = (filter) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = yield api.post(`${BASE_URL_API_NET}Atividade`, { queryString: filter || '', ev: ENV }, axiosConfig);
        resolve(data);
    }
    catch (error) {
        console.error(error);
    }
}));
export const getActivities = (filter) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${ACTIVITY}${query}`, {
            headers,
        });
        resolve(data === null || data === void 0 ? void 0 : data.value);
    }
    catch (error) {
        console.error(error);
    }
}));
export const getActivity = (id) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}atividadeid`, 'eq', id));
        query.expand(`${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por,${PREFIX}Programa,${PREFIX}Turma`);
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
export const getActivityByIds = (ids) => {
    return new Promise((resolve, reject) => {
        if (!ids.length) {
            resolve({ value: [] });
            return;
        }
        var query = new QueryBuilder().filter((f) => {
            f.or((p) => {
                ids.forEach((id) => p.filterExpression(`${PREFIX}atividadeid`, 'eq', id));
                return p;
            });
            return f;
        });
        query.expand(`${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por,${PREFIX}Programa,${PREFIX}Turma`);
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
export const getActivityPermitions = (id) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}atividadeid`, 'eq', id));
        query.expand(`${PREFIX}Atividade_Compartilhamento,${PREFIX}Programa,${PREFIX}Turma`);
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
export const getActivityByScheduleId = (scheduleId, onlyActive = true) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => {
            f.filterPhrase(`${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}cronogramadediaid eq '${scheduleId}')`);
            if (onlyActive) {
                f.filterExpression(`${PREFIX}ativo`, 'eq', true);
                f.filterExpression(`${PREFIX}excluido`, 'eq', false);
            }
            return f;
        });
        query.expand(`${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por`);
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
export const getActivityByTeamId = (teamId) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => {
            f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', teamId);
            f.filterExpression(`${PREFIX}ativo`, 'eq', true);
            return f;
        });
        query.expand(`${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por`);
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
export const getActivityByProgramId = (programId) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => {
            f.filterExpression(`${PREFIX}Programa/${PREFIX}programaid`, 'eq', programId);
            f.filterExpression(`${PREFIX}ativo`, 'eq', true);
            return f;
        });
        query.expand(`${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por`);
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
            f.filterExpression(`${PREFIX}nome`, 'eq', `${replaceSpecialCharacters(name)}`);
            f.filterExpression(`${PREFIX}tipo`, 'eq', type);
            f.filterExpression(`${PREFIX}tipoaplicacao`, 'eq', EActivityTypeApplication.PLANEJAMENTO);
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
export const getAcademicRequestsByActivityId = (activityId) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => {
            f.filterPhrase(`_ise_requisicaoacademica_atividade_value eq '${activityId}'`);
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
            resolve(data === null || data === void 0 ? void 0 : data.value);
        })
            .catch((err) => {
            reject(err);
        });
    });
};
export const getAcademicRequestsByTeamId = (teamId) => {
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
            resolve(data === null || data === void 0 ? void 0 : data.value);
        })
            .catch((err) => {
            reject(err);
        });
    });
};
export const addOrUpdateActivity = (activity, { onSuccess, onError }) => (dispatch, getState) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        if (activity.typeApplication === EActivityTypeApplication.PLANEJAMENTO) {
            const activitySavedByName = yield getActivityByName(activity.name, activity.type);
            if ((_a = activitySavedByName === null || activitySavedByName === void 0 ? void 0 : activitySavedByName.value) === null || _a === void 0 ? void 0 : _a.length) {
                const err = {
                    data: {
                        error: {
                            message: `${activity.type === TYPE_ACTIVITY.ACADEMICA
                                ? 'Atividade acadêmica'
                                : activity.type === TYPE_ACTIVITY.NON_ACADEMICA
                                    ? 'Atividade não acadêmica'
                                    : 'Atividade interna'} já cadastrada!`,
                        },
                    },
                };
                if (activity.id) {
                    const othersActivitySavedByName = (_b = activitySavedByName === null || activitySavedByName === void 0 ? void 0 : activitySavedByName.value) === null || _b === void 0 ? void 0 : _b.filter((tg) => (tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}atividadeid`]) !== activity.id);
                    if (othersActivitySavedByName.length) {
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
        }
        let dataToSave = buildItem(activity);
        if (activity.id) {
            const newSpaces = (_c = activity.spaces) === null || _c === void 0 ? void 0 : _c.map((tag) => tag.value);
            for (let j = 0; j < activity.previousSpace.length; j++) {
                const rel = activity.previousSpace[j];
                if (!(newSpaces === null || newSpaces === void 0 ? void 0 : newSpaces.includes(rel[`${PREFIX}espacoid`]))) {
                    yield api({
                        url: `${SPACE}(${rel[`${PREFIX}espacoid`]})/${PREFIX}Atividade_Espaco(${activity.id})/$ref`,
                        method: 'DELETE',
                    });
                }
            }
        }
        api({
            url: activity.id ? `${ACTIVITY}(${activity.id})` : `${ACTIVITY}`,
            method: (activity === null || activity === void 0 ? void 0 : activity.id) ? 'PATCH' : 'POST',
            headers: {
                Prefer: 'return=representation',
            },
            data: dataToSave,
        })
            .then(({ data }) => __awaiter(void 0, void 0, void 0, function* () {
            var _d, _e;
            if ((_d = activity === null || activity === void 0 ? void 0 : activity.spaces) === null || _d === void 0 ? void 0 : _d.length) {
                for (let j = 0; j < activity.spaces.length; j++) {
                    const rel = activity.spaces[j];
                    yield api({
                        url: `${ACTIVITY}(${data === null || data === void 0 ? void 0 : data[`${PREFIX}atividadeid`]})/${PREFIX}Atividade_Espaco/$ref`,
                        method: 'PUT',
                        data: {
                            '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                            '@odata.id': `${SPACE}(${rel.value})`,
                        },
                    });
                }
            }
            const newActv = yield getActivity(data === null || data === void 0 ? void 0 : data[`${PREFIX}atividadeid`]);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_e = newActv === null || newActv === void 0 ? void 0 : newActv.value) === null || _e === void 0 ? void 0 : _e[0]);
            resolve(data);
        }))
            .catch(({ response }) => {
            onError === null || onError === void 0 ? void 0 : onError(response);
            reject(response);
        });
    }));
};
export const updateActivityAll = (activity, { onSuccess, onError }) => (dispatch, getState) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    try {
        if (activity.typeApplication === EActivityTypeApplication.PLANEJAMENTO) {
            const activitySavedByName = yield getActivityByName(activity.name, activity.type);
            if ((_a = activitySavedByName === null || activitySavedByName === void 0 ? void 0 : activitySavedByName.value) === null || _a === void 0 ? void 0 : _a.length) {
                const err = {
                    data: {
                        error: {
                            message: `${activity.type === TYPE_ACTIVITY.ACADEMICA
                                ? 'Atividade acadêmica'
                                : activity.type === TYPE_ACTIVITY.NON_ACADEMICA
                                    ? 'Atividade não acadêmica'
                                    : 'Atividade interna'} já cadastrada!`,
                        },
                    },
                };
                if (activity.id) {
                    const othersActivitySavedByName = (_b = activitySavedByName === null || activitySavedByName === void 0 ? void 0 : activitySavedByName.value) === null || _b === void 0 ? void 0 : _b.filter((tg) => (tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}atividadeid`]) !== activity.id);
                    if (othersActivitySavedByName.length) {
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
        }
        let dataToSave = buildItem(activity);
        const batch = new BatchMultidata(api);
        let activityId = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`];
        if (activityId) {
            const activityRequest = yield getActivity(activityId);
            const actvSaved = (_c = activityRequest === null || activityRequest === void 0 ? void 0 : activityRequest.value) === null || _c === void 0 ? void 0 : _c[0];
            const { currentUser } = getState().app;
            if ((actvSaved === null || actvSaved === void 0 ? void 0 : actvSaved[`_${PREFIX}editanto_value`]) &&
                activity.typeApplication === EActivityTypeApplication.APLICACAO &&
                (actvSaved === null || actvSaved === void 0 ? void 0 : actvSaved[`_${PREFIX}editanto_value`]) !==
                    (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`])) {
                const err = {
                    data: {
                        error: {
                            message: `Outra pessoa está editando esta atividade!`,
                        },
                    },
                };
                reject(err);
                onError === null || onError === void 0 ? void 0 : onError(err, actvSaved);
                return;
            }
            batch.patch(ACTIVITY, activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], dataToSave);
        }
        else {
            const response = yield api({
                url: ACTIVITY,
                method: 'POST',
                headers: {
                    Prefer: 'return=representation',
                },
                data: dataToSave,
            });
            activityId = (_d = response.data) === null || _d === void 0 ? void 0 : _d[`${PREFIX}atividadeid`];
        }
        batch.bulkPostRelationship(ACTIVITY_ENVOLVED_PEOPLE, ACTIVITY, activityId, 'Atividade_PessoasEnvolvidas', (_e = activity === null || activity === void 0 ? void 0 : activity.people) === null || _e === void 0 ? void 0 : _e.map((pe) => buildItemPeople(pe)));
        batch.bulkPostReferenceRelatioship(ACTIVITY, SPACE, activityId, 'Atividade_Espaco', (_f = activity === null || activity === void 0 ? void 0 : activity.spaces) === null || _f === void 0 ? void 0 : _f.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]));
        batch.bulkDeleteReferenceParent(ACTIVITY, (_g = activity === null || activity === void 0 ? void 0 : activity.spacesToDelete) === null || _g === void 0 ? void 0 : _g.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]), activityId, 'Atividade_Espaco');
        if (activity === null || activity === void 0 ? void 0 : activity.scheduleId) {
            batch.bulkPostReferenceRelatioship(ACTIVITY, SCHEDULE_DAY, activityId, 'CronogramadeDia_Atividade', [activity === null || activity === void 0 ? void 0 : activity.scheduleId]);
        }
        batch.bulkDeleteReferenceParent(ACTIVITY, (_h = activity === null || activity === void 0 ? void 0 : activity.spacesToDelete) === null || _h === void 0 ? void 0 : _h.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]), activityId, 'Atividade_Espaco');
        batch.bulkPostRelationship(ACTIVITY_NAME, ACTIVITY, activityId, 'Atividade_NomeAtividade', (_j = activity === null || activity === void 0 ? void 0 : activity.names) === null || _j === void 0 ? void 0 : _j.map((name) => buildItemFantasyName(name)));
        batch.bulkPostRelationship(ACTIVITY_DOCUMENTS, ACTIVITY, activityId, 'Atividade_Documento', (_l = (_k = activity === null || activity === void 0 ? void 0 : activity.documents) === null || _k === void 0 ? void 0 : _k.filter((e) => !(!e.id && e.deleted))) === null || _l === void 0 ? void 0 : _l.map((pe) => buildItemDocument(pe)));
        (_m = activity === null || activity === void 0 ? void 0 : activity.academicRequests) === null || _m === void 0 ? void 0 : _m.forEach((academicRequest) => {
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
                dispatch(addOrUpdateTask({
                    title: academicRequest.description,
                    type: TYPE_TASK.REQUISICAO_ACADEMICA,
                    responsible: responsible,
                    group: group === null || group === void 0 ? void 0 : group[0],
                    completionForecast: academicRequest.deliveryDate
                        ? academicRequest.deliveryDate
                        : moment().add('d', academicRequest.deadline),
                    programId: activity === null || activity === void 0 ? void 0 : activity.programId,
                    teamId: activity === null || activity === void 0 ? void 0 : activity.teamId,
                    activityId: activityId,
                }, {
                    onSuccess: () => null,
                    onError: () => null,
                }));
            }
        });
        (_o = activity === null || activity === void 0 ? void 0 : activity.activities) === null || _o === void 0 ? void 0 : _o.forEach((elm) => {
            batch.patch(ACTIVITY, elm === null || elm === void 0 ? void 0 : elm.id, buildItem(elm));
        });
        yield batch.execute();
        let actv = yield getActivity(activityId);
        const { tag, environmentReference } = getState();
        const { dictTag } = tag;
        const { references } = environmentReference;
        yield addOrUpdateByActivities(actv === null || actv === void 0 ? void 0 : actv.value, { dictTag, references }, {
            activityId: activityId,
        }, {
            type: TypeBlockUpdated.Atividade,
            id: activityId,
        });
        resolve('Success');
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_p = actv === null || actv === void 0 ? void 0 : actv.value) === null || _p === void 0 ? void 0 : _p[0]);
    }
    catch (err) {
        onError === null || onError === void 0 ? void 0 : onError(err);
        reject(err);
    }
}));
export const batchUpdateActivityAll = (activities, activityRef, { programId, teamId, scheduleId }, { onSuccess, onError }) => (dispatch, getState) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    var _q, _r, _s;
    try {
        const batch = new BatchMultidata(api);
        const activityRefId = (activityRef === null || activityRef === void 0 ? void 0 : activityRef.id) || (activityRef === null || activityRef === void 0 ? void 0 : activityRef[`${PREFIX}atividadeid`]);
        const activityRequest = yield getActivity(activityRefId);
        const actvSaved = (_q = activityRequest === null || activityRequest === void 0 ? void 0 : activityRequest.value) === null || _q === void 0 ? void 0 : _q[0];
        const { currentUser } = getState().app;
        if ((actvSaved === null || actvSaved === void 0 ? void 0 : actvSaved[`_${PREFIX}editanto_value`]) &&
            activityRef.typeApplication === EActivityTypeApplication.APLICACAO &&
            (actvSaved === null || actvSaved === void 0 ? void 0 : actvSaved[`_${PREFIX}editanto_value`]) !==
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`])) {
            const err = {
                data: {
                    error: {
                        message: `Outra pessoa está editando esta atividade!`,
                    },
                },
            };
            reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err, actvSaved);
            return;
        }
        activities === null || activities === void 0 ? void 0 : activities.forEach((activity) => __awaiter(void 0, void 0, void 0, function* () {
            var _t, _u, _v, _w, _x, _y, _z, _0, _1;
            let dataToSave = buildItem(activity);
            let activityId = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`];
            if (activityId) {
                batch.patch(ACTIVITY, activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], dataToSave);
            }
            else {
                const response = yield api({
                    url: ACTIVITY,
                    method: 'POST',
                    headers: {
                        Prefer: 'return=representation',
                    },
                    data: dataToSave,
                });
                activityId = (_t = response.data) === null || _t === void 0 ? void 0 : _t[`${PREFIX}atividadeid`];
            }
            batch.bulkPostRelationship(ACTIVITY_ENVOLVED_PEOPLE, ACTIVITY, activityId, 'Atividade_PessoasEnvolvidas', (_u = activity === null || activity === void 0 ? void 0 : activity.people) === null || _u === void 0 ? void 0 : _u.map((pe) => buildItemPeople(pe)));
            batch.bulkPostReferenceRelatioship(ACTIVITY, SPACE, activityId, 'Atividade_Espaco', (_v = activity === null || activity === void 0 ? void 0 : activity.spaces) === null || _v === void 0 ? void 0 : _v.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]));
            if (activity === null || activity === void 0 ? void 0 : activity.scheduleId) {
                batch.bulkPostReferenceRelatioship(ACTIVITY, SCHEDULE_DAY, activityId, 'CronogramadeDia_Atividade', [activity === null || activity === void 0 ? void 0 : activity.scheduleId]);
            }
            batch.bulkDeleteReferenceParent(ACTIVITY, (_w = activity === null || activity === void 0 ? void 0 : activity.spacesToDelete) === null || _w === void 0 ? void 0 : _w.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]), activityId, 'Atividade_Espaco');
            batch.bulkPostRelationship(ACTIVITY_NAME, ACTIVITY, activityId, 'Atividade_NomeAtividade', (_x = activity === null || activity === void 0 ? void 0 : activity.names) === null || _x === void 0 ? void 0 : _x.map((name) => buildItemFantasyName(name)));
            batch.bulkPostRelationship(ACTIVITY_DOCUMENTS, ACTIVITY, activityId, 'Atividade_Documento', (_z = (_y = activity === null || activity === void 0 ? void 0 : activity.documents) === null || _y === void 0 ? void 0 : _y.filter((e) => !(!e.id && e.deleted))) === null || _z === void 0 ? void 0 : _z.map((pe) => buildItemDocument(pe)));
            (_0 = activity === null || activity === void 0 ? void 0 : activity.academicRequests) === null || _0 === void 0 ? void 0 : _0.forEach((academicRequest) => {
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
                    dispatch(addOrUpdateTask({
                        title: academicRequest.description,
                        type: TYPE_TASK.REQUISICAO_ACADEMICA,
                        responsible: responsible,
                        group: group === null || group === void 0 ? void 0 : group[0],
                        completionForecast: academicRequest.deliveryDate
                            ? academicRequest.deliveryDate
                            : moment().add('d', academicRequest.deadline),
                        programId: activity === null || activity === void 0 ? void 0 : activity.programId,
                        teamId: activity === null || activity === void 0 ? void 0 : activity.teamId,
                        activityId: activityId,
                    }, {
                        onSuccess: () => null,
                        onError: () => null,
                    }));
                }
            });
            (_1 = activity === null || activity === void 0 ? void 0 : activity.activities) === null || _1 === void 0 ? void 0 : _1.forEach((elm) => {
                batch.patch(ACTIVITY, elm === null || elm === void 0 ? void 0 : elm.id, buildItem(elm));
            });
        }));
        yield batch.execute();
        if ((activityRef === null || activityRef === void 0 ? void 0 : activityRef[`${PREFIX}tipoaplicacao`]) ===
            EActivityTypeApplication.APLICACAO) {
            const { tag, environmentReference } = getState();
            const { dictTag } = tag;
            const { references } = environmentReference;
            const responseActivities = yield getActivityByScheduleId(scheduleId);
            const activities = (_r = responseActivities === null || responseActivities === void 0 ? void 0 : responseActivities.value) === null || _r === void 0 ? void 0 : _r.map((e) => (Object.assign(Object.assign({}, e), { teamId,
                programId,
                scheduleId })));
            yield addOrUpdateByActivities(activities, { dictTag, references }, {
                scheduleId,
            }, {
                type: TypeBlockUpdated.DiaAula,
                id: scheduleId,
            });
        }
        let actv = yield getActivity(activityRefId);
        resolve('Success');
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_s = actv === null || actv === void 0 ? void 0 : actv.value) === null || _s === void 0 ? void 0 : _s[0]);
    }
    catch (err) {
        onError === null || onError === void 0 ? void 0 : onError(err);
        reject(err);
    }
}));
export const updateActivity = (id, toSave, { onSuccess, onError }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const batch = new BatchMultidata(api);
        batch.patch(ACTIVITY, id, toSave);
        try {
            yield batch.execute();
            const activity = yield getActivity(id);
            resolve((_a = activity === null || activity === void 0 ? void 0 : activity.value) === null || _a === void 0 ? void 0 : _a[0]);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_b = activity === null || activity === void 0 ? void 0 : activity.value) === null || _b === void 0 ? void 0 : _b[0]);
        }
        catch (err) {
            console.error(err);
            reject === null || reject === void 0 ? void 0 : reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
    }));
};
export const batchUpdateActivity = (activities, { onSuccess, onError }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const batch = new BatchMultidata(api);
        activities.forEach((elm) => {
            batch.patch(ACTIVITY, elm.id, elm.data);
        });
        try {
            yield batch.execute();
            resolve('Sucesso');
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess('Sucesso');
        }
        catch (err) {
            console.error(err);
            reject === null || reject === void 0 ? void 0 : reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
    }));
};
export const updateEnvolvedPerson = (id, activityId, toSave, { onSuccess, onError }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const batch = new BatchMultidata(api);
        batch.patch(ACTIVITY_ENVOLVED_PEOPLE, id, toSave);
        try {
            yield batch.execute();
            const activity = yield getActivity(activityId);
            resolve((_a = activity === null || activity === void 0 ? void 0 : activity.value) === null || _a === void 0 ? void 0 : _a[0]);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_b = activity === null || activity === void 0 ? void 0 : activity.value) === null || _b === void 0 ? void 0 : _b[0]);
        }
        catch (err) {
            reject === null || reject === void 0 ? void 0 : reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
    }));
};
export const deleteActivity = (item, { onSuccess, onError }) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    api({
        url: `${ACTIVITY}(${item === null || item === void 0 ? void 0 : item.id})`,
        method: 'PATCH',
        data: {
            [`${PREFIX}excluido`]: true,
            [`${PREFIX}ativo`]: false,
        },
    })
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        var _2;
        const { environmentReference, space, person } = getState();
        const { dictSpace } = space;
        const { dictPeople } = person;
        const { references } = environmentReference;
        const eventsToDelete = [];
        (_2 = item === null || item === void 0 ? void 0 : item.activity) === null || _2 === void 0 ? void 0 : _2[`${PREFIX}recursos_Atividade`].forEach((resourceToDelete) => {
            var _a, _b, _c;
            const spaceid = resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`_${PREFIX}espaco_value`];
            const personid = resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`_${PREFIX}pessoa_value`];
            eventsToDelete.push({
                action: ACTION_DELETE,
                title: (_a = item === null || item === void 0 ? void 0 : item.activity) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`],
                activity: item.activity,
                email: ((_b = dictSpace === null || dictSpace === void 0 ? void 0 : dictSpace[spaceid]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}email`]) ||
                    ((_c = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[personid]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}email`]),
                start: moment(resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}inicio`]).format(),
                end: moment(resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}fim`]).format(),
                resourceId: resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}recursosid`],
                eventId: resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}eventoid`],
            });
        });
        yield executeEventDeleteOutlook({ id: item === null || item === void 0 ? void 0 : item.id, type: TypeBlockUpdated.Atividade }, {
            onSuccess: () => {
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            },
            onError: () => null,
        });
    }))
        .catch(({ response }) => {
        onError === null || onError === void 0 ? void 0 : onError(response);
    });
});
export const changeActivityDate = (activity, previousSchedule, newSchedule, { onSuccess, onError }) => (dispatch, getState) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            let dataToSave = buildItem(activity);
            const batch = new BatchMultidata(api);
            const requestId = batch.patch(ACTIVITY, activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], Object.assign(Object.assign({}, dataToSave), { [`${PREFIX}CronogramaDia@odata.bind`]: `/${SCHEDULE_DAY}(${newSchedule})` }));
            batch.deleteReference(ACTIVITY, activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], previousSchedule, 'CronogramadeDia_Atividade');
            batch.addReference(SCHEDULE_DAY, requestId, newSchedule, 'CronogramadeDia_Atividade');
            yield batch.execute();
            if ((activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipoaplicacao`]) ===
                EActivityTypeApplication.APLICACAO) {
                const { tag, environmentReference } = getState();
                const { dictTag } = tag;
                const { references } = environmentReference;
                const responseActivities = yield getActivityByScheduleId(newSchedule);
                const activities = (_a = responseActivities === null || responseActivities === void 0 ? void 0 : responseActivities.value) === null || _a === void 0 ? void 0 : _a.map((e) => (Object.assign(Object.assign({}, e), { programId: activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}_programa_value`], teamId: activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}turma_value`], scheduleId: newSchedule })));
                yield addOrUpdateByActivities(activities, { dictTag, references }, {
                    scheduleId: newSchedule,
                }, {
                    type: TypeBlockUpdated.DiaAula,
                    id: newSchedule,
                });
            }
            resolve('Success');
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        }
        catch (err) {
            onError === null || onError === void 0 ? void 0 : onError(err);
            reject(err);
        }
    }));
};
export const addOrUpdateClassroom = (activity, { onSuccess, onError }, returnNewValue = true) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _3, _4, _5, _6, _7, _8;
        const dataToUpdate = {
            [`${PREFIX}temaaula`]: activity.theme,
            [`${PREFIX}descricaoobjetivo`]: activity.description,
        };
        const batch = new BatchMultidata(api);
        const requestId = batch.patch(ACTIVITY, activity === null || activity === void 0 ? void 0 : activity.id, dataToUpdate);
        batch.bulkPostReference(TAG, (_3 = activity === null || activity === void 0 ? void 0 : activity.equipments) === null || _3 === void 0 ? void 0 : _3.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}etiquetaid`]), requestId, 'Atividade_Equipamentos');
        batch.bulkPostReference(FINITE_INFINITE_RESOURCES, (_4 = activity === null || activity === void 0 ? void 0 : activity.finiteResource) === null || _4 === void 0 ? void 0 : _4.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), requestId, 'Atividade_RecursoFinitoInfinito');
        batch.bulkPostReference(FINITE_INFINITE_RESOURCES, (_5 = activity === null || activity === void 0 ? void 0 : activity.infiniteResource) === null || _5 === void 0 ? void 0 : _5.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), requestId, 'Atividade_RecursoFinitoInfinito');
        batch.bulkDeleteReference(TAG, (_6 = activity === null || activity === void 0 ? void 0 : activity.equipmentsToDelete) === null || _6 === void 0 ? void 0 : _6.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}etiquetaid`]), activity === null || activity === void 0 ? void 0 : activity.id, 'Atividade_Equipamentos');
        batch.bulkDeleteReferenceParent(ACTIVITY, (_7 = activity === null || activity === void 0 ? void 0 : activity.finiteInfiniteResourceToDelete) === null || _7 === void 0 ? void 0 : _7.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), activity === null || activity === void 0 ? void 0 : activity.id, 'Atividade_RecursoFinitoInfinito');
        yield batch.execute();
        if (returnNewValue) {
            const newActv = yield getActivity(activity.id);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_8 = newActv === null || newActv === void 0 ? void 0 : newActv.value) === null || _8 === void 0 ? void 0 : _8[0]);
        }
        resolve('Success');
    }));
});
export const addOrUpdateDocuments = (activity, { onSuccess, onError }, returnNewValue = true) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _9, _10, _11;
        const tagNames = [];
        try {
            if ((_9 = activity === null || activity === void 0 ? void 0 : activity.documents) === null || _9 === void 0 ? void 0 : _9.length) {
                for (let i = 0; i < activity.documents.length; i++) {
                    const tagName = activity.documents[i];
                    const { data } = yield api({
                        url: (tagName === null || tagName === void 0 ? void 0 : tagName.id)
                            ? `${ACTIVITY_DOCUMENTS}(${tagName === null || tagName === void 0 ? void 0 : tagName.id})?$select=${PREFIX}documentosatividadeid`
                            : `${ACTIVITY_DOCUMENTS}?$select=${PREFIX}documentosatividadeid`,
                        method: (tagName === null || tagName === void 0 ? void 0 : tagName.id) ? 'PATCH' : 'POST',
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
                    if (!(tagName === null || tagName === void 0 ? void 0 : tagName.id)) {
                        tagNames.push(`${ACTIVITY_DOCUMENTS}(${data === null || data === void 0 ? void 0 : data[`${PREFIX}documentosatividadeid`]})`);
                    }
                }
            }
            if (activity.id) {
                for (let j = 0; j < ((_10 = activity.previousDocuments) === null || _10 === void 0 ? void 0 : _10.length); j++) {
                    const rel = activity.previousDocuments[j];
                    const newNames = activity.documents.map((e) => e.id).filter((e) => e);
                    if (!(newNames === null || newNames === void 0 ? void 0 : newNames.includes(rel[`${PREFIX}documentosatividadeid`]))) {
                        yield api({
                            url: `${ACTIVITY_DOCUMENTS}(${rel[`${PREFIX}documentosatividadeid`]})`,
                            method: 'DELETE',
                        });
                    }
                }
            }
            for (let j = 0; j < (tagNames === null || tagNames === void 0 ? void 0 : tagNames.length); j++) {
                const rel = tagNames[j];
                yield api({
                    url: `${ACTIVITY}(${activity === null || activity === void 0 ? void 0 : activity.id})/${PREFIX}Atividade_Documento/$ref`,
                    method: 'PUT',
                    data: {
                        '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                        '@odata.id': rel,
                    },
                });
            }
            if (returnNewValue) {
                const newActv = yield getActivity(activity.id);
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_11 = newActv === null || newActv === void 0 ? void 0 : newActv.value) === null || _11 === void 0 ? void 0 : _11[0]);
            }
            resolve('Success');
        }
        catch (error) {
            onError === null || onError === void 0 ? void 0 : onError(error);
            reject(error);
        }
    }));
});
export const addOrUpdatePerson = (activity, { onSuccess, onError }, returnNewValue = true) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _12, _13, _14, _15, _16;
        const tagNames = [];
        try {
            if ((_12 = activity === null || activity === void 0 ? void 0 : activity.people) === null || _12 === void 0 ? void 0 : _12.length) {
                for (let i = 0; i < activity.people.length; i++) {
                    const tagName = activity.people[i];
                    const { data } = yield api({
                        url: (tagName === null || tagName === void 0 ? void 0 : tagName.id)
                            ? `${ACTIVITY_ENVOLVED_PEOPLE}(${tagName === null || tagName === void 0 ? void 0 : tagName.id})?$select=${PREFIX}pessoasenvolvidasatividadeid`
                            : `${ACTIVITY_ENVOLVED_PEOPLE}?$select=${PREFIX}pessoasenvolvidasatividadeid`,
                        method: (tagName === null || tagName === void 0 ? void 0 : tagName.id) ? 'PATCH' : 'POST',
                        headers: {
                            Prefer: 'return=representation',
                        },
                        data: {
                            [`${PREFIX}Pessoa@odata.bind`]: `/${PERSON}(${((_13 = tagName === null || tagName === void 0 ? void 0 : tagName.person) === null || _13 === void 0 ? void 0 : _13.value) || (tagName === null || tagName === void 0 ? void 0 : tagName[`_${PREFIX}pessoa_value`])})`,
                            [`${PREFIX}Funcao@odata.bind`]: `/${TAG}(${((_14 = tagName === null || tagName === void 0 ? void 0 : tagName.function) === null || _14 === void 0 ? void 0 : _14.value) || (tagName === null || tagName === void 0 ? void 0 : tagName[`_${PREFIX}funcao_value`])})`,
                        },
                    });
                    if (!(tagName === null || tagName === void 0 ? void 0 : tagName.id)) {
                        tagNames.push(`${ACTIVITY_ENVOLVED_PEOPLE}(${data === null || data === void 0 ? void 0 : data[`${PREFIX}pessoasenvolvidasatividadeid`]})`);
                    }
                }
            }
            if (activity.id) {
                for (let j = 0; j < ((_15 = activity.previousPeople) === null || _15 === void 0 ? void 0 : _15.length); j++) {
                    const rel = activity.previousPeople[j];
                    const newNames = activity.people.map((e) => e.id).filter((e) => e);
                    if (!(newNames === null || newNames === void 0 ? void 0 : newNames.includes(rel[`${PREFIX}pessoasenvolvidasatividadeid`]))) {
                        yield api({
                            url: `${ACTIVITY_ENVOLVED_PEOPLE}(${rel[`${PREFIX}pessoasenvolvidasatividadeid`]})`,
                            method: 'DELETE',
                        });
                    }
                }
            }
            for (let j = 0; j < tagNames.length; j++) {
                const rel = tagNames[j];
                yield api({
                    url: `${ACTIVITY}(${activity === null || activity === void 0 ? void 0 : activity.id})/${PREFIX}Atividade_PessoasEnvolvidas/$ref`,
                    method: 'PUT',
                    data: {
                        '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                        '@odata.id': rel,
                    },
                });
            }
            if (returnNewValue) {
                const newActv = yield getActivity(activity.id);
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_16 = newActv === null || newActv === void 0 ? void 0 : newActv.value) === null || _16 === void 0 ? void 0 : _16[0]);
            }
            resolve('Success');
        }
        catch (error) {
            onError === null || onError === void 0 ? void 0 : onError(error);
            reject(error);
        }
    }));
});
export const addOrUpdateObservation = (activity, { onSuccess, onError }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
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
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const newActv = yield getActivity(activity.id);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_a = newActv === null || newActv === void 0 ? void 0 : newActv.value) === null || _a === void 0 ? void 0 : _a[0]);
            resolve('Success');
        }))
            .catch(({ response }) => {
            onError === null || onError === void 0 ? void 0 : onError(response);
        });
    }));
};
export const addOrUpdateFantasyName = (activity, { onSuccess, onError }, returnNewValue = true) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _17, _18, _19;
        const tagNames = [];
        try {
            if ((_17 = activity === null || activity === void 0 ? void 0 : activity.names) === null || _17 === void 0 ? void 0 : _17.length) {
                for (let i = 0; i < activity.names.length; i++) {
                    const tagName = activity.names[i];
                    const { data } = yield api({
                        url: (tagName === null || tagName === void 0 ? void 0 : tagName.id)
                            ? `${ACTIVITY_NAME}(${tagName === null || tagName === void 0 ? void 0 : tagName.id})`
                            : `${ACTIVITY_NAME}`,
                        method: (tagName === null || tagName === void 0 ? void 0 : tagName.id) ? 'PATCH' : 'POST',
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
                    if (!(tagName === null || tagName === void 0 ? void 0 : tagName.id)) {
                        tagNames.push(`${ACTIVITY_NAME}(${data === null || data === void 0 ? void 0 : data[`${PREFIX}nomeatividadeid`]})`);
                    }
                }
            }
            if (activity.id) {
                for (let j = 0; j < ((_18 = activity.previousNames) === null || _18 === void 0 ? void 0 : _18.length); j++) {
                    const rel = activity.previousNames[j];
                    const newNames = activity.names.map((e) => e.id).filter((e) => e);
                    if (!(newNames === null || newNames === void 0 ? void 0 : newNames.includes(rel[`${PREFIX}nomeatividadeid`]))) {
                        yield api({
                            url: `${ACTIVITY_NAME}(${rel[`${PREFIX}nomeatividadeid`]})`,
                            method: 'DELETE',
                        });
                    }
                }
            }
            for (let j = 0; j < (tagNames === null || tagNames === void 0 ? void 0 : tagNames.length); j++) {
                const rel = tagNames[j];
                yield api({
                    url: `${ACTIVITY}(${activity === null || activity === void 0 ? void 0 : activity.id})/${PREFIX}Atividade_NomeAtividade/$ref`,
                    method: 'PUT',
                    data: {
                        '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                        '@odata.id': rel,
                    },
                });
            }
            if (returnNewValue) {
                const newActv = yield getActivity(activity.id);
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_19 = newActv === null || newActv === void 0 ? void 0 : newActv.value) === null || _19 === void 0 ? void 0 : _19[0]);
            }
            resolve('Success');
        }
        catch (error) {
            onError === null || onError === void 0 ? void 0 : onError(error);
            reject(error);
        }
    }));
});
export const desactiveActivity = (activity, { onSuccess, onError }) => (dispatch) => {
    new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            let data = {
                [`${PREFIX}tipodesativacao`]: activity.type,
            };
            if (activity.type === 'definitivo') {
                data[`${PREFIX}ativo`] = false;
            }
            if (activity.type === 'temporario') {
                if (moment()
                    .startOf('day')
                    .isSame(moment(activity.start.toISOString()).startOf('day'))) {
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
                url: `${ACTIVITY}(${(_a = activity === null || activity === void 0 ? void 0 : activity.data) === null || _a === void 0 ? void 0 : _a[`${PREFIX}atividadeid`]})`,
                method: 'PATCH',
                data,
            })
                .then(({ data }) => {
                var _a, _b;
                if (((_a = activity === null || activity === void 0 ? void 0 : activity.data) === null || _a === void 0 ? void 0 : _a[`${PREFIX}tipoaplicacao`]) !==
                    EActivityTypeApplication.PLANEJAMENTO) {
                    dispatch(deleteByActivity((_b = activity === null || activity === void 0 ? void 0 : activity.data) === null || _b === void 0 ? void 0 : _b[`${PREFIX}atividadeid`]));
                }
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                resolve(data);
            })
                .catch(({ response }) => {
                onError === null || onError === void 0 ? void 0 : onError(response);
                reject(response);
            });
        }
        catch (error) {
            reject(error);
        }
    }));
};
export const activeActivity = (activity, { onSuccess, onError }) => {
    api({
        url: `${ACTIVITY}(${activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]})`,
        method: 'PATCH',
        data: {
            [`${PREFIX}ativo`]: true,
        },
    })
        .then(({ data }) => {
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
    })
        .catch(({ response }) => {
        onError === null || onError === void 0 ? void 0 : onError(response);
    });
};
export const bulkUpdateActivity = (toUpdate, { onSuccess, onError }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let i = 0; i < toUpdate.data.length; i++) {
            const activity = toUpdate.data[i];
            yield api({
                url: `${ACTIVITY}(${activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]})`,
                method: 'PATCH',
                data: {
                    [`${PREFIX}escolaorigem`]: toUpdate.school,
                },
            });
        }
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
    }
    catch (e) {
        onError === null || onError === void 0 ? void 0 : onError(e);
    }
});
//# sourceMappingURL=actions.js.map