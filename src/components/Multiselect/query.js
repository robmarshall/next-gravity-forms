import { conditionalLogicFragment } from "../../fragments";

export const multiSelectFieldFragment = /* GraphQL */ `
  ... on MultiSelectField {
    adminLabel
    canPrepopulate
    choices {
      ... on MultiSelectFieldChoice {
        isSelected
        text
        value
      }
    }
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    cssClass
    description
    descriptionPlacement
    hasChoiceValue
    hasEnhancedUI
    errorMessage
    inputName
    isRequired
    label
    size
    values
  }
`;
