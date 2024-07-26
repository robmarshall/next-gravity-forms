import { conditionalLogicFragment } from "../../../fragments";

export const pageFieldFragment = /* GraphQL */ `
  ... on PageField {
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    nextButton {
      type
      text
      imageUrl
      conditionalLogic {
        ${conditionalLogicFragment}
      }
    }
    previousButton {
      type
      text
      imageUrl
    }
  }
`;
