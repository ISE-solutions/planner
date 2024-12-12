var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ACTIVITY, PROGRAM, SCHEDULE_DAY, TEAM } from '~/config/database';
import { QueryBuilder } from 'odata-query-builder';
import * as moment from 'moment';
import { FINITE_INFINITE_RESOURCES, PERSON, PREFIX, RESOURCES, SPACE, } from '~/config/database';
import axios from '../useAxios/useAxios';
import BatchMultidata from '~/utils/BatchMultidata';
import useContextWebpart from '../useContextWebpart';
const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        var _a, _b;
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        // tslint:disable-next-line: no-unused-expression
        if (((_a = filtro === null || filtro === void 0 ? void 0 : filtro.people) === null || _a === void 0 ? void 0 : _a.length) || ((_b = filtro === null || filtro === void 0 ? void 0 : filtro.spaces) === null || _b === void 0 ? void 0 : _b.length)) {
            f.or((p) => {
                var _a, _b;
                (_a = filtro === null || filtro === void 0 ? void 0 : filtro.people) === null || _a === void 0 ? void 0 : _a.forEach((item) => {
                    p.filterExpression(`${PREFIX}Pessoa/${PREFIX}pessoaid`, 'eq', item.value);
                });
                (_b = filtro === null || filtro === void 0 ? void 0 : filtro.spaces) === null || _b === void 0 ? void 0 : _b.forEach((item) => {
                    p.filterExpression(`${PREFIX}Espaco/${PREFIX}espacoid`, 'eq', item.value);
                });
                return p;
            });
        }
        if (filtro.startDate && filtro.endDate) {
            f.filterPhrase(`${PREFIX}inicio gt '${filtro.startDate
                .clone()
                .startOf('day')
                .format()}' and ${PREFIX}inicio lt '${filtro.endDate
                .clone()
                .endOf('day')
                .format()}'`);
        }
        if (filtro.dayDate) {
            f.filterPhrase(`${PREFIX}inicio gt '${filtro.dayDate.format('YYYY-MM-DD')}' and ${PREFIX}fim lt '${filtro.dayDate
                .add(1, 'day')
                .format('YYYY-MM-DD')}'`);
        }
        // tslint:disable-next-line: no-unused-expression
        // filtro.active &&
        //   filtro.active !== 'Todos' &&
        //   f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');
        // f.filterExpression(`${PREFIX}excluido`, 'eq', false);
        f.filterExpression(`${PREFIX}excluido`, 'eq', Boolean(filtro.deleted));
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    query.expand(`${PREFIX}Programa,${PREFIX}Turma,${PREFIX}Espaco,${PREFIX}Pessoa,${PREFIX}Atividade,${PREFIX}Recurso_RecursoFinitoeInfinito,${PREFIX}CronogramaDia`);
    query.count();
    return query.toQuery();
};
const useResource = (filter, options) => {
    const query = buildQuery(filter);
    const { context } = useContextWebpart();
    const useAxios = axios({ context: context });
    let headers = {};
    if (filter.rowsPerPage) {
        headers = {
            Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
    }
    const [{ data, loading, error }, refetch] = useAxios({
        url: `${RESOURCES}${query}`,
        headers,
    }, {
        useCache: false,
        manual: !!(options === null || options === void 0 ? void 0 : options.manual),
    });
    const [{ data: postData, loading: postLoading, error: postError }, executePost,] = useAxios({
        url: `${RESOURCES}`,
        method: 'POST',
    }, { manual: true });
    const buildItem = (item) => {
        return {
            [`${PREFIX}Espaco@odata.bind`]: (item === null || item === void 0 ? void 0 : item[`${PREFIX}espacoid`]) &&
                `/${SPACE}(${item === null || item === void 0 ? void 0 : item[`${PREFIX}espacoid`]})`,
            [`${PREFIX}Pessoa@odata.bind`]: (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`]) &&
                `/${PERSON}(${item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`]})`,
            [`${PREFIX}Recurso_RecursoFinitoeInfinito@odata.bind`]: (item === null || item === void 0 ? void 0 : item.resourceFiniteInfiniteId) &&
                `/${FINITE_INFINITE_RESOURCES}(${item === null || item === void 0 ? void 0 : item.resourceFiniteInfiniteId})`,
            [`${PREFIX}Atividade@odata.bind`]: (item === null || item === void 0 ? void 0 : item.activityId) && `/${ACTIVITY}(${item === null || item === void 0 ? void 0 : item.activityId})`,
            [`${PREFIX}Programa@odata.bind`]: (item === null || item === void 0 ? void 0 : item.programId) && `/${PROGRAM}(${item === null || item === void 0 ? void 0 : item.programId})`,
            [`${PREFIX}Turma@odata.bind`]: (item === null || item === void 0 ? void 0 : item.teamId) && `/${TEAM}(${item === null || item === void 0 ? void 0 : item.teamId})`,
            [`${PREFIX}CronogramaDia@odata.bind`]: (item === null || item === void 0 ? void 0 : item.scheduleId) && `/${SCHEDULE_DAY}(${item === null || item === void 0 ? void 0 : item.scheduleId})`,
            [`${PREFIX}inicio`]: item.startDate && moment(item.startDate).format(),
            [`${PREFIX}fim`]: item.endDate && moment(item.endDate).format(),
        };
    };
    const fetchResources = (ft) => {
        // const query = buildQuery(ft);
        // refetch({
        //   url: `${RESOURCES}${query}`,
        //   headers,
        // });
    };
    const getResources = (filtro) => {
        return new Promise((resolve, reject) => {
            var query = buildQuery(filtro);
            executePost({
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
    const addOrUpdateByActivities = (activities) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            const batch = new BatchMultidata(executePost);
            activities === null || activities === void 0 ? void 0 : activities.forEach((activity) => {
                var _a, _b, _c, _d, _e, _f;
                const resourcesSpaceSaved = (_b = (_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}recursos_Atividade`]) === null || _a === void 0 ? void 0 : _a.filter((e) => e === null || e === void 0 ? void 0 : e[`_${PREFIX}espaco_value`])) === null || _b === void 0 ? void 0 : _b.reduce((acc, curr) => {
                    acc[curr === null || curr === void 0 ? void 0 : curr[`_${PREFIX}espaco_value`]] = curr;
                    return acc;
                }, {});
                (_c = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_Espaco`]) === null || _c === void 0 ? void 0 : _c.forEach((space) => {
                    if (!resourcesSpaceSaved[space === null || space === void 0 ? void 0 : space[`${PREFIX}espacoid`]]) {
                        batch.post(RESOURCES, buildItem(Object.assign(Object.assign({}, space), { programId: activity === null || activity === void 0 ? void 0 : activity.programId, teamId: activity === null || activity === void 0 ? void 0 : activity.teamId, scheduleId: activity === null || activity === void 0 ? void 0 : activity.scheduleId, activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id, startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                                ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                                : activity.startDate, endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                                ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                                : activity.endDate })));
                    }
                });
                const resourcesPersonSaved = (_e = (_d = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}recursos_Atividade`]) === null || _d === void 0 ? void 0 : _d.filter((e) => e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`])) === null || _e === void 0 ? void 0 : _e.reduce((acc, curr) => {
                    acc[curr === null || curr === void 0 ? void 0 : curr[`_${PREFIX}pessoa_value`]] = curr;
                    return acc;
                }, {});
                (_f = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _f === void 0 ? void 0 : _f.forEach((person) => {
                    if (!resourcesPersonSaved[person === null || person === void 0 ? void 0 : person[`_${PREFIX}pessoa_value`]]) {
                        batch.post(RESOURCES, buildItem(Object.assign(Object.assign({}, person), { programId: activity === null || activity === void 0 ? void 0 : activity.programId, teamId: activity === null || activity === void 0 ? void 0 : activity.teamId, scheduleId: activity === null || activity === void 0 ? void 0 : activity.scheduleId, activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id, startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                                ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                                : activity.startDate, endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                                ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                                : activity.endDate })));
                    }
                });
            });
            yield batch.execute();
            resolve('Sucesso');
        }));
    });
    const addOrUpdateByActivity = (activity) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            const batch = new BatchMultidata(executePost);
            const resourcesSpaceSaved = (_b = (_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}recursos_Atividade`]) === null || _a === void 0 ? void 0 : _a.filter((e) => e === null || e === void 0 ? void 0 : e[`_${PREFIX}espaco_value`])) === null || _b === void 0 ? void 0 : _b.reduce((acc, curr) => {
                acc[curr === null || curr === void 0 ? void 0 : curr[`_${PREFIX}espaco_value`]] = curr;
                return acc;
            }, {});
            (_c = activity === null || activity === void 0 ? void 0 : activity.spaces) === null || _c === void 0 ? void 0 : _c.forEach((space) => {
                const resourceSpace = resourcesSpaceSaved[space === null || space === void 0 ? void 0 : space[`${PREFIX}espacoid`]];
                if (!resourceSpace) {
                    batch.post(RESOURCES, buildItem(Object.assign(Object.assign({}, space), { programId: activity === null || activity === void 0 ? void 0 : activity.programId, teamId: activity === null || activity === void 0 ? void 0 : activity.teamId, scheduleId: activity === null || activity === void 0 ? void 0 : activity.scheduleId, activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id, startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate, endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate })));
                }
                else {
                    batch.patch(RESOURCES, resourceSpace === null || resourceSpace === void 0 ? void 0 : resourceSpace[`${PREFIX}recursosid`], buildItem({
                        startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate,
                        endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate,
                    }));
                }
            });
            const resourcesFiniteSaved = (_e = (_d = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}recursos_Atividade`]) === null || _d === void 0 ? void 0 : _d.filter((e) => e === null || e === void 0 ? void 0 : e[`_${PREFIX}recurso_recursofinitoeinfinito_value`])) === null || _e === void 0 ? void 0 : _e.reduce((acc, curr) => {
                acc[curr === null || curr === void 0 ? void 0 : curr[`_${PREFIX}recurso_recursofinitoeinfinito_value`]] = curr;
                return acc;
            }, {});
            (_f = activity === null || activity === void 0 ? void 0 : activity.finiteResource) === null || _f === void 0 ? void 0 : _f.forEach((finite) => {
                const resourceFinite = resourcesFiniteSaved[finite === null || finite === void 0 ? void 0 : finite[`${PREFIX}recursofinitoinfinitoid`]];
                if (!resourceFinite) {
                    batch.post(RESOURCES, buildItem(Object.assign(Object.assign({}, finite), { programId: activity === null || activity === void 0 ? void 0 : activity.programId, teamId: activity === null || activity === void 0 ? void 0 : activity.teamId, scheduleId: activity === null || activity === void 0 ? void 0 : activity.scheduleId, resourceFiniteInfiniteId: finite === null || finite === void 0 ? void 0 : finite[`${PREFIX}recursofinitoinfinitoid`], activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id, startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate, endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate })));
                }
                else {
                    batch.patch(RESOURCES, resourceFinite === null || resourceFinite === void 0 ? void 0 : resourceFinite[`${PREFIX}recursosid`], buildItem({
                        startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate,
                        endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate,
                    }));
                }
            });
            (_g = activity === null || activity === void 0 ? void 0 : activity.infiniteResource) === null || _g === void 0 ? void 0 : _g.forEach((infinite) => {
                const resourceInfinite = resourcesFiniteSaved[infinite === null || infinite === void 0 ? void 0 : infinite[`${PREFIX}recursofinitoinfinitoid`]];
                if (!resourceInfinite) {
                    batch.post(RESOURCES, buildItem(Object.assign(Object.assign({}, infinite), { programId: activity === null || activity === void 0 ? void 0 : activity.programId, teamId: activity === null || activity === void 0 ? void 0 : activity.teamId, scheduleId: activity === null || activity === void 0 ? void 0 : activity.scheduleId, resourceFiniteInfiniteId: infinite === null || infinite === void 0 ? void 0 : infinite[`${PREFIX}recursofinitoinfinitoid`], activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id, startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate, endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate })));
                }
                else {
                    batch.patch(RESOURCES, resourceInfinite === null || resourceInfinite === void 0 ? void 0 : resourceInfinite[`${PREFIX}recursosid`], buildItem({
                        startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate,
                        endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate,
                    }));
                }
            });
            (_h = activity === null || activity === void 0 ? void 0 : activity.finiteResource) === null || _h === void 0 ? void 0 : _h.forEach((finite) => {
                const resourceFinite = resourcesFiniteSaved[finite === null || finite === void 0 ? void 0 : finite[`${PREFIX}recursofinitoinfinitoid`]];
                if (!resourceFinite) {
                    batch.post(RESOURCES, buildItem(Object.assign(Object.assign({}, finite), { programId: activity === null || activity === void 0 ? void 0 : activity.programId, teamId: activity === null || activity === void 0 ? void 0 : activity.teamId, scheduleId: activity === null || activity === void 0 ? void 0 : activity.scheduleId, resourceFiniteInfiniteId: finite === null || finite === void 0 ? void 0 : finite[`${PREFIX}recursofinitoinfinitoid`], activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id, startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate, endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate })));
                }
                else {
                    batch.patch(RESOURCES, resourceFinite === null || resourceFinite === void 0 ? void 0 : resourceFinite[`${PREFIX}recursosid`], buildItem({
                        startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate,
                        endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate,
                    }));
                }
            });
            (_j = activity === null || activity === void 0 ? void 0 : activity.infiniteResource) === null || _j === void 0 ? void 0 : _j.forEach((infinite) => {
                const resourceInfinite = resourcesFiniteSaved[infinite === null || infinite === void 0 ? void 0 : infinite[`${PREFIX}recursofinitoinfinitoid`]];
                if (!resourceInfinite) {
                    batch.post(RESOURCES, buildItem(Object.assign(Object.assign({}, infinite), { programId: activity === null || activity === void 0 ? void 0 : activity.programId, teamId: activity === null || activity === void 0 ? void 0 : activity.teamId, scheduleId: activity === null || activity === void 0 ? void 0 : activity.scheduleId, resourceFiniteInfiniteId: infinite === null || infinite === void 0 ? void 0 : infinite[`${PREFIX}recursofinitoinfinitoid`], activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id, startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate, endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate })));
                }
                else {
                    batch.patch(RESOURCES, resourceInfinite === null || resourceInfinite === void 0 ? void 0 : resourceInfinite[`${PREFIX}recursosid`], buildItem({
                        startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                            : activity.startDate,
                        endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                            : activity.endDate,
                    }));
                }
            });
            (_k = activity === null || activity === void 0 ? void 0 : activity.spacesToDelete) === null || _k === void 0 ? void 0 : _k.forEach((space) => {
                const resourceToDelete = resourcesSpaceSaved === null || resourcesSpaceSaved === void 0 ? void 0 : resourcesSpaceSaved[space === null || space === void 0 ? void 0 : space[`${PREFIX}espacoid`]];
                if (resourceToDelete) {
                    batch.patch(RESOURCES, resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}recursosid`], {
                        [`${PREFIX}excluido`]: true,
                    });
                }
            });
            (_l = activity === null || activity === void 0 ? void 0 : activity.finiteInfiniteResourceToDelete) === null || _l === void 0 ? void 0 : _l.forEach((space) => {
                const resourceToDelete = resourcesFiniteSaved === null || resourcesFiniteSaved === void 0 ? void 0 : resourcesFiniteSaved[space === null || space === void 0 ? void 0 : space[`${PREFIX}recursofinitoinfinitoid`]];
                if (resourceToDelete) {
                    batch.patch(RESOURCES, resourceToDelete === null || resourceToDelete === void 0 ? void 0 : resourceToDelete[`${PREFIX}recursosid`], {
                        [`${PREFIX}excluido`]: true,
                    });
                }
            });
            const resourcesPersonSaved = (_m = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}recursos_Atividade`]) === null || _m === void 0 ? void 0 : _m.filter((e) => e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]);
            const dictPersonResource = resourcesPersonSaved === null || resourcesPersonSaved === void 0 ? void 0 : resourcesPersonSaved.reduce((acc, curr) => {
                acc[curr === null || curr === void 0 ? void 0 : curr[`_${PREFIX}pessoa_value`]] = curr;
                return acc;
            }, {});
            (_o = activity === null || activity === void 0 ? void 0 : activity.people) === null || _o === void 0 ? void 0 : _o.forEach((person) => {
                var _a;
                const personId = (person === null || person === void 0 ? void 0 : person[`_${PREFIX}pessoa_value`]) ||
                    ((_a = person === null || person === void 0 ? void 0 : person.person) === null || _a === void 0 ? void 0 : _a[`${PREFIX}pessoaid`]);
                if (person === null || person === void 0 ? void 0 : person.deleted) {
                    const resourcePeopleToDelete = dictPersonResource === null || dictPersonResource === void 0 ? void 0 : dictPersonResource[personId];
                    if (resourcePeopleToDelete) {
                        batch.delete(RESOURCES, resourcePeopleToDelete === null || resourcePeopleToDelete === void 0 ? void 0 : resourcePeopleToDelete[`${PREFIX}recursosid`]);
                    }
                }
                else if (person === null || person === void 0 ? void 0 : person.person) {
                    const resourcePeople = dictPersonResource[personId];
                    if (!resourcePeople) {
                        batch.post(RESOURCES, buildItem(Object.assign(Object.assign({}, person), { [`_${PREFIX}pessoa_value`]: personId, programId: activity === null || activity === void 0 ? void 0 : activity.programId, teamId: activity === null || activity === void 0 ? void 0 : activity.teamId, scheduleId: activity === null || activity === void 0 ? void 0 : activity.scheduleId, activityId: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) || activity.id, startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                                ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                                : activity.startDate, endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                                ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                                : activity.endDate })));
                    }
                    else {
                        batch.patch(RESOURCES, resourcePeople === null || resourcePeople === void 0 ? void 0 : resourcePeople[`${PREFIX}recursosid`], buildItem({
                            startDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                                ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
                                : activity.startDate,
                            endDate: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                                ? moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`])
                                : activity.endDate,
                        }));
                    }
                }
            });
            resourcesPersonSaved === null || resourcesPersonSaved === void 0 ? void 0 : resourcesPersonSaved.forEach((personSaved) => {
                var _a;
                if (!((_a = activity === null || activity === void 0 ? void 0 : activity.people) === null || _a === void 0 ? void 0 : _a.find((person) => {
                    var _a;
                    const personId = (person === null || person === void 0 ? void 0 : person[`_${PREFIX}pessoa_value`]) ||
                        ((_a = person === null || person === void 0 ? void 0 : person.person) === null || _a === void 0 ? void 0 : _a[`${PREFIX}pessoaid`]);
                    return personId === (personSaved === null || personSaved === void 0 ? void 0 : personSaved[`_${PREFIX}pessoa_value`]);
                }))) {
                    batch.patch(RESOURCES, personSaved === null || personSaved === void 0 ? void 0 : personSaved[`${PREFIX}recursosid`], {
                        [`${PREFIX}excluido`]: true,
                    });
                }
            });
            yield batch.execute();
            resolve('Sucesso');
        }));
    });
    const deleteByActivity = (activity) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _p;
            const batch = new BatchMultidata(executePost);
            (_p = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}recursos_Atividade`]) === null || _p === void 0 ? void 0 : _p.forEach((res) => {
                batch.patch(RESOURCES, res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`], {
                    [`${PREFIX}excluido`]: true,
                });
            });
            yield batch.execute();
            resolve('Sucesso');
        }));
    });
    return [
        {
            resources: data === null || data === void 0 ? void 0 : data.value,
            count: data === null || data === void 0 ? void 0 : data['@odata.count'],
            nextLink: data === null || data === void 0 ? void 0 : data['@odata.nextLink'],
            postLoading,
            loading,
            error,
            fetchResources,
            addOrUpdateByActivities,
            addOrUpdateByActivity,
            deleteByActivity,
            getResources,
            refetch,
        },
    ];
};
export default useResource;
//# sourceMappingURL=useResource.js.map