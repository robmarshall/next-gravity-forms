import { conditionalLogicFragment } from "../../fragments";

export const numberFieldFragment = /* GraphQL */ `
  ... on NumberField {
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
