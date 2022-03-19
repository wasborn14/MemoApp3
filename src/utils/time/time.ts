export const formatToday = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = date.getDay();
  const dayOfWeekStr = ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek];
  return year + '年' + month + '月' + day + '日' + ' (' + dayOfWeekStr + ') ';
};

// Dateはそのまま代入すると参照渡しになってしまう
// const localNow = new Date().toLocaleString();日本時間に直す方法

export const convertSecToTime = (sec: number): string => {
  const hour = Math.floor(sec / 3600);
  const min = Math.floor((sec % 3600) / 60);
  const rem = sec % 60;

  if (hour === 0) {
    if (min === 0) {
      return `${rem}秒`;
    } else {
      return `${min}分${rem}秒`;
    }
  } else {
    return `${hour}時間${min}分${rem}秒`;
  }
};

export const startDate = (date: Date) => {
  const startDate = new Date(date.getTime());
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  return startDate;
};

export const nextDate = (date: Date) => {
  const nextDate = new Date(date.getTime());
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate;
};

export const startNextDate = (date: Date) => {
  const startNextDate = date;
  startNextDate.setHours(0);
  startNextDate.setMinutes(0);
  startNextDate.setSeconds(0);
  return startNextDate;
};

export const endDate = (date: Date) => {
  const endDate = date;
  endDate.setHours(23);
  endDate.setMinutes(59);
  endDate.setSeconds(59);
  return endDate;
};

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

export const isSameDate = (firstDate: Date, secondDate: Date): boolean => {
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
