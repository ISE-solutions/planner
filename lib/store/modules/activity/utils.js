import { QueryBuilder } from 'odata-query-builder';
import { PREFIX, PERSON, TAG, TEAM, PROGRAM, ACTIVITY, SCHEDULE_DAY, } from '~/config/database';
import { EActivityTypeApplication, } from '~/config/enums';
import buildTextOdataFilter from '~/utils/buildTextOdataFilter';
export const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        var _a, _b;
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.searchQuery) &&
            f.or((p) => {
                p.filterPhrase(`contains(${PREFIX}nome,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}duracao,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}temaaula,'${filtro.searchQuery}')`);
                return p;
            });
        // tslint:disable-next-line: no-unused-expression
        filtro.active &&
            filtro.active !== 'Todos' &&
            f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');
        if (filtro.typeActivity) {
            f.filterExpression(`${PREFIX}tipo`, 'eq', filtro.typeActivity);
        }
        if (filtro.typeApplication) {
            f.filterExpression(`${PREFIX}tipoaplicacao`, 'eq', filtro.typeApplication);
        }
        if (filtro.name) {
            f.filterPhrase(`contains(${PREFIX}nome,'${filtro.name}')`);
        }
        if (filtro.academicArea) {
            f.filterExpression(`${PREFIX}AreaAcademica/${PREFIX}etiquetaid`, 'eq', filtro === null || filtro === void 0 ? void 0 : filtro.academicArea);
        }
        if (filtro.startDate && !filtro.endDate) {
            f.filterPhrase(`${PREFIX}datahorainicio gt '${filtro.startDate
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')}'`);
        }
        if (!filtro.startDate && filtro.endDate) {
            f.filterPhrase(`${PREFIX}datahorainicio lt '${filtro.endDate
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')}'`);
        }
        if (filtro.startDate && filtro.endDate) {
            f.filterPhrase(`${PREFIX}datahorainicio gt '${filtro.startDate
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')}' and ${PREFIX}datahorainicio lt '${filtro.endDate
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')}'`);
        }
        if ((_a = filtro === null || filtro === void 0 ? void 0 : filtro.typesApplication) === null || _a === void 0 ? void 0 : _a.length) {
            f.or((p) => {
                filtro.typesApplication.forEach((elm) => {
                    p.filterPhrase(`${PREFIX}tipoaplicacao eq '${elm}'`);
                });
                return p;
            });
        }
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.teamId) &&
            f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', filtro === null || filtro === void 0 ? void 0 : filtro.teamId);
        // tslint:disable-next-line: no-unused-expression
        filtro.group &&
            f.filterExpression(`${PREFIX}grupopermissao`, 'eq', filtro.group);
        // tslint:disable-next-line: no-unused-expression
        filtro.published &&
            filtro.published !== 'Todos' &&
            f.filterExpression(`${PREFIX}publicado`, 'eq', filtro.published === 'Sim');
        // tslint:disable-next-line: no-unused-expression
        filtro.createdBy &&
            f.filterExpression(`${PREFIX}CriadoPor/${PREFIX}pessoaid`, 'eq', filtro.createdBy);
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.programId) &&
            f.filterExpression(`${PREFIX}Programa/${PREFIX}programaid`, 'eq', filtro === null || filtro === void 0 ? void 0 : filtro.programId);
        if ((_b = filtro === null || filtro === void 0 ? void 0 : filtro.schedulesId) === null || _b === void 0 ? void 0 : _b.length) {
            f.or((p) => {
                filtro === null || filtro === void 0 ? void 0 : filtro.schedulesId.forEach((elm) => {
                    ('');
                    p.filterExpression(`${PREFIX}CronogramaDia/${PREFIX}cronogramadediaid`, 'eq', elm);
                });
                return p;
            });
        }
        if (filtro.startDeleted && !filtro.endDeleted) {
            f.filterPhrase(`modifiedon gt '${filtro.startDeleted
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')}'`);
        }
        if (!filtro.startDeleted && filtro.endDeleted) {
            f.filterPhrase(`modifiedon lt '${filtro.endDeleted
                .add(1, 'day')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')}'`);
        }
        if (filtro.startDeleted && filtro.endDeleted) {
            f.filterPhrase(`modifiedon gt '${filtro.startDeleted
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')}' and modifiedon lt '${filtro.endDeleted
                .add(1, 'day')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')}'`);
        }
        f.filterExpression(`${PREFIX}excluido`, 'eq', Boolean(filtro.deleted));
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    query.expand(`${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por,${PREFIX}CriadoPor,${PREFIX}Turma`);
    query.count();
    return query.toQuery();
};
export const buildAdvancedQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        f.filterExpression(`${PREFIX}excluido`, 'eq', false);
        f.filterExpression(`${PREFIX}ativo`, 'eq', true);
        f.filterExpression(`${PREFIX}tipoaplicacao`, 'eq', EActivityTypeApplication.APLICACAO);
        const requestFilter = filtro === null || filtro === void 0 ? void 0 : filtro.filter((e) => { var _a; return !((_a = e === null || e === void 0 ? void 0 : e.field) === null || _a === void 0 ? void 0 : _a.isLocal); });
        requestFilter === null || requestFilter === void 0 ? void 0 : requestFilter.forEach((filter) => {
            const { field, value, criterion } = filter;
            if (!field) {
                return f;
            }
            if (field.value === 'nome') {
                buildTextOdataFilter.buildText(f, `${PREFIX}nome`, criterion.value, value);
            }
            if (field.value === 'temaaula') {
                buildTextOdataFilter.buildText(f, `${PREFIX}temaaula`, criterion.value, value);
            }
            if (field.value === 'tipo') {
                f.filterExpression(`${PREFIX}tipo`, criterion.value, value.value);
            }
            if (field.value === 'space') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}Atividade_Espaco/any(c: c/${PREFIX}espacoid eq '${sp.value}')`));
                    return p;
                });
            }
            if (field.value === 'area') {
                f.or((p) => {
                    value.forEach((ar) => p.filterExpression(`${PREFIX}AreaAcademica/${PREFIX}etiquetaid`, 'eq', ar.value));
                    return p;
                });
            }
            if (field.value === 'temperatura') {
                f.filterExpression(`${PREFIX}Temperatura/${PREFIX}etiquetaid`, 'eq', value.value);
            }
            if (field.value === 'quantidadesessao') {
                f.filterPhrase(`${PREFIX}quantidadesessao ${criterion.value} ${value}`);
            }
            if (field.value === 'pessoaenvolvida') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}Atividade_PessoasEnvolvidas/any(c: c/${PREFIX}Pessoa/${PREFIX}pessoaid eq '${sp.value}')`));
                    return p;
                });
            }
            if (field.value === 'funcaoenvolvida') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}Atividade_PessoasEnvolvidas/any(c: c/${PREFIX}Funcao/${PREFIX}etiquetaid eq '${sp.value}')`));
                    return p;
                });
            }
            if (field.value === 'documento') {
                buildTextOdataFilter.buildChildText(f, `${PREFIX}Atividade_Documento`, `${PREFIX}nome`, criterion.value, value);
            }
            if (field.value === 'requisicaoacademica') {
                buildTextOdataFilter.buildChildText(f, `${PREFIX}RequisicaoAcademica_Atividade`, `${PREFIX}descricao`, criterion.value, value);
            }
            if (field.value === 'inicio') {
                f.filterPhrase(`${PREFIX}datahorainicio ${criterion.value} '${value.format('YYYY-MM-DD HH:mm:ss')}'`);
            }
            if (field.value === 'fim') {
                f.filterPhrase(`${PREFIX}datahorafim ${criterion.value} '${value.format('YYYY-MM-DD HH:mm:ss')}'`);
            }
            if (field.value === 'dia-data') {
                f.filterPhrase(`${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}data ${criterion.value} '${value.startOf('day').format('YYYY-MM-DD HH:mm:ss')}')`);
            }
            if (field.value === 'dia-modulo') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}Modulo/${PREFIX}etiquetaid eq '${sp.value}')`));
                    return p;
                });
            }
            if (field.value === 'dia-modalidade') {
                f.filterPhrase(`${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}Modalidade/${PREFIX}etiquetaid eq '${value.value}')`);
            }
            if (field.value === 'dia-ferramenta') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}Ferramenta/${PREFIX}etiquetaid eq '${sp.value}')`));
                    return p;
                });
            }
            if (field.value === 'dia-temperatura') {
                f.filterPhrase(`${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}Temperatura/${PREFIX}etiquetaid eq '${value.value}')`);
            }
            if (field.value === 'dia-pessoaenvolvida') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}CronogramadeDia_PessoasEnvolvidas/any(v: v/${PREFIX}Pessoa/${PREFIX}pessoaid eq '${sp.value}'))`));
                    return p;
                });
            }
            if (field.value === 'dia-funcaoenvolvida') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}CronogramadeDia_PessoasEnvolvidas/any(v: v/${PREFIX}Funcao/${PREFIX}etiquetaid eq '${sp.value}'))`));
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
                f.filterPhrase(`${PREFIX}Turma/${PREFIX}anodeconclusao ${criterion.value} ${value}`);
            }
            if (field.value === 'turma-modalidade') {
                f.filterPhrase(`${PREFIX}Turma/_${PREFIX}modalidade_value eq '${value.value}'`);
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
    query.expand(`${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por,${PREFIX}CriadoPor,${PREFIX}Programa,${PREFIX}Turma`);
    query.count();
    return query.toQuery();
};
export const buildItem = (activity) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const res = {
        [`${PREFIX}titulo`]: activity.title,
        [`${PREFIX}nome`]: activity.name,
        [`${PREFIX}atualizado`]: activity.changed,
        [`${PREFIX}ativo`]: activity[`${PREFIX}ativo`],
        [`${PREFIX}tipo`]: activity.type || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]),
        [`${PREFIX}temaaula`]: activity.theme,
        [`${PREFIX}observacao`]: activity.observation,
        [`${PREFIX}descricaoobjetivo`]: activity.description,
        [`${PREFIX}quantidadesessao`]: +((_a = String(activity.quantity)) === null || _a === void 0 ? void 0 : _a.replace(/\D/g, '')) || 0,
        [`${PREFIX}duracao`]: ((_b = activity.duration) === null || _b === void 0 ? void 0 : _b.format('HH:mm')) || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}duracao`]),
        [`${PREFIX}inicio`]: ((_c = activity.startTime) === null || _c === void 0 ? void 0 : _c.format('HH:mm')) || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}inicio`]),
        [`${PREFIX}fim`]: ((_d = activity.endTime) === null || _d === void 0 ? void 0 : _d.format('HH:mm')) || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}fim`]),
        [`${PREFIX}tipoaplicacao`]: activity.typeApplication,
        [`${PREFIX}datahorainicio`]: activity.startDate,
        [`${PREFIX}datahorafim`]: activity.endDate,
        [`${PREFIX}AreaAcademica@odata.bind`]: (activity === null || activity === void 0 ? void 0 : activity.area) && `/${TAG}(${(_e = activity === null || activity === void 0 ? void 0 : activity.area) === null || _e === void 0 ? void 0 : _e[`${PREFIX}etiquetaid`]})`,
        [`${PREFIX}Curso@odata.bind`]: (activity === null || activity === void 0 ? void 0 : activity.course) &&
            `/${TAG}(${(_f = activity === null || activity === void 0 ? void 0 : activity.course) === null || _f === void 0 ? void 0 : _f[`${PREFIX}etiquetaid`]})`,
        [`${PREFIX}Temperatura@odata.bind`]: (activity === null || activity === void 0 ? void 0 : activity.temperature) && `/${TAG}(${(_g = activity === null || activity === void 0 ? void 0 : activity.temperature) === null || _g === void 0 ? void 0 : _g.value})`
    };
    if (activity === null || activity === void 0 ? void 0 : activity.teamId) {
        res[`${PREFIX}Turma@odata.bind`] = `/${TEAM}(${activity === null || activity === void 0 ? void 0 : activity.teamId})`;
    }
    if (activity === null || activity === void 0 ? void 0 : activity.programId) {
        res[`${PREFIX}Programa@odata.bind`] = `/${PROGRAM}(${activity === null || activity === void 0 ? void 0 : activity.programId})`;
    }
    if (activity === null || activity === void 0 ? void 0 : activity.scheduleId) {
        res[`${PREFIX}CronogramaDia@odata.bind`] = `/${SCHEDULE_DAY}(${activity === null || activity === void 0 ? void 0 : activity.scheduleId})`;
    }
    if (!(activity === null || activity === void 0 ? void 0 : activity.id)) {
        res[`${PREFIX}CriadoPor@odata.bind`] =
            (activity === null || activity === void 0 ? void 0 : activity.user) && `/${PERSON}(${activity === null || activity === void 0 ? void 0 : activity.user})`;
        res[`${PREFIX}grupopermissao`] = activity === null || activity === void 0 ? void 0 : activity.group;
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
export const buildItemPeople = (item) => {
    var _a, _b, _c, _d;
    return {
        id: item.id,
        deleted: item.deleted,
        [`${PREFIX}Pessoa@odata.bind`]: ((_a = item === null || item === void 0 ? void 0 : item.person) === null || _a === void 0 ? void 0 : _a.value)
            ? `/${PERSON}(${(_b = item === null || item === void 0 ? void 0 : item.person) === null || _b === void 0 ? void 0 : _b.value})`
            : null,
        [`${PREFIX}Funcao@odata.bind`]: ((_c = item === null || item === void 0 ? void 0 : item.function) === null || _c === void 0 ? void 0 : _c.value)
            ? `/${TAG}(${(_d = item === null || item === void 0 ? void 0 : item.function) === null || _d === void 0 ? void 0 : _d.value})`
            : null,
    };
};
export const buildItemPeopleAcademicRequest = (item) => {
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
        [`${PREFIX}Atividade@odata.bind`]: `/${ACTIVITY}(${item.activityId})`,
    };
};
export const buildItemDocument = (item) => {
    return {
        id: item.id,
        deleted: item.deleted,
        [`${PREFIX}fonte`]: item.font,
        [`${PREFIX}link`]: item.link,
        [`${PREFIX}entrega`]: item.delivery,
        [`${PREFIX}nome`]: item.name,
        [`${PREFIX}tipo`]: item.type,
    };
};
export const buildItemAcademicRequest = (item) => {
    var _a;
    const res = {
        id: item.id,
        // deleted: item.deleted,
        [`${PREFIX}descricao`]: item.description,
        [`${PREFIX}prazominimo`]: +((_a = String(item.deadline)) === null || _a === void 0 ? void 0 : _a.replace(/\D/g, '')),
        [`${PREFIX}outro`]: item.other,
        [`${PREFIX}observacao`]: item.observation,
        [`${PREFIX}link`]: item.link,
        [`${PREFIX}nomemoodle`]: item.nomemoodle,
        [`${PREFIX}momentoentrega`]: item.delivery,
        [`${PREFIX}dataentrega`]: item.deliveryDate && item.deliveryDate.format(),
    };
    if (item.deleted) {
        res[`${PREFIX}ativo`] = false;
        res[`${PREFIX}excluido`] = true;
    }
    if (item === null || item === void 0 ? void 0 : item.teamId) {
        res[`${PREFIX}Turma@odata.bind`] = `/${TEAM}(${item === null || item === void 0 ? void 0 : item.teamId})`;
    }
    if (item === null || item === void 0 ? void 0 : item.scheduleId) {
        res[`${PREFIX}CronogramaDia@odata.bind`] = `/${SCHEDULE_DAY}(${item === null || item === void 0 ? void 0 : item.scheduleId})`;
    }
    return res;
};
//# sourceMappingURL=utils.js.map