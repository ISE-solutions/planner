import { QueryBuilder } from 'odata-query-builder';
import { ACTIVITY, PREFIX, PROGRAM, TAG, TEAM } from '~/config/database';
import { STATUS_TASK, TYPE_RESOURCE } from '~/config/enums';

export interface IFilterProps {
  searchQuery?: string;
  teamId?: string;
  programId?: string;
  sequence?: number;
  status?: STATUS_TASK[];
  order?: 'desc' | 'asc';
  orderBy?: string;
  rowsPerPage?: number;
  top?: number;
  typeResource?: TYPE_RESOURCE.FINITO | TYPE_RESOURCE.INFINITO;
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

    // tslint:disable-next-line: no-unused-expression
    filtro?.teamId &&
      f.filterExpression(
        `${PREFIX}Turma/${PREFIX}turmaid`,
        'eq',
        filtro?.teamId
      );

    // tslint:disable-next-line: no-unused-expression
    filtro?.programId &&
      f.filterExpression(
        `${PREFIX}Programa/${PREFIX}programaid`,
        'eq',
        filtro?.programId
      );

    if (filtro?.status && filtro.status.length) {
      f.or((p) => {
        filtro.status.forEach((st) => {
          p.filterExpression(`statuscode`, 'eq', st);
        });

        return p;
      });
    }

    // tslint:disable-next-line: no-unused-expression
    filtro.sequence &&
      f.filterExpression(`${PREFIX}sequencia`, 'eq', filtro.sequence);

    f.filterExpression(`${PREFIX}excluido`, 'eq', false);

    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  } else {
    query.orderBy(`createdon desc`);
  }

  if (filtro.top) {
    query.top(filtro.top);
  }

  query.expand(
    `${PREFIX}Programa,${PREFIX}Turma,${PREFIX}Grupo,${PREFIX}Atividade,${PREFIX}tarefas_responsaveis_ise_pessoa`
  );

  query.count();
  return query.toQuery();
};

export const buildItem = (item) => {
  const res = {
    [`${PREFIX}nome`]: item.title,
    [`${PREFIX}tipo`]: item.type,
    [`${PREFIX}Grupo@odata.bind`]: item.group
      ? `/${TAG}(${item?.group?.value})`
      : null,
    statuscode: item.status,
    [`${PREFIX}prioridade`]: item.priority,
    [`${PREFIX}previsaodeconclusao`]: item.completionForecast,
    [`${PREFIX}dataconclusao`]: item.concludedDay,
    [`${PREFIX}datadeinicio`]: item.startDay,
    [`${PREFIX}link`]: item.link,
    [`${PREFIX}tipo`]: item.type,
    [`${PREFIX}observacao`]: item.observation,
  };

  if (item?.sequence) {
    res[`${PREFIX}sequencia`] = item.sequence;
  }

  if (item?.teamId) {
    res[`${PREFIX}Turma@odata.bind`] = `/${TEAM}(${item?.teamId})`;
  }

  if (item?.programId) {
    res[`${PREFIX}Programa@odata.bind`] = `/${PROGRAM}(${item?.programId})`;
  }

  if (item?.activityId) {
    res[`${PREFIX}Atividade@odata.bind`] = `/${ACTIVITY}(${item?.activityId})`;
  }

  return res;
};
