import { Moment } from 'moment';
import { QueryBuilder } from 'odata-query-builder';
import { PREFIX } from '~/config/database';

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
}

export const buildQuery = (filtro: IFilterProps) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');

    // tslint:disable-next-line: no-unused-expression
    filtro?.searchQuery &&
      f.or((p) => {
        p.filterPhrase(`contains(${PREFIX}nome,'${filtro.searchQuery}')`);
        p.filterPhrase(`contains(${PREFIX}sobrenome,'${filtro.searchQuery}')`);
        p.filterPhrase(
          `contains(${PREFIX}nomepreferido,'${filtro.searchQuery}')`
        );
        p.filterPhrase(`contains(${PREFIX}email,'${filtro.searchQuery}')`);
        p.filterPhrase(
          `contains(${PREFIX}emailsecundario,'${filtro.searchQuery}')`
        );
        p.filterPhrase(`contains(${PREFIX}celular,'${filtro.searchQuery}')`);

        p.filterPhrase(
          `contains(${PREFIX}EscolaOrigem/${PREFIX}nome,'${filtro.searchQuery}')`
        );
        p.filterPhrase(
          `contains(${PREFIX}Titulo/${PREFIX}nome,'${filtro.searchQuery}')`
        );

        return p;
      });

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

  // query.select(
  //   `${PREFIX}id,${PREFIX}nome,${PREFIX}sobrenome,${PREFIX}nomepreferido,${PREFIX}email,${PREFIX}emailsecundario,${PREFIX}celular,${PREFIX}escolaorigem,${PREFIX}ativo`
  // );
  query.expand(
    `${PREFIX}Titulo,${PREFIX}Pessoa_Etiqueta_Etiqueta,${PREFIX}EscolaOrigem,${PREFIX}AreaResponsavel,${PREFIX}Pessoa_AreaResponsavel`
  );

  if (filtro.top) {
    query.top(filtro.top);
  }

  query.count();
  return query.toQuery();
};
