const filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `archive`];

const isToday = (date) => {
  const todayDate = new Date();
  return date.toDateString() === todayDate.toDateString() ? true : false;
};

const getFilterCounts = (tasks) => {
  const counts = {
    'all': tasks.length,
    'overdue': 0,
    'today': 0,
    'favorites': 0,
    'archive': 0,
    'repeating': 0,
  };

  tasks.forEach((task) => {
    const isDate = task.dueDate !== null;

    if (isDate && task.dueDate < Date.now()) {
      counts[`overdue`] += 1;
    }

    if (isDate && isToday(task.dueDate)) {
      counts[`today`] += 1;
    }

    if (task.isFavorite) {
      counts[`favorites`] += 1;
    }

    if (task.isArchive) {
      counts[`archive`] += 1;
    }

    if (Object.values(task.repeatingDays).some(Boolean)) {
      counts[`repeating`] += 1;
    }
  });

  return counts;
};

const generateFilters = (tasks) => {
  const counts = getFilterCounts(tasks);

  return filterNames.map((item) => {
    return {
      name: item,
      count: counts[item]
    };
  });
};

export {generateFilters};
