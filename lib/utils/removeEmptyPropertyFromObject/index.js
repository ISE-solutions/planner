export default (obj) => {
    var _a;
    const newObj = Object.assign({}, obj);
    // @ts-ignore
    return Object.fromEntries((_a = Object.entries(newObj)) === null || _a === void 0 ? void 0 : _a.filter(([_, v]) => v != null));
};
//# sourceMappingURL=index.js.map