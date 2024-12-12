const buildText = (f, field, criteria, value) => {
    switch (criteria) {
        case 'eq':
        case 'ne':
            f.filterExpression(field, criteria, value);
            break;
        case 'contains':
            f.filterPhrase(`contains(${field},'${value}')`);
            break;
    }
};
const buildChildText = (f, parent, property, criteria, value) => {
    switch (criteria) {
        case 'eq':
        case 'ne':
            f.filterPhrase(`${parent}/any(c: c/${property} ${criteria} '${value}')`);
            break;
        case 'contains':
            f.filterPhrase(`${parent}/any(c: contains(c/${property},'${value}'))`);
            break;
    }
};
export default { buildText, buildChildText };
//# sourceMappingURL=index.js.map