import {COLORS, DAYS} from "../const.js";
import {formatTime, formatDate} from "../utils/common";
import AbstractSmartComponent from "./abstract-smart-component";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 140;

const isAllowableDescriptionLength = (description) => {
  const length = description.length;

  return length >= MIN_DESCRIPTION_LENGTH &&
    length <= MAX_DESCRIPTION_LENGTH;
};

const createColorMarkup = (color, isChecked, index) => {
  return (
    `<input
      type="radio"
      id="color-${color}-${index}"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      ${isChecked ? `checked` : ``}
    />
    <label
      for="color-${color}-${index}"
      class="card__color card__color--${color}"
      >${color}</label
    >`
  );
};

const createRepeatingDayMarkup = (day, isChecked, index) => {
  return (
    `<input
      class="visually-hidden card__repeat-day-input"
      type="checkbox"
      id="repeat-${day}-${index}"
      name="repeat"
      value="${day}"
      ${isChecked ? `checked` : ``}
    />
    <label class="card__repeat-day" for="repeat-${day}-${index}"
      >${day}</label
    >`
  );
};

const createEditTaskTemplate = (task, options = {}) => {
  const {id, dueDate} = task;
  const {activeColor, activeRepeatingDays, currentDescription, isDateShowing, isRepeatingTask} = options;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const date = isDateShowing && dueDate ? formatDate(dueDate) : ``;
  const time = isDateShowing && dueDate ? formatTime(dueDate) : ``;

  const deadlineClass = isExpired && isDateShowing ? `card--deadline` : ``;
  const repeatClass = isRepeatingTask ? `card--repeat` : ``;

  const colorsMarkup = COLORS.map((item, i) => {
    return createColorMarkup(item, item === activeColor, i);
  }).join(`\n`);

  const repeatingDaysMarkup = DAYS.map((item, i) => {
    return createRepeatingDayMarkup(item, activeRepeatingDays[item], i);
  }).join(`\n`);

  const isDisabledSaveButton = isRepeatingTask && !Object.values(activeRepeatingDays).some(Boolean);

  return (
    `<article data-id="${id}" class="card card--edit card--${activeColor} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                required
                minlength="${MIN_DESCRIPTION_LENGTH}"
                maxlength="${MAX_DESCRIPTION_LENGTH}"
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${currentDescription}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button" ${isRepeatingTask ? `disabled` : ``}>
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__date-deadline" ${isDateShowing ? `` : `disabled`}>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${dueDate ? `${date} ${time}` : ``}"
                    />
                  </label>
                </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__repeat-days" ${isRepeatingTask ? `` : `disabled`}>
                  <div class="card__repeat-days-inner">
                    ${repeatingDaysMarkup}
                  </div>
                </fieldset>
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isDisabledSaveButton ? `disabled` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>

        </div>
      </form>
    </article>`
  );
};

export default class EditTask extends AbstractSmartComponent {
  constructor(task) {
    super();

    this._task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentDescription = task.description;
    this._currentColor = task.color;

    this._flatpickr = null;

    this._submitHandler = null;

    // this.applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditTaskTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays,
      currentDescription: this._currentDescription,
      activeColor: this._currentColor
    });
  }

  reset() {
    const task = this._task;

    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentDescription = task.description;
    this._currentColor = task.color;

    this.rerender();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this.applyFlatpickr();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);

      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate || `today`
      });
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__text`)
      .addEventListener(`input`, (evt) => {
        this._currentDescription = evt.target.value;

        const saveButton = this.getElement().querySelector(`.card__save`);
        saveButton.disabled = !isAllowableDescriptionLength(this._currentDescription);
      });

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;

        this.rerender();
      });

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeatingTask = !this._isRepeatingTask;

        this._isDateShowing = false;

        this.rerender();
      });

    const repeatDays = element.querySelector(`.card__repeat-days`);

    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;

        this.rerender();
      });
    }

    const colors = element.querySelector(`.card__colors-wrap`);

    if (colors) {
      colors.addEventListener(`change`, (evt) => {
        this._currentColor = evt.target.value;

        this.rerender();
      });
    }
  }
}
