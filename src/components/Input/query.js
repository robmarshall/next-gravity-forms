import { conditionalLogicFragment } from "../../fragments";

export const textFieldFragment = /* GraphQL */ `
  ... on TextField {
    adminLabel
    autocompleteAttribute
    canPrepopulate
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    cssClass
    defaultValue
    description
    descriptionPlacement
    errorMessage
    hasAutocomplete
    inputName
    isPasswordInput
    isRequired
    label
    labelPlacement
    layoutGridColumnSpan
    maxLength
    placeholder
    shouldAllowDuplicates
    size
    value
  }
`;

export const hiddenFieldFragment = /* GraphQL */ `
  ... on HiddenField {
    canPrepopulate
    defaultValue
    inputName
    label
    value
  }
`;

export const numberFieldFragment = /* GraphQL */ `
  ... on NumberField {
    adminLabel
    autocompleteAttribute
    calculationFormula
    calculationRounding
    canPrepopulate
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    cssClass
    defaultValue
    description
    descriptionPlacement
    errorMessage
    hasAutocomplete
    inputName
    isCalculation
    isRequired
    label
    numberFormat
    placeholder
    rangeMax
    rangeMin
    shouldAllowDuplicates
    size
    value
  }
`;

export const phoneFieldFragment = /* GraphQL */ `
  ... on PhoneField {
    adminLabel
    autocompleteAttribute
    canPrepopulate
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    cssClass
    defaultValue
    description
    descriptionPlacement
    errorMessage
    hasAutocomplete
    inputName
    isRequired
    label
    phoneFormat
    placeholder
    shouldAllowDuplicates
    size
    value
  }
`;
