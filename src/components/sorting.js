import AbstractComponent from "./abstract-component";

const TAG_SORT = `A`;

export const SortType = {
  DATE_UP: `date-up`,
  DATE_DOWN: `date-down`,
  DEFAULT: `default`,
};

const createSortingTemplate = () => {
  return (
    `<div class="board__filter-list">
        <a href="#" class="board__filter" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
        <a href="#" class="board__filter" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
        <a href="#" class="board__filter" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
      </div>`
  );
};

export default class Sorting extends AbstractComponent {
  constructor() {
    super();

    this._currenSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortingTemplate();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== TAG_SORT) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;

      handler(this._currenSortType);
    });
  }
}
