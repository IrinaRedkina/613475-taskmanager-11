import {createElement} from '../utils/render';

const HIDDEN_CLASS = `visually-hidden`;

const ErrorMessage = {
  CLASS_INHERITANCE: `Can't instantiate AbstractComponent, only concrete one.`,
  METHOD_NOT_IMPLEMENTED: `Abstract method not implemented: getTemplate`
};

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(ErrorMessage.CLASS_INHERITANCE);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(ErrorMessage.METHOD_NOT_IMPLEMENTED);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  show() {
    if (this._element) {
      this._element.classList.remove(HIDDEN_CLASS);
    }
  }

  hide() {
    if (this._element) {
      this._element.classList.add(HIDDEN_CLASS);
    }
  }
}
