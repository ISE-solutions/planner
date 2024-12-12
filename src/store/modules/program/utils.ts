import { QueryBuilder } from 'odata-query-builder';
import { PREFIX, PERSON, TAG } from '~/config/database';
import { EGroups } from '~/config/enums';
import buildTextOdataFilter from '~/utils/buildTextOdataFilter';

export enum TYPE_PROGRAM_FILTER {
  TODOS,
  PROGRAMA,
  RESERVA,
}
export interface IFilterProps {
  searchQuery?: string;
  deleted?: boolean;
  startDeleted?: moment.Moment;
  endDeleted?: moment.Moment;
  active?: 'Todos' | 'Ativo' | 'Inativo';
  published?: 'Todos' | 'Sim' | 'Não';
  type?: TYPE_PROGRAM_FILTER;
  order?: 'desc' | 'asc';
  orderBy?: string;
  createdBy?: string;
  group?: EGroups;
  rowsPerPage?: number;
  model?: boolean;
  typeProgram?: string;
  nameProgram?: string;
  institute?: string;
  company?: string;
}

export const buildQuery = (filtro: IFilterProps) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');

    // tslint:disable-next-line: no-unused-expression
    filtro?.searchQuery &&
      f.or((p) => {
        p.filterPhrase(`contains(${PREFIX}titulo,'${filtro.searchQuery}')`);
        p.filterPhrase(`contains(${PREFIX}sigla,'${filtro.searchQuery}')`);

        p.filterPhrase(
          `contains(${PREFIX}NomePrograma/${PREFIX}nome,'${filtro.searchQuery}')`
        );

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
      f.filterExpression(
        `${PREFIX}publicado`,
        'eq',
        filtro.published === 'Sim'
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.typeProgram &&
      f.filterExpression(
        `${PREFIX}TipoPrograma/${PREFIX}etiquetaid`,
        'eq',
        filtro.typeProgram
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.nameProgram &&
      f.filterExpression(
        `${PREFIX}NomePrograma/${PREFIX}etiquetaid`,
        'eq',
        filtro.nameProgram
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.institute &&
      f.filterExpression(
        `${PREFIX}Instituto/${PREFIX}etiquetaid`,
        'eq',
        filtro.institute
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.company &&
      f.filterExpression(
        `${PREFIX}Empresa/${PREFIX}etiquetaid`,
        'eq',
        filtro.company
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.createdBy &&
      f.filterExpression(
        `${PREFIX}CriadoPor/${PREFIX}pessoaid`,
        'eq',
        filtro.createdBy
      );

    if (filtro.type === TYPE_PROGRAM_FILTER.RESERVA) {
      f.filterExpression(`${PREFIX}ehreserva`, 'eq', true);
    }

    if (!filtro.type || filtro.type === TYPE_PROGRAM_FILTER.PROGRAMA) {
      f.filterExpression(`${PREFIX}ehreserva`, 'eq', false);
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

    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  } else {
    query.orderBy(`createdon desc`);
  }

  query.expand(
    `${PREFIX}TipoPrograma,${PREFIX}NomePrograma,${PREFIX}Instituto,${PREFIX}Empresa,${PREFIX}Temperatura,${PREFIX}ResponsavelpeloPrograma,${PREFIX}Programa_NomePrograma,${PREFIX}Programa_PessoasEnvolvidas,${PREFIX}Programa_Turma,${PREFIX}ise_turmasrelacionadas_Programa_ise_progr,${PREFIX}Programa_Compartilhamento`
  );

  query.count();
  return query.toQuery();
};

export const buildAdvancedQuery = (filtro: any[]) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');
    f.filterExpression(`${PREFIX}ativo`, 'eq', true);
    f.filterExpression(`${PREFIX}modelo`, 'eq', false);
    f.filterExpression(`${PREFIX}ehreserva`, 'eq', false);
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
          `${PREFIX}NomePrograma/${PREFIX}nome`,
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

      if (field.value === 'temperatura') {
        f.filterPhrase(
          `${PREFIX}Temperatura/${PREFIX}etiquetaid eq '${value.value}'`
        );
      }

      if (field.value === 'pessoaenvolvida') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}Programa_PessoasEnvolvidas/any(c: c/${PREFIX}Pessoa/${PREFIX}pessoaid eq '${sp.value}')`
            )
          );

          return p;
        });
      }

      if (field.value === 'funcaoenvolvida') {
        f.or((p) => {
          value.forEach((sp) =>
            p.filterPhrase(
              `${PREFIX}Programa_PessoasEnvolvidas/any(c: c/${PREFIX}Funcao/${PREFIX}etiquetaid eq '${sp.value}')`
            )
          );

          return p;
        });
      }
    });

    return f;
  });

  query.expand(
    `${PREFIX}TipoPrograma,${PREFIX}NomePrograma,${PREFIX}Instituto,${PREFIX}Empresa,${PREFIX}Temperatura,${PREFIX}ResponsavelpeloPrograma,${PREFIX}Programa_NomePrograma,${PREFIX}Programa_PessoasEnvolvidas,${PREFIX}Programa_Turma,${PREFIX}ise_turmasrelacionadas_Programa_ise_progr,${PREFIX}Programa_Compartilhamento`
  );

  query.count();
  return query.toQuery();
};

export const buildItem = (program) => {
  const res = {
    [`${PREFIX}titulo`]: program?.title,
    [`${PREFIX}sigla`]: program?.sigla,
    [`${PREFIX}modelo`]: program?.model,
    [`${PREFIX}ehreserva`]: program?.isReserve,
    [`${PREFIX}anexossincronizados`]: program.anexossincronizados,
    [`${PREFIX}modeloid`]: program.modeloid,
    [`${PREFIX}observacao`]: program?.description,
    [`${PREFIX}TipoPrograma@odata.bind`]:
      program?.typeProgram && `/${TAG}(${program?.typeProgram?.value})`,
    [`${PREFIX}NomePrograma@odata.bind`]:
      program?.nameProgram && `/${TAG}(${program?.nameProgram?.value})`,
    [`${PREFIX}Instituto@odata.bind`]:
      program?.institute && `/${TAG}(${program?.institute?.value})`,
    [`${PREFIX}Empresa@odata.bind`]:
      program?.company && `/${TAG}(${program?.company?.value})`,
    [`${PREFIX}ResponsavelpeloPrograma@odata.bind`]:
      program?.responsible && `/${PERSON}(${program?.responsible?.value})`,
    [`${PREFIX}Temperatura@odata.bind`]:
      program?.temperature && `/${TAG}(${program?.temperature?.value})`,
  };

  if (!program?.id) {
    res[`${PREFIX}CriadoPor@odata.bind`] =
      program?.user && `/${PERSON}(${program?.user})`;
    res[`${PREFIX}grupopermissao`] = program?.group;
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

export const buildItemPeople = (item, pos) => {
  return {
    id: item.id,
    deleted: item.deleted,
    [`${PREFIX}ordem`]: pos,
    [`${PREFIX}obrigatorio`]: item?.isRequired,
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
  };
};
