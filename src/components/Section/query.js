import { conditionalLogicFragment } from "../../fragments";

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
    ${conditionalLogicFragment}
  }
}
`;
