import { captchaFieldFragment } from "./components/Captcha";
import {
  dateFieldFragment,
  textFieldFragment,
  emailFieldFragment,
  hiddenFieldFragment,
  numberFieldFragment,
  phoneFieldFragment,
} from "./components/Input";
import { htmlFieldFragment } from "./components/Html";
import { multiSelectFieldFragment } from "./components/Multiselect";
import { selectFieldFragment } from "./components/Select";
import {
  radioFieldFragment,
  checkboxFieldFragment,
} from "./components/SelectorList";
import { textareaFieldFragment } from "./components/Textarea";
import { formConfirmationFragment, submitButtonFragment } from "./fragments";

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
          ${multiSelectFieldFragment}
          ${numberFieldFragment}
          ${phoneFieldFragment}
          ${radioFieldFragment}
          ${selectFieldFragment}
          ${textareaFieldFragment}
          ${textFieldFragment}
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
