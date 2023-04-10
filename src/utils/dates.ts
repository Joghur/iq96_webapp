import moment from 'moment';
import 'moment/locale/da';
// import 'moment-timezone';

export const convertEpochSecondsToDateString = (
  epochSeconds: number,
  format = 'D/MMMM-YYYY HH:mm',
) => {
  moment.locale('da');
  return moment(epochSeconds * 1000).format(format);
};

export const fromNow = (epochSeconds: number) => {
  return moment(epochSeconds * 1000).fromNow();
};

export const dayDiff = (epochSeconds: number) => {
  const epoch = epochSeconds * 1000;
  return moment(epoch).diff(moment(new Date()), 'days');
};
