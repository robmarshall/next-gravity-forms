/**
 * these rules parse the conditional logic object from gravityforms
 * implements: https://docs.gravityforms.com/conditional-logic-object/
 * @param {string} operator
 * @param {bool} hideBasedOnRules does the field match
 * @param {string} ruleValue the value of the field of the conditional logic
 * @param {string,int,float} fieldValue the value of what the user entered in the field
 * @returns {bool}
 */
function parseOperator(operator, ruleValue, fieldValue) {
  console.log({ operator, ruleValue, fieldValue });
  // we dont do anything with hide or show. we do that later
  switch (operator) {
    // is: Evaluates this rule to true when the value of the field specified by fieldId is equal to value.
    case "IS":
      return ruleValue === fieldValue;
    // isnot: Evaluates this rule to true when the value of the field specified by fieldId is not equal to value.
    case "IS_NOT":
      return ruleValue != fieldValue;
    // <: Evaluates this rule to true when the value of the field specified by fieldId is less than value.
    case "LESS_THAN":
      return ruleValue < fieldValue;
    // >: Evaluates this rule to true when the value of the field specified by fieldId is greater than value.
    case "GREATER_THAN":
      return ruleValue > fieldValue;
    // contains: Evaluates this rule to true when the value of the field specified by fieldId contains value.
    case "CONTAINS":
      return ruleValue.indexOf(fieldValue) >= 0;
    // starts_with: Evaluates this rule to true when the value of the field specified by fieldId starts with value.
    case "STARTS_WITH":
      return ruleValue.indexOf(fieldValue) == 0;
    // ends_with: Evaluates this rule to true when the value of the field specified by fieldId ends with value.
    case "ENDS_WITH": {
      const start = ruleValue.length - fieldValue.length;
      if (start < 0) {
        return false;
      }
      const tail = ruleValue.substring(start);
      return fieldValue == tail;
    }
    default:
      /* eslint-disable no-console */
      console.error(`ERROR: ${operator} is not known. showing field anyway`);
      return false;
  }
}

/**
 * parse the logic type for matched fields
 * @param {string} logicType GF logic type this could be any or all
 * @param {array}} hideBasedOnRules
 * @returns
 */
function parseLogicType(logicType, hideBasedOnRules) {
  if (logicType === "ANY") {
    return hideBasedOnRules.includes(true);
  }
  // ALL
  return hideBasedOnRules.every((i) => i === true);
}

export function hideField(conditionalLogic, values) {
  const { rules, actionType, logicType } = conditionalLogic;

  const hideBasedOnRules = rules.map(({ operator, value }, index) =>
    parseOperator(operator, value, values[index])
  );

  let hideField = parseLogicType(logicType, hideBasedOnRules);

  if (actionType === "SHOW") {
    hideField = !hideField;
  }

  return hideField;
}
