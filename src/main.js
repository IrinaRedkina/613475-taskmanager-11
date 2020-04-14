import MenuComponent from './components/menu';
import FilterComponent from './components/filter';
import SortingComponent from './components/sorting';
import BoardComponent from './components/board';
import LoadMoreButtonComponent from './components/load-more-button';
import TasksComponent from './components/tasks';
import TaskComponent from './components/task';
import EditTaskComponent from './components/edit-task';
import NoTasksComponent from './components/no-tasks';
import {generateTasks} from './mock/task';
import {generateFilters} from './mock/filter';
import {render, Key} from './util';


const TASK_COUNT = 20;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;


const renderTask = (taskListElement, task, idTask) => {
  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditElement, taskElement);
  };

  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskElement, taskEditElement);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === Key.ESC || evt.key === Key.ESC_SHORT;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const taskComponent = new TaskComponent(idTask, task);
  const taskElement = taskComponent.getElement();
  const taskEditComponent = new EditTaskComponent(idTask, task);
  const taskEditElement = taskEditComponent.getElement();

  const editButton = taskElement.querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const editForm = taskEditElement.querySelector(`form`);
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent.getElement());
};


const renderBoard = (boardComponent, tasks) => {
  const boardElement = boardComponent.getElement();
  const isAllTasksArchived = tasks.every((task) => task.isArchive);
  const isNoTasks = tasks.length === 0;

  if (isAllTasksArchived || isNoTasks) {
    render(boardElement, new NoTasksComponent().getElement());
    return;
  }

  render(boardElement, new SortingComponent().getElement());
  render(boardElement, new TasksComponent().getElement());

  const taskListElement = boardElement.querySelector(`.board__tasks`);

  const renderTasks = (startTask, endTask) => {
    tasks.slice(startTask, endTask)
      .forEach((task, i) => renderTask(taskListElement, task, i));
  };

  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
  renderTasks(0, showingTasksCount);

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  const loadMoreButtonElement = loadMoreButtonComponent.getElement();
  const isShowingLoadMoreButton = showingTasksCount < tasks.length;

  const removeLoadMoreButton = () => {
    if (showingTasksCount >= tasks.length) {
      loadMoreButtonElement.remove();
      loadMoreButtonComponent.removeElement();
    }
  };

  if (isShowingLoadMoreButton) {
    render(boardElement, loadMoreButtonComponent.getElement());
  }

  loadMoreButtonElement.addEventListener(`click`, () => {
    const prevTaskCount = showingTasksCount;
    showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

    renderTasks(prevTaskCount, showingTasksCount);
    removeLoadMoreButton();
  });
};

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new MenuComponent().getElement());
render(siteMainElement, new FilterComponent(filters).getElement());

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement());
renderBoard(boardComponent, tasks);
