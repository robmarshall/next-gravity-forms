import { conditionalLogicFragment } from "../../fragments";

export const addressFieldFragment = /* GraphQL */ `
  ... on AddressField {
    canPrepopulate
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    cssClass
    description
    descriptionPlacement
    defaultCountry
    errorMessage
    hasAutocomplete
    addressType
    inputs {
      placeholder
      name
      label
      id
      autocompleteAttribute
      customLabel
      defaultValue
      isHidden
      key
    }
    isRequired
    label
    subLabelPlacement
    value
  }
`;
