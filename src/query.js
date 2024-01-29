import { captchaFieldFragment } from "./components/Captcha/query";
import {
  dateFieldFragment,
  textFieldFragment,
  hiddenFieldFragment,
  numberFieldFragment,
  phoneFieldFragment,
} from "./components/Input/query";
import { htmlFieldFragment } from "./components/Html/query";
import {
  selectFieldFragment,
  multiSelectFieldFragment,
} from "./components/Select/query";
import {
  radioFieldFragment,
  checkboxFieldFragment,
} from "./components/SelectorList/query";
import { sectionFieldFragment } from "./components/Section/query";
import { textareaFieldFragment } from "./components/Textarea/query";
import { formConfirmationFragment, submitButtonFragment } from "./fragments";
import { emailFieldFragment } from "./components/Email/query";
import { nameFieldFragment } from "./components/Name/query";

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
      submitButton {
        ${submitButtonFragment}
      }
      confirmations {
        ${formConfirmationFragment}
      }
      hasHoneypot
      formFields {
        nodes {
          displayOnly
          id
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
          ${nameFieldFragment}
        }
      }
    }
    gfSettings {
      recaptcha {
        publicKey
        type
      }
    }
  }
`;
