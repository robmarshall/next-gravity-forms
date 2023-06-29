import { conditionalLogicFragment } from "../../fragments";

export const selectFieldFragment = /* GraphQL */ `
  ... on SelectField {
    adminLabel
    autocompleteAttribute
    canPrepopulate
    choices {
      ... on SelectFieldChoice {
        isSelected
        text
        value
      }
    }
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    cssClass
    defaultValue
    description
    descriptionPlacement
    errorMessage
    hasAutocomplete
    hasChoiceValue
    hasEnhancedUI
    inputName
    isRequired
    label
    placeholder
    shouldAllowDuplicates
    size
    value
  }
`;
