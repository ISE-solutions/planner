import { PREFIX } from '~/config/database';
import momentToMinutes from '../momentToMinutes';
import * as moment from 'moment';
export default (startDateTime, list) => {
    try {
        let lastTime = startDateTime.clone();
        return list === null || list === void 0 ? void 0 : list.map((actv) => {
            let durationMoment = actv.duration;
            if (!durationMoment) {
                moment(actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}duracao`]);
            }
            if (typeof actv.duration === 'string') {
            }
            const duration = momentToMinutes(durationMoment);
            const endTime = lastTime.clone().add(duration, 'm');
            const result = Object.assign(Object.assign({}, actv), { startTime: lastTime, endTime, startDate: lastTime.format(), endDate: endTime.format(), [`${PREFIX}inicio`]: lastTime.format('HH:mm'), [`${PREFIX}fim`]: endTime.format('HH:mm'), [`${PREFIX}datahorainicio`]: lastTime.format(), [`${PREFIX}datahorafim`]: endTime.format() });
            lastTime = endTime;
            return result;
        });
    }
    catch (err) {
        console.error(err);
    }
};
//# sourceMappingURL=index.js.map