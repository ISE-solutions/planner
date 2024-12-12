import * as moment from 'moment';
import { QueryBuilder } from 'odata-query-builder';
import { PREFIX, PERSON, TAG, TEAM } from '~/config/database';
import buildTextOdataFilter from '~/utils/buildTextOdataFilter';
export const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.searchQuery) &&
            f.or((p) => {
                p.filterPhrase(`contains(${PREFIX}titulo,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}sigla,'${filtro.searchQuery}')`);
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
        filtro.modality &&
            f.filterExpression(`${PREFIX}Modalidade/${PREFIX}etiquetaid`, 'eq', filtro.modality);
        // tslint:disable-next-line: no-unused-expression
        filtro.yearConclusion &&
            f.filterExpression(`${PREFIX}anodeconclusao`, 'eq', +filtro.yearConclusion);
        // tslint:disable-next-line: no-unused-expression
        filtro.initials &&
            f.filterPhrase(`contains(${PREFIX}sigla,'${filtro.initials}')`);
        // tslint:disable-next-line: no-unused-expression
        filtro.createdBy &&
            f.filterExpression(`${PREFIX}CriadoPor/${PREFIX}pessoaid`, 'eq', filtro.createdBy);
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
        if (filtro.programDeleted !== undefined) {
            f.or((p) => {
                p.filterExpression(`${PREFIX}Programa/${PREFIX}excluido`, 'eq', filtro === null || filtro === void 0 ? void 0 : filtro.programDeleted);
                p.filterExpression(`${PREFIX}Programa`, 'eq', null);
                return p;
            });
        }
        // tslint:disable-next-line: no-unused-expression
        ((filtro === null || filtro === void 0 ? void 0 : filtro.programId) || filtro.filterProgram) &&
            f.filterExpression(`${PREFIX}Programa/${PREFIX}programaid`, 'eq', filtro === null || filtro === void 0 ? void 0 : filtro.programId);
        // tslint:disable-next-line: no-unused-expression
        filtro.published &&
            filtro.published !== 'Todos' &&
            f.filterExpression(`${PREFIX}publicado`, 'eq', filtro.published === 'Sim');
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    else {
        query.orderBy(`createdon desc`);
    }
    // query.select(
    //   `${PREFIX}id,${PREFIX}nome,${PREFIX}sobrenome,${PREFIX}nomepreferido,${PREFIX}email,${PREFIX}emailsecundario,${PREFIX}celular,${PREFIX}escolaorigem,${PREFIX}ativo`
    // );
    query.expand(`${PREFIX}Programa,${PREFIX}Turma_NomeTurma,${PREFIX}Temperatura,${PREFIX}Modalidade,${PREFIX}Turma_PessoasEnvolvidasTurma,${PREFIX}Turma_NomeTurma,${PREFIX}Turma_ParticipantesTurma,${PREFIX}CronogramadeDia_Turma,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}Turma_Compartilhamento,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}ise_entrega_Turma_ise_turma`);
    query.count();
    return query.toQuery();
};
export const buildAdvancedQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        f.filterExpression(`${PREFIX}ativo`, 'eq', true);
        f.filterExpression(`${PREFIX}modelo`, 'eq', false);
        f.filterExpression(`${PREFIX}excluido`, 'eq', false);
        const requestFilter = filtro === null || filtro === void 0 ? void 0 : filtro.filter((e) => { var _a; return !((_a = e === null || e === void 0 ? void 0 : e.field) === null || _a === void 0 ? void 0 : _a.isLocal); });
        requestFilter === null || requestFilter === void 0 ? void 0 : requestFilter.forEach((filter) => {
            const { field, value, criterion } = filter;
            if (!field) {
                return f;
            }
            if (field.value === 'nome') {
                buildTextOdataFilter.buildText(f, `${PREFIX}nome`, criterion.value, value);
            }
            if (field.value === 'sigla') {
                buildTextOdataFilter.buildText(f, `${PREFIX}sigla`, criterion.value, value);
            }
            if (field.value === 'codigoturma') {
                buildTextOdataFilter.buildText(f, `${PREFIX}codigodaturma`, criterion.value, value);
            }
            if (field.value === 'anodeconclusao') {
                f.filterExpression(`${PREFIX}anodeconclusao`, criterion.value, parseInt(value));
            }
            if (field.value === 'modalidade') {
                f.filterPhrase(`${PREFIX}Modalidade/${PREFIX}etiquetaid eq '${value.value}'`);
            }
            if (field.value === 'temperatura') {
                f.filterPhrase(`${PREFIX}Temperatura/${PREFIX}etiquetaid eq '${value.value}'`);
            }
            if (field.value === 'participantesdata') {
                f.filterPhrase(`${PREFIX}Turma_ParticipantesTurma/any(c: c/${PREFIX}data ${criterion.value} '${value.startOf('day').format('YYYY-MM-DD HH:mm:ss')}')`);
            }
            if (field.value === 'participantesquantidade') {
                f.filterPhrase(`${PREFIX}Turma_ParticipantesTurma/any(c: c/${PREFIX}quantidade ${criterion.value} ${value})`);
            }
            if (field.value === 'pessoaenvolvida') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}Turma_PessoasEnvolvidasTurma/any(c: c/${PREFIX}Pessoa/${PREFIX}pessoaid eq '${sp.value}')`));
                    return p;
                });
            }
            if (field.value === 'funcaoenvolvida') {
                f.or((p) => {
                    value.forEach((sp) => p.filterPhrase(`${PREFIX}Turma_PessoasEnvolvidasTurma/any(c: c/${PREFIX}Funcao/${PREFIX}etiquetaid eq '${sp.value}')`));
                    return p;
                });
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
    query.expand(`${PREFIX}Programa,${PREFIX}Turma_NomeTurma,${PREFIX}Temperatura,${PREFIX}Modalidade,${PREFIX}Turma_PessoasEnvolvidasTurma,${PREFIX}Turma_NomeTurma,${PREFIX}Turma_ParticipantesTurma,${PREFIX}CronogramadeDia_Turma,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}Turma_Compartilhamento`);
    query.count();
    return query.toQuery();
};
export const buildItem = (team) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const res = {
        [`${PREFIX}titulo`]: team === null || team === void 0 ? void 0 : team.title,
        [`${PREFIX}sigla`]: team === null || team === void 0 ? void 0 : team.sigla,
        [`${PREFIX}posicao`]: team === null || team === void 0 ? void 0 : team.teamPosition,
        [`${PREFIX}nomecustomizado`]: team === null || team === void 0 ? void 0 : team.nameEdited,
        [`${PREFIX}excluirtarefas`]: (team === null || team === void 0 ? void 0 : team.deleteTask) ? 'Sim' : 'Não',
        [`${PREFIX}nome`]: team === null || team === void 0 ? void 0 : team.name,
        [`${PREFIX}modeloid`]: team === null || team === void 0 ? void 0 : team.modeloid,
        [`${PREFIX}baseadoemmodeloturma`]: team === null || team === void 0 ? void 0 : team.baseadoemmodeloturma,
        [`${PREFIX}anexossincronizados`]: team.anexossincronizados,
        [`${PREFIX}nomefinanceiro`]: team === null || team === void 0 ? void 0 : team.teamName,
        [`${PREFIX}codigodaturma`]: team === null || team === void 0 ? void 0 : team.teamCode,
        [`${PREFIX}mascara`]: team === null || team === void 0 ? void 0 : team.mask,
        [`${PREFIX}mascarabackup`]: team === null || team === void 0 ? void 0 : team.maskBackup,
        [`${PREFIX}anodeconclusao`]: +((_a = String(team === null || team === void 0 ? void 0 : team.yearConclusion)) === null || _a === void 0 ? void 0 : _a.replace(/\D/g, '')),
        [`${PREFIX}observacao`]: team === null || team === void 0 ? void 0 : team.description,
        [`${PREFIX}modelo`]: team === null || team === void 0 ? void 0 : team.model,
        [`${PREFIX}atividadeconcorrente`]: team === null || team === void 0 ? void 0 : team.concurrentActivity,
        [`${PREFIX}Modalidade@odata.bind`]: ((_b = team === null || team === void 0 ? void 0 : team.modality) === null || _b === void 0 ? void 0 : _b.value) && `/${TAG}(${(_c = team === null || team === void 0 ? void 0 : team.modality) === null || _c === void 0 ? void 0 : _c.value})`,
        [`${PREFIX}Temperatura@odata.bind`]: ((_d = team === null || team === void 0 ? void 0 : team.temperature) === null || _d === void 0 ? void 0 : _d.value) && `/${TAG}(${(_e = team === null || team === void 0 ? void 0 : team.temperature) === null || _e === void 0 ? void 0 : _e.value})`,
        [`${PREFIX}FerramentaVideoConferencia@odata.bind`]: ((_f = team === null || team === void 0 ? void 0 : team.videoConference) === null || _f === void 0 ? void 0 : _f.value) &&
            `/${TAG}(${(_g = team === null || team === void 0 ? void 0 : team.videoConference) === null || _g === void 0 ? void 0 : _g.value})`,
        [`${PREFIX}FerramentaVideoConferenciaBackup@odata.bind`]: ((_h = team === null || team === void 0 ? void 0 : team.videoConferenceBackup) === null || _h === void 0 ? void 0 : _h.value) &&
            `/${TAG}(${(_j = team === null || team === void 0 ? void 0 : team.videoConferenceBackup) === null || _j === void 0 ? void 0 : _j.value})`,
    };
    if (!(team === null || team === void 0 ? void 0 : team.id)) {
        res[`${PREFIX}CriadoPor@odata.bind`] =
            (team === null || team === void 0 ? void 0 : team.user) && `/${PERSON}(${team === null || team === void 0 ? void 0 : team.user})`;
        res[`${PREFIX}grupopermissao`] = team === null || team === void 0 ? void 0 : team.group;
    }
    return res;
};
export const buildItemSchedule = (schedule) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        [`${PREFIX}nome`]: schedule.name,
        [`${PREFIX}modelo`]: schedule.model,
        [`${PREFIX}anexossincronizados`]: schedule.anexossincronizados,
        [`${PREFIX}modeloid`]: schedule.modeloid,
        [`${PREFIX}observacao`]: schedule.observation || (schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}observacao`]),
        [`${PREFIX}data`]: schedule.date && moment.utc(schedule.date).format(),
        [`${PREFIX}Modulo@odata.bind`]: ((_a = schedule === null || schedule === void 0 ? void 0 : schedule.module) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]) &&
            `/${TAG}(${(_b = schedule === null || schedule === void 0 ? void 0 : schedule.module) === null || _b === void 0 ? void 0 : _b[`${PREFIX}etiquetaid`]})`,
        [`${PREFIX}Modalidade@odata.bind`]: ((_c = schedule === null || schedule === void 0 ? void 0 : schedule.modality) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`]) &&
            `/${TAG}(${(_d = schedule === null || schedule === void 0 ? void 0 : schedule.modality) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`]})`,
        [`${PREFIX}Ferramenta@odata.bind`]: ((_e = schedule === null || schedule === void 0 ? void 0 : schedule.tool) === null || _e === void 0 ? void 0 : _e[`${PREFIX}etiquetaid`]) &&
            `/${TAG}(${(_f = schedule === null || schedule === void 0 ? void 0 : schedule.tool) === null || _f === void 0 ? void 0 : _f[`${PREFIX}etiquetaid`]})`,
        [`${PREFIX}FerramentaBackup@odata.bind`]: ((_g = schedule === null || schedule === void 0 ? void 0 : schedule.toolBackup) === null || _g === void 0 ? void 0 : _g[`${PREFIX}etiquetaid`]) &&
            `/${TAG}(${(_h = schedule === null || schedule === void 0 ? void 0 : schedule.toolBackup) === null || _h === void 0 ? void 0 : _h[`${PREFIX}etiquetaid`]})`,
        [`${PREFIX}link`]: schedule.link,
        [`${PREFIX}linkbackup`]: schedule.linkBackup,
    };
};
export const buildItemActivity = (activity) => {
    var _a, _b, _c, _d, _e;
    const res = {
        [`${PREFIX}nome`]: activity.name || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}nome`]),
        [`${PREFIX}tipo`]: activity.type || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]),
        [`${PREFIX}temaaula`]: activity.theme || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}temaaula`]),
        [`${PREFIX}observacao`]: activity.observation || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}observacao`]),
        [`${PREFIX}descricaoobjetivo`]: activity.description || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}descricaoobjetivo`]),
        [`${PREFIX}quantidadesessao`]: activity.quantity || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}quantidadesessao`]) || 0,
        [`${PREFIX}duracao`]: ((_a = activity.duration) === null || _a === void 0 ? void 0 : _a.format('HH:mm')) || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}duracao`]),
        [`${PREFIX}inicio`]: ((_b = activity.startTime) === null || _b === void 0 ? void 0 : _b.format('HH:mm')) || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}inicio`]),
        [`${PREFIX}fim`]: ((_c = activity.endTime) === null || _c === void 0 ? void 0 : _c.format('HH:mm')) || (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}fim`]),
        [`${PREFIX}tipoaplicacao`]: activity.typeApplication,
        [`${PREFIX}datahorainicio`]: activity.startDate && moment(activity.startDate).format(),
        [`${PREFIX}datahorafim`]: activity.endDate && moment(activity.endDate).format(),
        [`${PREFIX}AreaAcademica@odata.bind`]: ((_d = activity === null || activity === void 0 ? void 0 : activity.area) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`]) &&
            `/${TAG}(${(_e = activity === null || activity === void 0 ? void 0 : activity.area) === null || _e === void 0 ? void 0 : _e[`${PREFIX}etiquetaid`]})`,
    };
    if (activity === null || activity === void 0 ? void 0 : activity.teamId) {
        res[`${PREFIX}Turma@odata.bind`] = `/${TEAM}(${activity === null || activity === void 0 ? void 0 : activity.teamId})`;
    }
    if (activity === null || activity === void 0 ? void 0 : activity.programId) {
        res[`${PREFIX}Programa@odata.bind`] = `/${TEAM}(${activity === null || activity === void 0 ? void 0 : activity.programId})`;
    }
    return res;
};
export const buildItemFantasyName = (item) => {
    var _a, _b;
    return {
        id: item.id,
        deleted: item.deleted,
        [`${PREFIX}nome`]: item.name,
        [`${PREFIX}nomeen`]: item.nameEn,
        [`${PREFIX}nomees`]: item.nameEs,
        [`${PREFIX}Uso@odata.bind`]: ((_a = item === null || item === void 0 ? void 0 : item.use) === null || _a === void 0 ? void 0 : _a.value)
            ? `/${TAG}(${(_b = item === null || item === void 0 ? void 0 : item.use) === null || _b === void 0 ? void 0 : _b.value})`
            : null,
    };
};
export const buildItemParticipant = (item) => {
    var _a, _b, _c;
    return {
        id: item.id,
        deleted: item.deleted,
        [`${PREFIX}data`]: (item === null || item === void 0 ? void 0 : item.date) ? (_a = item === null || item === void 0 ? void 0 : item.date) === null || _a === void 0 ? void 0 : _a.format() : null,
        [`${PREFIX}quantidade`]: (item === null || item === void 0 ? void 0 : item.quantity) || 0,
        [`${PREFIX}Uso@odata.bind`]: ((_b = item === null || item === void 0 ? void 0 : item.use) === null || _b === void 0 ? void 0 : _b.value)
            ? `/${TAG}(${(_c = item === null || item === void 0 ? void 0 : item.use) === null || _c === void 0 ? void 0 : _c.value})`
            : null,
    };
};
export const buildItemPeopleTeam = (item, pos) => {
    var _a, _b, _c, _d;
    return {
        id: item.id,
        deleted: item.deleted,
        [`${PREFIX}ordem`]: pos,
        [`${PREFIX}obrigatorio`]: item === null || item === void 0 ? void 0 : item.isRequired,
        [`${PREFIX}Pessoa@odata.bind`]: ((_a = item === null || item === void 0 ? void 0 : item.person) === null || _a === void 0 ? void 0 : _a.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`])
            ? `/${PERSON}(${((_b = item === null || item === void 0 ? void 0 : item.person) === null || _b === void 0 ? void 0 : _b.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`])})`
            : null,
        [`${PREFIX}Funcao@odata.bind`]: ((_c = item === null || item === void 0 ? void 0 : item.function) === null || _c === void 0 ? void 0 : _c.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}funcao_value`])
            ? `/${TAG}(${((_d = item === null || item === void 0 ? void 0 : item.function) === null || _d === void 0 ? void 0 : _d.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}funcao_value`])})`
            : null,
    };
};
export const buildItemPeople = (item) => {
    var _a, _b, _c, _d;
    return {
        id: item.id,
        deleted: item.deleted,
        [`${PREFIX}Pessoa@odata.bind`]: ((_a = item === null || item === void 0 ? void 0 : item.person) === null || _a === void 0 ? void 0 : _a.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`])
            ? `/${PERSON}(${((_b = item === null || item === void 0 ? void 0 : item.person) === null || _b === void 0 ? void 0 : _b.value) || (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`])})`
            : null,
        [`${PREFIX}Funcao@odata.bind`]: ((_c = item === null || item === void 0 ? void 0 : item.function) === null || _c === void 0 ? void 0 : _c.value)
            ? `/${TAG}(${(_d = item === null || item === void 0 ? void 0 : item.function) === null || _d === void 0 ? void 0 : _d.value})`
            : null,
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
    };
};
export const buildItemAcademicRequest = (item) => {
    var _a;
    const res = {
        id: item.id,
        deleted: item.deleted,
        [`${PREFIX}descricao`]: item.description,
        [`${PREFIX}prazominimo`]: +((_a = String(item.deadline)) === null || _a === void 0 ? void 0 : _a.replace(/\D/g, '')),
        [`${PREFIX}outro`]: item.other,
        [`${PREFIX}observacao`]: item.observation,
        [`${PREFIX}link`]: item.link,
        [`${PREFIX}nomemoodle`]: item.nomemoodle,
        [`${PREFIX}momentoentrega`]: item.delivery,
        [`${PREFIX}dataentrega`]: item.deliveryDate && item.deliveryDate.format(),
    };
    if (item === null || item === void 0 ? void 0 : item.teamId) {
        res[`${PREFIX}Turma@odata.bind`] = `/${TEAM}(${item === null || item === void 0 ? void 0 : item.teamId})`;
    }
    return res;
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