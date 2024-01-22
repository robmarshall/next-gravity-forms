function parseOperator(operator, ruleValue, fieldValue) {
  switch (operator) {
    case "IS":
      return ruleValue === fieldValue;
    case "IS_NOT":
      return ruleValue !== fieldValue;
    case "LESS_THAN":
      return ruleValue < fieldValue;
    case "GREATER_THAN":
      return ruleValue > fieldValue;
    case "CONTAINS":
      return fieldValue?.includes(ruleValue);
    case "STARTS_WITH":
      return fieldValue?.startsWith(ruleValue);
    case "ENDS_WITH":
      return fieldValue?.endsWith(ruleValue);
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

function hideField(conditionalLogic, values) {
  const { rules, actionType, logicType } = conditionalLogic;
  const hideBasedOnRules = rules.map(({ operator, value }, index) =>
    parseOperator(operator, value, values[index])
  );

  return actionType === "SHOW"
    ? !parseLogicType(logicType, hideBasedOnRules)
    : parseLogicType(logicType, hideBasedOnRules);
}

export function checkConditionalRendering(conditionalLogic, watch) {
  if (!conditionalLogic || !conditionalLogic.rules) return false;

  const fieldsToBeWatched = conditionalLogic.rules.map(
    (i) => `input_${i.fieldId}`
  );
  const values = watch(fieldsToBeWatched);

  return values.length > 0 && hideField(conditionalLogic, values);
}
