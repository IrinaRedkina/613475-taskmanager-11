import SortingComponent from '../components/sorting';
import LoadMoreButtonComponent from '../components/load-more-button';
import NoTasksComponent from '../components/no-tasks';
import TasksComponent from '../components/tasks';
import TaskController from '../controllers/task';
import {render, remove} from '../utils/render';
import {SortType} from '../components/sorting';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const getSortedTasks = (tasks, sortType) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks;
};

const renderTasks = (container, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(container, onDataChange, onViewChange);

    taskController.render(task);

    return taskController;
  });
};

export default class BoardController {
  constructor(component) {
    this._container = component.getElement();

    this._tasks = [];
    this._showedTaskControllers = [];

    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    this._noTasksComponent = new NoTasksComponent();
    this._sortingComponent = new SortingComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(tasks) {
    this._tasks = tasks;

    const isAllTasksArchived = tasks.every((task) => task.isArchive);
    const isNoTasks = tasks.length === 0;

    if (isAllTasksArchived || isNoTasks) {
      render(this._container, this._noTasksComponent);
      return;
    }

    render(this._container, this._sortingComponent);
    render(this._container, this._tasksComponent);

    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, this._tasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    if (this._showingTasksCount >= this._tasks.length) {
      return;
    }

    render(this._container, this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTaskCount = this._showingTasksCount;
      const taskListElement = this._tasksComponent.getElement();

      this._showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedTasks = getSortedTasks(this._tasks.slice(prevTaskCount, this._showingTasksCount), this._sortingComponent.getSortType());

      const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      this._onViewChange();

      if (this._showingTasksCount >= this._tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    const sortedTasks = getSortedTasks(this._tasks, sortType).slice(0, this._showingTasksCount);
    const taskListElement = this._tasksComponent.getElement();

    taskListElement.innerHTML = ``;

    const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = newTasks;

    this._renderLoadMoreButton();
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onDataChange(taskController, oldData, newData) {
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));

    taskController.render(this._tasks[index]);
  }
}
