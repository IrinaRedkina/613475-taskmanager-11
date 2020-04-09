const getRandomElement = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

const getRandomNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export {getRandomNumber, formatTime, getRandomElement};
