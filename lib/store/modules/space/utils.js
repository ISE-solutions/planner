import { QueryBuilder } from 'odata-query-builder';
import { PERSON, PREFIX, TAG } from '~/config/database';
export const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.searchQuery) &&
            f.or((p) => {
                p.filterPhrase(`contains(${PREFIX}nome,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}nomeen,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}nomees,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}email,'${filtro.searchQuery}')`);
                return p;
            });
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
        // tslint:disable-next-line: no-unused-expression
        filtro.active &&
            filtro.active !== 'Todos' &&
            f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');
        f.filterExpression(`${PREFIX}excluido`, 'eq', Boolean(filtro.deleted));
        // tslint:disable-next-line: no-unused-expression
        filtro.type &&
            f.filterExpression(`${PREFIX}Etiqueta/${PREFIX}tipo`, 'eq', filtro.type);
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    else {
        query.orderBy(`${PREFIX}nome asc`);
    }
    if (filtro.top) {
        query.top(filtro.top);
    }
    query.expand(`${PREFIX}Espaco_Etiqueta_Etiqueta,${PREFIX}Espaco_PessoasEnvolvidas,${PREFIX}Espaco_NomeEspaco,${PREFIX}Espaco_CapacidadeEspaco,${PREFIX}Espaco_PessoasEnvolvidas,${PREFIX}Proprietario`);
    query.count();
    return query.toQuery();
};
export const buildItem = (space) => {
    var _a;
    return {
        [`${PREFIX}nome`]: space.name,
        [`${PREFIX}nomeen`]: space.nameEn,
        [`${PREFIX}nomees`]: space.nameEs,
        [`${PREFIX}email`]: space.email,
        [`${PREFIX}observacao`]: space.description,
        [`${PREFIX}Proprietario@odata.bind`]: space.owner && `/${PERSON}(${(_a = space === null || space === void 0 ? void 0 : space.owner) === null || _a === void 0 ? void 0 : _a.value})`,
    };
};
export const buildItemPeople = (item) => {
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
export const buildItemFantasyName = (item) => {
    var _a;
    return {
        id: item.id,
        deleted: item.deleted,
        [`${PREFIX}nome`]: item.name,
        [`${PREFIX}nomeen`]: item.nameEn,
        [`${PREFIX}nomees`]: item.nameEs,
        [`${PREFIX}Uso@odata.bind`]: (item === null || item === void 0 ? void 0 : item.use)
            ? `/${TAG}(${(_a = item === null || item === void 0 ? void 0 : item.use) === null || _a === void 0 ? void 0 : _a.value})`
            : null,
    };
};
export const buildItemCapacity = (item) => {
    var _a;
    return {
        id: item.id,
        deleted: item.deleted,
        [`${PREFIX}quantidade`]: item.quantity,
        [`${PREFIX}Uso@odata.bind`]: (item === null || item === void 0 ? void 0 : item.use)
            ? `/${TAG}(${(_a = item === null || item === void 0 ? void 0 : item.use) === null || _a === void 0 ? void 0 : _a.value})`
            : null,
    };
};
//# sourceMappingURL=utils.js.map