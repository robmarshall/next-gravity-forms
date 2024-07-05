import { conditionalLogicFragment } from "../../fragments";

export const fileuploadFieldFragment = /* GraphQL */ `
  ... on FileUploadField {
    adminLabel
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
    inputType
    maxFileSize
    maxFiles
    type
  }
`;
