var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { QueryBuilder } from 'odata-query-builder';
import { TEAM, PREFIX, PROGRAM, TEAM_NAME, PERSON, TAG, TEAM_ENVOLVED_PEOPLE, TEAM_PARTICIPANTS, SCHEDULE_DAY_ENVOLVED_PEOPLE, SCHEDULE_DAY, ACTIVITY, ACTIVITY_ENVOLVED_PEOPLE, SPACE, ACTIVITY_NAME, ACTIVITY_DOCUMENTS, ACADEMIC_REQUESTS, ACADEMIC_REQUESTS_ENVOLVED_PEOPLE, FINITE_INFINITE_RESOURCES, } from '~/config/database';
import axios from '../useAxios/useAxios';
import { BUSINESS_UNITY } from '~/config/constants';
import * as moment from 'moment';
import { createFolder, deleteFiles, uploadFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import BatchMultidata from '~/utils/BatchMultidata';
import useContextWebpart from '../useContextWebpart';
const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.searchQuery) &&
            f.or((p) => {
                p.filterPhrase(`contains(${PREFIX}titulo,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}sigla,'${filtro.searchQuery}')`);
                return p;
            });
        // tslint:disable-next-line: no-unused-expression
        filtro.active &&
            filtro.active !== 'Todos' &&
            f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');
        // tslint:disable-next-line: no-unused-expression
        filtro.model !== undefined &&
            f.filterExpression(`${PREFIX}modelo`, 'eq', filtro.model);
        // tslint:disable-next-line: no-unused-expression
        filtro.group &&
            f.filterExpression(`${PREFIX}grupopermissao`, 'eq', filtro.group);
        // tslint:disable-next-line: no-unused-expression
        filtro.published &&
            filtro.published !== 'Todos' &&
            f.filterExpression(`${PREFIX}publicado`, 'eq', filtro.published === 'Sim');
        // tslint:disable-next-line: no-unused-expression
        filtro.modality &&
            f.filterExpression(`${PREFIX}Modalidade/${PREFIX}etiquetaid`, 'eq', filtro.modality);
        // tslint:disable-next-line: no-unused-expression
        filtro.yearConclusion &&
            f.filterExpression(`${PREFIX}anodeconclusao`, 'eq', +filtro.yearConclusion);
        // tslint:disable-next-line: no-unused-expression
        filtro.initials &&
            f.filterPhrase(`contains(${PREFIX}sigla,'${filtro.initials}')`);
        // tslint:disable-next-line: no-unused-expression
        filtro.createdBy &&
            f.filterExpression(`${PREFIX}CriadoPor/${PREFIX}pessoaid`, 'eq', filtro.createdBy);
        f.filterExpression(`${PREFIX}excluido`, 'eq', false);
        // tslint:disable-next-line: no-unused-expression
        ((filtro === null || filtro === void 0 ? void 0 : filtro.programId) || filtro.filterProgram) &&
            f.filterExpression(`${PREFIX}Programa/${PREFIX}programaid`, 'eq', filtro === null || filtro === void 0 ? void 0 : filtro.programId);
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    else {
        query.orderBy(`createdon desc`);
    }
    // query.select(
    //   `${PREFIX}id,${PREFIX}nome,${PREFIX}sobrenome,${PREFIX}nomepreferido,${PREFIX}email,${PREFIX}emailsecundario,${PREFIX}celular,${PREFIX}escolaorigem,${PREFIX}ativo`
    // );
    query.expand(`${PREFIX}Programa,${PREFIX}Turma_NomeTurma,${PREFIX}Temperatura,${PREFIX}Modalidade,${PREFIX}Turma_PessoasEnvolvidasTurma,${PREFIX}Turma_NomeTurma,${PREFIX}Turma_ParticipantesTurma,${PREFIX}CronogramadeDia_Turma,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}Turma_Compartilhamento`);
    query.count();
    return query.toQuery();
};
const useTeam = (filter, options) => {
    const query = buildQuery(filter);
    const { context } = useContextWebpart();
    const useAxios = axios({ context: context });
    const [loadingSave, setLoadingSave] = React.useState(false);
    let headers = {};
    if (filter.rowsPerPage) {
        headers = {
            Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
    }
    const [{ data, loading, error }, refetch] = useAxios({
        url: `${TEAM}${query}`,
        headers,
    }, {
        useCache: false,
        manual: !!(options === null || options === void 0 ? void 0 : options.manual),
    });
    const [{ data: postData, loading: postLoading, error: postError }, executePost,] = useAxios({
        url: `${TEAM}`,
        method: 'POST',
    }, { manual: true });
    const getTeamById = (teamId) => {
        return new Promise((resolve, reject) => {
            var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}turmaid`, 'eq', teamId));
            query.expand(`${PREFIX}Programa,${PREFIX}Turma_NomeTurma,${PREFIX}Temperatura,${PREFIX}Modalidade,${PREFIX}Turma_PessoasEnvolvidasTurma,${PREFIX}Turma_NomeTurma,${PREFIX}Turma_ParticipantesTurma,${PREFIX}CronogramadeDia_Turma,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}Turma_Compartilhamento`);
            refetch({
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
    const getTeamByProgramId = (programId) => {
        return new Promise((resolve, reject) => {
            var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}Programa/${PREFIX}programaid`, 'eq', programId));
            query.expand(`${PREFIX}Programa,${PREFIX}Turma_NomeTurma,${PREFIX}Temperatura,${PREFIX}Modalidade,${PREFIX}Turma_PessoasEnvolvidasTurma,${PREFIX}Turma_NomeTurma,${PREFIX}Turma_ParticipantesTurma,${PREFIX}CronogramadeDia_Turma,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}Turma_Compartilhamento`);
            refetch({
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
    const buildItem = (team) => {
        var _a, _b;
        const res = {
            [`${PREFIX}titulo`]: team === null || team === void 0 ? void 0 : team.title,
            [`${PREFIX}sigla`]: team === null || team === void 0 ? void 0 : team.sigla,
            [`${PREFIX}nome`]: team === null || team === void 0 ? void 0 : team.name,
            [`${PREFIX}modeloid`]: team === null || team === void 0 ? void 0 : team.modeloid,
            [`${PREFIX}baseadoemmodeloturma`]: team === null || team === void 0 ? void 0 : team.baseadoemmodeloturma,
            [`${PREFIX}anexossincronizados`]: team.anexossincronizados,
            [`${PREFIX}nomefinanceiro`]: team === null || team === void 0 ? void 0 : team.teamName,
            [`${PREFIX}codigodaturma`]: team === null || team === void 0 ? void 0 : team.teamCode,
            [`${PREFIX}mascara`]: team === null || team === void 0 ? void 0 : team.mask,
            [`${PREFIX}mascarabackup`]: team === null || team === void 0 ? void 0 : team.maskBackup,
            [`${PREFIX}anodeconclusao`]: +(team === null || team === void 0 ? void 0 : team.yearConclusion),
            [`${PREFIX}observacao`]: team === null || team === void 0 ? void 0 : team.description,
            [`${PREFIX}modelo`]: team === null || team === void 0 ? void 0 : team.model,
            [`${PREFIX}Modalidade@odata.bind`]: (team === null || team === void 0 ? void 0 : team.modality) && `/${TAG}(${(_a = team === null || team === void 0 ? void 0 : team.modality) === null || _a === void 0 ? void 0 : _a.value})`,
            [`${PREFIX}Temperatura@odata.bind`]: (team === null || team === void 0 ? void 0 : team.temperature) && `/${TAG}(${(_b = team === null || team === void 0 ? void 0 : team.temperature) === null || _b === void 0 ? void 0 : _b.value})`,
        };
        if (!(team === null || team === void 0 ? void 0 : team.id)) {
            res[`${PREFIX}CriadoPor@odata.bind`] =
                (team === null || team === void 0 ? void 0 : team.user) && `/${PERSON}(${team === null || team === void 0 ? void 0 : team.user})`;
            res[`${PREFIX}grupopermissao`] = team === null || team === void 0 ? void 0 : team.group;
        }
        return res;
    };
    const buildItemSchedule = (schedule) => {
        var _a, _b, _c, _d;
        return {
            [`${PREFIX}nome`]: schedule.name,
            [`${PREFIX}modelo`]: schedule.model,
            [`${PREFIX}anexossincronizados`]: schedule.anexossincronizados,
            [`${PREFIX}modeloid`]: schedule.modeloid,
            [`${PREFIX}observacao`]: schedule.observation || (schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}observacao`]),
            [`${PREFIX}data`]: schedule.date && moment.utc(schedule.date).format(),
            [`${PREFIX}Modulo@odata.bind`]: (schedule === null || schedule === void 0 ? void 0 : schedule.module) &&
                `/${TAG}(${(_a = schedule === null || schedule === void 0 ? void 0 : schedule.module) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]})`,
            [`${PREFIX}Modalidade@odata.bind`]: (schedule === null || schedule === void 0 ? void 0 : schedule.modality) &&
                `/${TAG}(${(_b = schedule === null || schedule === void 0 ? void 0 : schedule.modality) === null || _b === void 0 ? void 0 : _b[`${PREFIX}etiquetaid`]})`,
            [`${PREFIX}Ferramenta@odata.bind`]: (schedule === null || schedule === void 0 ? void 0 : schedule.tool) && `/${TAG}(${(_c = schedule === null || schedule === void 0 ? void 0 : schedule.tool) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`]})`,
            [`${PREFIX}FerramentaBackup@odata.bind`]: (schedule === null || schedule === void 0 ? void 0 : schedule.toolBackup) &&
                `/${TAG}(${(_d = schedule === null || schedule === void 0 ? void 0 : schedule.toolBackup) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`]})`,
            [`${PREFIX}link`]: schedule.link,
            [`${PREFIX}linkbackup`]: schedule.linkBackup,
        };
    };
    const buildItemActivity = (activity) => {
        var _a, _b, _c, _d;
        return {
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
            [`${PREFIX}Turma@odata.bind`]: (activity === null || activity === void 0 ? void 0 : activity.teamId) && `/${PERSON}(${activity === null || activity === void 0 ? void 0 : activity.teamId})`,
            [`${PREFIX}AreaAcademica@odata.bind`]: (activity === null || activity === void 0 ? void 0 : activity.area) && `/${TAG}(${(_d = activity === null || activity === void 0 ? void 0 : activity.area) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`]})`,
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
    const buildItemParticipant = (item) => {
        var _a;
        return {
            id: item.id,
            deleted: item.deleted,
            [`${PREFIX}data`]: (item === null || item === void 0 ? void 0 : item.date) ? (_a = item === null || item === void 0 ? void 0 : item.date) === null || _a === void 0 ? void 0 : _a.format() : null,
            [`${PREFIX}quantidade`]: (item === null || item === void 0 ? void 0 : item.quantity) || 0,
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
    const addOrUpdateTeam = (team, programId, { onSuccess, onError }) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            setLoadingSave(true);
            const dataToSave = buildItem(team);
            try {
                const batch = new BatchMultidata(executePost);
                let teamId = team === null || team === void 0 ? void 0 : team.id;
                if (teamId) {
                    batch.patch(TEAM, teamId, dataToSave);
                }
                else {
                    const response = yield executePost({
                        url: TEAM,
                        method: 'POST',
                        headers: {
                            Prefer: 'return=representation',
                        },
                        data: dataToSave,
                    });
                    teamId = (_a = response.data) === null || _a === void 0 ? void 0 : _a[`${PREFIX}turmaid`];
                    if (programId) {
                        yield executePost({
                            url: `${TEAM}(${teamId})/${PREFIX}Programa/$ref`,
                            method: 'PUT',
                            data: {
                                '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                                '@odata.id': `${PROGRAM}(${programId})`,
                            },
                        });
                    }
                }
                batch.bulkPostRelationship(TEAM_NAME, TEAM, teamId, 'Turma_NomeTurma', (_b = team === null || team === void 0 ? void 0 : team.names) === null || _b === void 0 ? void 0 : _b.map((name) => buildItemFantasyName(name)));
                batch.bulkPostRelationship(TEAM_ENVOLVED_PEOPLE, TEAM, teamId, 'Turma_PessoasEnvolvidasTurma', (_d = (_c = team === null || team === void 0 ? void 0 : team.people) === null || _c === void 0 ? void 0 : _c.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _d === void 0 ? void 0 : _d.map((name) => buildItemPeople(name)));
                batch.bulkPostRelationship(TEAM_PARTICIPANTS, TEAM, teamId, 'Turma_ParticipantesTurma', (_e = team === null || team === void 0 ? void 0 : team.participants) === null || _e === void 0 ? void 0 : _e.map((name) => buildItemParticipant(name)));
                // If there are schedules.
                if ((_f = team === null || team === void 0 ? void 0 : team.schedules) === null || _f === void 0 ? void 0 : _f.length) {
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
                                const academicRequestToSave = buildItemAcademicRequest(academicRequest);
                                const academicRequestRefId = batch.postRelationshipReference(ACADEMIC_REQUESTS, requestId, 'RequisicaoAcademica_Atividade', academicRequestToSave);
                                if (!academicRequest.deleted) {
                                    batch.bulkPostRelationshipReference(ACADEMIC_REQUESTS_ENVOLVED_PEOPLE, academicRequestRefId, 'Requisicao_PessoasEnvolvidas', (_b = (_a = academicRequest === null || academicRequest === void 0 ? void 0 : academicRequest.people) === null || _a === void 0 ? void 0 : _a.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _b === void 0 ? void 0 : _b.map((pe) => buildItemPeopleAcademicRequest(Object.assign(Object.assign({}, pe), { activityId: requestId }))));
                                }
                            });
                        });
                    });
                }
                yield batch.execute();
                if (!(team === null || team === void 0 ? void 0 : team.isLoadModel)) {
                    yield uploadTeamFiles(team, teamId);
                }
                const newTeam = yield getTeamById(teamId);
                resolve('Salvo com sucesso!');
                setLoadingSave(false);
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_g = newTeam === null || newTeam === void 0 ? void 0 : newTeam.value) === null || _g === void 0 ? void 0 : _g[0]);
                refetch();
            }
            catch ({ response }) {
                console.error(response);
                reject(response);
                onError === null || onError === void 0 ? void 0 : onError(response);
                setLoadingSave(false);
            }
        }));
    });
    const updateEnvolvedPerson = (id, teamId, toSave, { onSuccess, onError }) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const batch = new BatchMultidata(executePost);
            batch.patch(TEAM_ENVOLVED_PEOPLE, id, toSave);
            try {
                yield batch.execute();
                const schedule = yield getTeamById(teamId);
                resolve((_a = schedule === null || schedule === void 0 ? void 0 : schedule.value) === null || _a === void 0 ? void 0 : _a[0]);
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_b = schedule === null || schedule === void 0 ? void 0 : schedule.value) === null || _b === void 0 ? void 0 : _b[0]);
            }
            catch (err) {
                reject === null || reject === void 0 ? void 0 : reject(err);
                onError === null || onError === void 0 ? void 0 : onError(err);
            }
        }));
    };
    const updateTeam = (id, toSave, { onSuccess, onError }) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const batch = new BatchMultidata(executePost);
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
    const uploadTeamFiles = (team, teamId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _h, _j, _k;
            try {
                if ((_h = team === null || team === void 0 ? void 0 : team.anexos) === null || _h === void 0 ? void 0 : _h.length) {
                    const folder = `Turma/${moment(data === null || data === void 0 ? void 0 : data.createdon).format('YYYY')}/${teamId}`;
                    const attachmentsToDelete = (_j = team === null || team === void 0 ? void 0 : team.anexos) === null || _j === void 0 ? void 0 : _j.filter((file) => file.relativeLink && file.deveExcluir);
                    const attachmentsToSave = (_k = team === null || team === void 0 ? void 0 : team.anexos) === null || _k === void 0 ? void 0 : _k.filter((file) => !file.relativeLink && !file.deveExcluir);
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
    return [
        {
            teams: data === null || data === void 0 ? void 0 : data.value,
            count: data === null || data === void 0 ? void 0 : data['@odata.count'],
            nextLink: data === null || data === void 0 ? void 0 : data['@odata.nextLink'],
            postLoading,
            loadingSave,
            loading,
            error,
            addOrUpdateTeam,
            updateTeam,
            updateEnvolvedPerson,
            getTeamByProgramId,
            getTeamById,
            refetch,
        },
    ];
};
export default useTeam;
//# sourceMappingURL=useTeam.js.map