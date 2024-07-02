import { conditionalLogicFragment } from "../../fragments";

export const nameFieldFragment = /* GraphQL */ `
  ... on NameField {
    id
    adminLabel
    canPrepopulate
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    cssClass
    description
    descriptionPlacement
    errorMessage
    hasAutocomplete
    inputs {
      ... on NameInputProperty {
        id
        name
        autocompleteAttribute
        customLabel
        defaultValue
        label
        placeholder
        isHidden
        key
        choices {
          text
          value
          isSelected
        }
      }
    }
    isRequired
    label
    subLabelPlacement
    value
  }
`;
