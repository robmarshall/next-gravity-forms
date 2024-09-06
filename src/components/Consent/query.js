import { conditionalLogicFragment } from "../../fragments";

export const consentFieldFragment = /* GraphQL */ `
  ... on ConsentField {
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    consentValue
    checkboxLabel
    consentValue
    cssClass
    description
    descriptionPlacement
    errorMessage
    isRequired
    label
    labelPlacement
    value
  }
`;
