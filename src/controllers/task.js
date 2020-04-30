import TaskComponent from '../components/task';
import EditTaskComponent from '../components/edit-task';
import {replace, render} from '../utils/render';
import {Key} from '../utils/common';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
}

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);

    this._onDataChange = onDataChange;

    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
  }

  render(task) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new EditTaskComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });

    this._taskComponent.setFavoriteClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite
      }));
    });

    this._taskComponent.setArchiveClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive
      }));
    });

    if (oldTaskEditComponent && oldTaskComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      render(this._container, this._taskComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  _replaceTaskToEdit() {
    this._onViewChange();

    replace(this._taskEditComponent, this._taskComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);

    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() {
    replace(this._taskComponent, this._taskEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === Key.ESC || evt.key === Key.ESC_SHORT) {
      this._taskEditComponent.reset();
      this._replaceEditToTask();
    }
  }
}
