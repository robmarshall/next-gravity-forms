import { conditionalLogicFragment } from "../../fragments";

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
