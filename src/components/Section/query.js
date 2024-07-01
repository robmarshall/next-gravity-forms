import { conditionalLogicFragment } from "../../fragments";

export const sectionFieldFragment = /* GraphQL */ `
... on SectionField {
  id: databaseId
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
    ${conditionalLogicFragment}
  }
}
`;
