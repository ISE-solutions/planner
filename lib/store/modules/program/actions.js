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
import { PREFIX, PROGRAM, PROGRAM_ENVOLVED_PEOPLE, PROGRAM_NAME, RELATED_TEAM, TEAM, } from '~/config/database';
import { buildItem, buildItemFantasyName, buildItemPeople, buildQuery, } from './utils';
import { EActionType } from './types';
import { setValue } from '../common';
import { QueryBuilder } from 'odata-query-builder';
import BatchMultidata from '~/utils/BatchMultidata';
import * as moment from 'moment';
import { createFolder, deleteFiles, uploadFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import { addOrUpdateTeam } from '../team/actions';
import { getActivities, getActivityByProgramId } from '../activity/actions';
import { ACTION_DELETE, BASE_URL_API_NET, ENV, REFERENCE_DELETE, TypeBlockUpdated, } from '~/config/constants';
import { executeEventDeleteOutlook, } from '../eventOutlook/actions';
import { EActivityTypeApplication, EFatherTag } from '~/config/enums';
import { addOrUpdateByActivities, deleteByActivities, } from '../resource/actions';
export const fetchAllPrograms = (filter) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    dispatch(setValue(EActionType.FETCH_ALL_REQUEST, null));
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${PROGRAM}${query}`, {
            headers,
        });
        dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, data === null || data === void 0 ? void 0 : data.value));
    }
    catch (error) {
        console.error(error);
        // handle your error
    }
});
export const fetchAdvancedPrograms = (filter) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = yield api.post(`${BASE_URL_API_NET}Programa`, { queryString: filter || '', ev: ENV }, axiosConfig);
        resolve(data);
    }
    catch (error) {
        console.error(error);
    }
}));
export const getPrograms = (filter) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${PROGRAM}${query}`, {
            headers,
        });
        resolve(data === null || data === void 0 ? void 0 : data.value);
    }
    catch (error) {
        console.error(error);
    }
}));
export const getProgramId = (programId) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}programaid`, 'eq', programId));
        query.expand(`${PREFIX}TipoPrograma,${PREFIX}NomePrograma,${PREFIX}Instituto,${PREFIX}Empresa,${PREFIX}Temperatura,${PREFIX}ResponsavelpeloPrograma,${PREFIX}Programa_NomePrograma,${PREFIX}Programa_PessoasEnvolvidas,${PREFIX}Programa_Turma,${PREFIX}ise_turmasrelacionadas_Programa_ise_progr,${PREFIX}Programa_Compartilhamento`);
        api({
            url: `${PROGRAM}${query.toQuery()}`,
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
export const getProgramByIds = (programIds) => {
    return new Promise((resolve, reject) => {
        if (!programIds.length) {
            resolve([]);
            return;
        }
        var query = new QueryBuilder().filter((f) => {
            f.or((p) => {
                programIds.forEach((id) => p.filterExpression(`${PREFIX}programaid`, 'eq', id));
                return p;
            });
            return f;
        });
        query.expand(`${PREFIX}TipoPrograma,${PREFIX}NomePrograma,${PREFIX}Instituto,${PREFIX}Empresa,${PREFIX}Temperatura,${PREFIX}ResponsavelpeloPrograma,${PREFIX}Programa_NomePrograma,${PREFIX}Programa_PessoasEnvolvidas,${PREFIX}Programa_Turma,${PREFIX}ise_turmasrelacionadas_Programa_ise_progr,${PREFIX}Programa_Compartilhamento`);
        api({
            url: `${PROGRAM}${query.toQuery()}`,
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
export const addOrUpdateProgram = (program, { onSuccess, onError }, temperatureChanged, isUndo) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    try {
        const dataToSave = buildItem(program);
        const batch = new BatchMultidata(api);
        let programId = program === null || program === void 0 ? void 0 : program.id;
        if (programId) {
            const programRequest = yield getProgramId(programId);
            const programSaved = (_a = programRequest === null || programRequest === void 0 ? void 0 : programRequest.value) === null || _a === void 0 ? void 0 : _a[0];
            const { currentUser } = getState().app;
            if ((programSaved === null || programSaved === void 0 ? void 0 : programSaved[`_${PREFIX}editanto_value`]) &&
                (programSaved === null || programSaved === void 0 ? void 0 : programSaved[`_${PREFIX}editanto_value`]) !==
                    (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`])) {
                const err = {
                    data: {
                        error: {
                            message: `Outra pessoa está editando este programa!`,
                        },
                    },
                };
                onError === null || onError === void 0 ? void 0 : onError(err, programSaved);
                return;
            }
        }
        if (programId) {
            batch.patch(PROGRAM, programId, dataToSave);
        }
        else {
            const response = yield api({
                url: program.id ? `${PROGRAM}(${program.id})` : `${PROGRAM}`,
                method: (program === null || program === void 0 ? void 0 : program.id) ? 'PATCH' : 'POST',
                data: dataToSave,
                headers: {
                    Prefer: 'return=representation',
                },
            });
            programId = (_b = response.data) === null || _b === void 0 ? void 0 : _b[`${PREFIX}programaid`];
        }
        batch.bulkPostRelationship(PROGRAM_NAME, PROGRAM, programId, 'Programa_NomePrograma', (_c = program === null || program === void 0 ? void 0 : program.names) === null || _c === void 0 ? void 0 : _c.map((name) => buildItemFantasyName(name)));
        batch.bulkPostRelationship(PROGRAM_ENVOLVED_PEOPLE, PROGRAM, programId, 'Programa_PessoasEnvolvidas', (_e = (_d = program === null || program === void 0 ? void 0 : program.people) === null || _d === void 0 ? void 0 : _d.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _e === void 0 ? void 0 : _e.map((name, idx) => buildItemPeople(name, idx)));
        (_f = program === null || program === void 0 ? void 0 : program.relatedClass) === null || _f === void 0 ? void 0 : _f.forEach((elm) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (elm.id) {
                if (elm.deleted) {
                    batch.delete(RELATED_TEAM, elm.id);
                    return;
                }
                batch.patch(RELATED_TEAM, elm.id, {
                    [`${PREFIX}Programa@odata.bind`]: `/${PROGRAM}(${programId})`,
                    [`${PREFIX}Turma@odata.bind`]: ((_a = elm === null || elm === void 0 ? void 0 : elm.team) === null || _a === void 0 ? void 0 : _a[`${PREFIX}turmaid`])
                        ? `/${TEAM}(${(_b = elm === null || elm === void 0 ? void 0 : elm.team) === null || _b === void 0 ? void 0 : _b[`${PREFIX}turmaid`]})`
                        : null,
                    [`${PREFIX}TurmaRelacionada@odata.bind`]: ((_c = elm === null || elm === void 0 ? void 0 : elm.relatedTeam) === null || _c === void 0 ? void 0 : _c[`${PREFIX}turmaid`])
                        ? `/${TEAM}(${(_d = elm === null || elm === void 0 ? void 0 : elm.relatedTeam) === null || _d === void 0 ? void 0 : _d[`${PREFIX}turmaid`]})`
                        : null,
                });
            }
            else {
                batch.post(RELATED_TEAM, {
                    [`${PREFIX}Programa@odata.bind`]: `/${PROGRAM}(${programId})`,
                    [`${PREFIX}Turma@odata.bind`]: ((_e = elm === null || elm === void 0 ? void 0 : elm.team) === null || _e === void 0 ? void 0 : _e[`${PREFIX}turmaid`])
                        ? `/${TEAM}(${(_f = elm === null || elm === void 0 ? void 0 : elm.team) === null || _f === void 0 ? void 0 : _f[`${PREFIX}turmaid`]})`
                        : null,
                    [`${PREFIX}TurmaRelacionada@odata.bind`]: ((_g = elm === null || elm === void 0 ? void 0 : elm.relatedTeam) === null || _g === void 0 ? void 0 : _g[`${PREFIX}turmaid`])
                        ? `/${TEAM}(${(_h = elm === null || elm === void 0 ? void 0 : elm.relatedTeam) === null || _h === void 0 ? void 0 : _h[`${PREFIX}turmaid`]})`
                        : null,
                });
            }
        });
        yield batch.execute();
        // If the program has Team
        for (let i = 0; i < ((_g = program === null || program === void 0 ? void 0 : program.teams) === null || _g === void 0 ? void 0 : _g.length); i++) {
            const team = program === null || program === void 0 ? void 0 : program.teams[i];
            yield dispatch(addOrUpdateTeam(team, programId, {
                onSuccess: () => { },
                onError: () => { },
            }));
        }
        if (!program.isLoadModel) {
            const { context } = getState().app;
            yield uploadProgramFiles(program, programId, context);
        }
        const newProgram = yield getProgramId(programId);
        const { app, tag, environmentReference } = getState();
        const { context } = app;
        const { dictTag } = tag;
        const { references } = environmentReference;
        const activities = yield getActivities({
            programId,
            typeApplication: EActivityTypeApplication.APLICACAO,
            active: 'Ativo',
        });
        if (((_h = program === null || program === void 0 ? void 0 : program.temperature) === null || _h === void 0 ? void 0 : _h[`${PREFIX}nome`]) !== EFatherTag.CONTRATADO &&
            temperatureChanged) {
            yield deleteByActivities(activities, { references }, {
                type: TypeBlockUpdated.Programa,
                id: programId,
            });
        }
        else if (((_j = program === null || program === void 0 ? void 0 : program.temperature) === null || _j === void 0 ? void 0 : _j[`${PREFIX}nome`]) === EFatherTag.CONTRATADO) {
            yield addOrUpdateByActivities(activities, { references, dictTag }, {
                programId,
            }, {
                type: TypeBlockUpdated.Programa,
                id: programId,
                temperatureId: (_k = program === null || program === void 0 ? void 0 : program.temperature) === null || _k === void 0 ? void 0 : _k[`${PREFIX}etiquetaid`],
                changeTemperature: temperatureChanged,
                isUndo
            });
        }
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_l = newProgram === null || newProgram === void 0 ? void 0 : newProgram.value) === null || _l === void 0 ? void 0 : _l[0]);
    }
    catch (error) {
        console.log(error);
        onError === null || onError === void 0 ? void 0 : onError(error);
    }
});
export const deleteProgram = (programId, { onSuccess, onError }) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const eventsToDelete = [];
        const batch = new BatchMultidata(api);
        const { environmentReference, space, person, app } = getState();
        const { dictSpace } = space;
        const { dictPeople } = person;
        batch.patch(PROGRAM, programId, {
            [`${PREFIX}ativo`]: false,
            [`${PREFIX}excluido`]: true,
        });
        const activityRequest = yield getActivityByProgramId(programId);
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
                    Origem: 'Programa',
                    IDOrigem: programId,
                    IDPessoa: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`],
                }),
            });
            yield executeEventDeleteOutlook({ id: programId, type: TypeBlockUpdated.Programa }, { onSuccess: () => null, onError: () => null });
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
export const updateProgram = (id, toSave, { onSuccess, onError }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const batch = new BatchMultidata(api);
        batch.patch(PROGRAM, id, toSave);
        try {
            yield batch.execute();
            const activity = yield getProgramId(id);
            resolve((_a = activity === null || activity === void 0 ? void 0 : activity.value) === null || _a === void 0 ? void 0 : _a[0]);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_b = activity === null || activity === void 0 ? void 0 : activity.value) === null || _b === void 0 ? void 0 : _b[0]);
        }
        catch (err) {
            reject === null || reject === void 0 ? void 0 : reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
    }));
};
export const updateEnvolvedPerson = (id, programId, toSave, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _m, _o;
        const batch = new BatchMultidata(api);
        batch.patch(PROGRAM_ENVOLVED_PEOPLE, id, toSave);
        try {
            yield batch.execute();
            const program = yield getProgramId(programId);
            resolve((_m = program === null || program === void 0 ? void 0 : program.value) === null || _m === void 0 ? void 0 : _m[0]);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_o = program === null || program === void 0 ? void 0 : program.value) === null || _o === void 0 ? void 0 : _o[0]);
        }
        catch (err) {
            reject === null || reject === void 0 ? void 0 : reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
    }));
});
export const uploadProgramFiles = (program, programId, context) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            if ((_a = program === null || program === void 0 ? void 0 : program.anexos) === null || _a === void 0 ? void 0 : _a.length) {
                const folder = `Programa/${moment(program === null || program === void 0 ? void 0 : program.createdon).format('YYYY')}/${programId}`;
                const attachmentsToDelete = (_b = program === null || program === void 0 ? void 0 : program.anexos) === null || _b === void 0 ? void 0 : _b.filter((file) => file.relativeLink && file.deveExcluir);
                const attachmentsToSave = (_c = program === null || program === void 0 ? void 0 : program.anexos) === null || _c === void 0 ? void 0 : _c.filter((file) => !file.relativeLink && !file.deveExcluir);
                yield deleteFiles(sp, attachmentsToDelete);
                yield createFolder(sp, folder, 'Anexos Interno');
                yield uploadFiles(sp, `${context.pageContext.web.serverRelativeUrl}/Anexos Interno/${folder}`, attachmentsToSave);
            }
            resolve('Sucesso');
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    }));
};
//# sourceMappingURL=actions.js.map