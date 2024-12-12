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

export interface IFilterResourceProps {
  searchQuery?: string;
  active?: 'Todos' | 'Ativo' | 'Inativo';
  order?: 'desc' | 'asc';
  deleted?: boolean;
  filterDeleted?: boolean;
  programId?: string;
  teamId?: string;
  scheduleId?: string;
  activityId?: string;
  orderBy?: string;
  rowsPerPage?: number;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  dayDate?: moment.Moment;
  people?: any[];
  spaces?: any[];
}

export const buildQuery = (
  filtro: IFilterResourceProps = { filterDeleted: true }
) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');

    if (filtro.programId) {
      f.filterExpression(
        `${PREFIX}Programa/${PREFIX}programaid`,
        'eq',
        filtro.programId
      );
    }
    if (filtro.teamId) {
      f.filterExpression(
        `${PREFIX}Turma/${PREFIX}turmaid`,
        'eq',
        filtro.teamId
      );
    }

    if (filtro.scheduleId) {
      f.filterExpression(
        `${PREFIX}CronogramaDia/${PREFIX}cronogramadediaid`,
        'eq',
        filtro.scheduleId
      );
    }

    if (filtro.activityId) {
      f.filterExpression(
        `${PREFIX}Atividade/${PREFIX}atividadeid`,
        'eq',
        filtro.activityId
      );
    }

    // tslint:disable-next-line: no-unused-expression
    if (filtro?.people?.length || filtro?.spaces?.length) {
      f.or((p) => {
        filtro?.people?.forEach((item) => {
          p.filterExpression(
            `${PREFIX}Pessoa/${PREFIX}pessoaid`,
            'eq',
            item.value
          );
        });

        filtro?.spaces?.forEach((item) => {
          p.filterExpression(
            `${PREFIX}Espaco/${PREFIX}espacoid`,
            'eq',
            item.value
          );
        });

        if (filtro.startDate && filtro.endDate) {
          f.filterPhrase(
            `${PREFIX}inicio gt '${filtro.startDate
              .startOf('month')
              .format('YYYY-MM-DD')}' and ${PREFIX}inicio lt '${filtro.endDate
              .endOf('month')
              .format('YYYY-MM-DD')}'`
          );
        }

        if (filtro.dayDate) {
          f.filterPhrase(
            `${PREFIX}inicio gt '${filtro.dayDate.format(
              'YYYY-MM-DD'
            )}' and ${PREFIX}fim lt '${filtro.dayDate
              .add(1, 'day')
              .format('YYYY-MM-DD')}'`
          );
        }

        if (filtro.filterDeleted) {
          f.filterExpression(
            `${PREFIX}excluido`,
            'eq',
            Boolean(filtro.deleted)
          );
        }

        return p;
      });
    }

    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  }

  query.expand(
    `${PREFIX}Programa,${PREFIX}Turma,${PREFIX}Espaco,${PREFIX}Pessoa,${PREFIX}Atividade,${PREFIX}Recurso_RecursoFinitoeInfinito,${PREFIX}CronogramaDia`
  );

  query.count();
  return query.toQuery();
};

export const buildItem = (item) => {
  return {
    [`${PREFIX}Espaco@odata.bind`]:
      item?.[`${PREFIX}espacoid`] &&
      `/${SPACE}(${item?.[`${PREFIX}espacoid`]})`,
    [`${PREFIX}Pessoa@odata.bind`]:
      item?.[`_${PREFIX}pessoa_value`] &&
      `/${PERSON}(${item?.[`_${PREFIX}pessoa_value`]})`,
    [`${PREFIX}Recurso_RecursoFinitoeInfinito@odata.bind`]:
      item?.resourceFiniteInfiniteId &&
      `/${FINITE_INFINITE_RESOURCES}(${item?.resourceFiniteInfiniteId})`,
    [`${PREFIX}Atividade@odata.bind`]:
      item?.activityId && `/${ACTIVITY}(${item?.activityId})`,
    [`${PREFIX}Programa@odata.bind`]:
      item?.programId && `/${PROGRAM}(${item?.programId})`,
    [`${PREFIX}Turma@odata.bind`]: item?.teamId && `/${TEAM}(${item?.teamId})`,
    [`${PREFIX}CronogramaDia@odata.bind`]:
      item?.scheduleId && `/${SCHEDULE_DAY}(${item?.scheduleId})`,
    [`${PREFIX}inicio`]: item.startDate && moment(item.startDate).format(),
    [`${PREFIX}fim`]: item.endDate && moment(item.endDate).format(),
    [`${PREFIX}criarevento`]: item.createInvite,
    [`${PREFIX}notificado`]: false,
  };
};
