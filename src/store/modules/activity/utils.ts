import * as moment from 'moment';
import FilterBuilder, { QueryBuilder } from 'odata-query-builder';
import {
  PREFIX,
  PERSON,
  TAG,
  TEAM,
  PROGRAM,
  ACTIVITY,
  SCHEDULE_DAY,
} from '~/config/database';
import {
  EActivityTypeApplication,
  EGroups,
  TYPE_ACTIVITY,
} from '~/config/enums';
import buildTextOdataFilter from '~/utils/buildTextOdataFilter';

export interface IFilterProps {
  searchQuery?: string;
  deleted?: boolean;
  startDeleted?: moment.Moment;
  endDeleted?: moment.Moment;
  active?: 'Todos' | 'Ativo' | 'Inativo';
  published?: 'Todos' | 'Sim' | 'Não';
  order?: 'desc' | 'asc';
  createdBy?: string;
  academicArea?: string;
  name?: string;
  group?: EGroups;
  typesApplication?: [
    | EActivityTypeApplication.PLANEJAMENTO
    | EActivityTypeApplication.AGRUPAMENTO
    | EActivityTypeApplication.MODELO
    | EActivityTypeApplication.MODELO_REFERENCIA
    | EActivityTypeApplication.APLICACAO
  ];
  typeApplication?:
    | EActivityTypeApplication.PLANEJAMENTO
    | EActivityTypeApplication.AGRUPAMENTO
    | EActivityTypeApplication.MODELO
    | EActivityTypeApplication.MODELO_REFERENCIA
    | EActivityTypeApplication.APLICACAO;
  typeActivity?:
    | TYPE_ACTIVITY.ACADEMICA
    | TYPE_ACTIVITY.NON_ACADEMICA
    | TYPE_ACTIVITY.INTERNAL;
  type?: string;
  teamId?: string;
  programId?: string;
  schedulesId?: string[];
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  orderBy?: string;
  rowsPerPage?: number;
}

export const buildQuery = (filtro: IFilterProps) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');

    // tslint:disable-next-line: no-unused-expression
    filtro?.searchQuery &&
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
      f.filterExpression(
        `${PREFIX}tipoaplicacao`,
        'eq',
        filtro.typeApplication
      );
    }

    if (filtro.name) {
      f.filterPhrase(`contains(${PREFIX}nome,'${filtro.name}')`);
    }

    if (filtro.academicArea) {
      f.filterExpression(
        `${PREFIX}AreaAcademica/${PREFIX}etiquetaid`,
        'eq',
        filtro?.academicArea
      );
    }

    if (filtro.startDate && !filtro.endDate) {
      f.filterPhrase(
        `${PREFIX}datahorainicio gt '${filtro.startDate
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'`
      );
    }

    if (!filtro.startDate && filtro.endDate) {
      f.filterPhrase(
        `${PREFIX}datahorainicio lt '${filtro.endDate
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'`
      );
    }

    if (filtro.startDate && filtro.endDate) {
      f.filterPhrase(
        `${PREFIX}datahorainicio gt '${filtro.startDate
          .startOf('day')
          .format(
            'YYYY-MM-DD HH:mm:ss'
          )}' and ${PREFIX}datahorainicio lt '${filtro.endDate
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'`
      );
    }

    if (filtro?.typesApplication?.length) {
      f.or((p) => {
        filtro.typesApplication.forEach((elm) => {
          p.filterPhrase(`${PREFIX}tipoaplicacao eq '${elm}'`);
        });
        return p;
      });
    }

    // tslint:disable-next-line: no-unused-expression
    filtro?.teamId &&
      f.filterExpression(
        `${PREFIX}Turma/${PREFIX}turmaid`,
        'eq',
        filtro?.teamId
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.group &&
      f.filterExpression(`${PREFIX}grupopermissao`, 'eq', filtro.group);

    // tslint:disable-next-line: no-unused-expression
    filtro.published &&
      filtro.published !== 'Todos' &&
      f.filterExpression(
        `${PREFIX}publicado`,
        'eq',
        filtro.published === 'Sim'
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.createdBy &&
      f.filterExpression(
        `${PREFIX}CriadoPor/${PREFIX}pessoaid`,
        'eq',
        filtro.createdBy
      );

    // tslint:disable-next-line: no-unused-expression
    filtro?.programId &&
      f.filterExpression(
        `${PREFIX}Programa/${PREFIX}programaid`,
        'eq',
        filtro?.programId
      );

    if (filtro?.schedulesId?.length) {
      f.or((p) => {
        filtro?.schedulesId.forEach((elm) => {
          ('');
          p.filterExpression(
            `${PREFIX}CronogramaDia/${PREFIX}cronogramadediaid`,
            'eq',
            elm
          );
        });

        return p;
      });
    }

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
          .add(1, 'day')
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
          .add(1, 'day')
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')}'`
      );
    }

    f.filterExpression(`${PREFIX}excluido`, 'eq', Boolean(filtro.deleted));

    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  }

  query.expand(
    `${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por,${PREFIX}CriadoPor,${PREFIX}Turma`
  );

  query.count();
  return query.toQuery();
};

export const buildAdvancedQuery = (filtro: any[]) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');
    f.filterExpression(`${PREFIX}excluido`, 'eq', false);
    f.filterExpression(`${PREFIX}ativo`, 'eq', true);
    f.filterExpression(
      `${PREFIX}tipoaplicacao`,
      'eq',
      EActivityTypeApplication.APLICACAO
    );

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

      if (field.value === 'temaaula') {
        buildTextOdataFilter.buildText(
          f,
          `${PREFIX}temaaula`,
          criterion.value,
          value
        );
      }

      if (field.value === 'tipo') {
        f.filterExpression(`${PREFIX}tipo`, criterion.value, value.value);
      }

      if (field.value === 'space') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}Atividade_Espaco/any(c: c/${PREFIX}espacoid eq '${sp.value}')`
            )
          );

          return p;
        });
      }

      if (field.value === 'area') {
        f.or((p) => {
          value.forEach((ar) =>
            p.filterExpression(
              `${PREFIX}AreaAcademica/${PREFIX}etiquetaid`,
              'eq',
              ar.value
            )
          );

          return p;
        });
      }

      if (field.value === 'temperatura') {
        f.filterExpression(
          `${PREFIX}Temperatura/${PREFIX}etiquetaid`,
          'eq',
          value.value
        );
      }

      if (field.value === 'quantidadesessao') {
        f.filterPhrase(`${PREFIX}quantidadesessao ${criterion.value} ${value}`);
      }

      if (field.value === 'pessoaenvolvida') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}Atividade_PessoasEnvolvidas/any(c: c/${PREFIX}Pessoa/${PREFIX}pessoaid eq '${sp.value}')`
            )
          );

          return p;
        });
      }

      if (field.value === 'funcaoenvolvida') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}Atividade_PessoasEnvolvidas/any(c: c/${PREFIX}Funcao/${PREFIX}etiquetaid eq '${sp.value}')`
            )
          );

          return p;
        });
      }

      if (field.value === 'documento') {
        buildTextOdataFilter.buildChildText(
          f,
          `${PREFIX}Atividade_Documento`,
          `${PREFIX}nome`,
          criterion.value,
          value
        );
      }

      if (field.value === 'requisicaoacademica') {
        buildTextOdataFilter.buildChildText(
          f,
          `${PREFIX}RequisicaoAcademica_Atividade`,
          `${PREFIX}descricao`,
          criterion.value,
          value
        );
      }

      if (field.value === 'inicio') {
        f.filterPhrase(
          `${PREFIX}datahorainicio ${criterion.value} '${value.format(
            'YYYY-MM-DD HH:mm:ss'
          )}'`
        );
      }

      if (field.value === 'fim') {
        f.filterPhrase(
          `${PREFIX}datahorafim ${criterion.value} '${value.format(
            'YYYY-MM-DD HH:mm:ss'
          )}'`
        );
      }

      if (field.value === 'dia-data') {
        f.filterPhrase(
          `${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}data ${
            criterion.value
          } '${value.startOf('day').format('YYYY-MM-DD HH:mm:ss')}')`
        );
      }

      if (field.value === 'dia-modulo') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}Modulo/${PREFIX}etiquetaid eq '${sp.value}')`
            )
          );

          return p;
        });
      }

      if (field.value === 'dia-modalidade') {
        f.filterPhrase(
          `${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}Modalidade/${PREFIX}etiquetaid eq '${value.value}')`
        );
      }

      if (field.value === 'dia-ferramenta') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}Ferramenta/${PREFIX}etiquetaid eq '${sp.value}')`
            )
          );

          return p;
        });
      }

      if (field.value === 'dia-temperatura') {
        f.filterPhrase(
          `${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}Temperatura/${PREFIX}etiquetaid eq '${value.value}')`
        );
      }

      if (field.value === 'dia-pessoaenvolvida') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}CronogramadeDia_PessoasEnvolvidas/any(v: v/${PREFIX}Pessoa/${PREFIX}pessoaid eq '${sp.value}'))`
            )
          );

          return p;
        });
      }

      if (field.value === 'dia-funcaoenvolvida') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}CronogramadeDia_PessoasEnvolvidas/any(v: v/${PREFIX}Funcao/${PREFIX}etiquetaid eq '${sp.value}'))`
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
        f.filterPhrase(
          `${PREFIX}Turma/${PREFIX}anodeconclusao ${criterion.value} ${value}`
        );
      }

      if (field.value === 'turma-modalidade') {
        f.filterPhrase(
          `${PREFIX}Turma/_${PREFIX}modalidade_value eq '${value.value}'`
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
    `${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por,${PREFIX}CriadoPor,${PREFIX}Programa,${PREFIX}Turma`
  );

  query.count();
  return query.toQuery();
};

export const buildItem = (activity) => {
  const res = {
    [`${PREFIX}titulo`]: activity.title,
    [`${PREFIX}nome`]: activity.name,
    [`${PREFIX}atualizado`]: activity.changed,
    [`${PREFIX}ativo`]: activity[`${PREFIX}ativo`],
    [`${PREFIX}tipo`]: activity.type || activity?.[`${PREFIX}tipo`],
    [`${PREFIX}temaaula`]: activity.theme,
    [`${PREFIX}observacao`]: activity.observation,
    [`${PREFIX}descricaoobjetivo`]: activity.description,
    [`${PREFIX}quantidadesessao`]:
      +String(activity.quantity)?.replace(/\D/g, '') || 0,
    [`${PREFIX}duracao`]:
      activity.duration?.format('HH:mm') || activity?.[`${PREFIX}duracao`],
    [`${PREFIX}inicio`]:
      activity.startTime?.format('HH:mm') || activity?.[`${PREFIX}inicio`],
    [`${PREFIX}fim`]:
      activity.endTime?.format('HH:mm') || activity?.[`${PREFIX}fim`],
    [`${PREFIX}tipoaplicacao`]: activity.typeApplication,
    [`${PREFIX}datahorainicio`]: activity.startDate,
    [`${PREFIX}datahorafim`]: activity.endDate,
    [`${PREFIX}AreaAcademica@odata.bind`]:
      activity?.area && `/${TAG}(${activity?.area?.[`${PREFIX}etiquetaid`]})`,
    [`${PREFIX}Curso@odata.bind`]:
      activity?.course &&
      `/${TAG}(${activity?.course?.[`${PREFIX}etiquetaid`]})`,
    [`${PREFIX}Temperatura@odata.bind`]:
      activity?.temperature && `/${TAG}(${activity?.temperature?.value})`
  };

  if (activity?.teamId) {
    res[`${PREFIX}Turma@odata.bind`] = `/${TEAM}(${activity?.teamId})`;
  }

  if (activity?.programId) {
    res[`${PREFIX}Programa@odata.bind`] = `/${PROGRAM}(${activity?.programId})`;
  }

  if (activity?.scheduleId) {
    res[
      `${PREFIX}CronogramaDia@odata.bind`
    ] = `/${SCHEDULE_DAY}(${activity?.scheduleId})`;
  }

  if (!activity?.id) {
    res[`${PREFIX}CriadoPor@odata.bind`] =
      activity?.user && `/${PERSON}(${activity?.user})`;
    res[`${PREFIX}grupopermissao`] = activity?.group;
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
    [`${PREFIX}Uso@odata.bind`]: item?.use
      ? `/${TAG}(${item?.use?.value})`
      : null,
  };
};

export const buildItemPeople = (item) => {
  return {
    id: item.id,
    deleted: item.deleted,
    [`${PREFIX}Pessoa@odata.bind`]: item?.person?.value
      ? `/${PERSON}(${item?.person?.value})`
      : null,
    [`${PREFIX}Funcao@odata.bind`]: item?.function?.value
      ? `/${TAG}(${item?.function?.value})`
      : null,
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
      item?.function?.value || item?.[`_${PREFIX}funcao_value`]
        ? `/${TAG}(${
            item?.function?.value || item?.[`_${PREFIX}funcao_value`]
          })`
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
  const res = {
    id: item.id,
    // deleted: item.deleted,
    [`${PREFIX}descricao`]: item.description,
    [`${PREFIX}prazominimo`]: +String(item.deadline)?.replace(/\D/g, ''),
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

  if (item?.teamId) {
    res[`${PREFIX}Turma@odata.bind`] = `/${TEAM}(${item?.teamId})`;
  }

  if (item?.scheduleId) {
    res[
      `${PREFIX}CronogramaDia@odata.bind`
    ] = `/${SCHEDULE_DAY}(${item?.scheduleId})`;
  }

  return res;
};
