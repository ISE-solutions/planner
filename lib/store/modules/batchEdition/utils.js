import { QueryBuilder } from 'odata-query-builder';
import { PREFIX } from '~/config/database';
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
    query.expand(`${PREFIX}Entrega,${PREFIX}Programa,${PREFIX}Turma,${PREFIX}Grupo,${PREFIX}Atividade,${PREFIX}tarefas_responsaveis_ise_pessoa`);
    query.count();
    return query.toQuery();
};
export const buildItem = (item) => {
    const res = {
        Tipo: item === null || item === void 0 ? void 0 : item.action,
        Assunto: item === null || item === void 0 ? void 0 : item.title,
        HorarioInicio: item === null || item === void 0 ? void 0 : item.start,
        HorarioFim: item === null || item === void 0 ? void 0 : item.end,
        Email: item === null || item === void 0 ? void 0 : item.email,
        IDRecurso: item === null || item === void 0 ? void 0 : item.resourceId,
        IDEvento: item === null || item === void 0 ? void 0 : item.eventId,
    };
    return res;
};
//# sourceMappingURL=utils.js.map