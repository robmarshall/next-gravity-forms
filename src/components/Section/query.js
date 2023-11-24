export const SectionFieldFragment = /* GraphQL */ `
... on SectionField {
  id
  cssClass
  databaseId
  label
  type
  description
  displayOnly
  visibility
  layoutGridColumnSpan
  layoutSpacerGridColumnSpan
  conditionalLogic {
    actionType
    logicType
    rules {
      fieldId
      operator
      value
    }
  }
}
`;
