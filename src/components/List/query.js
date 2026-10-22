import { conditionalLogicFragment } from "../../fragments";

export const listFieldFragment = /* GraphQL */ `
  ... on ListField {
    addIconUrl
    adminLabel
    canPrepopulate
    choices {
      text
      value
    }
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    cssClass
    databaseId
    deleteIconUrl
    description
    descriptionPlacement
    errorMessage
    hasColumns
    inputName
    isRequired
    label
    labelPlacement
    listValues {
      values
    }
    maxRows
    value
  }
`;
