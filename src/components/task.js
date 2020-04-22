import {MONTH_NAMES} from "../const.js";
import {formatTime} from "../utils/common";
import AbstractComponent from "./abstract-component";

const createTaskControlMarkup = (isArchive, isFavorite, buttonDisabledClass) => {
  return (
    `<div class="card__control">
      <button type="button" class="card__btn card__btn--edit">
        edit
      </button>
      <button type="button"
        class="card__btn card__btn--archive ${isArchive ? `` : buttonDisabledClass}">
        archive
      </button>
      <button type="button"
        class="card__btn card__btn--favorites ${isFavorite ? `` : buttonDisabledClass}">
        favorites
      </button>
    </div>`
  );
};

const createTaskTemplate = (idTask, task) => {
  const {color, description, dueDate, repeatingDays, isArchive, isFavorite} = task;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const isDateShowing = !!dueDate;
  const deadlineClass = isExpired ? `card--deadline` : ``;
  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? `${formatTime(dueDate)}` : ``;

  const isRepeatingTask = Object.values(repeatingDays).some(Boolean);
  const repeatClass = isRepeatingTask ? `card--repeat` : ``;

  const buttonDisabledClass = `card__btn--disabled`;

  return (
    `<article data-id="${idTask}" class="card card--${color} ${repeatClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          ${createTaskControlMarkup(isArchive, isFavorite, buttonDisabledClass)}

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              ${isDateShowing ? `
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>` : ``}
            </div>
          </div>

        </div>
      </div>
    </article>`
  );
};

export default class Task extends AbstractComponent {
  constructor(id, task) {
    super();

    this._id = id;
    this._task = task;
  }

  getTemplate() {
    return createTaskTemplate(this._id, this._task);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, handler);
  }
}
