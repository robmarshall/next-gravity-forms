import { conditionalLogicFragment } from "../../fragments";

export const timeFieldFragment = /* GraphQL */ `
  ... on TimeField {
    canPrepopulate
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    cssClass
    description
    descriptionPlacement
    errorMessage
    inputName
    isRequired
    label
    value
    inputs {
      customLabel
      defaultValue
      id
      label
      placeholder
    }
    timeFormat
  }
`;
