import { captchaFieldFragment } from "./components/Captcha/query";
import {
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
import { dateFieldFragment } from "./components/Date/query";
import { sectionFieldFragment } from "./components/Section/query";
import { textareaFieldFragment } from "./components/Textarea/query";
import { formConfirmationFragment, submitButtonFragment } from "./fragments";
import { emailFieldFragment } from "./components/Email/query";
import { fileuploadFieldFragment } from "./components/Fileupload/query";
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
