// This function formats Date object to specific format
const getDatePickerValue = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return { day, month, year };
};

const getDropdownValue = (date) => {
  return date;
};

const formatDate = (date, type, format) => {
  const { day, month, year } =
    type === "PICKER" ? getDatePickerValue(date) : getDropdownValue(date);

  switch (format) {
    case "MDY":
      return `${month}/${day}/${year}`;
    case "DMY":
      return `${day}/${month}/${year}`;
    case "DMY_DASH":
      return `${day}-${month}-${year}`;
    case "DMY_DOT":
      return `${day}.${month}.${year}`;
    case "YMD_SLASH":
      return `${year}/${month}/${day}`;
    case "YMD_DASH":
      return `${year}-${month}-${day}`;
    case "YMD_DOT":
      return `${year}.${month}.${day}`;
    default:
      return null;
  }
};

export default formatDate;
