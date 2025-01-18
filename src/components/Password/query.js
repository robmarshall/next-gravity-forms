import { conditionalLogicFragment } from "../../fragments";

export const passwordFieldFragment = /* GraphQL */ `
  ... on PasswordField {
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    cssClass
    description
    descriptionPlacement
    errorMessage
    isRequired
    label
    labelPlacement
    size
    value
    hasPasswordStrengthIndicator
    hasPasswordVisibilityToggle
    minPasswordStrength
    inputs {
      placeholder
      label
      isHidden
      id
      customLabel
    }
  }
`;
