import { QueryBuilder } from 'odata-query-builder';
import { PERSON, PREFIX, } from '~/config/database';
export const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        f.filterExpression(`${PREFIX}Pessoa/${PREFIX}pessoaid`, 'eq', filtro === null || filtro === void 0 ? void 0 : filtro.pessoaId);
        f.filterExpression(`${PREFIX}lido`, 'eq', false);
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    else {
        query.orderBy(`createdon desc`);
    }
    query.expand(`${PREFIX}Pessoa`);
    query.count();
    return query.toQuery();
};
export const buildItem = (item) => {
    return {
        [`${PREFIX}titulo`]: item.title,
        [`${PREFIX}link`]: item.link,
        [`${PREFIX}descricao`]: item.description,
        [`${PREFIX}Pessoa@odata.bind`]: (item === null || item === void 0 ? void 0 : item.pessoaId)
            ? `/${PERSON}(${item === null || item === void 0 ? void 0 : item.pessoaId})`
            : null,
    };
};
export const truncateString = (string, maxLength) => {
    if (string.length <= maxLength) {
        return string;
    }
    else {
        return string.slice(0, maxLength - 3) + '...';
    }
};
//# sourceMappingURL=utils.js.map