const checkValues = (values) => {
  const result = Object.keys(values).filter((key) => {
    const value = values[key];

    // Check if the value is a non-empty string
    if (typeof value === "string" && value.length > 0) {
      return true;
    }

    // Check if the value is a non-empty array
    if (Array.isArray(value) && value.length > 0) {
      // Recursively check the contents of the array
      return checkValues(value).length > 0;
    }

    // Check if the value is an object (but not null or an array)
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return checkValues(value).length > 0;
    }

    return false;
  });

  return result;
};

export const submissionHasOneFieldEntry = (values) => {
  const getFieldWithValues = checkValues(values);

  if (getFieldWithValues.length > 0) {
    return true;
  }

  return false;
};

/**
 * Check form data for arrays (indicating input groups) which need to have their names changed for GravityForms to recognize them.
 *
 * @param {Object} values - All form data to be filtered
 * @returns An object of modified input groups
 */
export const cleanGroupedFields = (values) => {
  for (const [key, value] of Object.entries(values)) {
    if (Array.isArray(value)) {
      value
        .filter((spot) => typeof spot !== undefined)
        .forEach((inputValue, i) => (values[`${key}_${i + 1}`] = inputValue));
      delete values[key];
    }
  }

  return values;
};
