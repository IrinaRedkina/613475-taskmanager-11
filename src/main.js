import {createMenuTemplate} from './components/menu.js';
import {createBoardTemplate} from './components/board.js';

import {createFilterTemplate} from './components/filter.js';
import {generateFilters} from './mock/filter';

import {createEditTaskTemplate} from './components/edit-task.js';
import {createTaskTemplate} from './components/task.js';
import {generateTasks} from './mock/task.js';

import {createLoadMoreButtonTemplate} from './components/load-more-button.js';

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(tasks);

const renderElement = (container, template, place = `beforeEnd`) => {
  container.insertAdjacentHTML(place, template);
};

const renderTasks = (startTask, endTask) => {
  tasks.slice(startTask, endTask)
  .forEach((task) => renderElement(boardListElement, createTaskTemplate(task)));
};

const siteMainContainer = document.querySelector(`.main`);
const siteMenuContainer = siteMainContainer.querySelector(`.main__control`);

renderElement(siteMenuContainer, createMenuTemplate());
renderElement(siteMainContainer, createFilterTemplate(filters));
renderElement(siteMainContainer, createBoardTemplate());

const boardElement = siteMainContainer.querySelector(`.board`);
const boardListElement = boardElement.querySelector(`.board__tasks`);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

renderElement(boardListElement, createEditTaskTemplate(tasks[0]));

renderTasks(1, showingTasksCount);

renderElement(boardElement, createLoadMoreButtonTemplate());

const loadButton = document.querySelector(`.load-more`);

const removeLoadButton = () => {
  if (showingTasksCount >= tasks.length) {
    loadButton.remove();
  }
};

removeLoadButton();

loadButton.addEventListener(`click`, () => {
  const prevTaskCount = showingTasksCount;
  showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

  renderTasks(prevTaskCount, showingTasksCount);
  removeLoadButton();
});
