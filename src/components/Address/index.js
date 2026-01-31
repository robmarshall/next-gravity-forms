import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { Controller } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import { Input, SubLabelWrapper, ConditionalWrapper } from "../General";
import { interpolateString } from "../../utils/helpers";
import { useSettings } from "../../providers/SettingsContext";

import locations from "../../utils/locations";
import { isSelectField } from "./helpers";

const Address = ({ fieldData, name, labelFor, ...wrapProps }) => {
  const {
    isRequired,
    inputs,
    subLabelPlacement,
    errorMessage,
    hasAutocomplete,
    addressType,
  } = fieldData;
  const { gfId } = wrapProps;

  const { strings } = useSettings();

  // Get special labels for state and ZIP fields
  const specialLabelsMap = strings?.address?.fieldLabelMap?.[addressType];

  const fieldInputs = inputs
    // Ensure the country field is not excluded for non-international addresses
    .map((input) =>
      input.key === "country" && addressType !== "INTERNATIONAL"
        ? { ...input, isHidden: false }
        : input
    )
    .filter((input) => !input.isHidden);

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
              { key, id, placeholder, autocompleteAttribute, label, ...rest },
              i
            ) => {
              const fieldId = `input_${gfId}_${id}`;
              const autoComplete =
                hasAutocomplete && autocompleteAttribute
                  ? autocompleteAttribute
                  : undefined;
              return (
                <ConditionalWrapper // render label for all fields except country field for non-international addresses
                  key={key}
                  condition={
                    !(key === "country" && addressType !== "INTERNATIONAL")
                  }
                  wrapper={(children) => (
                    <SubLabelWrapper
                      label={specialLabelsMap?.[key] || label}
                      {...rest}
                      name={fieldId}
                      subLabelPlacement={subLabelPlacement}
                      className="ginput_right"
                    >
                      {children}
                    </SubLabelWrapper>
                  )}
                >
                  {isSelectField(addressType, key) ? (
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
                      {locations[addressType].map(({ name }, index) => {
                        return (
                          <option
                            key={`${`input_${id}`}-${index}`}
                            value={name}
                          >
                            {name}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <Input
                      defaultValue={value?.[key]}
                      placeholder={placeholder}
                      fieldData={{
                        ...fieldData,
                        type:
                          key === "country" && addressType !== "INTERNATIONAL"
                            ? "hidden"
                            : "text",
                      }}
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
                </ConditionalWrapper>
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

export default Address;

Address.propTypes = {
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
    addressType: PropTypes.string,
  }),
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapProps: PropTypes.object,
};
