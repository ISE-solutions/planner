var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useActivity, useContextWebpart } from '~/hooks';
import { QueryBuilder } from 'odata-query-builder';
import * as moment from 'moment';
import { TAG, PERSON, PREFIX, ACTIVITY, ACTIVITY_NAME, ACTIVITY_ENVOLVED_PEOPLE, SCHEDULE_DAY, SCHEDULE_DAY_ENVOLVED_PEOPLE, TEAM, SPACE, ACTIVITY_DOCUMENTS, SCHEDULE_DAY_LOCALE, RESOURCES, ACADEMIC_REQUESTS, ACADEMIC_REQUESTS_ENVOLVED_PEOPLE, FINITE_INFINITE_RESOURCES, PROGRAM, } from '~/config/database';
import axios from '../useAxios/useAxios';
import { BUSINESS_UNITY } from '~/config/constants';
import BatchMultidata from '~/utils/BatchMultidata';
import { useState } from 'react';
import { createFolder, deleteFiles, uploadFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import useResource from '../useResource/useResource';
const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.searchQuery) &&
            f.or((p) => {
                p.filterPhrase(`contains(${PREFIX}nome,'${filtro.searchQuery}')`);
                return p;
            });
        if (filtro.date) {
            f.filterPhrase(`${PREFIX}data gt '${filtro.date}' and ${PREFIX}data lt '${moment(filtro.date, 'YYYY-MM-DD')
                .add(1, 'd')
                .format('YYYY-MM-DD')}'`);
        }
        // tslint:disable-next-line: no-unused-expression
        filtro.active &&
            filtro.active !== 'Todos' &&
            f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');
        // tslint:disable-next-line: no-unused-expression
        f.filterExpression(`${PREFIX}modelo`, 'eq', !!filtro.model);
        // tslint:disable-next-line: no-unused-expression
        filtro.groupPermition &&
            f.filterExpression(`${PREFIX}grupopermissao`, 'eq', filtro.groupPermition);
        // tslint:disable-next-line: no-unused-expression
        filtro.group &&
            filtro.group !== 'Todos' &&
            f.filterExpression(`${PREFIX}agrupamentoatividade`, 'eq', filtro.group === 'Sim');
        // tslint:disable-next-line: no-unused-expression
        filtro.published &&
            filtro.published !== 'Todos' &&
            f.filterExpression(`${PREFIX}publicado`, 'eq', filtro.published === 'Sim');
        // tslint:disable-next-line: no-unused-expression
        filtro.modality &&
            f.filterExpression(`${PREFIX}Modalidade/${PREFIX}etiquetaid`, 'eq', filtro.modality);
        // tslint:disable-next-line: no-unused-expression
        filtro.module &&
            f.filterExpression(`${PREFIX}Modulo/${PREFIX}etiquetaid`, 'eq', filtro.module);
        // tslint:disable-next-line: no-unused-expression
        filtro.createdBy &&
            f.filterExpression(`${PREFIX}CriadoPor/${PREFIX}pessoaid`, 'eq', filtro.createdBy);
        if (filtro.typeActivity) {
            f.filterExpression(`${PREFIX}tipo`, 'eq', filtro.typeActivity);
        }
        // tslint:disable-next-line: no-unused-expression
        ((filtro === null || filtro === void 0 ? void 0 : filtro.teamId) || (filtro === null || filtro === void 0 ? void 0 : filtro.filterTeam)) &&
            f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', (filtro === null || filtro === void 0 ? void 0 : filtro.teamId) || null);
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    else {
        query.orderBy(`${PREFIX}data asc`);
    }
    query.expand(`${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Temperatura,${PREFIX}Local,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento`);
    query.count();
    return query.toQuery();
};
const useScheduleDay = (filter, options) => {
    const query = buildQuery(filter);
    const { context } = useContextWebpart();
    const useAxios = axios({ context: context });
    const [loading, setLoading] = useState(false);
    const [{ addOrUpdateByActivities }] = useResource({}, { manual: true });
    const [{ getActivityByScheduleId }] = useActivity({}, { manual: true });
    let headers = {};
    if (filter.rowsPerPage) {
        headers = {
            Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
    }
    const [{ data, error }, refetch] = useAxios({
        url: `${SCHEDULE_DAY}${query}`,
        headers,
    }, {
        useCache: false,
        manual: !!(options === null || options === void 0 ? void 0 : options.manual),
    });
    const [{}, executeRequest] = useAxios({
        url: `${SCHEDULE_DAY}${query}`,
        headers,
    }, {
        useCache: false,
        manual: true,
    });
    const getScheduleId = (scheduleId) => {
        return new Promise((resolve, reject) => {
            var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}cronogramadediaid`, 'eq', scheduleId));
            query.expand(`${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Local,${PREFIX}Temperatura,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento`);
            executeRequest({
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
    const getSchedule = (filter) => {
        return new Promise((resolve, reject) => {
            const getQuery = buildQuery(filter);
            executeRequest({
                url: `${SCHEDULE_DAY}${getQuery}`,
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
    const getScheduleByTeamId = (teamId) => {
        return new Promise((resolve, reject) => {
            var query = new QueryBuilder().filter((f) => {
                f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', teamId);
                f.filterExpression(`${PREFIX}ativo`, 'eq', true);
                return f;
            });
            query.expand(`${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Local,${PREFIX}Temperatura,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento`);
            query.orderBy(`${PREFIX}data asc`);
            refetch({
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
    const buildItem = (schedule) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const res = {
            [`${PREFIX}nome`]: schedule.name,
            [`${PREFIX}modelo`]: schedule.model,
            [`${PREFIX}anexossincronizados`]: schedule.anexossincronizados,
            [`${PREFIX}modeloid`]: schedule.modeloid,
            [`${PREFIX}baseadoemcronogramadiamodelo`]: schedule.baseadoemcronogramadiamodelo,
            [`${PREFIX}agrupamentoatividade`]: schedule.isGroupActive,
            [`${PREFIX}duracao`]: schedule.duration
                ? (_a = schedule.duration) === null || _a === void 0 ? void 0 : _a.format('HH:mm')
                : null,
            [`${PREFIX}inicio`]: schedule.startTime
                ? (_b = schedule.startTime) === null || _b === void 0 ? void 0 : _b.format('HH:mm')
                : null,
            [`${PREFIX}fim`]: schedule.endTime
                ? (_c = schedule.endTime) === null || _c === void 0 ? void 0 : _c.format('HH:mm')
                : null,
            [`${PREFIX}observacao`]: schedule.observation || (schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}observacao`]),
            [`${PREFIX}data`]: schedule.date && moment.utc(schedule.date).format(),
            [`${PREFIX}Modulo@odata.bind`]: (schedule === null || schedule === void 0 ? void 0 : schedule.module)
                ? `/${TAG}(${(_d = schedule === null || schedule === void 0 ? void 0 : schedule.module) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`]})`
                : null,
            [`${PREFIX}Modalidade@odata.bind`]: (schedule === null || schedule === void 0 ? void 0 : schedule.modality)
                ? `/${TAG}(${(_e = schedule === null || schedule === void 0 ? void 0 : schedule.modality) === null || _e === void 0 ? void 0 : _e[`${PREFIX}etiquetaid`]})`
                : null,
            [`${PREFIX}Ferramenta@odata.bind`]: (schedule === null || schedule === void 0 ? void 0 : schedule.tool)
                ? `/${TAG}(${(_f = schedule === null || schedule === void 0 ? void 0 : schedule.tool) === null || _f === void 0 ? void 0 : _f[`${PREFIX}etiquetaid`]})`
                : null,
            [`${PREFIX}FerramentaBackup@odata.bind`]: (schedule === null || schedule === void 0 ? void 0 : schedule.toolBackup)
                ? `/${TAG}(${(_g = schedule === null || schedule === void 0 ? void 0 : schedule.toolBackup) === null || _g === void 0 ? void 0 : _g[`${PREFIX}etiquetaid`]})`
                : null,
            [`${PREFIX}Local@odata.bind`]: ((_h = schedule === null || schedule === void 0 ? void 0 : schedule.place) === null || _h === void 0 ? void 0 : _h[`${PREFIX}etiquetaid`])
                ? `/${TAG}(${(_j = schedule === null || schedule === void 0 ? void 0 : schedule.place) === null || _j === void 0 ? void 0 : _j[`${PREFIX}etiquetaid`]})`
                : null,
            [`${PREFIX}Turma@odata.bind`]: (schedule === null || schedule === void 0 ? void 0 : schedule.teamId) && `/${TEAM}(${schedule === null || schedule === void 0 ? void 0 : schedule.teamId})`,
            [`${PREFIX}Programa@odata.bind`]: (schedule === null || schedule === void 0 ? void 0 : schedule.programId) && `/${PROGRAM}(${schedule === null || schedule === void 0 ? void 0 : schedule.programId})`,
            [`${PREFIX}Temperatura@odata.bind`]: (schedule === null || schedule === void 0 ? void 0 : schedule.temperature) && `/${TAG}(${(_k = schedule === null || schedule === void 0 ? void 0 : schedule.temperature) === null || _k === void 0 ? void 0 : _k.value})`,
            [`${PREFIX}link`]: schedule.link,
            [`${PREFIX}linkbackup`]: schedule.linkBackup,
        };
        if (!(schedule === null || schedule === void 0 ? void 0 : schedule.id)) {
            res[`${PREFIX}CriadoPor@odata.bind`] =
                (schedule === null || schedule === void 0 ? void 0 : schedule.user) && `/${PERSON}(${schedule === null || schedule === void 0 ? void 0 : schedule.user})`;
            res[`${PREFIX}grupopermissao`] = schedule === null || schedule === void 0 ? void 0 : schedule.group;
        }
        return res;
    };
    const buildItemActivity = (activity) => {
        var _a, _b, _c, _d, _e;
        let res = {
            deleted: activity.deleted,
            [`${PREFIX}nome`]: activity.name || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}nome`]),
            [`${PREFIX}tipo`]: activity.type || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]),
            [`${PREFIX}temaaula`]: activity.theme || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}temaaula`]),
            [`${PREFIX}observacao`]: activity.observation || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}observacao`]),
            [`${PREFIX}descricaoobjetivo`]: activity.description || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}descricaoobjetivo`]),
            [`${PREFIX}quantidadesessao`]: activity.quantity || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}quantidadesessao`]) || 0,
            [`${PREFIX}duracao`]: ((_a = activity.duration) === null || _a === void 0 ? void 0 : _a.format('HH:mm')) || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}duracao`]),
            [`${PREFIX}inicio`]: ((_b = activity.startTime) === null || _b === void 0 ? void 0 : _b.format('HH:mm')) || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}inicio`]),
            [`${PREFIX}fim`]: ((_c = activity.endTime) === null || _c === void 0 ? void 0 : _c.format('HH:mm')) || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}fim`]),
            [`${PREFIX}tipoaplicacao`]: activity.typeApplication,
            [`${PREFIX}datahorainicio`]: activity.startDate && moment(activity.startDate).format(),
            [`${PREFIX}datahorafim`]: activity.endDate && moment(activity.endDate).format(),
            [`${PREFIX}AreaAcademica@odata.bind`]: (activity === null || activity === void 0 ? void 0 : activity.area) && `/${TAG}(${(_d = activity === null || activity === void 0 ? void 0 : activity.area) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`]})`,
            [`${PREFIX}Temperatura@odata.bind`]: (activity === null || activity === void 0 ? void 0 : activity.temperature) && `/${TAG}(${(_e = activity === null || activity === void 0 ? void 0 : activity.temperature) === null || _e === void 0 ? void 0 : _e.value})`,
        };
        if (activity === null || activity === void 0 ? void 0 : activity.teamId) {
            res[`${PREFIX}Turma@odata.bind`] = `/${TEAM}(${activity === null || activity === void 0 ? void 0 : activity.teamId})`;
        }
        if (activity === null || activity === void 0 ? void 0 : activity.programId) {
            res[`${PREFIX}Programa@odata.bind`] = `/${PROGRAM}(${activity === null || activity === void 0 ? void 0 : activity.programId})`;
        }
        if (activity === null || activity === void 0 ? void 0 : activity.scheduleId) {
            res[`${PREFIX}CronogramaDia@odata.bind`] = `/${SCHEDULE_DAY}(${activity === null || activity === void 0 ? void 0 : activity.scheduleId})`;
        }
        return res;
    };
    const buildItemFantasyName = (item) => {
        return {
            id: item.id,
            deleted: item.deleted,
            [`${PREFIX}nome`]: item.name || (item === null || item === void 0 ? void 0 : item[`${PREFIX}nome`]),
            [`${PREFIX}nomeen`]: item.nameEn || (item === null || item === void 0 ? void 0 : item[`${PREFIX}nomeen`]),
            [`${PREFIX}nomees`]: item.nameEs || (item === null || item === void 0 ? void 0 : item[`${PREFIX}nomees`]),
            [`${PREFIX}uso`]: item.use || (item === null || item === void 0 ? void 0 : item[`${PREFIX}uso`]),
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
    const buildItemLocale = (item) => {
        var _a;
        return {
            id: item.id,
            deleted: item.deleted,
            [`${PREFIX}Espaco@odata.bind`]: (item === null || item === void 0 ? void 0 : item.space) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}espaco_value`])
                ? `/${SPACE}(${((_a = item === null || item === void 0 ? void 0 : item.space) === null || _a === void 0 ? void 0 : _a.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}espaco_value`])})`
                : null,
            [`${PREFIX}observacao`]: item === null || item === void 0 ? void 0 : item.observation,
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
            [`${PREFIX}momentoentrega`]: item.delivery,
            [`${PREFIX}dataentrega`]: item.deliveryDate && item.deliveryDate.format(),
        };
    };
    const buildItemPeopleAcademicRequest = (item) => {
        var _a, _b;
        return {
            id: item.id,
            deleted: item.deleted,
            [`${PREFIX}Pessoa@odata.bind`]: (item === null || item === void 0 ? void 0 : item.person) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`])
                ? `/${PERSON}(${((_a = item === null || item === void 0 ? void 0 : item.person) === null || _a === void 0 ? void 0 : _a.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`])})`
                : null,
            [`${PREFIX}Funcao@odata.bind`]: (item === null || item === void 0 ? void 0 : item.function) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}funcao_value`])
                ? `/${TAG}(${((_b = item === null || item === void 0 ? void 0 : item.function) === null || _b === void 0 ? void 0 : _b.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}funcao_value`])})`
                : null,
            [`${PREFIX}Atividade@odata.bind`]: '$' + item.activityId,
        };
    };
    const addUpdateSchedule = (schedule, teamId, programId, { onSuccess, onError }, hasRefetch = true) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            setLoading(true);
            const batch = new BatchMultidata(executeRequest);
            try {
                let dataToSave = buildItem(Object.assign(Object.assign({}, schedule), { teamId: teamId, programId: programId }));
                let scheduleId = schedule === null || schedule === void 0 ? void 0 : schedule.id;
                if (scheduleId) {
                    batch.patch(SCHEDULE_DAY, scheduleId, dataToSave);
                }
                else {
                    const response = yield executeRequest({
                        url: SCHEDULE_DAY,
                        method: 'POST',
                        headers: {
                            Prefer: 'return=representation',
                        },
                        data: dataToSave,
                    });
                    scheduleId = (_a = response.data) === null || _a === void 0 ? void 0 : _a[`${PREFIX}cronogramadediaid`];
                    if (teamId) {
                        yield executeRequest({
                            url: `${SCHEDULE_DAY}(${scheduleId})/${PREFIX}Turma/$ref`,
                            method: 'PUT',
                            data: {
                                '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                                '@odata.id': `${TEAM}(${teamId})`,
                            },
                        });
                    }
                }
                schedule.activities
                    .filter((e) => !(!(e === null || e === void 0 ? void 0 : e[`${PREFIX}atividadeid`]) && e.deleted))
                    .forEach((activity) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
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
                            var _a;
                            const academicRequestToSave = buildItemAcademicRequest(academicRequest);
                            const academicRequestRefId = batch.postRelationshipReference(ACADEMIC_REQUESTS, requestId, 'RequisicaoAcademica_Atividade', academicRequestToSave);
                            if (!academicRequest.deleted) {
                                batch.bulkPostRelationshipReference(ACADEMIC_REQUESTS_ENVOLVED_PEOPLE, academicRequestRefId, 'Requisicao_PessoasEnvolvidas', (_a = academicRequest === null || academicRequest === void 0 ? void 0 : academicRequest.people) === null || _a === void 0 ? void 0 : _a.map((pe) => buildItemPeopleAcademicRequest(Object.assign(Object.assign({}, pe), { activityId: requestId }))));
                            }
                        });
                    }
                    else if (!activity.deleted) {
                        batch.patch(ACTIVITY, activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], buildItemActivity(Object.assign(Object.assign({}, activity), { teamId: teamId, scheduleId: scheduleId, programId: programId })));
                    }
                    if ((activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) && activity.deleted) {
                        batch.patch(ACTIVITY, activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], {
                            [`${PREFIX}ativo`]: false,
                        });
                        (_o = activity === null || activity === void 0 ? void 0 : activity.resources) === null || _o === void 0 ? void 0 : _o.forEach((res) => {
                            batch.patch(RESOURCES, res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`], {
                                [`${PREFIX}excluido`]: true,
                            });
                        });
                    }
                });
                batch.bulkPostRelationship(SCHEDULE_DAY_ENVOLVED_PEOPLE, SCHEDULE_DAY, scheduleId, 'CronogramadeDia_PessoasEnvolvidas', (_c = (_b = schedule === null || schedule === void 0 ? void 0 : schedule.people) === null || _b === void 0 ? void 0 : _b.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _c === void 0 ? void 0 : _c.map((pe) => buildItemPeople(pe)));
                batch.bulkPostRelationship(SCHEDULE_DAY_LOCALE, SCHEDULE_DAY, scheduleId, 'CronogramadeDia_LocalCronogramaDia', (_e = (_d = schedule === null || schedule === void 0 ? void 0 : schedule.locale) === null || _d === void 0 ? void 0 : _d.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _e === void 0 ? void 0 : _e.map((pe) => buildItemLocale(pe)));
                yield batch.execute();
                if (!(schedule === null || schedule === void 0 ? void 0 : schedule.isLoadModel)) {
                    yield uploadScheduleFiles(schedule, scheduleId);
                }
                if (!schedule.model) {
                    const responseActivities = yield getActivityByScheduleId(scheduleId);
                    const activities = (_f = responseActivities === null || responseActivities === void 0 ? void 0 : responseActivities.value) === null || _f === void 0 ? void 0 : _f.map((e) => (Object.assign(Object.assign({}, e), { teamId,
                        programId,
                        scheduleId })));
                    yield addOrUpdateByActivities(activities);
                }
                const newSchedule = yield getScheduleId(scheduleId);
                setLoading(false);
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_g = newSchedule === null || newSchedule === void 0 ? void 0 : newSchedule.value) === null || _g === void 0 ? void 0 : _g[0]);
                resolve(data);
                if (hasRefetch) {
                    refetch();
                }
            }
            catch (error) {
                console.error(error);
                setLoading(false);
                onError === null || onError === void 0 ? void 0 : onError(error);
                reject();
            }
        }));
    });
    const updateSchedule = (id, toSave, { onSuccess, onError }) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const batch = new BatchMultidata(executeRequest);
            batch.patch(SCHEDULE_DAY, id, toSave);
            try {
                yield batch.execute();
                const activity = yield getScheduleId(id);
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
    const updateEnvolvedPerson = (id, scheduleId, toSave, { onSuccess, onError }) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const batch = new BatchMultidata(executeRequest);
            batch.patch(SCHEDULE_DAY_ENVOLVED_PEOPLE, id, toSave);
            try {
                yield batch.execute();
                const schedule = yield getScheduleId(scheduleId);
                resolve((_a = schedule === null || schedule === void 0 ? void 0 : schedule.value) === null || _a === void 0 ? void 0 : _a[0]);
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_b = schedule === null || schedule === void 0 ? void 0 : schedule.value) === null || _b === void 0 ? void 0 : _b[0]);
            }
            catch (err) {
                reject === null || reject === void 0 ? void 0 : reject(err);
                onError === null || onError === void 0 ? void 0 : onError(err);
            }
        }));
    };
    const uploadScheduleFiles = (schedule, scheduleId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _h, _j, _k;
            try {
                if ((_h = schedule === null || schedule === void 0 ? void 0 : schedule.anexos) === null || _h === void 0 ? void 0 : _h.length) {
                    const folder = `Cronograma Dia/${moment(data === null || data === void 0 ? void 0 : data.createdon).format('YYYY')}/${scheduleId}`;
                    const attachmentsToDelete = (_j = schedule === null || schedule === void 0 ? void 0 : schedule.anexos) === null || _j === void 0 ? void 0 : _j.filter((file) => file.relativeLink && file.deveExcluir);
                    const attachmentsToSave = (_k = schedule === null || schedule === void 0 ? void 0 : schedule.anexos) === null || _k === void 0 ? void 0 : _k.filter((file) => !file.relativeLink && !file.deveExcluir);
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
    const desactiveSchedule = (id, activities, { onSuccess, onError }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const batch = new BatchMultidata(executeRequest);
            batch.patch(SCHEDULE_DAY, id, {
                [`${PREFIX}ativo`]: false,
            });
            activities.forEach((actId) => {
                batch.patch(ACTIVITY, actId, {
                    [`${PREFIX}ativo`]: false,
                });
            });
            yield batch.execute();
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        }
        catch (error) {
            console.error(error);
            onError === null || onError === void 0 ? void 0 : onError(error);
        }
    });
    return [
        {
            schedule: data === null || data === void 0 ? void 0 : data.value,
            count: data === null || data === void 0 ? void 0 : data['@odata.count'],
            nextLink: data === null || data === void 0 ? void 0 : data['@odata.nextLink'],
            loading: loading,
            error,
            getSchedule,
            getScheduleByTeamId,
            addUpdateSchedule,
            updateSchedule,
            desactiveSchedule,
            updateEnvolvedPerson,
            refetch,
        },
    ];
};
export default useScheduleDay;
//# sourceMappingURL=useScheduleDay.js.map