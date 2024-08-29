import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import { Input } from "../General";
import { useSettings } from "../../providers/SettingsContext";

const ConsentField = ({ fieldData, name, labelFor, ...wrapProps }) => {
  const { strings } = useSettings();
  const { isRequired, type, errorMessage, checkboxLabel } = fieldData;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[`${name}`] || {}}
      inputData={fieldData}
      labelFor={labelFor}
      {...wrapProps}
    >
      <Input
        fieldData={{ ...fieldData, type: "checkbox" }}
        className={classnames({
          gform_hidden: type === "HIDDEN",
        })}
        errors={errors}
        labelFor={`${labelFor}_1`}
        {...register(name, {
          required: isRequired && (errorMessage || strings.errors.required),
        })}
      />
      {checkboxLabel && (
        <>
          <label
            className="gform-field-label gform-field-label--type-inline gfield_consent_label"
            htmlFor={`${labelFor}_1`}
            dangerouslySetInnerHTML={{ __html: checkboxLabel }}
          />
        </>
      )}
    </InputWrapper>
  );
};

export default ConsentField;

ConsentField.propTypes = {
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    checkboxLabel: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
    errorMessage: PropTypes.string,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapProps: PropTypes.object,
};
