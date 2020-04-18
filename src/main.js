import Menu from './components/menu';
import Filter from './components/filter';
import BoardComponent from './components/board';
import BoardController from './controllers/board';
import {generateTasks} from './mock/task';
import {generateFilters} from './mock/filter';
import {render} from './utils/render';

const TASK_COUNT = 20;
const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new Menu());
render(siteMainElement, new Filter(filters));

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent);

render(siteMainElement, boardComponent);
boardController.render(tasks);
