export default (
  value: string,
  valueToCompair: string,
  criteria: string
): boolean => {
  switch (criteria) {
    case 'eq':
      return parseInt(value) === parseInt(valueToCompair);
    case 'gt':
      return parseInt(value) >= parseInt(valueToCompair);
    case 'lt':
      return parseInt(value) <= parseInt(valueToCompair);
  }
};
