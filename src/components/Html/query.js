import { conditionalLogicFragment } from "../../fragments";

export const htmlFieldFragment = /* GraphQL */ `
  ... on HtmlField {
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    content
    cssClass
    hasMargins
    label
  }
`;
