import { conditionalLogicFragment } from "../../fragments";

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
