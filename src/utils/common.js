import moment from "moment";

export const Key = {
  ENTER: `Enter`,
  ESC: `Escape`,
  ESC_SHORT: `Esc`,
  MOUSE_LEFT: 0
};

export const getRandomElement = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

export const getRandomNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

export const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

export const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(date, dueDate);
};

export const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};
