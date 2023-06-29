import { conditionalLogicFragment } from "../../fragments";

export const checkboxFieldFragment = /* GraphQL */ `
  ... on CheckboxField {
    adminLabel
    canPrepopulate
    checkboxValues {
      inputId
      value
    }
    choices {
      ... on CheckboxFieldChoice {
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
    errorMessage
    hasChoiceValue
    hasSelectAll
    inputs {
      ... on CheckboxInputProperty {
        id
        name
        label
      }
    }
    inputName
    isRequired
    label
  }
`;

export const radioFieldFragment = /* GraphQL */ `
  ... on RadioField {
    adminLabel
    canPrepopulate
    choices {
      ... on RadioFieldChoice {
        isOtherChoice
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
    hasOtherChoice
    errorMessage
    inputName
    isRequired
    label
    shouldAllowDuplicates
    value
  }
`;
