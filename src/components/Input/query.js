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
    inputMaskValue
    inputName
    isPasswordInput
    isRequired
    label
    maxLength
    placeholder
    shouldAllowDuplicates
    size
    value
  }
`;

export const dateFieldFragment = /* GraphQL */ `
  ... on DateField {
    adminLabel
    calendarIconType
    calendarIconUrl
    canPrepopulate
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    cssClass
    dateFormat
    dateType
    defaultValue
    description
    descriptionPlacement
    errorMessage
    inputName
    inputs {
      ... on DateInputProperty {
        id
        autocompleteAttribute
        customLabel
        defaultValue
        label
        placeholder
      }
    }
    isRequired
    label
    placeholder
    shouldAllowDuplicates
    subLabelPlacement
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
