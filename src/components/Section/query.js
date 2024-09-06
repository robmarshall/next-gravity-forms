import { conditionalLogicFragment } from "../../fragments";

export const sectionFieldFragment = /* GraphQL */ `
... on SectionField {
  cssClass
  label
  description
  displayOnly
  conditionalLogic {
    ${conditionalLogicFragment}
  }
}
`;
