import * as moment from 'moment';

export default (
  value: string,
  valueToCompair: string,
  criteria: string
): boolean => {
  if (!value || !valueToCompair) return false;

  const dateValue = moment(value);
  const dateValueToCompair = moment(valueToCompair);

  switch (criteria) {
    case 'lt':
      return dateValue.isSameOrBefore(dateValueToCompair);
    case 'gt':
      return dateValue.isSameOrAfter(dateValueToCompair);
  }
};
