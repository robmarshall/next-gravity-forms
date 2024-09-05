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
    databaseId
    description
    descriptionPlacement
    errorMessage
    isRequired
    label
    labelPlacement
    value
  }
`;

