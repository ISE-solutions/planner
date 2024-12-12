import { Moment } from 'moment';
import { QueryBuilder } from 'odata-query-builder';
import { PERSON, PREFIX, TAG } from '~/config/database';

export interface IFilterProps {
  searchQuery?: string;
  deleted?: boolean;
  startDeleted?: Moment;
  endDeleted?: Moment;
  active?: 'Todos' | 'Ativo' | 'Inativo';
  order?: 'desc' | 'asc';
  type?: string;
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
        p.filterPhrase(`contains(${PREFIX}nomeen,'${filtro.searchQuery}')`);
        p.filterPhrase(`contains(${PREFIX}nomees,'${filtro.searchQuery}')`);
        p.filterPhrase(`contains(${PREFIX}email,'${filtro.searchQuery}')`);

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

    // tslint:disable-next-line: no-unused-expression
    filtro.type &&
      f.filterExpression(`${PREFIX}Etiqueta/${PREFIX}tipo`, 'eq', filtro.type);
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

  query.expand(
    `${PREFIX}Espaco_Etiqueta_Etiqueta,${PREFIX}Espaco_PessoasEnvolvidas,${PREFIX}Espaco_NomeEspaco,${PREFIX}Espaco_CapacidadeEspaco,${PREFIX}Espaco_PessoasEnvolvidas,${PREFIX}Proprietario`
  );

  query.count();
  return query.toQuery();
};

export const buildItem = (space) => {
  return {
    [`${PREFIX}nome`]: space.name,
    [`${PREFIX}nomeen`]: space.nameEn,
    [`${PREFIX}nomees`]: space.nameEs,
    [`${PREFIX}email`]: space.email,
    [`${PREFIX}observacao`]: space.description,
    [`${PREFIX}Proprietario@odata.bind`]:
      space.owner && `/${PERSON}(${space?.owner?.value})`,
  };
};

export const buildItemPeople = (item) => {
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
  };
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

export const buildItemCapacity = (item) => {
  return {
    id: item.id,
    deleted: item.deleted,
    [`${PREFIX}quantidade`]: item.quantity,
    [`${PREFIX}Uso@odata.bind`]: item?.use
      ? `/${TAG}(${item?.use?.value})`
      : null,
  };
};
