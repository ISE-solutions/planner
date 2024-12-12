export default (
  value: string,
  valueToCompair: string,
  criteria: string
): boolean => {
  switch (criteria) {
    case 'eq':
      return value?.toLocaleLowerCase() === valueToCompair?.toLocaleLowerCase();
    case 'ne':
      return value?.toLocaleLowerCase() !== valueToCompair?.toLocaleLowerCase();
    case 'contains':
      return value
        ?.toLocaleLowerCase()
        ?.includes(valueToCompair?.toLocaleLowerCase());
  }
};
