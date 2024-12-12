import * as moment from 'moment';
import { QueryBuilder } from 'odata-query-builder';
import { PERSON, PREFIX, PROGRAM, SPACE, TAG, TEAM } from '~/config/database';
import buildTextOdataFilter from '~/utils/buildTextOdataFilter';
export const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.searchQuery) &&
            f.or((p) => {
                p.filterPhrase(`contains(${PREFIX}nome,'${filtro.searchQuery}')`);
                return p;
            });
        if (filtro.date) {
            f.filterPhrase(`${PREFIX}data ge '${filtro.date}T00:00:00' and ${PREFIX}data le '${filtro.date} 23:59:59'`);
        }
        // tslint:disable-next-line: no-unused-expression
        filtro.active &&
            filtro.active !== 'Todos' &&
            f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');
        // tslint:disable-next-line: no-unused-expression
        f.filterExpression(`${PREFIX}modelo`, 'eq', !!filtro.model);
        // tslint:disable-next-line: no-unused-expression
        filtro.groupPermition &&
            f.filterExpression(`${PREFIX}grupopermissao`, 'eq', filtro.groupPermition);
        // tslint:disable-next-line: no-unused-expression
        filtro.group &&
            filtro.group !== 'Todos' &&
            f.filterExpression(`${PREFIX}agrupamentoatividade`, 'eq', filtro.group === 'Sim');
        // tslint:disable-next-line: no-unused-expression
        filtro.published &&
            filtro.published !== 'Todos' &&
            f.filterExpression(`${PREFIX}publicado`, 'eq', filtro.published === 'Sim');
        // tslint:disable-next-line: no-unused-expression
        filtro.modality &&
            f.filterExpression(`${PREFIX}Modalidade/${PREFIX}etiquetaid`, 'eq', filtro.modality);
        // tslint:disable-next-line: no-unused-expression
        filtro.module &&
            f.filterExpression(`${PREFIX}Modulo/${PREFIX}etiquetaid`, 'eq', filtro.module);
        // tslint:disable-next-line: no-unused-expression
        filtro.createdBy &&
            f.filterExpression(`${PREFIX}CriadoPor/${PREFIX}pessoaid`, 'eq', filtro.createdBy);
        if (filtro.typeActivity) {
            f.filterExpression(`${PREFIX}tipo`, 'eq', filtro.typeActivity);
        }
        // tslint:disable-next-line: no-unused-expression
        ((filtro === null || filtro === void 0 ? void 0 : filtro.teamId) || (filtro === null || filtro === void 0 ? void 0 : filtro.filterTeam)) &&
            f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', (filtro === null || filtro === void 0 ? void 0 : filtro.teamId) || null);
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
        if (filtro.teamDeleted !== undefined) {
            f.or((p) => {
                p.filterExpression(`${PREFIX}Turma/${PREFIX}excluido`, 'eq', filtro === null || filtro === void 0 ? void 0 : filtro.teamDeleted);
                p.filterExpression(`${PREFIX}Turma`, 'eq', null);
                return p;
            });
        }
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    else {
        query.orderBy(`createdon desc`);
    }
    query.expand(`${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Temperatura,${PREFIX}Local,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento`);
    query.count();
    return query.toQuery();
};
export const buildAdvancedQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        f.filterExpression(`${PREFIX}modelo`, 'eq', false);
        f.filterExpression(`${PREFIX}excluido`, 'eq', false);
        f.filterExpression(`${PREFIX}ativo`, 'eq', true);
        const requestFilter = filtro === null || filtro === void 0 ? void 0 : filtro.filter((e) => { var _a; return !((_a = e === null || e === void 0 ? void 0 : e.field) === null || _a === void 0 ? void 0 : _a.isLocal); });
        requestFilter === null || requestFilter === void 0 ? void 0 : requestFilter.forEach((filter) => {
            const { field, value, criterion } = filter;
            if (!field) {
                return f;
            }
            if (field.value === 'data') {
                f.filterExpression(`${PREFIX}data`, criterion.value, value.format('YYYY-MM-DD'));
            }
            if (field.value === 'modulo') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}Modulo/${PREFIX}etiquetaid eq '${sp.value}'`));
                    return p;
                });
            }
            if (field.value === 'modalidade') {
                f.filterPhrase(`${PREFIX}Modalidade/${PREFIX}etiquetaid eq '${value.value}'`);
            }
            if (field.value === 'ferramenta') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}Ferramenta/${PREFIX}etiquetaid eq '${sp.value}'`));
                    return p;
                });
            }
            if (field.value === 'temperatura') {
                f.filterPhrase(`${PREFIX}Temperatura/${PREFIX}etiquetaid eq '${value.value}'`);
            }
            if (field.value === 'pessoaenvolvida') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}CronogramadeDia_PessoasEnvolvidas/any(c: c/${PREFIX}Pessoa/${PREFIX}pessoaid eq '${sp.value}')`));
                    return p;
                });
            }
            if (field.value === 'funcaoenvolvida') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}CronogramadeDia_PessoasEnvolvidas/any(c: c/${PREFIX}Funcao/${PREFIX}etiquetaid eq '${sp.value}')`));
                    return p;
                });
            }
            if (field.value === 'turma-nome') {
                buildTextOdataFilter.buildText(f, `${PREFIX}Turma/${PREFIX}nome`, criterion.value, value);
            }
            if (field.value === 'turma-sigla') {
                buildTextOdataFilter.buildText(f, `${PREFIX}Turma/${PREFIX}sigla`, criterion.value, value);
            }
            if (field.value === 'turma-codigoturma') {
                buildTextOdataFilter.buildText(f, `${PREFIX}Turma/${PREFIX}codigodaturma`, criterion.value, value);
            }
            if (field.value === 'turma-anodeconclusao') {
                f.filterExpression(`${PREFIX}Turma/${PREFIX}anodeconclusao`, criterion.value, parseInt(value));
            }
            if (field.value === 'turma-modalidade') {
                f.filterPhrase(`${PREFIX}Turma/${PREFIX}Modalidade/${PREFIX}etiquetaid eq '${value.value}'`);
            }
            if (field.value === 'programa-nome') {
                buildTextOdataFilter.buildText(f, `${PREFIX}Programa/${PREFIX}NomePrograma/${PREFIX}nome`, criterion.value, value);
            }
            if (field.value === 'programa-sigla') {
                buildTextOdataFilter.buildText(f, `${PREFIX}Programa/${PREFIX}sigla`, criterion.value, value);
            }
            if (field.value === 'programa-temperatura') {
                f.filterPhrase(`${PREFIX}Programa/${PREFIX}Temperatura/${PREFIX}etiquetaid eq '${value.value}'`);
            }
        });
        return f;
    });
    query.expand(`${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Temperatura,${PREFIX}Local,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento,${PREFIX}Programa`);
    query.count();
    return query.toQuery();
};
export const buildItem = (schedule) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const res = {
        [`${PREFIX}nome`]: schedule.name,
        [`${PREFIX}modelo`]: schedule.model,
        [`${PREFIX}anexossincronizados`]: schedule.anexossincronizados,
        [`${PREFIX}modeloid`]: schedule.modeloid,
        [`${PREFIX}baseadoemcronogramadiamodelo`]: schedule.baseadoemcronogramadiamodelo,
        [`${PREFIX}agrupamentoatividade`]: schedule.isGroupActive,
        [`${PREFIX}duracao`]: schedule.duration
            ? (_a = schedule.duration) === null || _a === void 0 ? void 0 : _a.format('HH:mm')
            : null,
        [`${PREFIX}inicio`]: schedule.startTime
            ? (_b = schedule.startTime) === null || _b === void 0 ? void 0 : _b.format('HH:mm')
            : null,
        [`${PREFIX}fim`]: schedule.endTime
            ? (_c = schedule.endTime) === null || _c === void 0 ? void 0 : _c.format('HH:mm')
            : null,
        [`${PREFIX}observacao`]: schedule.observation || (schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}observacao`]),
        [`${PREFIX}data`]: schedule.date && moment(schedule.date).format('YYYY-MM-DD'),
        [`${PREFIX}Modulo@odata.bind`]: ((_d = schedule === null || schedule === void 0 ? void 0 : schedule.module) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`])
            ? `/${TAG}(${(_e = schedule === null || schedule === void 0 ? void 0 : schedule.module) === null || _e === void 0 ? void 0 : _e[`${PREFIX}etiquetaid`]})`
            : null,
        [`${PREFIX}Modalidade@odata.bind`]: ((_f = schedule === null || schedule === void 0 ? void 0 : schedule.modality) === null || _f === void 0 ? void 0 : _f[`${PREFIX}etiquetaid`])
            ? `/${TAG}(${(_g = schedule === null || schedule === void 0 ? void 0 : schedule.modality) === null || _g === void 0 ? void 0 : _g[`${PREFIX}etiquetaid`]})`
            : null,
        [`${PREFIX}Ferramenta@odata.bind`]: ((_h = schedule === null || schedule === void 0 ? void 0 : schedule.tool) === null || _h === void 0 ? void 0 : _h[`${PREFIX}etiquetaid`])
            ? `/${TAG}(${(_j = schedule === null || schedule === void 0 ? void 0 : schedule.tool) === null || _j === void 0 ? void 0 : _j[`${PREFIX}etiquetaid`]})`
            : null,
        [`${PREFIX}FerramentaBackup@odata.bind`]: ((_k = schedule === null || schedule === void 0 ? void 0 : schedule.toolBackup) === null || _k === void 0 ? void 0 : _k[`${PREFIX}etiquetaid`])
            ? `/${TAG}(${(_l = schedule === null || schedule === void 0 ? void 0 : schedule.toolBackup) === null || _l === void 0 ? void 0 : _l[`${PREFIX}etiquetaid`]})`
            : null,
        [`${PREFIX}Local@odata.bind`]: ((_m = schedule === null || schedule === void 0 ? void 0 : schedule.place) === null || _m === void 0 ? void 0 : _m[`${PREFIX}etiquetaid`])
            ? `/${TAG}(${(_o = schedule === null || schedule === void 0 ? void 0 : schedule.place) === null || _o === void 0 ? void 0 : _o[`${PREFIX}etiquetaid`]})`
            : null,
        [`${PREFIX}Turma@odata.bind`]: (schedule === null || schedule === void 0 ? void 0 : schedule.teamId) && `/${TEAM}(${schedule === null || schedule === void 0 ? void 0 : schedule.teamId})`,
        [`${PREFIX}Programa@odata.bind`]: (schedule === null || schedule === void 0 ? void 0 : schedule.programId) && `/${PROGRAM}(${schedule === null || schedule === void 0 ? void 0 : schedule.programId})`,
        [`${PREFIX}Temperatura@odata.bind`]: (schedule === null || schedule === void 0 ? void 0 : schedule.temperature) && `/${TAG}(${(_p = schedule === null || schedule === void 0 ? void 0 : schedule.temperature) === null || _p === void 0 ? void 0 : _p.value})`,
        [`${PREFIX}link`]: schedule.link,
        [`${PREFIX}linkbackup`]: schedule.linkBackup,
    };
    if (!(schedule === null || schedule === void 0 ? void 0 : schedule.id)) {
        res[`${PREFIX}CriadoPor@odata.bind`] =
            (schedule === null || schedule === void 0 ? void 0 : schedule.user) && `/${PERSON}(${schedule === null || schedule === void 0 ? void 0 : schedule.user})`;
        res[`${PREFIX}grupopermissao`] = schedule === null || schedule === void 0 ? void 0 : schedule.group;
    }
    return res;
};
export const buildItemLocale = (item) => {
    var _a;
    return {
        id: item.id,
        deleted: item.deleted,
        [`${PREFIX}Espaco@odata.bind`]: (item === null || item === void 0 ? void 0 : item.space) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}espaco_value`])
            ? `/${SPACE}(${((_a = item === null || item === void 0 ? void 0 : item.space) === null || _a === void 0 ? void 0 : _a.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}espaco_value`])})`
            : null,
        [`${PREFIX}observacao`]: item === null || item === void 0 ? void 0 : item.observation,
    };
};
export const buildItemPeopleAcademicRequest = (item) => {
    var _a, _b;
    return {
        id: item.id,
        deleted: item.deleted,
        [`${PREFIX}Pessoa@odata.bind`]: (item === null || item === void 0 ? void 0 : item.person) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`])
            ? `/${PERSON}(${((_a = item === null || item === void 0 ? void 0 : item.person) === null || _a === void 0 ? void 0 : _a.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`])})`
            : null,
        [`${PREFIX}Funcao@odata.bind`]: (item === null || item === void 0 ? void 0 : item.function) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}funcao_value`])
            ? `/${TAG}(${((_b = item === null || item === void 0 ? void 0 : item.function) === null || _b === void 0 ? void 0 : _b.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}funcao_value`])})`
            : null,
        [`${PREFIX}Atividade@odata.bind`]: '$' + item.activityId,
    };
};
//# sourceMappingURL=utils.js.map