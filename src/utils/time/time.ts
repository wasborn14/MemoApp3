export const startTodayDate = () => {
  const now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  return now;
};

export const endTodayDate = () => {
  const now = new Date();
  now.setHours(23);
  now.setMinutes(59);
  now.setSeconds(59);
  return now;
};

export const sameDate = (firstDate: Date, secondDate: Date): boolean => {
  if (firstDate.getFullYear() == secondDate.getFullYear()) {
    if (firstDate.getMonth() == secondDate.getMonth()) {
      if (firstDate.getDate() == secondDate.getDate()) {
        return true;
      }
    }
  }
  return false;
};

// export const convertSeconds = (hours: number, minutes: number, seconds: number) => {
//   return hours * 60 * 60 + minutes * 60 + seconds;
// };
