import classnames from "classnames";

import Captcha from "../../components/Captcha";
import Html from "../../components/Html";
import Input from "../../components/Input";
import Email from "../../components/Email";
import Multiselect from "../../components/Multiselect";
import Select from "../../components/Select";
import SelectorList from "../../components/SelectorList";
import Textarea from "../../components/Textarea";
import Section from "../../components/Section";
import { valueToLowerCase } from "../../utils/helpers";
import { islabelHidden } from "../../utils/inputSettings";

const FieldBuilder = ({
  databaseId,
  formFields,
  // formLoading,
  preOnSubmit,
  presetValues,
  settings,
  subLabelPlacement: formSubLabelPlacement,
  labelPlacement: formLabelPlacement,
}) => {
  // Loop through fields and create
  return formFields.map((field) => {
    // Set the wrapper classes
    const {
      id,
      captchaTheme,
      descriptionPlacement,
      isRequired,
      subLabelPlacement: fieldSubLabelPlacement,
      labelPlacement: fieldLabelPlacement,
      type,
      size,
      visibility,
    } = field;

    // take into account general settings as fallback
    const labelPlacement =
      fieldLabelPlacement && fieldLabelPlacement !== "INHERIT"
        ? fieldLabelPlacement
        : formLabelPlacement;

    const subLabelPlacement =
      fieldSubLabelPlacement && fieldSubLabelPlacement !== "INHERIT"
        ? fieldSubLabelPlacement
        : formSubLabelPlacement;

    const fieldData = { ...field, labelPlacement, subLabelPlacement };

    // const isHiddenField = type === "HIDDEN";

    const inputWrapperClass = classnames(
      "gfield",
      "gravityform__field",
      "gravityform__field__" + valueToLowerCase(type),
      { [`gravityform__field--${valueToLowerCase(size)}`]: size },
      field.cssClass,
      { "field-required": isRequired },
      { "hidden-label": islabelHidden(labelPlacement) },
      { gfield_contains_required: isRequired },
      {
        [`field_sublabel_${valueToLowerCase(subLabelPlacement)}`]:
          valueToLowerCase(subLabelPlacement),
      },
      {
        [`field_description_${valueToLowerCase(descriptionPlacement)}`]:
          descriptionPlacement,
      },
      `gfield_visibility_${valueToLowerCase ? "hidden" : valueToLowerCase(visibility)}`
    );

    const wrapId = `field_${databaseId}_${id}`;

    //TODO: Should this match GF version "input_form.id_input.id"
    const inputName = `input_${field.id}`;

    const defaultValue = presetValues?.[inputName] || field?.defaultValue || "";

    switch (field.type) {
      // Add note for unsupported captcha field
      case "CAPTCHA":
        return (
          <Captcha
            captchaTheme={captchaTheme}
            fieldData={fieldData}
            gfId={id}
            key={id}
            name={inputName}
            ref={preOnSubmit}
            settings={settings?.recaptcha}
            wrapClassName={inputWrapperClass}
          />
        );
      case "HTML":
        return (
          <Html
            fieldData={fieldData}
            key={id}
            gfId={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      // Start with the standard fields
      case "TEXT":
      case "NUMBER":
      case "HIDDEN":
      case "DATE":
      case "PHONE":
        return (
          <Input
            fieldData={fieldData}
            key={id}
            gfId={id}
            name={inputName}
            defaultValue={defaultValue}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "EMAIL":
        return (
          <Email
            fieldData={fieldData}
            key={id}
            gfId={id}
            name={inputName}
            defaultValue={defaultValue}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "TEXTAREA":
        return (
          <Textarea
            fieldData={fieldData}
            defaultValue={defaultValue}
            key={id}
            gfId={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "SELECT":
        return (
          <Select
            fieldData={fieldData}
            key={id}
            gfId={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "MULTISELECT":
        return (
          <Multiselect
            fieldData={fieldData}
            key={id}
            gfId={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "RADIO":
      case "CHECKBOX":
        return (
          <SelectorList
            fieldData={fieldData}
            key={id}
            gfId={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "SECTION":
        return (
          <Section
            fieldData={fieldData}
            key={id}
            gfId={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );

      default:
        return null;
    }
  });
};

export default FieldBuilder;
