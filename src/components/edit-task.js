import {COLORS, DAYS} from "../const.js";
import {formatTime, formatDate, isRepeating, isOverdueDate} from "../utils/common";
import AbstractSmartComponent from "./abstract-smart-component";
import {encode} from "he";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 140;

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

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
  const {activeColor, activeRepeatingDays, currentDescription, isDateShowing, isRepeatingTask, externalData} = options;

  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
  const date = isDateShowing && dueDate ? formatDate(dueDate) : ``;
  const time = isDateShowing && dueDate ? formatTime(dueDate) : ``;

  const description = encode(currentDescription);

  const deadlineClass = isExpired && isDateShowing ? `card--deadline` : ``;
  const repeatClass = isRepeatingTask ? `card--repeat` : ``;

  const colorsMarkup = COLORS.map((item, i) => {
    return createColorMarkup(item, item === activeColor, i);
  }).join(`\n`);

  const repeatingDaysMarkup = DAYS.map((item, i) => {
    return createRepeatingDayMarkup(item, activeRepeatingDays[item], i);
  }).join(`\n`);

  const isBlockSaveButton = (isDateShowing && isRepeatingTask) ||
    (isRepeatingTask && !isRepeating(activeRepeatingDays)) ||
    !isAllowableDescriptionLength(description);

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

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
              >${description}</textarea>
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
          <button class="card__save" type="submit" ${isBlockSaveButton ? `disabled` : ``}>${saveButtonText}</button>
          <button class="card__delete" type="button">${deleteButtonText}</button>
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
    this._isRepeatingTask = isRepeating(task.repeatingDays);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentDescription = task.description;
    this._currentColor = task.color;
    this._externalData = DefaultData;

    this._flatpickr = null;

    this._submitHandler = null;
    this._deleteButtonClickHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditTaskTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays,
      currentDescription: this._currentDescription,
      activeColor: this._currentColor,
      externalData: this._externalData
    });
  }

  getCardElement() {
    return this.getElement().querySelector(`.card__inner`);
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  reset() {
    const task = this._task;

    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = isRepeating(task.repeatingDays);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentDescription = task.description;
    this._currentColor = task.color;

    this.rerender();
  }

  getData() {
    const form = this.getElement().querySelector(`.card__form`);
    return new FormData(form);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
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

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
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
