import FilterBuilder from 'odata-query-builder';

const buildText = (
  f: FilterBuilder,
  field: string,
  criteria: string,
  value: string
) => {
  switch (criteria) {
    case 'eq':
    case 'ne':
      f.filterExpression(field, criteria, value);
      break;
    case 'contains':
      f.filterPhrase(`contains(${field},'${value}')`);
      break;
  }
};
const buildChildText = (
  f: FilterBuilder,
  parent: string,
  property: string,
  criteria: string,
  value: string
) => {
  switch (criteria) {
    case 'eq':
    case 'ne':
      f.filterPhrase(`${parent}/any(c: c/${property} ${criteria} '${value}')`);
      break;
    case 'contains':
      f.filterPhrase(`${parent}/any(c: contains(c/${property},'${value}'))`);
      break;
  }
};

export default { buildText, buildChildText };
