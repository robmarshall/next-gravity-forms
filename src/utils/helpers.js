export const createGfKeyFromField = (string) => {
  const fieldName = "input_";
  const field = string.slice(string.indexOf(fieldName) + fieldName.length);
  return field.replace("_", ".");
};

export const doesObjectExist = (obj) => {
  if (typeof obj !== "undefined") {
    return true;
  }
  return false;
};

export const filteredKeys = (obj, filter) => {
  let key,
    keys = [];
  for (key in obj)
    if ({}.hasOwnProperty.call(obj, key) && filter.test(key)) keys.push(key);
  return keys;
};

export const valueToLowerCase = (string) =>
  string ? string.toLowerCase() : "";

export const isEmptyArray = (val) => {
  if (!Array.isArray(val)) {
    val = [val];
  }

  for (const item of val) {
    if (item !== null && item !== undefined && item !== "") {
      return false;
    }
  }

  return true;
};

export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const interpolateString = (template, values) => {
  return template.replace(/\{\{(\w+)\}\}/g, (placeholder, key) => {
    return values[key] || placeholder;
  });
};

export const isNonEmptyObject = (obj) => {
  return obj !== null && typeof obj === "object" && Object.keys(obj).length > 0;
};
