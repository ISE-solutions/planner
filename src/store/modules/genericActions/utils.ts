export const buildItem = (item) => {
  const res = {
    Origem: item?.origin,
    IDOrigem: item?.idOrigin,
    IDPessoa: item?.idPerson,
  };

  return res;
};
