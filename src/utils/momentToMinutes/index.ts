import { Moment } from 'moment';

export default (date: Moment) => {
  const hour = date?.hours() || 0;
  const min = date?.minutes() || 0;
  const sec = date?.seconds() || 0;

  return hour * 60 + min + sec / 60;
};
