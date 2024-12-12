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
import * as moment from 'moment';
import { TAG, SPACE, PERSON, PREFIX, ACTIVITY, ACTIVITY_NAME, ACTIVITY_DOCUMENTS, ACTIVITY_ENVOLVED_PEOPLE, SCHEDULE_DAY, ACADEMIC_REQUESTS, ACADEMIC_REQUESTS_ENVOLVED_PEOPLE, FINITE_INFINITE_RESOURCES, } from '~/config/database';
import axios from '../useAxios/useAxios';
import { BUSINESS_UNITY } from '~/config/constants';
import { EActivityTypeApplication, TYPE_ACTIVITY } from '~/config/enums';
import removeEmptyPropertyFromObject from '~/utils/removeEmptyPropertyFromObject';
import BatchMultidata from '~/utils/BatchMultidata';
import { useState } from 'react';
import useResource from '../useResource/useResource';
import useContextWebpart from '../useContextWebpart';
import replaceSpecialCharacters from '~/utils/replaceSpecialCharacters';
const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.searchQuery) &&
            f.or((p) => {
                p.filterPhrase(`contains(${PREFIX}nome,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}duracao,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}temaaula,'${filtro.searchQuery}')`);
                return p;
            });
        // tslint:disable-next-line: no-unused-expression
        filtro.active &&
            filtro.active !== 'Todos' &&
            f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');
        if (filtro.typeActivity) {
            f.filterExpression(`${PREFIX}tipo`, 'eq', filtro.typeActivity);
        }
        f.filterExpression(`${PREFIX}tipoaplicacao`, 'eq', filtro.typeApplication);
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.teamId) &&
            f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', filtro === null || filtro === void 0 ? void 0 : filtro.teamId);
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    query.expand(`${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por`);
    query.count();
    return query.toQuery();
};
const useActivity = (filter, options) => {
    const { context } = useContextWebpart();
    const useAxios = axios({ context: context });
    const query = buildQuery(filter);
    const [loadingSave, setLoadingSave] = useState(false);
    const [{ addOrUpdateByActivity, deleteByActivity }] = useResource({}, { manual: true });
    let headers = {};
    if (filter.rowsPerPage) {
        headers = {
            Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
    }
    const [{ data, loading, error }, refetch] = useAxios({
        url: `${ACTIVITY}${query}`,
        headers,
    }, {
        useCache: false,
        manual: !!(options === null || options === void 0 ? void 0 : options.manual),
    });
    const [{ data: postData, loading: postLoading, error: postError }, executePost,] = useAxios({
        url: `${ACTIVITY}`,
        method: 'POST',
    }, { manual: true });
    const getActivity = (id) => {
        return new Promise((resolve, reject) => {
            var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}atividadeid`, 'eq', id));
            query.expand(`${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por`);
            query.count();
            executePost({
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
    const getActivityByScheduleId = (scheduleId) => {
        return new Promise((resolve, reject) => {
            var query = new QueryBuilder().filter((f) => {
                f.filterPhrase(`${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}cronogramadediaid eq '${scheduleId}')`);
                f.filterExpression(`${PREFIX}ativo`, 'eq', true);
                return f;
            });
            query.expand(`${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por`);
            query.count();
            executePost({
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
    const getActivityByTeamId = (teamId) => {
        return new Promise((resolve, reject) => {
            var query = new QueryBuilder().filter((f) => {
                f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', teamId);
                f.filterExpression(`${PREFIX}ativo`, 'eq', true);
                return f;
            });
            query.expand(`${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por`);
            query.count();
            executePost({
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
    const getActivityByName = (name, type) => {
        return new Promise((resolve, reject) => {
            var query = new QueryBuilder().filter((f) => {
                f.filterPhrase(`contains(${PREFIX}nome,'${replaceSpecialCharacters(name)}')`);
                f.filterExpression(`${PREFIX}tipo`, 'eq', type);
                f.filterExpression(`${PREFIX}tipoaplicacao`, 'eq', EActivityTypeApplication.PLANEJAMENTO);
                return f;
            });
            query.count();
            executePost({
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
    const buildItem = (activity) => {
        var _a, _b, _c, _d, _e;
        return {
            [`${PREFIX}nome`]: activity.name,
            [`${PREFIX}tipo`]: activity.type || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]),
            [`${PREFIX}temaaula`]: activity.theme,
            [`${PREFIX}observacao`]: activity.observation,
            [`${PREFIX}descricaoobjetivo`]: activity.description,
            [`${PREFIX}quantidadesessao`]: activity.quantity || 0,
            [`${PREFIX}duracao`]: ((_a = activity.duration) === null || _a === void 0 ? void 0 : _a.format('HH:mm')) || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}duracao`]),
            [`${PREFIX}inicio`]: ((_b = activity.startTime) === null || _b === void 0 ? void 0 : _b.format('HH:mm')) || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}inicio`]),
            [`${PREFIX}fim`]: ((_c = activity.endTime) === null || _c === void 0 ? void 0 : _c.format('HH:mm')) || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}fim`]),
            [`${PREFIX}tipoaplicacao`]: activity.typeApplication,
            [`${PREFIX}datahorainicio`]: activity.startDate && moment(activity.startDate).format(),
            [`${PREFIX}datahorafim`]: activity.endDate && moment(activity.endDate).format(),
            [`${PREFIX}Turma@odata.bind`]: (activity === null || activity === void 0 ? void 0 : activity.teamId) && `/${PERSON}(${activity === null || activity === void 0 ? void 0 : activity.teamId})`,
            [`${PREFIX}AreaAcademica@odata.bind`]: (activity === null || activity === void 0 ? void 0 : activity.area) && `/${TAG}(${(_d = activity === null || activity === void 0 ? void 0 : activity.area) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`]})`,
            [`${PREFIX}Temperatura@odata.bind`]: (activity === null || activity === void 0 ? void 0 : activity.temperature) && `/${TAG}(${(_e = activity === null || activity === void 0 ? void 0 : activity.temperature) === null || _e === void 0 ? void 0 : _e.value})`,
        };
    };
    const buildItemFantasyName = (item) => {
        return {
            id: item.id,
            deleted: item.deleted,
            [`${PREFIX}nome`]: item.name,
            [`${PREFIX}nomeen`]: item.nameEn,
            [`${PREFIX}nomees`]: item.nameEs,
            [`${PREFIX}uso`]: item.use,
        };
    };
    const buildItemPeople = (item) => {
        var _a, _b, _c;
        return {
            id: item.id,
            deleted: item.deleted,
            [`${PREFIX}Pessoa@odata.bind`]: (item === null || item === void 0 ? void 0 : item.person) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`])
                ? `/${PERSON}(${((_a = item === null || item === void 0 ? void 0 : item.person) === null || _a === void 0 ? void 0 : _a.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`])})`
                : null,
            [`${PREFIX}Funcao@odata.bind`]: ((_b = item === null || item === void 0 ? void 0 : item.function) === null || _b === void 0 ? void 0 : _b.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}funcao_value`])
                ? `/${TAG}(${((_c = item === null || item === void 0 ? void 0 : item.function) === null || _c === void 0 ? void 0 : _c.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}funcao_value`])})`
                : null,
        };
    };
    const buildItemPeopleAcademicRequest = (item) => {
        var _a, _b, _c;
        return {
            id: item.id,
            deleted: item.deleted,
            [`${PREFIX}Pessoa@odata.bind`]: (item === null || item === void 0 ? void 0 : item.person) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`])
                ? `/${PERSON}(${((_a = item === null || item === void 0 ? void 0 : item.person) === null || _a === void 0 ? void 0 : _a.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`])})`
                : null,
            [`${PREFIX}Funcao@odata.bind`]: ((_b = item === null || item === void 0 ? void 0 : item.function) === null || _b === void 0 ? void 0 : _b.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}funcao_value`])
                ? `/${TAG}(${((_c = item === null || item === void 0 ? void 0 : item.function) === null || _c === void 0 ? void 0 : _c.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}funcao_value`])})`
                : null,
            [`${PREFIX}Atividade@odata.bind`]: '$' + item.activityId,
        };
    };
    const buildItemDocument = (item) => {
        return {
            id: item.id,
            deleted: item.deleted,
            [`${PREFIX}fonte`]: item.font,
            [`${PREFIX}link`]: item.link,
            [`${PREFIX}entrega`]: item.delivery,
            [`${PREFIX}nome`]: item.name,
        };
    };
    const buildItemAcademicRequest = (item) => {
        return {
            id: item.id,
            deleted: item.deleted,
            [`${PREFIX}descricao`]: item.description,
            [`${PREFIX}prazominimo`]: item.deadline,
            [`${PREFIX}link`]: item.link,
            [`${PREFIX}nomemoodle`]: item.nomemoodle,
            [`${PREFIX}momentoentrega`]: item.delivery,
            [`${PREFIX}dataentrega`]: item.deliveryDate && item.deliveryDate.format(),
        };
    };
    const addOrUpdateActivity = (activity, { onSuccess, onError }) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
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
                    const othersActivitySavedByName = (_b = activitySavedByName === null || activitySavedByName === void 0 ? void 0 : activitySavedByName.value) === null || _b === void 0 ? void 0 : _b.filter((tg) => (tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}recursofinitoinfinitoid`]) !== activity.id);
                    if (othersActivitySavedByName.length) {
                        onError === null || onError === void 0 ? void 0 : onError(err);
                    }
                    return;
                }
                else {
                    onError === null || onError === void 0 ? void 0 : onError(err);
                    return;
                }
            }
            let dataToSave = buildItem(activity);
            dataToSave = removeEmptyPropertyFromObject(dataToSave);
            if (activity.id) {
                const newSpaces = (_c = activity.spaces) === null || _c === void 0 ? void 0 : _c.map((tag) => tag.value);
                for (let j = 0; j < activity.previousSpace.length; j++) {
                    const rel = activity.previousSpace[j];
                    if (!(newSpaces === null || newSpaces === void 0 ? void 0 : newSpaces.includes(rel[`${PREFIX}espacoid`]))) {
                        yield executePost({
                            url: `${SPACE}(${rel[`${PREFIX}espacoid`]})/${PREFIX}Atividade_Espaco(${activity.id})/$ref`,
                            method: 'DELETE',
                        });
                    }
                }
            }
            executePost({
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
                        yield executePost({
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
    });
    const updateActivityAll = (activity, { onSuccess, onError }) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
            setLoadingSave(true);
            try {
                let dataToSave = buildItem(activity);
                dataToSave = removeEmptyPropertyFromObject(dataToSave);
                const batch = new BatchMultidata(executePost);
                const requestId = batch.patch(ACTIVITY, activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], dataToSave);
                batch.bulkPostRelationshipReference(ACTIVITY_ENVOLVED_PEOPLE, requestId, 'Atividade_PessoasEnvolvidas', (_f = activity === null || activity === void 0 ? void 0 : activity.people) === null || _f === void 0 ? void 0 : _f.map((pe) => buildItemPeople(pe)));
                batch.bulkPostReference(SPACE, (_g = activity === null || activity === void 0 ? void 0 : activity.spaces) === null || _g === void 0 ? void 0 : _g.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]), requestId, 'Atividade_Espaco');
                batch.bulkPostReference(TAG, (_h = activity === null || activity === void 0 ? void 0 : activity.equipments) === null || _h === void 0 ? void 0 : _h.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}etiquetaid`]), requestId, 'Atividade_Equipamentos');
                batch.bulkPostReference(FINITE_INFINITE_RESOURCES, (_j = activity === null || activity === void 0 ? void 0 : activity.finiteResource) === null || _j === void 0 ? void 0 : _j.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), requestId, 'Atividade_RecursoFinitoInfinito');
                batch.bulkDeleteReference(FINITE_INFINITE_RESOURCES, (_k = activity === null || activity === void 0 ? void 0 : activity.finiteResourceToDelete) === null || _k === void 0 ? void 0 : _k.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), requestId, 'Atividade_RecursoFinitoInfinito');
                batch.bulkPostReference(FINITE_INFINITE_RESOURCES, (_l = activity === null || activity === void 0 ? void 0 : activity.infiniteResource) === null || _l === void 0 ? void 0 : _l.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), requestId, 'Atividade_RecursoFinitoInfinito');
                batch.bulkDeleteReference(FINITE_INFINITE_RESOURCES, (_m = activity === null || activity === void 0 ? void 0 : activity.infiniteResourceToDelete) === null || _m === void 0 ? void 0 : _m.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], 'Atividade_RecursoFinitoInfinito');
                batch.bulkDeleteReferenceParent(ACTIVITY, (_o = activity === null || activity === void 0 ? void 0 : activity.spacesToDelete) === null || _o === void 0 ? void 0 : _o.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]), activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], 'Atividade_Espaco');
                batch.bulkDeleteReferenceParent(ACTIVITY, (_p = activity === null || activity === void 0 ? void 0 : activity.finiteInfiniteResourceToDelete) === null || _p === void 0 ? void 0 : _p.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}recursofinitoinfinitoid`]), activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], 'Atividade_RecursoFinitoInfinito');
                batch.bulkDeleteReference(TAG, (_q = activity === null || activity === void 0 ? void 0 : activity.equipmentsToDelete) === null || _q === void 0 ? void 0 : _q.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}etiquetaid`]), activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], 'Atividade_Equipamentos');
                batch.bulkPostRelationshipReference(ACTIVITY_NAME, requestId, 'Atividade_NomeAtividade', (_r = activity === null || activity === void 0 ? void 0 : activity.names) === null || _r === void 0 ? void 0 : _r.map((name) => buildItemFantasyName(name)));
                batch.bulkPostRelationshipReference(ACTIVITY_DOCUMENTS, requestId, 'Atividade_Documento', (_t = (_s = activity === null || activity === void 0 ? void 0 : activity.documents) === null || _s === void 0 ? void 0 : _s.filter((e) => !(!e.id && e.deleted))) === null || _t === void 0 ? void 0 : _t.map((pe) => buildItemDocument(pe)));
                (_u = activity === null || activity === void 0 ? void 0 : activity.academicRequests) === null || _u === void 0 ? void 0 : _u.forEach((academicRequest) => {
                    var _a, _b;
                    const academicRequestToSave = buildItemAcademicRequest(academicRequest);
                    const academicRequestRefId = batch.postRelationshipReference(ACADEMIC_REQUESTS, requestId, 'RequisicaoAcademica_Atividade', academicRequestToSave);
                    if (!academicRequest.deleted) {
                        batch.bulkPostRelationshipReference(ACADEMIC_REQUESTS_ENVOLVED_PEOPLE, academicRequestRefId, 'Requisicao_PessoasEnvolvidas', (_b = (_a = academicRequest === null || academicRequest === void 0 ? void 0 : academicRequest.people) === null || _a === void 0 ? void 0 : _a.filter((e) => !(!e.id && e.deleted))) === null || _b === void 0 ? void 0 : _b.map((pe) => buildItemPeopleAcademicRequest(Object.assign(Object.assign({}, pe), { activityId: requestId }))));
                    }
                });
                yield batch.execute();
                if ((activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipoaplicacao`]) ===
                    EActivityTypeApplication.APLICACAO) {
                    yield addOrUpdateByActivity(activity);
                }
                const actv = yield getActivity(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]);
                resolve('Success');
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_v = actv === null || actv === void 0 ? void 0 : actv.value) === null || _v === void 0 ? void 0 : _v[0]);
                setLoadingSave(false);
            }
            catch (err) {
                onError === null || onError === void 0 ? void 0 : onError(err);
                reject(err);
                setLoadingSave(false);
            }
        }));
    });
    const updateActivity = (id, toSave, { onSuccess, onError }) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const batch = new BatchMultidata(executePost);
            batch.patch(ACTIVITY, id, toSave);
            try {
                yield batch.execute();
                const activity = yield getActivity(id);
                resolve((_a = activity === null || activity === void 0 ? void 0 : activity.value) === null || _a === void 0 ? void 0 : _a[0]);
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_b = activity === null || activity === void 0 ? void 0 : activity.value) === null || _b === void 0 ? void 0 : _b[0]);
            }
            catch (err) {
                reject === null || reject === void 0 ? void 0 : reject(err);
                onError === null || onError === void 0 ? void 0 : onError(err);
            }
        }));
    };
    const updateEnvolvedPerson = (id, activityId, toSave, { onSuccess, onError }) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const batch = new BatchMultidata(executePost);
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
    const changeActivityDate = (activity, previousSchedule, newSchedule, { onSuccess, onError }) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            setLoadingSave(true);
            try {
                let dataToSave = buildItem(activity);
                dataToSave = removeEmptyPropertyFromObject(dataToSave);
                const batch = new BatchMultidata(executePost);
                const requestId = batch.patch(ACTIVITY, activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], dataToSave);
                batch.deleteReference(ACTIVITY, activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], previousSchedule, 'CronogramadeDia_Atividade');
                batch.addReference(SCHEDULE_DAY, requestId, newSchedule, 'CronogramadeDia_Atividade');
                yield batch.execute();
                resolve('Success');
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                setLoadingSave(false);
            }
            catch (err) {
                onError === null || onError === void 0 ? void 0 : onError(err);
                reject(err);
                setLoadingSave(false);
            }
        }));
    });
    const bulkAddUpdateActivity = (activities, activitiesToDelete, teamId, typeApplication, { onSuccess, onError }) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _w, _x, _y, _z, _0, _1, _2;
            try {
                const batch = new BatchMultidata(executePost);
                for (let i = 0; i < activities.length; i++) {
                    const event = activities[i];
                    let dataToSave = buildItem(Object.assign(Object.assign({}, event), { teamId: teamId, typeApplication: typeApplication }));
                    dataToSave = removeEmptyPropertyFromObject(dataToSave);
                    let activityId = event === null || event === void 0 ? void 0 : event[`${PREFIX}atividadeid`];
                    if (activityId) {
                        batch.patch(ACTIVITY, event === null || event === void 0 ? void 0 : event[`${PREFIX}atividadeid`], dataToSave);
                    }
                    else {
                        const response = yield executePost({
                            url: `${ACTIVITY}`,
                            method: 'POST',
                            headers: {
                                Prefer: 'return=representation',
                            },
                            data: dataToSave,
                        });
                        activityId = (_w = response.data) === null || _w === void 0 ? void 0 : _w[`${PREFIX}atividadeid`];
                    }
                    batch.bulkPostRelationship(ACTIVITY_NAME, ACTIVITY, activityId, 'Atividade_NomeAtividade', (_x = event === null || event === void 0 ? void 0 : event.names) === null || _x === void 0 ? void 0 : _x.map((name) => buildItemFantasyName(name)));
                    batch.bulkPostRelationship(ACTIVITY_ENVOLVED_PEOPLE, ACTIVITY, activityId, 'Atividade_PessoasEnvolvidas', (_y = event === null || event === void 0 ? void 0 : event.people) === null || _y === void 0 ? void 0 : _y.map((name) => buildItemPeople(name)));
                    batch.bulkPostRelationship(ACTIVITY_DOCUMENTS, ACTIVITY, activityId, 'Atividade_Documento', (_0 = (_z = event === null || event === void 0 ? void 0 : event.documents) === null || _z === void 0 ? void 0 : _z.filter((e) => !(!e.id && e.deleted))) === null || _0 === void 0 ? void 0 : _0.map((pe) => buildItemDocument(pe)));
                    batch.bulkPostRelationship(SPACE, ACTIVITY, activityId, 'Atividade_Espaco', (_1 = event === null || event === void 0 ? void 0 : event.spaces) === null || _1 === void 0 ? void 0 : _1.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]));
                    batch.bulkPostRelationship(TAG, ACTIVITY, activityId, 'Atividade_Equipamentos', (_2 = event === null || event === void 0 ? void 0 : event.equipments) === null || _2 === void 0 ? void 0 : _2.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]));
                }
                yield batch.execute();
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                resolve(data);
                refetch();
            }
            catch (error) {
                console.error(error);
                onError === null || onError === void 0 ? void 0 : onError(error);
                reject();
            }
        }));
    });
    const addOrUpdateClassroom = (activity, { onSuccess, onError }, returnNewValue = true) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _3, _4, _5, _6, _7, _8;
            const dataToUpdate = {
                [`${PREFIX}temaaula`]: activity.theme,
                [`${PREFIX}descricaoobjetivo`]: activity.description,
            };
            const batch = new BatchMultidata(executePost);
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
    const addOrUpdateDocuments = (activity, { onSuccess, onError }, returnNewValue = true) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _9, _10, _11, _12, _13;
            const tagNames = [];
            try {
                if ((_9 = activity === null || activity === void 0 ? void 0 : activity.documents) === null || _9 === void 0 ? void 0 : _9.length) {
                    for (let i = 0; i < activity.documents.length; i++) {
                        const tagName = activity.documents[i];
                        const { data } = yield executePost({
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
                        const newNames = (_12 = (_11 = activity.documents) === null || _11 === void 0 ? void 0 : _11.map((e) => e.id)) === null || _12 === void 0 ? void 0 : _12.filter((e) => e);
                        if (!(newNames === null || newNames === void 0 ? void 0 : newNames.includes(rel[`${PREFIX}documentosatividadeid`]))) {
                            yield executePost({
                                url: `${ACTIVITY_DOCUMENTS}(${rel[`${PREFIX}documentosatividadeid`]})`,
                                method: 'DELETE',
                            });
                        }
                    }
                }
                for (let j = 0; j < (tagNames === null || tagNames === void 0 ? void 0 : tagNames.length); j++) {
                    const rel = tagNames[j];
                    yield executePost({
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
                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_13 = newActv === null || newActv === void 0 ? void 0 : newActv.value) === null || _13 === void 0 ? void 0 : _13[0]);
                }
                resolve('Success');
            }
            catch (error) {
                onError === null || onError === void 0 ? void 0 : onError(error);
                reject(error);
            }
        }));
    });
    const addOrUpdatePerson = (activity, { onSuccess, onError }, returnNewValue = true) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _14, _15, _16, _17, _18, _19, _20;
            const tagNames = [];
            try {
                if ((_14 = activity === null || activity === void 0 ? void 0 : activity.people) === null || _14 === void 0 ? void 0 : _14.length) {
                    for (let i = 0; i < activity.people.length; i++) {
                        const tagName = activity.people[i];
                        const { data } = yield executePost({
                            url: (tagName === null || tagName === void 0 ? void 0 : tagName.id)
                                ? `${ACTIVITY_ENVOLVED_PEOPLE}(${tagName === null || tagName === void 0 ? void 0 : tagName.id})?$select=${PREFIX}pessoasenvolvidasatividadeid`
                                : `${ACTIVITY_ENVOLVED_PEOPLE}?$select=${PREFIX}pessoasenvolvidasatividadeid`,
                            method: (tagName === null || tagName === void 0 ? void 0 : tagName.id) ? 'PATCH' : 'POST',
                            headers: {
                                Prefer: 'return=representation',
                            },
                            data: {
                                [`${PREFIX}Pessoa@odata.bind`]: `/${PERSON}(${((_15 = tagName === null || tagName === void 0 ? void 0 : tagName.person) === null || _15 === void 0 ? void 0 : _15.value) || (tagName === null || tagName === void 0 ? void 0 : tagName[`_${PREFIX}pessoa_value`])})`,
                                [`${PREFIX}Funcao@odata.bind`]: `/${TAG}(${((_16 = tagName === null || tagName === void 0 ? void 0 : tagName.function) === null || _16 === void 0 ? void 0 : _16.value) ||
                                    (tagName === null || tagName === void 0 ? void 0 : tagName[`_${PREFIX}funcao_value`])})`,
                            },
                        });
                        if (!(tagName === null || tagName === void 0 ? void 0 : tagName.id)) {
                            tagNames.push(`${ACTIVITY_ENVOLVED_PEOPLE}(${data === null || data === void 0 ? void 0 : data[`${PREFIX}pessoasenvolvidasatividadeid`]})`);
                        }
                    }
                }
                if (activity.id) {
                    for (let j = 0; j < ((_17 = activity.previousPeople) === null || _17 === void 0 ? void 0 : _17.length); j++) {
                        const rel = activity.previousPeople[j];
                        const newNames = (_19 = (_18 = activity.people) === null || _18 === void 0 ? void 0 : _18.map((e) => e.id)) === null || _19 === void 0 ? void 0 : _19.filter((e) => e);
                        if (!(newNames === null || newNames === void 0 ? void 0 : newNames.includes(rel[`${PREFIX}pessoasenvolvidasatividadeid`]))) {
                            yield executePost({
                                url: `${ACTIVITY_ENVOLVED_PEOPLE}(${rel[`${PREFIX}pessoasenvolvidasatividadeid`]})`,
                                method: 'DELETE',
                            });
                        }
                    }
                }
                for (let j = 0; j < tagNames.length; j++) {
                    const rel = tagNames[j];
                    yield executePost({
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
                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_20 = newActv === null || newActv === void 0 ? void 0 : newActv.value) === null || _20 === void 0 ? void 0 : _20[0]);
                }
                resolve('Success');
            }
            catch (error) {
                onError === null || onError === void 0 ? void 0 : onError(error);
                reject(error);
            }
        }));
    });
    const addOrUpdateObservation = (activity, { onSuccess, onError }) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            executePost({
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
    const addOrUpdateFantasyName = (activity, { onSuccess, onError }, returnNewValue = true) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _21, _22, _23, _24;
            const tagNames = [];
            try {
                if ((_21 = activity === null || activity === void 0 ? void 0 : activity.names) === null || _21 === void 0 ? void 0 : _21.length) {
                    for (let i = 0; i < activity.names.length; i++) {
                        const tagName = activity.names[i];
                        const { data } = yield executePost({
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
                    for (let j = 0; j < ((_22 = activity.previousNames) === null || _22 === void 0 ? void 0 : _22.length); j++) {
                        const rel = activity.previousNames[j];
                        const newNames = (_23 = activity.names) === null || _23 === void 0 ? void 0 : _23.map((e) => e.id).filter((e) => e);
                        if (!(newNames === null || newNames === void 0 ? void 0 : newNames.includes(rel[`${PREFIX}nomeatividadeid`]))) {
                            yield executePost({
                                url: `${ACTIVITY_NAME}(${rel[`${PREFIX}nomeatividadeid`]})`,
                                method: 'DELETE',
                            });
                        }
                    }
                }
                for (let j = 0; j < (tagNames === null || tagNames === void 0 ? void 0 : tagNames.length); j++) {
                    const rel = tagNames[j];
                    yield executePost({
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
                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_24 = newActv === null || newActv === void 0 ? void 0 : newActv.value) === null || _24 === void 0 ? void 0 : _24[0]);
                }
                resolve('Success');
            }
            catch (error) {
                onError === null || onError === void 0 ? void 0 : onError(error);
                reject(error);
            }
        }));
    });
    const desactiveActivity = (activity, { onSuccess, onError }, returnNewValue = true) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _25;
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
            executePost({
                url: `${ACTIVITY}(${(_25 = activity === null || activity === void 0 ? void 0 : activity.data) === null || _25 === void 0 ? void 0 : _25[`${PREFIX}atividadeid`]})`,
                method: 'PATCH',
                data,
            })
                .then(({ data }) => {
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                deleteByActivity(activity.data);
                resolve(data);
                if (returnNewValue) {
                    refetch();
                }
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
    const activeActivity = (activity, { onSuccess, onError }) => {
        executePost({
            url: `${ACTIVITY}(${activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]})`,
            method: 'PATCH',
            data: {
                [`${PREFIX}ativo`]: true,
            },
        })
            .then(({ data }) => {
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            refetch();
        })
            .catch(({ response }) => {
            onError === null || onError === void 0 ? void 0 : onError(response);
        });
    };
    const bulkUpdateActivity = (toUpdate, { onSuccess, onError }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            for (let i = 0; i < toUpdate.data.length; i++) {
                const activity = toUpdate.data[i];
                yield executePost({
                    url: `${ACTIVITY}(${activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]})`,
                    method: 'PATCH',
                    data: {
                        [`${PREFIX}escolaorigem`]: toUpdate.school,
                    },
                });
            }
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            refetch();
        }
        catch (e) {
            onError === null || onError === void 0 ? void 0 : onError(e);
        }
    });
    return [
        {
            activities: data === null || data === void 0 ? void 0 : data.value,
            count: data === null || data === void 0 ? void 0 : data['@odata.count'],
            nextLink: data === null || data === void 0 ? void 0 : data['@odata.nextLink'],
            postLoading,
            loading,
            loadingSave: loadingSave,
            error,
            getActivity,
            getActivityByTeamId,
            getActivityByScheduleId,
            addOrUpdateActivity,
            changeActivityDate,
            updateActivityAll,
            addOrUpdatePerson,
            updateEnvolvedPerson,
            addOrUpdateClassroom,
            addOrUpdateDocuments,
            addOrUpdateObservation,
            bulkUpdateActivity,
            updateActivity,
            desactiveActivity,
            activeActivity,
            addOrUpdateFantasyName,
            bulkAddUpdateActivity,
            refetch,
        },
    ];
};
export default useActivity;
//# sourceMappingURL=useActivity.js.map