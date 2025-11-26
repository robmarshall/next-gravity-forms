const padValue = (value) => {
  if (value === undefined || value === null) return undefined;
  const numeric = parseInt(value, 10);
  if (Number.isNaN(numeric)) return undefined;
  return `${numeric}`.padStart(2, "0");
};

function formatTime(fieldResponse, timeFormat) {
  if (typeof fieldResponse === "string") {
    return fieldResponse;
  }

  const hour = padValue(fieldResponse?.hour);
  const minute = padValue(fieldResponse?.minute);

  if (!hour || !minute) {
    return null;
  }

  if (timeFormat === "H24") {
    return `${hour}:${minute}`;
  }

  const ampm = (fieldResponse?.ampm || "am").toLowerCase();

  return `${hour}:${minute} ${ampm}`;
}
export default formatTime;
