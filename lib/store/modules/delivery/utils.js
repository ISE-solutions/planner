import { QueryBuilder } from 'odata-query-builder';
import { ACTIVITY, PREFIX, PROGRAM, TAG, TEAM } from '~/config/database';
export const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.searchQuery) &&
            f.or((p) => {
                p.filterPhrase(`contains(${PREFIX}nome,'${filtro.searchQuery}')`);
                return p;
            });
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.teamId) &&
            f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', filtro === null || filtro === void 0 ? void 0 : filtro.teamId);
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.programId) &&
            f.filterExpression(`${PREFIX}Programa/${PREFIX}programaid`, 'eq', filtro === null || filtro === void 0 ? void 0 : filtro.programId);
        if ((filtro === null || filtro === void 0 ? void 0 : filtro.status) && filtro.status.length) {
            f.or((p) => {
                filtro.status.forEach((st) => {
                    p.filterExpression(`statuscode`, 'eq', st);
                });
                return p;
            });
        }
        // tslint:disable-next-line: no-unused-expression
        filtro.sequence &&
            f.filterExpression(`${PREFIX}sequencia`, 'eq', filtro.sequence);
        f.filterExpression(`${PREFIX}excluido`, 'eq', false);
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    else {
        query.orderBy(`createdon desc`);
    }
    if (filtro.top) {
        query.top(filtro.top);
    }
    query.expand(`${PREFIX}Programa,${PREFIX}Turma,${PREFIX}Grupo,${PREFIX}Atividade,${PREFIX}tarefas_responsaveis_ise_pessoa`);
    query.count();
    return query.toQuery();
};
export const buildItem = (item) => {
    var _a;
    const res = {
        [`${PREFIX}nome`]: item.title,
        [`${PREFIX}tipo`]: item.type,
        [`${PREFIX}Grupo@odata.bind`]: item.group
            ? `/${TAG}(${(_a = item === null || item === void 0 ? void 0 : item.group) === null || _a === void 0 ? void 0 : _a.value})`
            : null,
        statuscode: item.status,
        [`${PREFIX}prioridade`]: item.priority,
        [`${PREFIX}previsaodeconclusao`]: item.completionForecast,
        [`${PREFIX}dataconclusao`]: item.concludedDay,
        [`${PREFIX}datadeinicio`]: item.startDay,
        [`${PREFIX}link`]: item.link,
        [`${PREFIX}tipo`]: item.type,
        [`${PREFIX}observacao`]: item.observation,
    };
    if (item === null || item === void 0 ? void 0 : item.sequence) {
        res[`${PREFIX}sequencia`] = item.sequence;
    }
    if (item === null || item === void 0 ? void 0 : item.teamId) {
        res[`${PREFIX}Turma@odata.bind`] = `/${TEAM}(${item === null || item === void 0 ? void 0 : item.teamId})`;
    }
    if (item === null || item === void 0 ? void 0 : item.programId) {
        res[`${PREFIX}Programa@odata.bind`] = `/${PROGRAM}(${item === null || item === void 0 ? void 0 : item.programId})`;
    }
    if (item === null || item === void 0 ? void 0 : item.activityId) {
        res[`${PREFIX}Atividade@odata.bind`] = `/${ACTIVITY}(${item === null || item === void 0 ? void 0 : item.activityId})`;
    }
    return res;
};
//# sourceMappingURL=utils.js.map