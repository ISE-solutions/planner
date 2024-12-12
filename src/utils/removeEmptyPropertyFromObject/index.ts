export default (obj) => {
  const newObj = { ...obj };

  // @ts-ignore
  return Object.fromEntries(
    Object.entries(newObj)?.filter(([_, v]) => v != null)
  );
};
