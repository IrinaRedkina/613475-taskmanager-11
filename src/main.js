import MenuComponent from './components/menu';
import {MenuItem} from './components/menu';
import BoardComponent from './components/board';
import BoardController from './controllers/board';
import TasksModel from './models/tasks';
import FilterController from './controllers/filter';
import {generateTasks} from './mock/task';
import {render} from './utils/render';

const TASK_COUNT = 20;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const siteMenuComponent = new MenuComponent();
render(siteHeaderElement, siteMenuComponent);

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;
  }
});
