import { conditionalLogicFragment } from "../../fragments";

export const multiSelectFieldFragment = /* GraphQL */ `
  ... on MultiSelectField {
    adminLabel
    canPrepopulate
    options: choices {
      ... on MultiSelectFieldChoice {
        isFixed: isSelected
        label: text
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
