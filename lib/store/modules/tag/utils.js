import { QueryBuilder } from 'odata-query-builder';
import { PREFIX, TAG } from '~/config/database';
export const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.searchQuery) &&
            f.or((p) => {
                p.filterPhrase(`contains(${PREFIX}nome,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}nomeen,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}nomees,'${filtro.searchQuery}')`);
                // p.filterPhrase(`contains(${PREFIX}Etiqueta/${PREFIX}nome,'${filtro.searchQuery}')`);
                p.filterPhrase(`${PREFIX}Etiqueta_NomeEtiqueta/any(c: c/${PREFIX}nome eq '${filtro.searchQuery}')`);
                p.filterPhrase(`${PREFIX}Etiqueta_NomeEtiqueta/any(c: c/${PREFIX}nomeen eq '${filtro.searchQuery}')`);
                p.filterPhrase(`${PREFIX}Etiqueta_NomeEtiqueta/any(c: c/${PREFIX}nomees eq '${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}descricao,'${filtro.searchQuery}')`);
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
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    else {
        query.orderBy(`${PREFIX}nome asc`);
    }
    // query.select(
    //   `${PREFIX}id,${PREFIX}descricao,${PREFIX}ordem,${PREFIX}ativo,${PREFIX}tipo`
    // );
    query.expand(`${PREFIX}Etiqueta_Pai,${PREFIX}Etiqueta_NomeEtiqueta`);
    query.count();
    return query.toQuery();
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
//# sourceMappingURL=utils.js.map