import {createMenuTemplate} from './components/menu.js';
import {createBoardTemplate} from './components/board.js';
import {createSortingTemplate} from './components/sorting.js';

import {generateFilters} from './mock/filter';
import {createFilterTemplate} from './components/filter.js';

import {generateTasks} from './mock/task.js';
import {createTasksTemplate} from './components/tasks.js';
import {createTaskTemplate} from './components/task.js';
import {createEditTaskTemplate} from './components/edit-task.js';
import {createNoTasksTemplate} from './components/no-tasks.js';

import {createLoadMoreButtonTemplate} from './components/load-more-button.js';

const TASK_COUNT = 20;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(tasks);

const renderElement = (container, template, place = `beforeEnd`) => {
  container.insertAdjacentHTML(place, template);
};

const renderTasks = (startTask, endTask) => {
  tasks.slice(startTask, endTask)
  .forEach((task) => renderElement(taskList, createTaskTemplate(task)));
};

const siteMainContainer = document.querySelector(`.main`);
const siteMenuContainer = siteMainContainer.querySelector(`.main__control`);

renderElement(siteMenuContainer, createMenuTemplate());
renderElement(siteMainContainer, createFilterTemplate(filters));
renderElement(siteMainContainer, createBoardTemplate());

const boardElement = siteMainContainer.querySelector(`.board`);
renderElement(boardElement, createSortingTemplate());
renderElement(boardElement, createTasksTemplate());

const taskList = boardElement.querySelector(`.board__tasks`);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

renderElement(taskList, createEditTaskTemplate(tasks[0]));

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
