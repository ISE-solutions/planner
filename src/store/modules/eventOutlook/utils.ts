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
    `${PREFIX}Entrega,${PREFIX}Programa,${PREFIX}Turma,${PREFIX}Grupo,${PREFIX}Atividade,${PREFIX}tarefas_responsaveis_ise_pessoa`
  );

  query.count();
  return query.toQuery();
};

export const buildItem = (item) => {
  const res = {
    Tipo: item?.action,
    Assunto: item?.title,
    HorarioInicio: item?.start,
    HorarioFim: item?.end,
    Email: item?.email,
    IDRecurso: item?.resourceId,
    IDAtividade: item?.activity?.[`${PREFIX}atividadeid`] || item?.activityId,
    IDEvento: item?.eventId,
  };

  return res;
};
