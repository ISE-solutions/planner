import { QueryBuilder } from 'odata-query-builder';
import { PERSON, PREFIX } from '~/config/database';
export const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        if (filtro.startDeleted && !filtro.endDeleted) {
            f.filterPhrase(`modifiedon gt '${filtro.startDeleted
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')}'`);
        }
        if (!filtro.startDeleted && filtro.endDeleted) {
            f.filterPhrase(`modifiedon lt '${filtro.endDeleted
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')}'`);
        }
        if (filtro.startDeleted && filtro.endDeleted) {
            f.filterPhrase(`modifiedon gt '${filtro.startDeleted
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')}' and modifiedon lt '${filtro.endDeleted
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')}'`);
        }
        if ((filtro === null || filtro === void 0 ? void 0 : filtro.published) && (filtro === null || filtro === void 0 ? void 0 : filtro.me)) {
            f.or((p) => {
                p.filterExpression(`${PREFIX}publicado`, 'eq', true);
                p.filterExpression(`_${PREFIX}criadopor_value`, 'eq', filtro.me);
                return p;
            });
        }
        // tslint:disable-next-line: no-unused-expression
        filtro.active &&
            filtro.active !== 'Todos' &&
            f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');
        f.filterExpression(`${PREFIX}excluido`, 'eq', Boolean(filtro.deleted));
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    else {
        query.orderBy(`${PREFIX}nome asc`);
    }
    query.count();
    return query.toQuery();
};
export const buildItem = (item) => {
    const res = {
        [`${PREFIX}nome`]: item.name,
        [`${PREFIX}tipo`]: item.type,
        [`${PREFIX}valor`]: JSON.stringify(item.value),
    };
    if (!(item === null || item === void 0 ? void 0 : item.id)) {
        res[`${PREFIX}CriadoPor@odata.bind`] =
            (item === null || item === void 0 ? void 0 : item.user) && `/${PERSON}(${item === null || item === void 0 ? void 0 : item.user})`;
    }
    return res;
};
//# sourceMappingURL=utils.js.map