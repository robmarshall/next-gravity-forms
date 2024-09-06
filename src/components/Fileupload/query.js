import { conditionalLogicFragment } from "../../fragments";

export const fileuploadFieldFragment = /* GraphQL */ `
  ... on FileUploadField {
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    cssClass
    description
    descriptionPlacement
    errorMessage
    isRequired
    label
    value
    allowedExtensions
    canAcceptMultipleFiles
    maxFileSize
    maxFiles
  }
`;
