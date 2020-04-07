import {createMenuTemplate} from './components/menu.js';
import {createBoardTemplate} from './components/board.js';
import {createFilterTemplate} from './components/filter.js';
import {createEditTaskTemplate} from './components/edit-task.js';
import {createTaskTemplate} from './components/task.js';
import {createMoreButtonTemplate} from './components/more-button.js';

const TASK_COUNT = 3;

const renderElement = (container, template, place = `beforeEnd`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainContainer = document.querySelector(`.main`);
const siteMenuContainer = siteMainContainer.querySelector(`.main__control`);

renderElement(siteMenuContainer, createMenuTemplate());
renderElement(siteMainContainer, createFilterTemplate());
renderElement(siteMainContainer, createBoardTemplate());

const boardElement = siteMainContainer.querySelector(`.board`);
const boardListElement = boardElement.querySelector(`.board__tasks`);

renderElement(boardListElement, createEditTaskTemplate());

for (let i = 0; i <= TASK_COUNT; i++) {
  renderElement(boardListElement, createTaskTemplate());
}

renderElement(boardElement, createMoreButtonTemplate());
