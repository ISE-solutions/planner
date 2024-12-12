import { QueryBuilder } from 'odata-query-builder';
import { PREFIX, PERSON, TAG } from '~/config/database';
import buildTextOdataFilter from '~/utils/buildTextOdataFilter';
export var TYPE_PROGRAM_FILTER;
(function (TYPE_PROGRAM_FILTER) {
    TYPE_PROGRAM_FILTER[TYPE_PROGRAM_FILTER["TODOS"] = 0] = "TODOS";
    TYPE_PROGRAM_FILTER[TYPE_PROGRAM_FILTER["PROGRAMA"] = 1] = "PROGRAMA";
    TYPE_PROGRAM_FILTER[TYPE_PROGRAM_FILTER["RESERVA"] = 2] = "RESERVA";
})(TYPE_PROGRAM_FILTER || (TYPE_PROGRAM_FILTER = {}));
export const buildQuery = (filtro) => {
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
        filtro.published &&
            filtro.published !== 'Todos' &&
            f.filterExpression(`${PREFIX}publicado`, 'eq', filtro.published === 'Sim');
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
        if (filtro.type === TYPE_PROGRAM_FILTER.RESERVA) {
            f.filterExpression(`${PREFIX}ehreserva`, 'eq', true);
        }
        if (!filtro.type || filtro.type === TYPE_PROGRAM_FILTER.PROGRAMA) {
            f.filterExpression(`${PREFIX}ehreserva`, 'eq', false);
        }
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
        f.filterExpression(`${PREFIX}excluido`, 'eq', Boolean(filtro.deleted));
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
export const buildAdvancedQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        f.filterExpression(`${PREFIX}ativo`, 'eq', true);
        f.filterExpression(`${PREFIX}modelo`, 'eq', false);
        f.filterExpression(`${PREFIX}ehreserva`, 'eq', false);
        f.filterExpression(`${PREFIX}excluido`, 'eq', false);
        const requestFilter = filtro === null || filtro === void 0 ? void 0 : filtro.filter((e) => { var _a; return !((_a = e === null || e === void 0 ? void 0 : e.field) === null || _a === void 0 ? void 0 : _a.isLocal); });
        requestFilter === null || requestFilter === void 0 ? void 0 : requestFilter.forEach((filter) => {
            const { field, value, criterion } = filter;
            if (!field) {
                return f;
            }
            if (field.value === 'nome') {
                buildTextOdataFilter.buildText(f, `${PREFIX}NomePrograma/${PREFIX}nome`, criterion.value, value);
            }
            if (field.value === 'sigla') {
                buildTextOdataFilter.buildText(f, `${PREFIX}sigla`, criterion.value, value);
            }
            if (field.value === 'temperatura') {
                f.filterPhrase(`${PREFIX}Temperatura/${PREFIX}etiquetaid eq '${value.value}'`);
            }
            if (field.value === 'pessoaenvolvida') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}Programa_PessoasEnvolvidas/any(c: c/${PREFIX}Pessoa/${PREFIX}pessoaid eq '${sp.value}')`));
                    return p;
                });
            }
            if (field.value === 'funcaoenvolvida') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}Programa_PessoasEnvolvidas/any(c: c/${PREFIX}Funcao/${PREFIX}etiquetaid eq '${sp.value}')`));
                    return p;
                });
            }
        });
        return f;
    });
    query.expand(`${PREFIX}TipoPrograma,${PREFIX}NomePrograma,${PREFIX}Instituto,${PREFIX}Empresa,${PREFIX}Temperatura,${PREFIX}ResponsavelpeloPrograma,${PREFIX}Programa_NomePrograma,${PREFIX}Programa_PessoasEnvolvidas,${PREFIX}Programa_Turma,${PREFIX}ise_turmasrelacionadas_Programa_ise_progr,${PREFIX}Programa_Compartilhamento`);
    query.count();
    return query.toQuery();
};
export const buildItem = (program) => {
    var _a, _b, _c, _d, _e, _f;
    const res = {
        [`${PREFIX}titulo`]: program === null || program === void 0 ? void 0 : program.title,
        [`${PREFIX}sigla`]: program === null || program === void 0 ? void 0 : program.sigla,
        [`${PREFIX}modelo`]: program === null || program === void 0 ? void 0 : program.model,
        [`${PREFIX}ehreserva`]: program === null || program === void 0 ? void 0 : program.isReserve,
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
export const buildItemPeople = (item, pos) => {
    var _a, _b, _c;
    return {
        id: item.id,
        deleted: item.deleted,
        [`${PREFIX}ordem`]: pos,
        [`${PREFIX}obrigatorio`]: item === null || item === void 0 ? void 0 : item.isRequired,
        [`${PREFIX}Pessoa@odata.bind`]: (item === null || item === void 0 ? void 0 : item.person) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`])
            ? `/${PERSON}(${((_a = item === null || item === void 0 ? void 0 : item.person) === null || _a === void 0 ? void 0 : _a.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`])})`
            : null,
        [`${PREFIX}Funcao@odata.bind`]: ((_b = item === null || item === void 0 ? void 0 : item.function) === null || _b === void 0 ? void 0 : _b.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}funcao_value`])
            ? `/${TAG}(${((_c = item === null || item === void 0 ? void 0 : item.function) === null || _c === void 0 ? void 0 : _c.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}funcao_value`])})`
            : null,
    };
};
//# sourceMappingURL=utils.js.map