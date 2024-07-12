import { valueToLowerCase } from "../../utils/helpers";

// IS
function compareIS(ruleValue, fieldValue, type) {
  console.log({ fieldValue, ruleValue, type });

  if (
    ["checkbox", "multiselect"].includes(type) &&
    fieldValue instanceof Array
  ) {
    return fieldValue?.includes(ruleValue);
  }
  return ruleValue === fieldValue;
}

// IS NOT
function compareIS_NOT(ruleValue, fieldValue, type) {
  if (
    ["checkbox", "multiselect"].includes(type) &&
    fieldValue instanceof Array
  ) {
    return !fieldValue?.includes(ruleValue);
  }
  return ruleValue !== fieldValue;
}

// CONTAINS
function compareContains(ruleValue, fieldValue, type) {
  if (
    ["checkbox", "multiselect"].includes(type) &&
    fieldValue instanceof Array
  ) {
    return fieldValue.some((val) => val.includes(ruleValue));
  }
  return fieldValue?.includes(ruleValue);
}

// STARTS_WITH
function compareStartsWith(ruleValue, fieldValue, type) {
  if (
    ["checkbox", "multiselect"].includes(type) &&
    fieldValue instanceof Array
  ) {
    return fieldValue.some((val) => val.startsWith(ruleValue));
  }
  return fieldValue?.startsWith(ruleValue);
}

// ENDS_WITH
function compareEndsWith(ruleValue, fieldValue, type) {
  if (
    ["checkbox", "multiselect"].includes(type) &&
    fieldValue instanceof Array
  ) {
    return fieldValue.some((val) => val.endsWith(ruleValue));
  }
  return fieldValue?.endsWith(ruleValue);
}

// GREATER_THAN @//TODO probably needs tweaks for currency
function compareGreaterThan(ruleValue, fieldValue) {
  return parseFloat(ruleValue) < parseFloat(fieldValue);
}

// LESS_THAN @//TODO probably needs tweaks for currency
function compareGreateLessThan(ruleValue, fieldValue) {
  return parseFloat(ruleValue) > parseFloat(fieldValue);
}

function parseOperator(operator, ruleValue, fieldValue, field) {
  if (!fieldValue) return false;

  const { type: typeUpper, numberFormat } = field;
  const type = valueToLowerCase(typeUpper);

  switch (operator) {
    case "IS":
      return compareIS(ruleValue, fieldValue, type);
    case "IS_NOT":
      return compareIS_NOT(ruleValue, fieldValue, type);
    case "LESS_THAN":
      return compareGreateLessThan(ruleValue, fieldValue, numberFormat);
    case "GREATER_THAN":
      return compareGreaterThan(ruleValue, fieldValue, numberFormat);
    case "CONTAINS":
      return compareContains(ruleValue, fieldValue, type);
    case "STARTS_WITH":
      return compareStartsWith(ruleValue, fieldValue, type);
    case "ENDS_WITH":
      return compareEndsWith(ruleValue, fieldValue, type);
    default:
      console.error(
        `ERROR: Unknown operator '${operator}'. Showing field by default.`
      );
      return false;
  }
}

function parseLogicType(logicType, hideBasedOnRules) {
  return logicType === "ANY"
    ? hideBasedOnRules.includes(true)
    : hideBasedOnRules.every((i) => i === true);
}

function hideField(conditionalLogic, values, fields) {
  const { rules, actionType, logicType } = conditionalLogic;
  const hideBasedOnRules = rules.map(({ operator, value }, index) =>
    parseOperator(operator, value, values[index], fields[index])
  );

  return actionType === "SHOW"
    ? !parseLogicType(logicType, hideBasedOnRules)
    : parseLogicType(logicType, hideBasedOnRules);
}

export function checkConditionalRendering(conditionalLogic, watch, fields) {
  if (!conditionalLogic || !conditionalLogic.rules) return false;

  const fieldsToBeWatched = conditionalLogic.rules.map((i) => i.fieldId);

  const values = watch(fieldsToBeWatched.map((i) => `input_${parseInt(i)}`));

  const fieldsWorkWith = fieldsToBeWatched.map((id) =>
    fields?.nodes?.find((y) => {
      return y.id == parseInt(id); // if it's name field for example 1.3 we need to get ID of
    })
  );

  const formattedValues = values.map((value, index) => {
    const field = fieldsWorkWith[index];
    // if we check Name field we need to check each sub field separately
    if (field.type === "NAME") {
      const id = fieldsToBeWatched[index];
      const name = field.inputs.find((i) => i.id == id)?.name;

      if (name) return value[name];
    }
    return value;
  });

  return (
    values.length > 0 &&
    hideField(conditionalLogic, formattedValues, fieldsWorkWith)
  );
}
