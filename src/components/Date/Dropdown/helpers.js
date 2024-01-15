function isEmptyArray(val) {
  if (!Array.isArray(val)) {
    val = [val];
  }

  for (const item of val) {
    if (item !== null && item !== undefined && item !== "") {
      return false;
    }
  }

  return true;
}

export function parseDate(date, format = "mdy", returnKeysOnEmpty = false) {
  const dateInfo = {
    year: "",
    month: "",
    day: "",
  };

  if (!date || isEmptyArray(date)) {
    return returnKeysOnEmpty ? dateInfo : {};
  }

  const position = format.substring(0, 3);

  if (Array.isArray(date)) {
    switch (position) {
      case "mdy":
        [dateInfo.month, dateInfo.day, dateInfo.year] = date;
        break;
      case "dmy":
        [dateInfo.day, dateInfo.month, dateInfo.year] = date;
        break;
      case "ymd":
        [dateInfo.year, dateInfo.month, dateInfo.day] = date;
        break;
    }
    return dateInfo;
  }

  date = date.replace(/[/\.]/g, "-");
  const matches = date.match(/^(\d{1,4})-(\d{1,2})-(\d{1,4})$/);

  if (matches) {
    if (matches[1].length === 4) {
      // format yyyy-mm-dd
      [dateInfo.year, dateInfo.month, dateInfo.day] = matches.slice(1);
    } else if (position === "mdy") {
      // format mm-dd-yyyy
      [dateInfo.month, dateInfo.day, dateInfo.year] = matches.slice(1);
    } else {
      // format dd-mm-yyyy
      [dateInfo.day, dateInfo.month, dateInfo.year] = matches.slice(1);
    }
  }

  return dateInfo;
}

export function sortComponentsByFormat(components, format) {
  const formatMap = {
    d: "day",
    m: "month",
    y: "year",
  };

  return format
    .split("")
    .map((f) => formatMap[f])
    .map((name) => components.find((component) => component.name === name));
}
