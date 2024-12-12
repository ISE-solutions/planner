export default (en, value) => {
    // @ts-ignore
    return Object.keys(en)[Object.values(en).findIndex((x) => x === value)];
};
//# sourceMappingURL=index.js.map