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
