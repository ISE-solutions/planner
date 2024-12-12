export default (value, valueToCompair, criteria) => {
    switch (criteria) {
        case 'eq':
            return parseInt(value) === parseInt(valueToCompair);
        case 'gt':
            return parseInt(value) >= parseInt(valueToCompair);
        case 'lt':
            return parseInt(value) <= parseInt(valueToCompair);
    }
};
//# sourceMappingURL=index.js.map