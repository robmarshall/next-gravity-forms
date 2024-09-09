import React, { useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Controller, useFormContext } from "react-hook-form";
import { valueToLowerCase } from "../../utils/helpers";
import InputWrapper from "../InputWrapper";
import { Input } from "../General";
import { useSettings } from "../../providers/SettingsContext";
import { InputMask, format } from "@react-input/mask";

const PhoneField = ({ fieldData, name, labelFor, ...wrapProps }) => {
  const { strings } = useSettings();
  const { phoneFormat, isRequired, size, errorMessage, autoComplete } =
    fieldData;

  const isStandard = "standard" === valueToLowerCase(phoneFormat);
  const mask = {
    mask: "(___) ___-____",
    replacement: { _: /\d/ },
  };

  const {
    control,
    formState: { errors },
    resetField,
  } = useFormContext();

  const describedBy = `gfield_description_${labelFor?.replace("name_", "")}`;

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
        render={({ field: { onChange, value, ref } }) => {
          const [detail, setDetail] = useState(null);

          return (
            <>
              {isStandard ? (
                <InputMask
                  className={classnames(valueToLowerCase(size))}
                  defaultValue={
                    value && isStandard ? format(value, mask) : value
                  }
                  id={labelFor}
                  ref={ref}
                  name={name}
                  aria-invalid={Boolean(errors?.[name])}
                  aria-required={isRequired}
                  aria-describedby={describedBy}
                  type="text"
                  {...mask}
                  showMask={!!value}
                  autoComplete={autoComplete}
                  onChange={onChange}
                  onBlur={() => {
                    if (detail?.input && !detail.isValid) {
                      resetField(name);
                    }
                  }}
                  onMask={(event) => setDetail(event.detail)}
                />
              ) : (
                <Input
                  fieldData={{ ...fieldData, type: "tel" }}
                  className={classnames(valueToLowerCase(size))}
                  onChange={onChange}
                  defaultValue={
                    value && isStandard ? format(value, mask) : value
                  }
                  errors={errors}
                  labelFor={labelFor}
                  ref={ref}
                />
              )}
            </>
          );
        }}
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
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
    defaultValue: PropTypes.string,
    errorMessage: PropTypes.string,
    phoneFormat: PropTypes.string,
    autoComplete: PropTypes.string,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapProps: PropTypes.object,
};
