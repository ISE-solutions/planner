var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RELATED_TEAM, TEAM } from './../../config/database';
import { QueryBuilder } from 'odata-query-builder';
import * as moment from 'moment';
import { PROGRAM, PREFIX, TAG, PERSON, PROGRAM_NAME, PROGRAM_ENVOLVED_PEOPLE, } from '~/config/database';
import axios from '../useAxios/useAxios';
import { createFolder, deleteFiles, uploadFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import BatchMultidata from '~/utils/BatchMultidata';
import useTeam from '../useTeam/useTeam';
import { useState } from 'react';
const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.searchQuery) &&
            f.or((p) => {
                p.filterPhrase(`contains(${PREFIX}titulo,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}sigla,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}NomePrograma/${PREFIX}nome,'${filtro.searchQuery}')`);
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
        filtro.typeProgram &&
            f.filterExpression(`${PREFIX}TipoPrograma/${PREFIX}etiquetaid`, 'eq', filtro.typeProgram);
        // tslint:disable-next-line: no-unused-expression
        filtro.nameProgram &&
            f.filterExpression(`${PREFIX}NomePrograma/${PREFIX}etiquetaid`, 'eq', filtro.nameProgram);
        // tslint:disable-next-line: no-unused-expression
        filtro.institute &&
            f.filterExpression(`${PREFIX}Instituto/${PREFIX}etiquetaid`, 'eq', filtro.institute);
        // tslint:disable-next-line: no-unused-expression
        filtro.company &&
            f.filterExpression(`${PREFIX}Empresa/${PREFIX}etiquetaid`, 'eq', filtro.company);
        // tslint:disable-next-line: no-unused-expression
        filtro.createdBy &&
            f.filterExpression(`${PREFIX}CriadoPor/${PREFIX}pessoaid`, 'eq', filtro.createdBy);
        f.filterExpression(`${PREFIX}excluido`, 'eq', false);
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    else {
        query.orderBy(`createdon desc`);
    }
    query.expand(`${PREFIX}TipoPrograma,${PREFIX}NomePrograma,${PREFIX}Instituto,${PREFIX}Empresa,${PREFIX}Temperatura,${PREFIX}ResponsavelpeloPrograma,${PREFIX}Programa_NomePrograma,${PREFIX}Programa_PessoasEnvolvidas,${PREFIX}Programa_Turma,${PREFIX}ise_turmasrelacionadas_Programa_ise_progr,${PREFIX}Programa_Compartilhamento`);
    query.count();
    return query.toQuery();
};
const useProgram = (filter, context) => {
    const query = buildQuery(filter);
    // const { context } = useContextWebpart();
    const useAxios = axios({ context: context });
    const [loadingSave, setLoadingSave] = useState(false);
    const [{ addOrUpdateTeam }] = useTeam({}, {
        manual: true,
    });
    let headers = {};
    if (filter.rowsPerPage) {
        headers = {
            Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
    }
    const [{ data, loading, error }, refetch] = useAxios({
        url: `${PROGRAM}${query}`,
        headers,
    }, {
        useCache: false,
    });
    const [{ data: postData, loading: postLoading, error: postError }, executePost,] = useAxios({
        url: `${PROGRAM}`,
        method: 'POST',
    }, { manual: true });
    const buildItem = (program) => {
        var _a, _b, _c, _d, _e, _f;
        const res = {
            [`${PREFIX}titulo`]: program === null || program === void 0 ? void 0 : program.title,
            [`${PREFIX}sigla`]: program === null || program === void 0 ? void 0 : program.sigla,
            [`${PREFIX}modelo`]: program === null || program === void 0 ? void 0 : program.model,
            [`${PREFIX}anexossincronizados`]: program.anexossincronizados,
            [`${PREFIX}modeloid`]: program.modeloid,
            [`${PREFIX}observacao`]: program === null || program === void 0 ? void 0 : program.description,
            [`${PREFIX}TipoPrograma@odata.bind`]: (program === null || program === void 0 ? void 0 : program.typeProgram) && `/${TAG}(${(_a = program === null || program === void 0 ? void 0 : program.typeProgram) === null || _a === void 0 ? void 0 : _a.value})`,
            [`${PREFIX}NomePrograma@odata.bind`]: (program === null || program === void 0 ? void 0 : program.nameProgram) && `/${TAG}(${(_b = program === null || program === void 0 ? void 0 : program.nameProgram) === null || _b === void 0 ? void 0 : _b.value})`,
            [`${PREFIX}Instituto@odata.bind`]: (program === null || program === void 0 ? void 0 : program.institute) && `/${TAG}(${(_c = program === null || program === void 0 ? void 0 : program.institute) === null || _c === void 0 ? void 0 : _c.value})`,
            [`${PREFIX}Empresa@odata.bind`]: (program === null || program === void 0 ? void 0 : program.company) && `/${TAG}(${(_d = program === null || program === void 0 ? void 0 : program.company) === null || _d === void 0 ? void 0 : _d.value})`,
            [`${PREFIX}ResponsavelpeloPrograma@odata.bind`]: (program === null || program === void 0 ? void 0 : program.responsible) && `/${PERSON}(${(_e = program === null || program === void 0 ? void 0 : program.responsible) === null || _e === void 0 ? void 0 : _e.value})`,
            [`${PREFIX}Temperatura@odata.bind`]: (program === null || program === void 0 ? void 0 : program.temperature) && `/${TAG}(${(_f = program === null || program === void 0 ? void 0 : program.temperature) === null || _f === void 0 ? void 0 : _f.value})`,
        };
        if (!(program === null || program === void 0 ? void 0 : program.id)) {
            res[`${PREFIX}CriadoPor@odata.bind`] =
                (program === null || program === void 0 ? void 0 : program.user) && `/${PERSON}(${program === null || program === void 0 ? void 0 : program.user})`;
            res[`${PREFIX}grupopermissao`] = program === null || program === void 0 ? void 0 : program.group;
        }
        return res;
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
    const getProgramId = (programId) => {
        return new Promise((resolve, reject) => {
            var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}programaid`, 'eq', programId));
            query.expand(`${PREFIX}TipoPrograma,${PREFIX}NomePrograma,${PREFIX}Instituto,${PREFIX}Empresa,${PREFIX}Temperatura,${PREFIX}ResponsavelpeloPrograma,${PREFIX}Programa_NomePrograma,${PREFIX}Programa_PessoasEnvolvidas,${PREFIX}Programa_Turma,${PREFIX}ise_turmasrelacionadas_Programa_ise_progr,${PREFIX}Programa_Compartilhamento`);
            executePost({
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
    const addOrUpdateProgram = (program, { onSuccess, onError }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            setLoadingSave(true);
            const dataToSave = buildItem(program);
            const batch = new BatchMultidata(executePost);
            let programId = program === null || program === void 0 ? void 0 : program.id;
            if (programId) {
                batch.patch(PROGRAM, programId, dataToSave);
            }
            else {
                const response = yield executePost({
                    url: program.id ? `${PROGRAM}(${program.id})` : `${PROGRAM}`,
                    method: (program === null || program === void 0 ? void 0 : program.id) ? 'PATCH' : 'POST',
                    data: dataToSave,
                    headers: {
                        Prefer: 'return=representation',
                    },
                });
                programId = (_a = response.data) === null || _a === void 0 ? void 0 : _a[`${PREFIX}programaid`];
            }
            batch.bulkPostRelationship(PROGRAM_NAME, PROGRAM, programId, 'Programa_NomePrograma', (_b = program === null || program === void 0 ? void 0 : program.names) === null || _b === void 0 ? void 0 : _b.map((name) => buildItemFantasyName(name)));
            batch.bulkPostRelationship(PROGRAM_ENVOLVED_PEOPLE, PROGRAM, programId, 'Programa_PessoasEnvolvidas', (_d = (_c = program === null || program === void 0 ? void 0 : program.people) === null || _c === void 0 ? void 0 : _c.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _d === void 0 ? void 0 : _d.map((name) => buildItemPeople(name)));
            (_e = program === null || program === void 0 ? void 0 : program.relatedClass) === null || _e === void 0 ? void 0 : _e.forEach((elm) => {
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
            for (let i = 0; i < ((_f = program === null || program === void 0 ? void 0 : program.teams) === null || _f === void 0 ? void 0 : _f.length); i++) {
                const team = program === null || program === void 0 ? void 0 : program.teams[i];
                yield addOrUpdateTeam(team, programId, {
                    onSuccess: () => { },
                    onError: () => { },
                });
            }
            if (!program.isLoadModel) {
                yield uploadProgramFiles(program, programId);
            }
            const newProgram = yield getProgramId(programId);
            setLoadingSave(false);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_g = newProgram === null || newProgram === void 0 ? void 0 : newProgram.value) === null || _g === void 0 ? void 0 : _g[0]);
            refetch();
        }
        catch (error) {
            console.log(error);
            setLoadingSave(false);
            onError === null || onError === void 0 ? void 0 : onError(error);
        }
    });
    const updateProgram = (id, toSave, { onSuccess, onError }) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const batch = new BatchMultidata(executePost);
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
    const updateEnvolvedPerson = (id, programId, toSave, { onSuccess, onError }) => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const batch = new BatchMultidata(executePost);
            batch.patch(PROGRAM_ENVOLVED_PEOPLE, id, toSave);
            try {
                yield batch.execute();
                const program = yield getProgramId(programId);
                resolve((_a = program === null || program === void 0 ? void 0 : program.value) === null || _a === void 0 ? void 0 : _a[0]);
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_b = program === null || program === void 0 ? void 0 : program.value) === null || _b === void 0 ? void 0 : _b[0]);
            }
            catch (err) {
                reject === null || reject === void 0 ? void 0 : reject(err);
                onError === null || onError === void 0 ? void 0 : onError(err);
            }
        }));
    };
    const uploadProgramFiles = (program, programId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _h, _j, _k;
            try {
                if ((_h = program === null || program === void 0 ? void 0 : program.anexos) === null || _h === void 0 ? void 0 : _h.length) {
                    const folder = `Programa/${moment(data === null || data === void 0 ? void 0 : data.createdon).format('YYYY')}/${programId}`;
                    const attachmentsToDelete = (_j = program === null || program === void 0 ? void 0 : program.anexos) === null || _j === void 0 ? void 0 : _j.filter((file) => file.relativeLink && file.deveExcluir);
                    const attachmentsToSave = (_k = program === null || program === void 0 ? void 0 : program.anexos) === null || _k === void 0 ? void 0 : _k.filter((file) => !file.relativeLink && !file.deveExcluir);
                    yield deleteFiles(sp, attachmentsToDelete);
                    yield createFolder(sp, folder, 'Anexos Interno');
                    yield uploadFiles(sp, `${context.pageContext.web.serverRelativeUrl}/Anexos Interno/${folder}`, attachmentsToSave);
                }
                resolve('Sucesso');
            }
            catch (err) {
                console.log(error);
                reject(err);
            }
        }));
    });
    return [
        {
            programs: data === null || data === void 0 ? void 0 : data.value,
            count: data === null || data === void 0 ? void 0 : data['@odata.count'],
            nextLink: data === null || data === void 0 ? void 0 : data['@odata.nextLink'],
            postLoading,
            loadingSave,
            loading,
            error,
            addOrUpdateProgram,
            updateEnvolvedPerson,
            updateProgram,
            refetch,
        },
    ];
};
export default useProgram;
//# sourceMappingURL=useProgram.js.map