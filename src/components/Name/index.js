import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { Controller } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import { Input, SubLabelWrapper } from "../General";
import { interpolateString } from "../../utils/helpers";
import { useSettings } from "../../providers/SettingsContext";

const Name = ({ fieldData, name, labelFor, ...wrapProps }) => {
  const {
    inputs,
    subLabelPlacement,
    errorMessage,
    isRequired,
    hasAutocomplete,
  } = fieldData;
  const { gfId } = wrapProps;

  const { strings } = useSettings();
  const fieldInputs = [...inputs].filter((i) => !i.isHidden);

  const {
    control,
    formState: { errors },
  } = useFormContext();

  if (!fieldInputs?.length > 0) return null;

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
          const indexWithoutValue = fieldInputs.findIndex(
            ({ key }) => !value?.[key]
          );

          return fieldInputs.map(
            (
              { key, id, choices, placeholder, autocompleteAttribute, ...rest },
              i
            ) => {
              const fieldId = `input_${gfId}_${id}`;
              const autoComplete =
                hasAutocomplete && autocompleteAttribute
                  ? autocompleteAttribute
                  : undefined;

              return (
                <SubLabelWrapper
                  key={key}
                  {...rest}
                  name={fieldId}
                  subLabelPlacement={subLabelPlacement}
                  className="ginput_right"
                >
                  {choices?.length > 0 ? (
                    <select
                      aria-required={isRequired}
                      id={fieldId}
                      defaultValue={value?.[key]}
                      name={`input_${id}`}
                      onChange={(e) =>
                        onChange({ ...value, [key]: e.target.value })
                      }
                      ref={i === indexWithoutValue ? ref : undefined}
                      autoComplete={autoComplete}
                    >
                      <option value></option>
                      {choices.map(({ text, value }, index) => {
                        return (
                          <option
                            key={`${`input_${id}`}-${index}`}
                            value={value}
                          >
                            {text}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <Input
                      defaultValue={value?.[key]}
                      placeholder={placeholder}
                      fieldData={{ ...fieldData, type: "text" }}
                      errors={errors}
                      name={`input_${id}`}
                      id={fieldId}
                      onChange={(e) =>
                        onChange({ ...value, [key]: e.target.value })
                      }
                      ref={i === indexWithoutValue ? ref : undefined}
                      autoComplete={autoComplete}
                    />
                  )}
                </SubLabelWrapper>
              );
            }
          );
        }}
        rules={{
          validate: (value) => {
            if (!isRequired) return true;
            const emptyFields = fieldInputs
              .filter((i) => !value[i.key])
              .map((i) => i.label);

            if (emptyFields.length === 0) return true;
            return `${
              errorMessage || strings.errors.required
            } ${interpolateString(strings.errors.name, {
              fields: emptyFields.join(", "),
            })}`;
          },
        }}
      />
    </InputWrapper>
  );
};

export default Name;

Name.propTypes = {
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    inputMaskValue: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
    inputs: PropTypes.array,
    subLabelPlacement: PropTypes.string,
    errorMessage: PropTypes.string,
    hasAutocomplete: PropTypes.bool,
  }),
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapProps: PropTypes.object,
};
