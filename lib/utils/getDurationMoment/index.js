import * as moment from 'moment';
export default (startDate, endDate) => {
    const duration = moment.duration(endDate.diff(startDate));
    const hours = duration.hours();
    const minutes = duration.minutes() % 60;
    return moment(`${hours}:${minutes}`, 'HH:mm');
};
//# sourceMappingURL=index.js.map