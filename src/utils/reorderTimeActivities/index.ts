import { PREFIX } from '~/config/database';
import momentToMinutes from '../momentToMinutes';
import * as moment from 'moment';

export default (startDateTime: moment.Moment, list: any[]) => {
  try {
    let lastTime = startDateTime.clone();

    return list?.map((actv) => {
      let durationMoment = actv.duration;

      if (!durationMoment) {
        moment(actv?.[`${PREFIX}duracao`]);
      }

      if (typeof actv.duration === 'string') {
      }

      const duration = momentToMinutes(durationMoment);
      const endTime = lastTime.clone().add(duration, 'm');

      const result = {
        ...actv,
        startTime: lastTime,
        endTime,
        startDate: lastTime.format(),
        endDate: endTime.format(),
        [`${PREFIX}inicio`]: lastTime.format('HH:mm'),
        [`${PREFIX}fim`]: endTime.format('HH:mm'),
        [`${PREFIX}datahorainicio`]: lastTime.format(),
        [`${PREFIX}datahorafim`]: endTime.format(),
      };

      lastTime = endTime;

      return result;
    });
  } catch (err) {
    console.error(err);
  }
};
