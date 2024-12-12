export const buildItem = (item) => {
    const res = {
        Origem: item === null || item === void 0 ? void 0 : item.origin,
        IDOrigem: item === null || item === void 0 ? void 0 : item.idOrigin,
        IDPessoa: item === null || item === void 0 ? void 0 : item.idPerson,
    };
    return res;
};
//# sourceMappingURL=utils.js.map