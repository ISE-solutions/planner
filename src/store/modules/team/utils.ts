import * as moment from 'moment';
import { QueryBuilder } from 'odata-query-builder';
import { PREFIX, PERSON, TAG, TEAM, PROGRAM } from '~/config/database';
import { EGroups } from '~/config/enums';
import buildTextOdataFilter from '~/utils/buildTextOdataFilter';

export interface IFilterProps {
  searchQuery?: string;
  deleted?: boolean;
  programDeleted?: boolean;
  startDeleted?: moment.Moment;
  endDeleted?: moment.Moment;
  programId?: string;
  filterProgram?: boolean;
  active?: 'Todos' | 'Ativo' | 'Inativo';
  published?: 'Todos' | 'Sim' | 'Não';
  order?: 'desc' | 'asc';
  group?: EGroups;
  createdBy?: string;
  orderBy?: string;
  model?: boolean;
  rowsPerPage?: number;
  modality?: string;
  yearConclusion?: string;
  initials?: string;
}

export const buildQuery = (filtro: IFilterProps) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');

    // tslint:disable-next-line: no-unused-expression
    filtro?.searchQuery &&
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
      f.filterExpression(
        `${PREFIX}Modalidade/${PREFIX}etiquetaid`,
        'eq',
        filtro.modality
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.yearConclusion &&
      f.filterExpression(
        `${PREFIX}anodeconclusao`,
        'eq',
        +filtro.yearConclusion
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.initials &&
      f.filterPhrase(`contains(${PREFIX}sigla,'${filtro.initials}')`);

    // tslint:disable-next-line: no-unused-expression
    filtro.createdBy &&
      f.filterExpression(
        `${PREFIX}CriadoPor/${PREFIX}pessoaid`,
        'eq',
        filtro.createdBy
      );

    if (filtro.startDeleted && !filtro.endDeleted) {
      f.filterPhrase(
        `modifiedon gt '${filtro.startDeleted
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'`
      );
    }

    if (!filtro.startDeleted && filtro.endDeleted) {
      f.filterPhrase(
        `modifiedon lt '${filtro.endDeleted
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'`
      );
    }

    if (filtro.startDeleted && filtro.endDeleted) {
      f.filterPhrase(
        `modifiedon gt '${filtro.startDeleted
          .startOf('day')
          .format(
            'YYYY-MM-DD HH:mm:ss'
          )}' and modifiedon lt '${filtro.endDeleted
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'`
      );
    }

    f.filterExpression(`${PREFIX}excluido`, 'eq', Boolean(filtro.deleted));

    if (filtro.programDeleted !== undefined) {
      f.or((p) => {
        p.filterExpression(
          `${PREFIX}Programa/${PREFIX}excluido`,
          'eq',
          filtro?.programDeleted
        );

        p.filterExpression(`${PREFIX}Programa`, 'eq', null);
        return p;
      });
    }

    // tslint:disable-next-line: no-unused-expression
    (filtro?.programId || filtro.filterProgram) &&
      f.filterExpression(
        `${PREFIX}Programa/${PREFIX}programaid`,
        'eq',
        filtro?.programId
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.published &&
      filtro.published !== 'Todos' &&
      f.filterExpression(
        `${PREFIX}publicado`,
        'eq',
        filtro.published === 'Sim'
      );

    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  } else {
    query.orderBy(`createdon desc`);
  }

  // query.select(
  //   `${PREFIX}id,${PREFIX}nome,${PREFIX}sobrenome,${PREFIX}nomepreferido,${PREFIX}email,${PREFIX}emailsecundario,${PREFIX}celular,${PREFIX}escolaorigem,${PREFIX}ativo`
  // );
  query.expand(
    `${PREFIX}Programa,${PREFIX}Turma_NomeTurma,${PREFIX}Temperatura,${PREFIX}Modalidade,${PREFIX}Turma_PessoasEnvolvidasTurma,${PREFIX}Turma_NomeTurma,${PREFIX}Turma_ParticipantesTurma,${PREFIX}CronogramadeDia_Turma,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}Turma_Compartilhamento,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}ise_entrega_Turma_ise_turma`
  );

  query.count();
  return query.toQuery();
};

export const buildAdvancedQuery = (filtro: any[]) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');
    f.filterExpression(`${PREFIX}ativo`, 'eq', true);
    f.filterExpression(`${PREFIX}modelo`, 'eq', false);
    f.filterExpression(`${PREFIX}excluido`, 'eq', false);

    const requestFilter = filtro?.filter((e) => !e?.field?.isLocal);

    requestFilter?.forEach((filter) => {
      const { field, value, criterion } = filter;

      if (!field) {
        return f;
      }

      if (field.value === 'nome') {
        buildTextOdataFilter.buildText(
          f,
          `${PREFIX}nome`,
          criterion.value,
          value
        );
      }

      if (field.value === 'sigla') {
        buildTextOdataFilter.buildText(
          f,
          `${PREFIX}sigla`,
          criterion.value,
          value
        );
      }

      if (field.value === 'codigoturma') {
        buildTextOdataFilter.buildText(
          f,
          `${PREFIX}codigodaturma`,
          criterion.value,
          value
        );
      }

      if (field.value === 'anodeconclusao') {
        f.filterExpression(
          `${PREFIX}anodeconclusao`,
          criterion.value,
          parseInt(value)
        );
      }

      if (field.value === 'modalidade') {
        f.filterPhrase(
          `${PREFIX}Modalidade/${PREFIX}etiquetaid eq '${value.value}'`
        );
      }

      if (field.value === 'temperatura') {
        f.filterPhrase(
          `${PREFIX}Temperatura/${PREFIX}etiquetaid eq '${value.value}'`
        );
      }

      if (field.value === 'participantesdata') {
        f.filterPhrase(
          `${PREFIX}Turma_ParticipantesTurma/any(c: c/${PREFIX}data ${
            criterion.value
          } '${value.startOf('day').format('YYYY-MM-DD HH:mm:ss')}')`
        );
      }

      if (field.value === 'participantesquantidade') {
        f.filterPhrase(
          `${PREFIX}Turma_ParticipantesTurma/any(c: c/${PREFIX}quantidade ${criterion.value} ${value})`
        );
      }

      if (field.value === 'pessoaenvolvida') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}Turma_PessoasEnvolvidasTurma/any(c: c/${PREFIX}Pessoa/${PREFIX}pessoaid eq '${sp.value}')`
            )
          );

          return p;
        });
      }

      if (field.value === 'funcaoenvolvida') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}Turma_PessoasEnvolvidasTurma/any(c: c/${PREFIX}Funcao/${PREFIX}etiquetaid eq '${sp.value}')`
            )
          );

          return p;
        });
      }

      if (field.value === 'programa-nome') {
        buildTextOdataFilter.buildText(
          f,
          `${PREFIX}Programa/${PREFIX}NomePrograma/${PREFIX}nome`,
          criterion.value,
          value
        );
      }

      if (field.value === 'programa-sigla') {
        buildTextOdataFilter.buildText(
          f,
          `${PREFIX}Programa/${PREFIX}sigla`,
          criterion.value,
          value
        );
      }

      if (field.value === 'programa-temperatura') {
        f.filterPhrase(
          `${PREFIX}Programa/${PREFIX}Temperatura/${PREFIX}etiquetaid eq '${value.value}'`
        );
      }
    });

    return f;
  });

  query.expand(
    `${PREFIX}Programa,${PREFIX}Turma_NomeTurma,${PREFIX}Temperatura,${PREFIX}Modalidade,${PREFIX}Turma_PessoasEnvolvidasTurma,${PREFIX}Turma_NomeTurma,${PREFIX}Turma_ParticipantesTurma,${PREFIX}CronogramadeDia_Turma,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}Turma_Compartilhamento`
  );

  query.count();
  return query.toQuery();
};

export const buildItem = (team) => {
  const res = {
    [`${PREFIX}titulo`]: team?.title,
    [`${PREFIX}sigla`]: team?.sigla,
    [`${PREFIX}posicao`]: team?.teamPosition,
    [`${PREFIX}nomecustomizado`]: team?.nameEdited,
    [`${PREFIX}excluirtarefas`]: team?.deleteTask ? 'Sim' : 'Não',
    [`${PREFIX}nome`]: team?.name,
    [`${PREFIX}modeloid`]: team?.modeloid,
    [`${PREFIX}baseadoemmodeloturma`]: team?.baseadoemmodeloturma,
    [`${PREFIX}anexossincronizados`]: team.anexossincronizados,
    [`${PREFIX}nomefinanceiro`]: team?.teamName,
    [`${PREFIX}codigodaturma`]: team?.teamCode,
    [`${PREFIX}mascara`]: team?.mask,
    [`${PREFIX}mascarabackup`]: team?.maskBackup,
    [`${PREFIX}anodeconclusao`]: +String(team?.yearConclusion)?.replace(
      /\D/g,
      ''
    ),
    [`${PREFIX}observacao`]: team?.description,
    [`${PREFIX}modelo`]: team?.model,
    [`${PREFIX}atividadeconcorrente`]: team?.concurrentActivity,
    [`${PREFIX}Modalidade@odata.bind`]:
      team?.modality?.value && `/${TAG}(${team?.modality?.value})`,
    [`${PREFIX}Temperatura@odata.bind`]:
      team?.temperature?.value && `/${TAG}(${team?.temperature?.value})`,
    [`${PREFIX}FerramentaVideoConferencia@odata.bind`]:
      team?.videoConference?.value &&
      `/${TAG}(${team?.videoConference?.value})`,
    [`${PREFIX}FerramentaVideoConferenciaBackup@odata.bind`]:
      team?.videoConferenceBackup?.value &&
      `/${TAG}(${team?.videoConferenceBackup?.value})`,
  };

  if (!team?.id) {
    res[`${PREFIX}CriadoPor@odata.bind`] =
      team?.user && `/${PERSON}(${team?.user})`;
    res[`${PREFIX}grupopermissao`] = team?.group;
  }

  return res;
};

export const buildItemSchedule = (schedule) => {
  return {
    [`${PREFIX}nome`]: schedule.name,
    [`${PREFIX}modelo`]: schedule.model,
    [`${PREFIX}anexossincronizados`]: schedule.anexossincronizados,
    [`${PREFIX}modeloid`]: schedule.modeloid,
    [`${PREFIX}observacao`]:
      schedule.observation || schedule?.[`${PREFIX}observacao`],
    [`${PREFIX}data`]: schedule.date && moment.utc(schedule.date).format(),
    [`${PREFIX}Modulo@odata.bind`]:
      schedule?.module?.[`${PREFIX}etiquetaid`] &&
      `/${TAG}(${schedule?.module?.[`${PREFIX}etiquetaid`]})`,
    [`${PREFIX}Modalidade@odata.bind`]:
      schedule?.modality?.[`${PREFIX}etiquetaid`] &&
      `/${TAG}(${schedule?.modality?.[`${PREFIX}etiquetaid`]})`,
    [`${PREFIX}Ferramenta@odata.bind`]:
      schedule?.tool?.[`${PREFIX}etiquetaid`] &&
      `/${TAG}(${schedule?.tool?.[`${PREFIX}etiquetaid`]})`,
    [`${PREFIX}FerramentaBackup@odata.bind`]:
      schedule?.toolBackup?.[`${PREFIX}etiquetaid`] &&
      `/${TAG}(${schedule?.toolBackup?.[`${PREFIX}etiquetaid`]})`,
    [`${PREFIX}link`]: schedule.link,
    [`${PREFIX}linkbackup`]: schedule.linkBackup,
  };
};

export const buildItemActivity = (activity) => {
  const res = {
    [`${PREFIX}nome`]: activity.name || activity?.[`${PREFIX}nome`],
    [`${PREFIX}tipo`]: activity.type || activity?.[`${PREFIX}tipo`],
    [`${PREFIX}temaaula`]: activity.theme || activity?.[`${PREFIX}temaaula`],
    [`${PREFIX}observacao`]:
      activity.observation || activity?.[`${PREFIX}observacao`],
    [`${PREFIX}descricaoobjetivo`]:
      activity.description || activity?.[`${PREFIX}descricaoobjetivo`],
    [`${PREFIX}quantidadesessao`]:
      activity.quantity || activity?.[`${PREFIX}quantidadesessao`] || 0,
    [`${PREFIX}duracao`]:
      activity.duration?.format('HH:mm') || activity?.[`${PREFIX}duracao`],
    [`${PREFIX}inicio`]:
      activity.startTime?.format('HH:mm') || activity?.[`${PREFIX}inicio`],
    [`${PREFIX}fim`]:
      activity.endTime?.format('HH:mm') || activity?.[`${PREFIX}fim`],
    [`${PREFIX}tipoaplicacao`]: activity.typeApplication,
    [`${PREFIX}datahorainicio`]:
      activity.startDate && moment(activity.startDate).format(),
    [`${PREFIX}datahorafim`]:
      activity.endDate && moment(activity.endDate).format(),
    [`${PREFIX}AreaAcademica@odata.bind`]:
      activity?.area?.[`${PREFIX}etiquetaid`] &&
      `/${TAG}(${activity?.area?.[`${PREFIX}etiquetaid`]})`,
  };

  if (activity?.teamId) {
    res[`${PREFIX}Turma@odata.bind`] = `/${TEAM}(${activity?.teamId})`;
  }

  if (activity?.programId) {
    res[`${PREFIX}Programa@odata.bind`] = `/${TEAM}(${activity?.programId})`;
  }

  return res;
};

export const buildItemFantasyName = (item) => {
  return {
    id: item.id,
    deleted: item.deleted,
    [`${PREFIX}nome`]: item.name,
    [`${PREFIX}nomeen`]: item.nameEn,
    [`${PREFIX}nomees`]: item.nameEs,
    [`${PREFIX}Uso@odata.bind`]: item?.use?.value
      ? `/${TAG}(${item?.use?.value})`
      : null,
  };
};

export const buildItemParticipant = (item) => {
  return {
    id: item.id,
    deleted: item.deleted,
    [`${PREFIX}data`]: item?.date ? item?.date?.format() : null,
    [`${PREFIX}quantidade`]: item?.quantity || 0,
    [`${PREFIX}Uso@odata.bind`]: item?.use?.value
      ? `/${TAG}(${item?.use?.value})`
      : null,
  };
};

export const buildItemPeopleTeam = (item, pos) => {
  return {
    id: item.id,
    deleted: item.deleted,
    [`${PREFIX}ordem`]: pos,
    [`${PREFIX}obrigatorio`]: item?.isRequired,
    [`${PREFIX}Pessoa@odata.bind`]:
      item?.person?.value || item?.[`_${PREFIX}pessoa_value`]
        ? `/${PERSON}(${
            item?.person?.value || item?.[`_${PREFIX}pessoa_value`]
          })`
        : null,
    [`${PREFIX}Funcao@odata.bind`]:
      item?.function?.value || item?.[`_${PREFIX}funcao_value`]
        ? `/${TAG}(${
            item?.function?.value || item?.[`_${PREFIX}funcao_value`]
          })`
        : null,
  };
};

export const buildItemPeople = (item) => {
  return {
    id: item.id,
    deleted: item.deleted,
    [`${PREFIX}Pessoa@odata.bind`]:
      item?.person?.value || item?.[`_${PREFIX}pessoa_value`]
        ? `/${PERSON}(${
            item?.person?.value || item?.[`_${PREFIX}pessoa_value`]
          })`
        : null,
    [`${PREFIX}Funcao@odata.bind`]: item?.function?.value
      ? `/${TAG}(${item?.function?.value})`
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
  const res = {
    id: item.id,
    deleted: item.deleted,
    [`${PREFIX}descricao`]: item.description,
    [`${PREFIX}prazominimo`]: +String(item.deadline)?.replace(/\D/g, ''),
    [`${PREFIX}outro`]: item.other,
    [`${PREFIX}observacao`]: item.observation,
    [`${PREFIX}link`]: item.link,
    [`${PREFIX}nomemoodle`]: item.nomemoodle,
    [`${PREFIX}momentoentrega`]: item.delivery,
    [`${PREFIX}dataentrega`]: item.deliveryDate && item.deliveryDate.format(),
  };

  if (item?.teamId) {
    res[`${PREFIX}Turma@odata.bind`] = `/${TEAM}(${item?.teamId})`;
  }

  return res;
};

export const buildItemPeopleAcademicRequest = (item) => {
  return {
    id: item.id,
    deleted: item.deleted,
    [`${PREFIX}Pessoa@odata.bind`]:
      item?.person || item?.[`_${PREFIX}pessoa_value`]
        ? `/${PERSON}(${
            item?.person?.value || item?.[`_${PREFIX}pessoa_value`]
          })`
        : null,
    [`${PREFIX}Funcao@odata.bind`]:
      item?.function || item?.[`_${PREFIX}funcao_value`]
        ? `/${TAG}(${
            item?.function?.value || item?.[`_${PREFIX}funcao_value`]
          })`
        : null,
    [`${PREFIX}Atividade@odata.bind`]: '$' + item.activityId,
  };
};
