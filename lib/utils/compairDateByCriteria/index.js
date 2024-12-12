import * as moment from 'moment';
export default (value, valueToCompair, criteria) => {
    if (!value || !valueToCompair)
        return false;
    const dateValue = moment(value);
    const dateValueToCompair = moment(valueToCompair);
    switch (criteria) {
        case 'lt':
            return dateValue.isSameOrBefore(dateValueToCompair);
        case 'gt':
            return dateValue.isSameOrAfter(dateValueToCompair);
    }
};
//# sourceMappingURL=index.js.map