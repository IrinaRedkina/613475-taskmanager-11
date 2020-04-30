import AbstractComponent from './abstract-component';

const ErrorMessage = {
  METHOD_NOT_IMPLEMENTED: `Abstract method not implemented: recoveryListeners`
};

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(ErrorMessage.METHOD_NOT_IMPLEMENTED);
  }

  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();

    console.log(this);
  }
}
