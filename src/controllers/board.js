import SortingComponent from '../components/sorting';
import LoadMoreButtonComponent from '../components/load-more-button';
import TasksComponent from '../components/tasks';
import TaskComponent from '../components/task';
import EditTaskComponent from '../components/edit-task';
import NoTasksComponent from '../components/no-tasks';
import {replace, render, remove} from '../utils/render';
import {Key} from '../utils/common';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;


const renderTask = (taskListElement, task, idTask) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === Key.ESC || evt.key === Key.ESC_SHORT;

    if (isEscKey) {
      replace(taskComponent, taskEditComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const taskComponent = new TaskComponent(idTask, task);
  const taskEditComponent = new EditTaskComponent(idTask, task);

  taskComponent.setEditButtonClickHandler(() => {
    replace(taskEditComponent, taskComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setEditFormSubmitHandler((evt) => {
    evt.preventDefault();
    replace(taskComponent, taskEditComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent);
};

const renderTasks = (container, tasks) => {
  tasks.forEach((task, i) => {
    renderTask(container, task, i);
  });
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortingComponent = new SortingComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const container = this._container.getElement();
    const taskListElement = this._tasksComponent.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);
    const isNoTasks = tasks.length === 0;
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    const renderLoadMoreButton = () => {
      if (showingTasksCount >= tasks.length) {
        return;
      }

      render(container, this._loadMoreButtonComponent);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevTaskCount = showingTasksCount;
        showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

        renderTasks(taskListElement, tasks.slice(prevTaskCount, showingTasksCount));

        if (showingTasksCount >= tasks.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    };

    if (isAllTasksArchived || isNoTasks) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortingComponent);
    render(container, this._tasksComponent);

    renderTasks(taskListElement, tasks.slice(0, showingTasksCount));
    renderLoadMoreButton();
  }
}