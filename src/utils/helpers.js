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
  let key;
  const keys = [];
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

export const isNonEmptyObject = (obj) => {
  return obj !== null && typeof obj === "object" && Object.keys(obj).length > 0;
};

export const groupFields = (nodes) => {
  return nodes.reduce((acc, field) => {
    const pageNumber = field.pageNumber || 1;
    const page = acc[pageNumber] || [];
    page.push(field);
    acc[pageNumber] = page;
    return acc;
  }, {});
};

export const interpolateString = (template, values) => {
  if (!template) return "";
  return template.replace(/\{\{(\w+)\}\}/g, (placeholder, key) => {
    return key in values ? values[key] : placeholder;
  });
};

export const isInternalLink = (url) => {
  const currentOrigin = window.location.origin;
  return url.startsWith(currentOrigin) || url.startsWith("/");
};

export function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
