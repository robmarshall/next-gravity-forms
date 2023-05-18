export const conditionalLogicFragment = /* GraphQL */ `
  actionType
  logicType
  rules {
    fieldId
    operator
    value
  }
`;

export const formConfirmationFragment = /* GraphQL */ `
  conditionalLogic {
    ${conditionalLogicFragment}
  }
  id
  isActive
  isDefault
  message
  name
  pageId
  queryString
  type
  url
`;

export const submitButtonFragment = /* GraphQL */ `
  conditionalLogic {
    ${conditionalLogicFragment}
  }
  imageUrl
  text
  type
`;
