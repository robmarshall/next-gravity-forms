import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Controller, useFormContext } from "react-hook-form";
import { valueToLowerCase } from "../../utils/helpers";
import InputWrapper from "../InputWrapper";
import { Input } from "../General";
import { useSettings } from "../../providers/SettingsContext";
import { useMask, format } from "@react-input/mask";

const PhoneField = ({ fieldData, name, labelFor, ...wrapProps }) => {
  const { strings } = useSettings();
  const { phoneFormat, isRequired, type, size, errorMessage } = fieldData;

  const isStandard = "standard" === valueToLowerCase(phoneFormat);
  const mask = {
    mask: "(___) ___-____",
    replacement: { _: /\d/ },
  };

  const inputRef = useMask(mask);

  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={labelFor}
      {...wrapProps}
    >
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            fieldData={{ ...fieldData, type: isStandard ? "text" : "tel" }}
            className={classnames(valueToLowerCase(size), {
              gform_hidden: type === "HIDDEN",
            })}
            onChange={onChange}
            defaultValue={value && isStandard ? format(value, mask) : value}
            errors={errors}
            labelFor={labelFor}
            ref={isStandard ? inputRef : undefined}
          />
        )}
        rules={{
          required: isRequired && (errorMessage || strings.errors.required),
        }}
      />
    </InputWrapper>
  );
};

export default PhoneField;

PhoneField.propTypes = {
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    inputMaskValue: PropTypes.string,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
    defaultValue: PropTypes.string,
    errorMessage: PropTypes.string,
    phoneFormat: PropTypes.string,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapProps: PropTypes.object,
};
