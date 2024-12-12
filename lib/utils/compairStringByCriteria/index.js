export default (value, valueToCompair, criteria) => {
    var _a;
    switch (criteria) {
        case 'eq':
            return (value === null || value === void 0 ? void 0 : value.toLocaleLowerCase()) === (valueToCompair === null || valueToCompair === void 0 ? void 0 : valueToCompair.toLocaleLowerCase());
        case 'ne':
            return (value === null || value === void 0 ? void 0 : value.toLocaleLowerCase()) !== (valueToCompair === null || valueToCompair === void 0 ? void 0 : valueToCompair.toLocaleLowerCase());
        case 'contains':
            return (_a = value === null || value === void 0 ? void 0 : value.toLocaleLowerCase()) === null || _a === void 0 ? void 0 : _a.includes(valueToCompair === null || valueToCompair === void 0 ? void 0 : valueToCompair.toLocaleLowerCase());
    }
};
//# sourceMappingURL=index.js.map