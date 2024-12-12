import { Moment } from 'moment';
import { QueryBuilder } from 'odata-query-builder';
import { PREFIX } from '~/config/database';
import { TYPE_RESOURCE } from '~/config/enums';

export interface IFilterProps {
  searchQuery?: string;
  deleted?: boolean;
  startDeleted?: Moment;
  endDeleted?: Moment;
  active?: 'Todos' | 'Ativo' | 'Inativo';
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
        p.filterPhrase(
          `contains(${PREFIX}Tipo/${PREFIX}nome,'${filtro.searchQuery}')`
        );

        if (parseInt(filtro.searchQuery)) {
          p.filterExpression(
            `${PREFIX}limitacao`,
            'eq',
            parseInt(filtro.searchQuery)
          );
          p.filterExpression(
            `${PREFIX}quantidade`,
            'eq',
            parseInt(filtro.searchQuery)
          );
        }

        return p;
      });

    if (filtro.typeResource) {
      f.filterExpression(`${PREFIX}tiporecurso`, 'eq', filtro.typeResource);
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

    // tslint:disable-next-line: no-unused-expression
    filtro.active &&
      filtro.active !== 'Todos' &&
      f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');

    f.filterExpression(`${PREFIX}excluido`, 'eq', Boolean(filtro.deleted));

    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  } else {
    query.orderBy(`${PREFIX}nome asc`);
  }

  if (filtro.top) {
    query.top(filtro.top);
  }

  query.expand(`${PREFIX}Tipo`);

  query.count();
  return query.toQuery();
};
