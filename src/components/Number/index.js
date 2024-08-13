import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { useFormContext } from "react-hook-form";
import { valueToLowerCase } from "../../utils/helpers";
import InputWrapper from "../InputWrapper";
import { Input } from "../General";
import { useSettings } from "../../providers/SettingsContext";
import { getRangeUtilities } from "./helpers";

const NumberField = ({ fieldData, name, labelFor, ...wrapProps }) => {
  const { strings } = useSettings();
  const { isRequired, type, size, errorMessage, rangeMin, rangeMax, id } =
    fieldData;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { rangeInstruction, showInstruction, rangeValidation } =
    getRangeUtilities({
      strings,
      range: { minValue: rangeMin, maxValue: rangeMax },
      isError: !!errors?.[name],
      customErrorText: errorMessage,
    });

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={labelFor}
      {...wrapProps}
    >
      <Input
        fieldData={{ ...fieldData, type: valueToLowerCase(type) }}
        className={classnames(valueToLowerCase(size), {
          gform_hidden: type === "HIDDEN",
        })}
        errors={errors}
        labelFor={labelFor}
        min={rangeMin}
        max={rangeMax}
        step="any"
        {...register(name, {
          required: isRequired && (errorMessage || strings.errors.required),
          ...rangeValidation,
        })}
      />
      {showInstruction && (
        <div
          className="gfield_description instruction"
          id={`gfield_instruction_${id}`}
          dangerouslySetInnerHTML={{
            __html: rangeInstruction,
          }}
        />
      )}
    </InputWrapper>
  );
};

export default NumberField;

NumberField.propTypes = {
  fieldData: PropTypes.shape({
    id: PropTypes.number,
    cssClass: PropTypes.string,
    inputMaskValue: PropTypes.string,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
    defaultValue: PropTypes.string,
    errorMessage: PropTypes.string,
    rangeMax: PropTypes.number,
    rangeMin: PropTypes.number,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapProps: PropTypes.object,
};
