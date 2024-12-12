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
import { PREFIX, RESOURCES } from '~/config/database';
import { buildItem, buildQuery } from './utils';
import { EActionType } from './types';
import { setValue } from '../common';
import * as moment from 'moment';
import BatchMultidata from '~/utils/BatchMultidata';
import { ACTION_DELETE, TypeBlockUpdated, } from '~/config/constants';
import { addOrUpdateEventsByResources, deleteEventsByResources, } from '../eventOutlook/actions';
import { QueryBuilder } from 'odata-query-builder';
import { EFatherTag } from '~/config/enums';
export const fetchAllResources = (filter) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    dispatch(setValue(EActionType.FETCH_ALL_REQUEST, null));
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${RESOURCES}${query}`, {
            headers,
        });
        dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, {
            items: data === null || data === void 0 ? void 0 : data.value,
            isActive: (filter === null || filter === void 0 ? void 0 : filter.active) === 'Ativo',
        }));
    }
    catch (error) {
        console.error(error);
        // handle your error
    }
});
export const getResources = (filtro) => {
    return new Promise((resolve, reject) => {
        var query = buildQuery(filtro);
        api({
            url: `${RESOURCES}${query}`,
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
export const getResourcesByActivityId = (activityId) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => {
            f.filterExpression(`${PREFIX}Atividade/${PREFIX}atividadeid`, 'eq', activityId);
            return f;
        });
        query.expand(`${PREFIX}Programa,${PREFIX}Turma,${PREFIX}Espaco,${PREFIX}Pessoa,${PREFIX}Atividade,${PREFIX}Recurso_RecursoFinitoeInfinito,${PREFIX}CronogramaDia`);
        api({
            url: `${RESOURCES}${query.toQuery()}`,
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
export const addOrUpdateByActivities = (activities, { dictTag }, filterEvent, blockUpdated) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const batch = new BatchMultidata(api);
        activities
            .filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]))
            .forEach((activity) => {
            var _a;
            (_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}recursos_Atividade`]) === null || _a === void 0 ? void 0 : _a.forEach((res) => {
                batch.patch(RESOURCES, res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`], {
                    [`${PREFIX}excluido`]: true,
                });
            });
        });
        (_a = activities === null || activities === void 0 ? void 0 : activities.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`])) === null || _a === void 0 ? void 0 : _a.forEach((activity) => {
            var _a, _b, _c, _d, _e;
            const resourcesSpaceSaved = (_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}recursos_Atividade`]) === null || _a === void 0 ? void 0 : _a.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && (e === null || e === void 0 ? void 0 : e[`_${PREFIX}espaco_value`]));
            const dictResourcesSpaceSaved = resourcesSpaceSaved === null || resourcesSpaceSaved === void 0 ? void 0 : resourcesSpaceSaved.reduce((acc, curr) => {
                acc[curr === null || curr === void 0 ? void 0 : curr[`_${PREFIX}espaco_value`]] = curr;
                return acc;
            }, {});
            (_b = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_Espaco`]) === null || _b === void 0 ? void 0 : _b.forEach((space) => {
                const resource = dictResourcesSpaceSaved[space === null || space === void 0 ? void 0 : space[`${PREFIX}espacoid`]];
                if (!resource) {
                    batch.post(RESOURCES, buildItem(Object.assign(Object.assign({}, space), { programId: (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}programa_value`]) || activity.programId, teamId: (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}turma_value`]) || activity.teamId, scheduleId: (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}cronogramadia_value`]) ||
                            activity.scheduleId, activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id, startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment.utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate, endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment.utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate })));
                }
                else if ((activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`]) !=
                    (resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}inicio`]) ||
                    (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`]) != (resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}fim`])) {
                    batch.patch(RESOURCES, resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}recursosid`], buildItem({
                        createInvite: true,
                        programId: (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}programa_value`]) || activity.programId,
                        teamId: (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}turma_value`]) || activity.teamId,
                        scheduleId: (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}cronogramadia_value`]) ||
                            activity.scheduleId,
                        activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id,
                        startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment.utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate,
                        endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment.utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate,
                    }));
                }
            });
            resourcesSpaceSaved === null || resourcesSpaceSaved === void 0 ? void 0 : resourcesSpaceSaved.forEach((res) => {
                var _a;
                const spaceExists = (_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_Espaco`]) === null || _a === void 0 ? void 0 : _a.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]) === (res === null || res === void 0 ? void 0 : res[`_${PREFIX}espaco_value`]));
                if (!spaceExists) {
                    batch.patch(RESOURCES, res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`], {
                        [`${PREFIX}excluido`]: true,
                    });
                }
            });
            const resourcesPersonSaved = (_c = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}recursos_Atividade`]) === null || _c === void 0 ? void 0 : _c.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && (e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]));
            const dictResourcesPersonSaved = resourcesPersonSaved === null || resourcesPersonSaved === void 0 ? void 0 : resourcesPersonSaved.reduce((acc, curr) => {
                acc[curr === null || curr === void 0 ? void 0 : curr[`_${PREFIX}pessoa_value`]] = curr;
                return acc;
            }, {});
            (_e = (_d = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _d === void 0 ? void 0 : _d.filter((e) => e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`])) === null || _e === void 0 ? void 0 : _e.forEach((person) => {
                var _a, _b;
                const resource = dictResourcesPersonSaved[person === null || person === void 0 ? void 0 : person[`_${PREFIX}pessoa_value`]];
                const func = dictTag === null || dictTag === void 0 ? void 0 : dictTag[person === null || person === void 0 ? void 0 : person[`_${PREFIX}funcao_value`]];
                const isTeacher = (_b = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) === null || _b === void 0 ? void 0 : _b.includes(EFatherTag.PROFESSOR.toLocaleLowerCase());
                if (!resource) {
                    batch.post(RESOURCES, buildItem(Object.assign(Object.assign({}, person), { createInvite: isTeacher, programId: (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}programa_value`]) ||
                            activity.programId, teamId: (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}turma_value`]) || activity.teamId, scheduleId: (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}cronogramadia_value`]) ||
                            activity.scheduleId, activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id, startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment.utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate, endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment.utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate })));
                }
                else if ((activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`]) !=
                    (resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}inicio`]) ||
                    (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`]) !=
                        (resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}fim`]) ||
                    isTeacher != (resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}criarevento`])) {
                    batch.patch(RESOURCES, resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}recursosid`], buildItem(Object.assign(Object.assign({}, person), { createInvite: isTeacher, programId: (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}programa_value`]) ||
                            activity.programId, teamId: (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}turma_value`]) || activity.teamId, scheduleId: (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}cronogramadia_value`]) ||
                            activity.scheduleId, activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id, startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment.utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate, endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment.utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate })));
                }
            });
            resourcesPersonSaved === null || resourcesPersonSaved === void 0 ? void 0 : resourcesPersonSaved.forEach((res) => {
                var _a;
                const personExists = (_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.find((e) => (e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]) === (res === null || res === void 0 ? void 0 : res[`_${PREFIX}pessoa_value`]));
                if (!personExists) {
                    // batch.delete(RESOURCES, res?.[`${PREFIX}recursosid`])
                    batch.patch(RESOURCES, res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`], {
                        [`${PREFIX}excluido`]: true,
                    });
                }
            });
        });
        yield batch.execute();
        const resourcesRequest = yield getResources(Object.assign(Object.assign({}, filterEvent), { filterDeleted: false }));
        const resourcesSaved = resourcesRequest.value;
        try {
            yield addOrUpdateEventsByResources(blockUpdated);
        }
        catch (err) {
            reject(err);
            console.error(err);
        }
        resolve('Sucesso');
    }));
});
export const deleteByActivities = (activities, { references, dictSpace, dictPeople }, blockUpdated) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const batch = new BatchMultidata(api);
        let resourcesToDelete = [];
        activities === null || activities === void 0 ? void 0 : activities.forEach((activity) => {
            var _a;
            const resourcesSaved = (_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}recursos_Atividade`]) === null || _a === void 0 ? void 0 : _a.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]));
            resourcesToDelete = resourcesToDelete.concat(resourcesSaved);
            resourcesSaved === null || resourcesSaved === void 0 ? void 0 : resourcesSaved.forEach((res) => {
                batch.patch(RESOURCES, res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`], {
                    [`${PREFIX}excluido`]: true,
                });
            });
        });
        yield batch.execute();
        try {
            yield deleteEventsByResources(resourcesToDelete, {
                references,
                dictSpace,
                dictPeople,
            }, blockUpdated);
        }
        catch (err) {
            reject(err);
            console.error(err);
        }
        resolve('Sucesso');
    }));
});
export const addOrUpdateByActivity = (activity, { references, dictTag }) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c, _d, _e, _f, _g;
        const batch = new BatchMultidata(api);
        const eventsToCreate = [];
        const resourcesSpaceSaved = (_c = (_b = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}recursos_Atividade`]) === null || _b === void 0 ? void 0 : _b.filter((e) => e === null || e === void 0 ? void 0 : e[`_${PREFIX}espaco_value`])) === null || _c === void 0 ? void 0 : _c.reduce((acc, curr) => {
            acc[curr === null || curr === void 0 ? void 0 : curr[`_${PREFIX}espaco_value`]] = curr;
            return acc;
        }, {});
        (_d = activity === null || activity === void 0 ? void 0 : activity.spaces) === null || _d === void 0 ? void 0 : _d.forEach((space) => {
            const resourceSpace = resourcesSpaceSaved[space === null || space === void 0 ? void 0 : space[`${PREFIX}espacoid`]];
            if (!resourceSpace) {
                batch.post(RESOURCES, buildItem(Object.assign(Object.assign({}, space), { createInvite: true, programId: activity === null || activity === void 0 ? void 0 : activity.programId, teamId: activity === null || activity === void 0 ? void 0 : activity.teamId, scheduleId: activity === null || activity === void 0 ? void 0 : activity.scheduleId, activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id, startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                        ? moment.utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                        : activity.startDate, endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                        ? moment.utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                        : activity.endDate })));
            }
            else {
                batch.patch(RESOURCES, resourceSpace === null || resourceSpace === void 0 ? void 0 : resourceSpace[`${PREFIX}recursosid`], buildItem({
                    programId: activity === null || activity === void 0 ? void 0 : activity.programId,
                    teamId: activity === null || activity === void 0 ? void 0 : activity.teamId,
                    scheduleId: activity === null || activity === void 0 ? void 0 : activity.scheduleId,
                    activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id,
                    startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                        ? moment.utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                        : activity.startDate,
                    endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                        ? moment.utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                        : activity.endDate,
                }));
            }
        });
        (_e = activity === null || activity === void 0 ? void 0 : activity.spacesToDelete) === null || _e === void 0 ? void 0 : _e.forEach((space) => {
            const resourceToDelete = resourcesSpaceSaved === null || resourcesSpaceSaved === void 0 ? void 0 : resourcesSpaceSaved[space === null || space === void 0 ? void 0 : space[`${PREFIX}espacoid`]];
            if (resourceToDelete) {
                batch.patch(RESOURCES, resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}recursosid`], {
                    [`${PREFIX}excluido`]: true,
                });
                eventsToCreate.push({
                    action: ACTION_DELETE,
                    title: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}nome`],
                    email: space === null || space === void 0 ? void 0 : space[`${PREFIX}email`],
                    start: moment(resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}inicio`]).format(),
                    end: moment(resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}fim`]).format(),
                    resourceId: resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}recursosid`],
                    // eventId: resourceToDelete?.[`${PREFIX}eventoid`] || eventId,
                });
            }
        });
        const resourcesPersonSaved = (_f = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}recursos_Atividade`]) === null || _f === void 0 ? void 0 : _f.filter((e) => e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]);
        const dictPersonResource = resourcesPersonSaved === null || resourcesPersonSaved === void 0 ? void 0 : resourcesPersonSaved.reduce((acc, curr) => {
            acc[curr === null || curr === void 0 ? void 0 : curr[`_${PREFIX}pessoa_value`]] = curr;
            return acc;
        }, {});
        resourcesPersonSaved.forEach((res) => {
            if (!(activity === null || activity === void 0 ? void 0 : activity.people.some((es) => {
                var _a;
                return ((es === null || es === void 0 ? void 0 : es[`_${PREFIX}pessoa_value`]) ||
                    ((_a = es === null || es === void 0 ? void 0 : es.person) === null || _a === void 0 ? void 0 : _a[`${PREFIX}pessoaid`])) ===
                    (res === null || res === void 0 ? void 0 : res[`_${PREFIX}pessoa_value`]);
            }))) {
                batch.patch(RESOURCES, res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`], {
                    [`${PREFIX}excluido`]: true,
                });
                eventsToCreate.push({
                    action: ACTION_DELETE,
                    title: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}nome`],
                    email: 'teste@example.com',
                    start: moment(res === null || res === void 0 ? void 0 : res[`${PREFIX}inicio`]).format(),
                    end: moment(res === null || res === void 0 ? void 0 : res[`${PREFIX}fim`]).format(),
                    resourceId: res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`],
                    // eventId: res?.[`${PREFIX}eventoid`] || eventId,
                });
            }
        });
        (_g = activity === null || activity === void 0 ? void 0 : activity.people) === null || _g === void 0 ? void 0 : _g.forEach((person) => {
            var _a, _b, _c, _d;
            const personId = (person === null || person === void 0 ? void 0 : person[`_${PREFIX}pessoa_value`]) ||
                ((_a = person === null || person === void 0 ? void 0 : person.person) === null || _a === void 0 ? void 0 : _a[`${PREFIX}pessoaid`]);
            const funcId = (person === null || person === void 0 ? void 0 : person[`_${PREFIX}funcao_value`]) ||
                ((_b = person === null || person === void 0 ? void 0 : person.function) === null || _b === void 0 ? void 0 : _b[`${PREFIX}etiquetaid`]);
            if (person === null || person === void 0 ? void 0 : person.deleted) {
                const resourcePeopleToDelete = dictPersonResource === null || dictPersonResource === void 0 ? void 0 : dictPersonResource[personId];
                if (resourcePeopleToDelete) {
                    batch.patch(RESOURCES, resourcePeopleToDelete === null || resourcePeopleToDelete === void 0 ? void 0 : resourcePeopleToDelete[`${PREFIX}recursosid`], { [`${PREFIX}excluido`]: true });
                    eventsToCreate.push({
                        action: ACTION_DELETE,
                        title: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}nome`],
                        email: person === null || person === void 0 ? void 0 : person[`${PREFIX}email`],
                        start: moment(resourcePeopleToDelete === null || resourcePeopleToDelete === void 0 ? void 0 : resourcePeopleToDelete[`${PREFIX}inicio`]).format(),
                        end: moment(resourcePeopleToDelete === null || resourcePeopleToDelete === void 0 ? void 0 : resourcePeopleToDelete[`${PREFIX}fim`]).format(),
                        resourceId: resourcePeopleToDelete === null || resourcePeopleToDelete === void 0 ? void 0 : resourcePeopleToDelete[`${PREFIX}recursosid`],
                        // eventId: resourcePeopleToDelete?.[`${PREFIX}eventoid`] || eventId,
                    });
                }
            }
            else if (person === null || person === void 0 ? void 0 : person.person) {
                const resourcePeople = dictPersonResource[personId];
                const isTeacher = (_d = (_c = dictTag === null || dictTag === void 0 ? void 0 : dictTag[funcId]) === null || _c === void 0 ? void 0 : _c.toLocaleLowerCase()) === null || _d === void 0 ? void 0 : _d.includes(EFatherTag.PROFESSOR.toLocaleLowerCase());
                if (!resourcePeople) {
                    batch.post(RESOURCES, buildItem(Object.assign(Object.assign({}, person), { createInvite: isTeacher, [`_${PREFIX}pessoa_value`]: personId, programId: activity === null || activity === void 0 ? void 0 : activity.programId, teamId: activity === null || activity === void 0 ? void 0 : activity.teamId, scheduleId: activity === null || activity === void 0 ? void 0 : activity.scheduleId, activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id, startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate, endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate })));
                }
                else {
                    batch.patch(RESOURCES, resourcePeople === null || resourcePeople === void 0 ? void 0 : resourcePeople[`${PREFIX}recursosid`], buildItem({
                        createInvite: isTeacher,
                        startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment.utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate,
                        endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment.utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate,
                    }));
                }
            }
        });
        yield batch.execute();
        const resourcesSaved = yield getResourcesByActivityId((activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id);
        resourcesSaved === null || resourcesSaved === void 0 ? void 0 : resourcesSaved.forEach((res) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const temperatureId = ((_a = res === null || res === void 0 ? void 0 : res[`${PREFIX}Atividade`]) === null || _a === void 0 ? void 0 : _a[`_${PREFIX}temperatura_value`]) ||
                ((_b = res === null || res === void 0 ? void 0 : res[`${PREFIX}CronogramaDia`]) === null || _b === void 0 ? void 0 : _b[`_${PREFIX}temperatura_value`]) ||
                ((_c = res === null || res === void 0 ? void 0 : res[`${PREFIX}Turma`]) === null || _c === void 0 ? void 0 : _c[`_${PREFIX}temperatura_value`]) ||
                ((_d = res === null || res === void 0 ? void 0 : res[`${PREFIX}Programa`]) === null || _d === void 0 ? void 0 : _d[`_${PREFIX}temperatura_value`]);
            const temperature = dictTag === null || dictTag === void 0 ? void 0 : dictTag[temperatureId];
            if (temperature &&
                (temperature === null || temperature === void 0 ? void 0 : temperature[`${PREFIX}nome`]) !== EFatherTag.RASCUNHO &&
                ((res === null || res === void 0 ? void 0 : res[`${PREFIX}Pessoa`]) || (res === null || res === void 0 ? void 0 : res[`${PREFIX}Espaco`]))) {
                const academicArea = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_e = res === null || res === void 0 ? void 0 : res[`${PREFIX}Atividade`]) === null || _e === void 0 ? void 0 : _e[`_${PREFIX}areaacademica_value`]];
                const title = [];
                title.push((_f = res === null || res === void 0 ? void 0 : res[`${PREFIX}Programa`]) === null || _f === void 0 ? void 0 : _f[`${PREFIX}sigla`]);
                title.push((_g = res === null || res === void 0 ? void 0 : res[`${PREFIX}Turma`]) === null || _g === void 0 ? void 0 : _g[`${PREFIX}nome`]);
                title.push((_h = res === null || res === void 0 ? void 0 : res[`${PREFIX}Atividade`]) === null || _h === void 0 ? void 0 : _h[`${PREFIX}nome`]);
                title.push(academicArea === null || academicArea === void 0 ? void 0 : academicArea[`${PREFIX}nome`]);
            }
        });
        if (eventsToCreate.length) {
            // await executeEventOutlook(
            //   { references, events: eventsToCreate },
            //   {
            //     onSuccess: () => null,
            //     onError: () => null,
            //   }
            // );
        }
        resolve('Sucesso');
    }));
});
export const deleteByActivity = (activityId) => (dispatch, getState) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const batch = new BatchMultidata(api);
        const { tag, person, space, environmentReference } = getState();
        const { dictTag } = tag;
        const { dictSpace } = space;
        const { dictPeople } = person;
        const { references } = environmentReference;
        const resourcesRequest = yield getResources({
            activityId,
            filterDeleted: false,
        });
        const resourcesSaved = resourcesRequest.value;
        resourcesSaved === null || resourcesSaved === void 0 ? void 0 : resourcesSaved.forEach((res) => {
            batch.patch(RESOURCES, res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`], {
                [`${PREFIX}excluido`]: true,
            });
        });
        try {
            yield deleteEventsByResources(resourcesSaved, {
                references,
                dictPeople,
                dictSpace,
            }, { id: activityId, type: TypeBlockUpdated.Atividade });
        }
        catch (err) {
            reject(err);
            console.error(err);
        }
        yield batch.execute();
        resolve('Sucesso');
    }));
};
export const deleteBySchedule = (scheduleId) => (dispatch, getState) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const batch = new BatchMultidata(api);
        const { tag, environmentReference } = getState();
        const { dictTag } = tag;
        const { references } = environmentReference;
        const resourcesRequest = yield getResources({
            scheduleId,
            filterDeleted: false,
        });
        const resourcesSaved = resourcesRequest.value;
        resourcesSaved === null || resourcesSaved === void 0 ? void 0 : resourcesSaved.forEach((res) => {
            batch.patch(RESOURCES, res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`], {
                [`${PREFIX}excluido`]: true,
            });
        });
        try {
            yield addOrUpdateEventsByResources({
                type: TypeBlockUpdated.DiaAula,
                id: scheduleId,
            });
        }
        catch (err) {
            reject(err);
            console.error(err);
        }
        yield batch.execute();
        resolve('Sucesso');
    }));
};
export const deleteByTeam = (teamId) => (dispatch, getState) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const batch = new BatchMultidata(api);
        const { tag, environmentReference } = getState();
        const { dictTag } = tag;
        const { references } = environmentReference;
        const resourcesRequest = yield getResources({
            teamId,
            filterDeleted: false,
        });
        const resourcesSaved = resourcesRequest.value;
        resourcesSaved === null || resourcesSaved === void 0 ? void 0 : resourcesSaved.forEach((res) => {
            batch.patch(RESOURCES, res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`], {
                [`${PREFIX}excluido`]: true,
            });
        });
        try {
            yield addOrUpdateEventsByResources({
                type: TypeBlockUpdated.Turma,
                id: teamId,
            });
        }
        catch (err) {
            reject(err);
            console.error(err);
        }
        yield batch.execute();
        resolve('Sucesso');
    }));
};
export const deleteByProgram = (programId) => (dispatch, getState) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const batch = new BatchMultidata(api);
        const { tag, environmentReference } = getState();
        const { dictTag } = tag;
        const { references } = environmentReference;
        const resourcesRequest = yield getResources({
            programId,
            filterDeleted: false,
        });
        const resourcesSaved = resourcesRequest.value;
        resourcesSaved === null || resourcesSaved === void 0 ? void 0 : resourcesSaved.forEach((res) => {
            batch.patch(RESOURCES, res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`], {
                [`${PREFIX}excluido`]: true,
            });
        });
        try {
            yield addOrUpdateEventsByResources({
                type: TypeBlockUpdated.Programa,
                id: programId,
            });
        }
        catch (err) {
            reject(err);
            console.error(err);
        }
        yield batch.execute();
        resolve('Sucesso');
    }));
};
//# sourceMappingURL=actions.js.map