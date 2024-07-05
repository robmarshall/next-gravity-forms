export function sortByFormat(components, format) {
  const formatMap = {
    d: "day",
    m: "month",
    y: "year",
  };

  return [...new Set(format.split(""))]
    .filter((i) => ["y", "m", "d"].includes(i))
    .map((f) => formatMap[f])
    .map((name) => components.find((component) => component.name === name));
}

// Check if date is invalid
export function isValidDate(value) {
  const { month, day, year } = value;
  if (
    !month ||
    isNaN(month) ||
    !day ||
    isNaN(day) ||
    !year ||
    isNaN(year) ||
    year.toString().length !== 4
  ) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === parseInt(year, 10) &&
    date.getMonth() === parseInt(month, 10) - 1 &&
    date.getDate() === parseInt(day, 10)
  );
}

export function getDefaultValue(inputs) {
  return {
    month: inputs[0].defaultValue,
    day: inputs[1].defaultValue,
    year: inputs[2].defaultValue,
  };
}

export function dateStringToObj(dateString, dateFormat) {
  if (!dateString || !dateFormat) return null;

  const formatMap = {
    d: "day",
    m: "month",
    y: "year",
  };
  const dateObj = {};

  // Use a regular expression to match periods, slashes, or hyphens.
  const dateArray = dateString.split(/[./-]/);

  // Only first 3 characters indicate date order
  const formatArray = [...dateFormat].slice(0, 3);

  formatArray.forEach((formatChar, index) => {
    const key = formatMap[formatChar];
    const value = dateArray[index];
    if (value) {
      dateObj[key] = value;
    }
  });

  return dateObj;
}
