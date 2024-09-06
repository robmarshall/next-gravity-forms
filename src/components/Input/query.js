import { conditionalLogicFragment } from "../../fragments";

export const textFieldFragment = /* GraphQL */ `
  ... on TextField {
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
    labelPlacement
    maxLength
    placeholder
    shouldAllowDuplicates
    size
    value
  }
`;

export const websiteFieldFragment = /* GraphQL */ `
  ... on WebsiteField {
    cssClass
    defaultValue
    description
    descriptionPlacement
    errorMessage
    inputName
    isRequired
    label
    labelPlacement
    placeholder
    size
    type
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
