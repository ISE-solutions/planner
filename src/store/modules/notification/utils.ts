import * as moment from 'moment';
import { QueryBuilder } from 'odata-query-builder';
import {
  ACTIVITY,
  FINITE_INFINITE_RESOURCES,
  PERSON,
  PREFIX,
  PROGRAM,
  SCHEDULE_DAY,
  SPACE,
  TEAM,
} from '~/config/database';

export interface IFilterProps {
  pessoaId: string;
  searchQuery?: string;
  active?: 'Todos' | 'Ativo' | 'Inativo';
  order?: 'desc' | 'asc';
  orderBy?: string;
  rowsPerPage?: number;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  dayDate?: moment.Moment;
  people?: any[];
  spaces?: any[];
}

export const buildQuery = (filtro: IFilterProps) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');

    f.filterExpression(
      `${PREFIX}Pessoa/${PREFIX}pessoaid`,
      'eq',
      filtro?.pessoaId
    );
    f.filterExpression(`${PREFIX}lido`, 'eq', false);

    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  } else {
    query.orderBy(`createdon desc`);
  }

  query.expand(`${PREFIX}Pessoa`);

  query.count();
  return query.toQuery();
};

export const buildItem = (item) => {
  return {
    [`${PREFIX}titulo`]: item.title,
    [`${PREFIX}link`]: item.link,
    [`${PREFIX}descricao`]: item.description,
    [`${PREFIX}Pessoa@odata.bind`]: item?.pessoaId
      ? `/${PERSON}(${item?.pessoaId})`
      : null,
  };
};

export const truncateString = (string, maxLength) => {
  if (string.length <= maxLength) {
    return string;
  } else {
    return string.slice(0, maxLength - 3) + '...';
  }
};
