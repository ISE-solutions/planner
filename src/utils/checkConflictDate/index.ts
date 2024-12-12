import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

const locale = 'pt-BR';
const moment = extendMoment(Moment);

moment.locale(locale);

export default (
  rangeDate1: [Date | Moment.Moment, Date | Moment.Moment],
  rangeDate2: [Date | Moment.Moment, Date | Moment.Moment]
) => {
  var range = moment.range(rangeDate1);
  var range2 = moment.range(rangeDate2);

  return range.overlaps(range2);
};
