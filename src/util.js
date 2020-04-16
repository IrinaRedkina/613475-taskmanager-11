export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const Key = {
  ENTER: `Enter`,
  ESC: `Escape`,
  ESC_SHORT: `Esc`,
  MOUSE_LEFT: 0
};

export const getRandomElement = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

export const getRandomNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
