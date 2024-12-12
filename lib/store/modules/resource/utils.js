import * as moment from 'moment';
import { QueryBuilder } from 'odata-query-builder';
import { ACTIVITY, FINITE_INFINITE_RESOURCES, PERSON, PREFIX, PROGRAM, SCHEDULE_DAY, SPACE, TEAM, } from '~/config/database';
export const buildQuery = (filtro = { filterDeleted: true }) => {
    var query = new QueryBuilder().filter((f) => {
        var _a, _b;
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        if (filtro.programId) {
            f.filterExpression(`${PREFIX}Programa/${PREFIX}programaid`, 'eq', filtro.programId);
        }
        if (filtro.teamId) {
            f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', filtro.teamId);
        }
        if (filtro.scheduleId) {
            f.filterExpression(`${PREFIX}CronogramaDia/${PREFIX}cronogramadediaid`, 'eq', filtro.scheduleId);
        }
        if (filtro.activityId) {
            f.filterExpression(`${PREFIX}Atividade/${PREFIX}atividadeid`, 'eq', filtro.activityId);
        }
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
                if (filtro.startDate && filtro.endDate) {
                    f.filterPhrase(`${PREFIX}inicio gt '${filtro.startDate
                        .startOf('month')
                        .format('YYYY-MM-DD')}' and ${PREFIX}inicio lt '${filtro.endDate
                        .endOf('month')
                        .format('YYYY-MM-DD')}'`);
                }
                if (filtro.dayDate) {
                    f.filterPhrase(`${PREFIX}inicio gt '${filtro.dayDate.format('YYYY-MM-DD')}' and ${PREFIX}fim lt '${filtro.dayDate
                        .add(1, 'day')
                        .format('YYYY-MM-DD')}'`);
                }
                if (filtro.filterDeleted) {
                    f.filterExpression(`${PREFIX}excluido`, 'eq', Boolean(filtro.deleted));
                }
                return p;
            });
        }
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    query.expand(`${PREFIX}Programa,${PREFIX}Turma,${PREFIX}Espaco,${PREFIX}Pessoa,${PREFIX}Atividade,${PREFIX}Recurso_RecursoFinitoeInfinito,${PREFIX}CronogramaDia`);
    query.count();
    return query.toQuery();
};
export const buildItem = (item) => {
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
        [`${PREFIX}criarevento`]: item.createInvite,
        [`${PREFIX}notificado`]: false,
    };
};
//# sourceMappingURL=utils.js.map