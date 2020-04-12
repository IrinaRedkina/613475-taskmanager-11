import {COLORS} from "../const.js";
import {getRandomNumber, getRandomElement} from '../util';

const INITIAL_TASK = {
  color: `black`,
  description: ``,
  dueDate: null,
  repeatingDays: {}
};

const DescriptionItems = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

const DefaultRepeatingDays = {
  'mo': false,
  'tu': false,
  'we': false,
  'th': false,
  'fr': false,
  'sa': false,
  'su': false
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValues = sign * getRandomNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValues);

  return targetDate;
};

const generateRepeatingDays = () => {
  return Object.assign({}, DefaultRepeatingDays, {
    'mo': Math.random() > 0.5,
    'tu': Math.random() > 0.5,
    'we': Math.random() > 0.5,
    'th': Math.random() > 0.5,
    'fr': Math.random() > 0.5,
    'sa': Math.random() > 0.5,
    'su': Math.random() > 0.5
  });
};

const generateTask = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();

  return {
    color: getRandomElement(COLORS),
    description: getRandomElement(DescriptionItems),
    dueDate,
    repeatingDays: dueDate ? DefaultRepeatingDays : generateRepeatingDays(),
    isArchive: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5
  };
};

const generateTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTask);
};

export {generateTasks, generateTask, INITIAL_TASK};
