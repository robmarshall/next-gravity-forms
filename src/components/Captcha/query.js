import { conditionalLogicFragment } from "../../fragments";

export const captchaFieldFragment = /* GraphQL */ `
  ... on CaptchaField {
    captchaLanguage
    captchaTheme
    captchaType
    conditionalLogic {
      ${conditionalLogicFragment}
    }
    cssClass
    description
    descriptionPlacement
    errorMessage
    label
    simpleCaptchaBackgroundColor
    simpleCaptchaFontColor
    simpleCaptchaSize
  }
`;
