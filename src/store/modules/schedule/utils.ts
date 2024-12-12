import * as moment from 'moment';
import { QueryBuilder } from 'odata-query-builder';
import { PERSON, PREFIX, PROGRAM, SPACE, TAG, TEAM } from '~/config/database';
import { EGroups, TYPE_ACTIVITY } from '~/config/enums';
import buildTextOdataFilter from '~/utils/buildTextOdataFilter';

export interface IFilterProps {
  searchQuery?: string;
  deleted?: boolean;
  teamDeleted?: boolean;
  startDeleted?: moment.Moment;
  endDeleted?: moment.Moment;
  active?: 'Todos' | 'Ativo' | 'Inativo';
  order?: 'desc' | 'asc';
  typeActivity?:
    | TYPE_ACTIVITY.ACADEMICA
    | TYPE_ACTIVITY.NON_ACADEMICA
    | TYPE_ACTIVITY.INTERNAL;
  type?: string;
  date?: string;
  teamId?: string;
  createdBy?: string;
  filterTeam?: boolean;
  groupPermition?: EGroups;
  model?: boolean;
  group?: 'Todos' | 'Sim' | 'Não';
  published?: 'Todos' | 'Sim' | 'Não';
  orderBy?: string;
  modality?: string;
  module?: string;
  rowsPerPage?: number;
}

export const buildQuery = (filtro: IFilterProps) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');

    // tslint:disable-next-line: no-unused-expression
    filtro?.searchQuery &&
      f.or((p) => {
        p.filterPhrase(`contains(${PREFIX}nome,'${filtro.searchQuery}')`);

        return p;
      });

    if (filtro.date) {
      f.filterPhrase(
        `${PREFIX}data ge '${filtro.date}T00:00:00' and ${PREFIX}data le '${filtro.date} 23:59:59'`
      );
    }

    // tslint:disable-next-line: no-unused-expression
    filtro.active &&
      filtro.active !== 'Todos' &&
      f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');

    // tslint:disable-next-line: no-unused-expression
    f.filterExpression(`${PREFIX}modelo`, 'eq', !!filtro.model);

    // tslint:disable-next-line: no-unused-expression
    filtro.groupPermition &&
      f.filterExpression(
        `${PREFIX}grupopermissao`,
        'eq',
        filtro.groupPermition
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.group &&
      filtro.group !== 'Todos' &&
      f.filterExpression(
        `${PREFIX}agrupamentoatividade`,
        'eq',
        filtro.group === 'Sim'
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.published &&
      filtro.published !== 'Todos' &&
      f.filterExpression(
        `${PREFIX}publicado`,
        'eq',
        filtro.published === 'Sim'
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.modality &&
      f.filterExpression(
        `${PREFIX}Modalidade/${PREFIX}etiquetaid`,
        'eq',
        filtro.modality
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.module &&
      f.filterExpression(
        `${PREFIX}Modulo/${PREFIX}etiquetaid`,
        'eq',
        filtro.module
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.createdBy &&
      f.filterExpression(
        `${PREFIX}CriadoPor/${PREFIX}pessoaid`,
        'eq',
        filtro.createdBy
      );

    if (filtro.typeActivity) {
      f.filterExpression(`${PREFIX}tipo`, 'eq', filtro.typeActivity);
    }

    // tslint:disable-next-line: no-unused-expression
    (filtro?.teamId || filtro?.filterTeam) &&
      f.filterExpression(
        `${PREFIX}Turma/${PREFIX}turmaid`,
        'eq',
        filtro?.teamId || null
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

    if (filtro.teamDeleted !== undefined) {
      f.or((p) => {
        p.filterExpression(
          `${PREFIX}Turma/${PREFIX}excluido`,
          'eq',
          filtro?.teamDeleted
        );

        p.filterExpression(`${PREFIX}Turma`, 'eq', null);
        return p;
      });
    }

    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  } else {
    query.orderBy(`createdon desc`);
  }

  query.expand(
    `${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Temperatura,${PREFIX}Local,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento`
  );

  query.count();
  return query.toQuery();
};

export const buildAdvancedQuery = (filtro: any[]) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');
    f.filterExpression(`${PREFIX}modelo`, 'eq', false);
    f.filterExpression(`${PREFIX}excluido`, 'eq', false);
    f.filterExpression(`${PREFIX}ativo`, 'eq', true);

    const requestFilter = filtro?.filter((e) => !e?.field?.isLocal);

    requestFilter?.forEach((filter) => {
      const { field, value, criterion } = filter;

      if (!field) {
        return f;
      }

      if (field.value === 'data') {
        f.filterExpression(
          `${PREFIX}data`,
          criterion.value,
          value.format('YYYY-MM-DD')
        );
      }

      if (field.value === 'modulo') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}Modulo/${PREFIX}etiquetaid eq '${sp.value}'`
            )
          );

          return p;
        });
      }

      if (field.value === 'modalidade') {
        f.filterPhrase(
          `${PREFIX}Modalidade/${PREFIX}etiquetaid eq '${value.value}'`
        );
      }

      if (field.value === 'ferramenta') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}Ferramenta/${PREFIX}etiquetaid eq '${sp.value}'`
            )
          );

          return p;
        });
      }

      if (field.value === 'temperatura') {
        f.filterPhrase(
          `${PREFIX}Temperatura/${PREFIX}etiquetaid eq '${value.value}'`
        );
      }

      if (field.value === 'pessoaenvolvida') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}CronogramadeDia_PessoasEnvolvidas/any(c: c/${PREFIX}Pessoa/${PREFIX}pessoaid eq '${sp.value}')`
            )
          );

          return p;
        });
      }

      if (field.value === 'funcaoenvolvida') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}CronogramadeDia_PessoasEnvolvidas/any(c: c/${PREFIX}Funcao/${PREFIX}etiquetaid eq '${sp.value}')`
            )
          );

          return p;
        });
      }

      if (field.value === 'turma-nome') {
        buildTextOdataFilter.buildText(
          f,
          `${PREFIX}Turma/${PREFIX}nome`,
          criterion.value,
          value
        );
      }

      if (field.value === 'turma-sigla') {
        buildTextOdataFilter.buildText(
          f,
          `${PREFIX}Turma/${PREFIX}sigla`,
          criterion.value,
          value
        );
      }

      if (field.value === 'turma-codigoturma') {
        buildTextOdataFilter.buildText(
          f,
          `${PREFIX}Turma/${PREFIX}codigodaturma`,
          criterion.value,
          value
        );
      }

      if (field.value === 'turma-anodeconclusao') {
        f.filterExpression(
          `${PREFIX}Turma/${PREFIX}anodeconclusao`,
          criterion.value,
          parseInt(value)
        );
      }

      if (field.value === 'turma-modalidade') {
        f.filterPhrase(
          `${PREFIX}Turma/${PREFIX}Modalidade/${PREFIX}etiquetaid eq '${value.value}'`
        );
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
    `${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Temperatura,${PREFIX}Local,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento,${PREFIX}Programa`
  );

  query.count();
  return query.toQuery();
};

export const buildItem = (schedule) => {
  const res = {
    [`${PREFIX}nome`]: schedule.name,
    [`${PREFIX}modelo`]: schedule.model,
    [`${PREFIX}anexossincronizados`]: schedule.anexossincronizados,
    [`${PREFIX}modeloid`]: schedule.modeloid,
    [`${PREFIX}baseadoemcronogramadiamodelo`]:
      schedule.baseadoemcronogramadiamodelo,
    [`${PREFIX}agrupamentoatividade`]: schedule.isGroupActive,
    [`${PREFIX}duracao`]: schedule.duration
      ? schedule.duration?.format('HH:mm')
      : null,
    [`${PREFIX}inicio`]: schedule.startTime
      ? schedule.startTime?.format('HH:mm')
      : null,
    [`${PREFIX}fim`]: schedule.endTime
      ? schedule.endTime?.format('HH:mm')
      : null,
    [`${PREFIX}observacao`]:
      schedule.observation || schedule?.[`${PREFIX}observacao`],
    [`${PREFIX}data`]: schedule.date && moment(schedule.date).format('YYYY-MM-DD'),
    [`${PREFIX}Modulo@odata.bind`]: schedule?.module?.[`${PREFIX}etiquetaid`]
      ? `/${TAG}(${schedule?.module?.[`${PREFIX}etiquetaid`]})`
      : null,
    [`${PREFIX}Modalidade@odata.bind`]: schedule?.modality?.[
      `${PREFIX}etiquetaid`
    ]
      ? `/${TAG}(${schedule?.modality?.[`${PREFIX}etiquetaid`]})`
      : null,
    [`${PREFIX}Ferramenta@odata.bind`]: schedule?.tool?.[`${PREFIX}etiquetaid`]
      ? `/${TAG}(${schedule?.tool?.[`${PREFIX}etiquetaid`]})`
      : null,
    [`${PREFIX}FerramentaBackup@odata.bind`]: schedule?.toolBackup?.[
      `${PREFIX}etiquetaid`
    ]
      ? `/${TAG}(${schedule?.toolBackup?.[`${PREFIX}etiquetaid`]})`
      : null,
    [`${PREFIX}Local@odata.bind`]: schedule?.place?.[`${PREFIX}etiquetaid`]
      ? `/${TAG}(${schedule?.place?.[`${PREFIX}etiquetaid`]})`
      : null,
    [`${PREFIX}Turma@odata.bind`]:
      schedule?.teamId && `/${TEAM}(${schedule?.teamId})`,
    [`${PREFIX}Programa@odata.bind`]:
      schedule?.programId && `/${PROGRAM}(${schedule?.programId})`,
    [`${PREFIX}Temperatura@odata.bind`]:
      schedule?.temperature && `/${TAG}(${schedule?.temperature?.value})`,
    [`${PREFIX}link`]: schedule.link,
    [`${PREFIX}linkbackup`]: schedule.linkBackup,
  };

  if (!schedule?.id) {
    res[`${PREFIX}CriadoPor@odata.bind`] =
      schedule?.user && `/${PERSON}(${schedule?.user})`;
    res[`${PREFIX}grupopermissao`] = schedule?.group;
  }

  return res;
};

export const buildItemLocale = (item) => {
  return {
    id: item.id,
    deleted: item.deleted,
    [`${PREFIX}Espaco@odata.bind`]:
      item?.space || item?.[`_${PREFIX}espaco_value`]
        ? `/${SPACE}(${item?.space?.value || item?.[`_${PREFIX}espaco_value`]})`
        : null,
    [`${PREFIX}observacao`]: item?.observation,
  };
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
