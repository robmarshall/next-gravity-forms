import React, { useEffect } from "react";
import classnames from "classnames";
import Captcha from "../../components/Captcha";
import Html from "../../components/Html";
import Input from "../../components/Input";
import Email from "../../components/Email";
import Select from "../../components/Select";
import SelectorList from "../../components/SelectorList";
import Textarea from "../../components/Textarea";
import Section from "../../components/Section";
import Fileupload from "../../components/Fileupload";
import DateField from "../../components/Date";
import Honeypot from "../../components/Honeypot";
import Name from "../../components/Name";
import Phone from "../../components/Phone";
import { valueToLowerCase } from "../../utils/helpers";
import { islabelHidden } from "../../utils/inputSettings";
import { getFieldWidthClass } from "../../utils/getFieldWidthClass";
import CustomField from "../../components/CustomField";
import { useFormContext } from "react-hook-form";
import { checkConditionalRendering } from "../../components/InputWrapper/helpers";
import Number from "../../components/Number";
import Consent from "../../components/Consent";

const FieldBuilder = ({
  databaseId,
  formFields,
  preOnSubmit,
  settings,
  formLayoutProps,
  customFormFields,
}) => {
  const { watch, setValue } = useFormContext();

  // Loop through fields and create
  return formFields.map((field) => {
    // Set the wrapper classes
    const {
      id,
      captchaTheme,
      description,
      descriptionPlacement,
      isRequired,
      subLabelPlacement,
      labelPlacement,
      layoutGridColumnSpan,
      type,
      visibility,
      conditionalLogic,
    } = field;

    const isHidden = checkConditionalRendering(
      conditionalLogic,
      watch,
      formFields
    );

    const fieldData = {
      ...field,
      isRequired: field.isRequired && !isHidden,
      isHidden,
    };

    const inputWrapperClass = classnames(
      "gfield",
      "gfield--type-" + valueToLowerCase(type),
      field.cssClass,
      { gfield_contains_required: isRequired },
      { gform_hidden: type === "HIDDEN" },
      { "hidden-label": islabelHidden(labelPlacement) },
      {
        [`gfield--width-${getFieldWidthClass(layoutGridColumnSpan)}`]:
          layoutGridColumnSpan,
      },
      `field_description_${
        descriptionPlacement &&
        valueToLowerCase(descriptionPlacement) !== "inherit"
          ? valueToLowerCase(descriptionPlacement)
          : valueToLowerCase(formLayoutProps?.descriptionPlacement) || "below"
      }`,
      `field_sublabel_${
        subLabelPlacement && valueToLowerCase(subLabelPlacement) !== "inherit"
          ? valueToLowerCase(subLabelPlacement)
          : valueToLowerCase(formLayoutProps?.subLabelPlacement) || "below"
      }`,
      `gfield--${description ? "has-description" : "no-description"}`,
      `gfield_visibility_${
        visibility ? valueToLowerCase(visibility) : "hidden"
      }`
    );

    const wrapId = `field_${databaseId}_${id}`;
    const name = `input_${id}`;
    const labelFor = `input_${databaseId}_${id}`;

    const props = {
      fieldData,
      gfId: id,
      name,
      labelFor,
      wrapClassName: inputWrapperClass,
      wrapId,
    };

    // this is needed in order to clear the field value once it gets hidden
    // otherwise conditional rendering won't working properly
    useEffect(() => {
      if (isHidden) {
        setValue(name, "");
      }
    }, [isHidden]);

    // check if there is custom filed to be rendered instead
    if (customFormFields[id])
      return (
        <CustomField key={id} {...props}>
          {customFormFields[id]}
        </CustomField>
      );

    switch (field.type) {
      // Add note for unsupported captcha field
      case "CAPTCHA":
        return (
          <Captcha
            key={id}
            captchaTheme={captchaTheme}
            ref={preOnSubmit}
            settings={settings?.recaptcha}
            {...props}
          />
        );
      case "HTML":
        return <Html key={id} {...props} />;
      // Start with the standard fields
      case "TEXT":
      case "HIDDEN":
      case "WEBSITE":
        return <Input key={id} {...props} />;
      case "NUMBER":
        return <Number key={id} {...props} />;
      case "PHONE":
        return <Phone key={id} {...props} />;
      case "DATE":
        return <DateField key={id} {...props} />;
      case "NAME":
        return <Name key={id} {...props} />;
      case "EMAIL":
        return <Email key={id} {...props} />;
      case "FILEUPLOAD":
        return <Fileupload key={id} {...props} />;
      case "TEXTAREA":
        return <Textarea key={id} {...props} />;
      case "SELECT":
      case "MULTISELECT":
        return <Select key={id} {...props} />;
      case "RADIO":
      case "CHECKBOX":
        return <SelectorList key={id} {...props} />;
      case "SECTION":
        return <Section key={id} {...props} />;
      case "HONEYPOT":
        return <Honeypot key={id} {...props} />;
      case "CONSENT":
        return <Consent key={id} {...props} />;
      default:
        return null;
    }
  });
};

export default FieldBuilder;
