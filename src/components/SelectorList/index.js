import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";
import { useSettings } from "../../providers/SettingsContext";
import SelectDeselectButton from "./SelectDeselectButton";
import OtherChoice from "./OtherChoice";

const SelectorList = ({ fieldData, name, labelFor, ...wrapProps }) => {
  const { strings, databaseId } = useSettings();
  const {
    id,
    choices,
    cssClass,
    errorMessage,
    hasSelectAll,
    isRequired,
    hasOtherChoice,
    size,
    type: typeUpper,
  } = fieldData;

  const type = valueToLowerCase(typeUpper);

  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name] || (hasOtherChoice && errors?.[`${name}_other`])}
      inputData={fieldData}
      labelFor={labelFor}
      {...wrapProps}
    >
      <div className={`gfield_${type}`} id={`input_${databaseId}_${id}`}>
        {choices.map(({ text, value, isDisabled }, index) => {
          const choiceID = type === "checkbox" ? index + 1 : index;
          return (
            <div
              className={classnames(
                "gchoice",
                `gchoice_${databaseId}_${id}_${choiceID}`
              )}
              key={`${name}-${index + 1}`}
            >
              <input
                className={classnames(
                  `gfield-choice-input`,
                  cssClass,
                  valueToLowerCase(size)
                )}
                id={`choice_${databaseId}_${id}_${choiceID}`}
                name={`${name}${type === "checkbox" ? `.${choiceID}` : ""}`}
                {...register(name, {
                  required:
                    isRequired && (errorMessage || strings.errors.required),
                })}
                type={type}
                value={value}
                disabled={isDisabled}
              />
              <label
                className="gform-field-label gform-field-label--type-inline"
                htmlFor={`choice_${databaseId}_${id}_${choiceID}`}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          );
        })}
        {hasOtherChoice && (
          <OtherChoice
            strings={strings}
            databaseId={databaseId}
            id={id}
            register={register}
            name={name}
            errorMessage={errorMessage}
            isRequired
            index={choices.length}
          />
        )}
        {hasSelectAll && (
          <SelectDeselectButton
            id={id}
            name={name}
            choices={choices}
            setValue={setValue}
          />
        )}
      </div>
    </InputWrapper>
  );
};

export default SelectorList;

SelectorList.propTypes = {
  fieldData: PropTypes.shape({
    choices: PropTypes.array,
    cssClass: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isRequired: PropTypes.bool,
    size: PropTypes.string,
    type: PropTypes.string,
    errorMessage: PropTypes.string,
    hasSelectAll: PropTypes.bool,
    hasOtherChoice: PropTypes.bool,
  }),
  name: PropTypes.string,
  labelFor: PropTypes.string,
  wrapProps: PropTypes.object,
};
