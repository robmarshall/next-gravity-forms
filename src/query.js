import { captchaFieldFragment } from "./components/Captcha/query";
import {
  textFieldFragment,
  hiddenFieldFragment,
  websiteFieldFragment,
} from "./components/Input/query";
import { htmlFieldFragment } from "./components/Html/query";
import {
  selectFieldFragment,
  multiSelectFieldFragment,
} from "./components/Select/query";
import { phoneFieldFragment } from "./components/Phone/query";
import { numberFieldFragment } from "./components/Number/query";
import {
  radioFieldFragment,
  checkboxFieldFragment,
} from "./components/SelectorList/query";
import { consentFieldFragment } from "./components/Consent/query";
import { timeFieldFragment } from "./components/Time/query";
import { dateFieldFragment } from "./components/Date/query";
import { sectionFieldFragment } from "./components/Section/query";
import { textareaFieldFragment } from "./components/Textarea/query";
import { formConfirmationFragment, submitButtonFragment } from "./fragments";
import { emailFieldFragment } from "./components/Email/query";
import { fileuploadFieldFragment } from "./components/Fileupload/query";
import { nameFieldFragment } from "./components/Name/query";
import { pageFieldFragment } from "./container/FormBuilder/PageNav/query";
import { passwordFieldFragment } from "./components/Password/query";

export const submitMutationQuery = /* GraphQL */ `
  mutation submitForm($id: ID!, $fieldValues: [FormFieldValuesInput]!) {
    submitGfForm(input: { id: $id, fieldValues: $fieldValues }) {
      errors {
        id
        message
      }
    }
  }
`;

export const gravityFormQuery = /* GraphQL */ `
  query GetGravityForm($id: ID!) {
    gfForm(id: $id, idType: DATABASE_ID) {
      databaseId
      description
      descriptionPlacement
      labelPlacement
      subLabelPlacement
      title
      cssClass
      submitButton {
        ${submitButtonFragment}
      }
      confirmations {
        ${formConfirmationFragment}
      }
      hasHoneypot
      entryLimits {
        hasLimit
        limitReachedMessage
        maxEntries
      }
      formFields(first: 999){
        nodes {
          displayOnly
          id: databaseId
          inputType
          layoutGridColumnSpan
          layoutSpacerGridColumnSpan
          pageNumber
          type
          visibility
          ${captchaFieldFragment}
          ${checkboxFieldFragment}
          ${dateFieldFragment}
          ${emailFieldFragment}
          ${hiddenFieldFragment}
          ${htmlFieldFragment}
          ${numberFieldFragment}
          ${phoneFieldFragment}
          ${radioFieldFragment}
          ${selectFieldFragment}
          ${multiSelectFieldFragment}
          ${textareaFieldFragment}
          ${textFieldFragment}
          ${sectionFieldFragment}
          ${fileuploadFieldFragment}
          ${nameFieldFragment}
          ${pageFieldFragment}
          ${consentFieldFragment}
          ${websiteFieldFragment}
          ${passwordFieldFragment}
          ${timeFieldFragment}
        }
      }
      pagination {
        pageNames
        lastPageButton {
          text
          type
          imageUrl
        }
        hasProgressbarOnConfirmation
        progressbarCompletionText
        style
        type
        color
        backgroundColor
      }
    }
    gfSettings {
      recaptcha {
        publicKey
        type
      }
      currency
    }
  }
`;
