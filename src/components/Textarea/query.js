export const textareaFieldFragment = /* GraphQL */ `
  ... on TextAreaField {
    adminLabel
    canPrepopulate
    conditionalLogic {
      actionType
      rules {
        fieldId
        operator
        value
      }
    }
    cssClass
    defaultValue
    description
    descriptionPlacement
    errorMessage
    inputName
    isRequired
    label
    maxLength
    shouldAllowDuplicates
    placeholder
    size
    hasRichTextEditor
    value
  }
`;
