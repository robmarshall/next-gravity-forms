/**
 * Parse the default value for the time field
 * @param {string} defaultValue
 * @param {Object[]} inputs
 * @returns {Object} { hour, minute, ampm }
 * @example
 * parseTimeDefaultValue("12:00") // { hour: "12", minute: "00", ampm: "am" }
 * parseTimeDefaultValue("12:00 pm") // { hour: "12", minute: "00", ampm: "pm" }
 * parseTimeDefaultValue("12:00 am") // { hour: "12", minute: "00", ampm: "am" }
 * parseTimeDefaultValue("12:00 pm") // { hour: "12", minute: "00", ampm: "pm" }
 */
export const parseTimeDefaultValue = (
  defaultValue = "",
  inputs = [],
  timeFormat = "H24"
) => {
  const shouldRenderAmpm = timeFormat !== "H24";

  const normalizeAmpm = (value) => {
    if (!shouldRenderAmpm) return undefined;
    return value?.toLowerCase() || "am";
  };

  if (!defaultValue) {
    const hourInput = inputs[0];
    const minuteInput = inputs[1];
    const ampmInput = inputs[2];

    if (!hourInput?.defaultValue && !minuteInput?.defaultValue) {
      return {
        ampm: normalizeAmpm(ampmInput?.defaultValue),
      };
    }

    return {
      hour: `${hourInput?.defaultValue || ""}`,
      minute: `${minuteInput?.defaultValue || ""}`,
      ampm: normalizeAmpm(ampmInput?.defaultValue),
    };
  }

  if (typeof defaultValue === "object") {
    const { hour, minute, ampm } = defaultValue;
    if (hour && minute) {
      return {
        hour,
        minute,
        ampm: normalizeAmpm(ampm),
      };
    }
    return undefined;
  }

  const rawValue = `${defaultValue}`.trim().toLowerCase();

  if (!rawValue) {
    return { hour: "", minute: "", ampm: normalizeAmpm() };
  }

  const periodMatch = rawValue.match(/(am|pm)$/);
  const ampm = periodMatch ? periodMatch[1] : undefined;
  const numericPart = periodMatch
    ? rawValue.slice(0, periodMatch.index).trim()
    : rawValue;

  const sanitized = numericPart.replace(/[^0-9:]/g, "").replace(/:+$/, "");
  const [hour, minute] = sanitized.split(/:+/).filter(Boolean);

  if (!hour || !minute) {
    return {
      hour: hour || "",
      minute: minute || "",
      ampm: normalizeAmpm(ampm),
    };
  }

  return { hour, minute, ampm: normalizeAmpm(ampm) };
};
