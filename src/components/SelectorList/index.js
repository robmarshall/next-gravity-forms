import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";
import { useSettings } from "../../providers/SettingsContext";
import SelectDeselectButton from "./SelectDeselectButton";

// TODO: Enable Select All Choice
const SelectorList = ({ fieldData, name, ...wrapProps }) => {
  const { strings } = useSettings();
  const {
    id,
    choices,
    cssClass,
    hasSelectAll,
    isRequired,
    size,
    type: typeUpper,
  } = fieldData;

  const type = valueToLowerCase(typeUpper);

  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  // Due to checkboxes and radios are seen in GraphQL each choice is given an
  // error parameter. However in practice only one error matters.
  // So we check to see if one error exists across all choices.
  const error = errors[name]?.filter(({ message }) => {
    if (message) {
      return true;
    }
  })?.[0];

  return (
    <InputWrapper
      errors={error}
      inputData={fieldData}
      labelFor={name}
      {...wrapProps}
    >
      <ul className={`gfield_${type}`} id={name}>
        {choices.map(({ isSelected, text, value }, index) => {
          const choiceID = index + 1;
          return (
            <li key={`${name}-${index + 1}`}>
              <input
                className={classnames(
                  `gravityform__field__input__${type}`,
                  `gravityform__field__input__${type}--` + choiceID,
                  cssClass,
                  valueToLowerCase(size)
                )}
                defaultChecked={isSelected}
                id={`${name}_${choiceID}`}
                name={`${name}${type === "checkbox" ? `.${choiceID}` : ""}`}
                {...register(
                  `${name}${type === "checkbox" ? `.${choiceID}` : ""}`,
                  {
                    required: isRequired && strings.errors.required,
                  }
                )}
                type={type}
                value={value}
              />
              &nbsp;
              <label
                htmlFor={`${name}_${choiceID}`}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </li>
          );
        })}
        {hasSelectAll && (
          <SelectDeselectButton
            id={id}
            name={name}
            choices={choices}
            setValue={setValue}
          />
        )}
      </ul>
    </InputWrapper>
  );
};

export default SelectorList;

SelectorList.propTypes = {
  fieldData: PropTypes.shape({
    choices: PropTypes.array,
    cssClass: PropTypes.string,
    id: PropTypes.number,
    isRequired: PropTypes.bool,
    size: PropTypes.string,
    type: PropTypes.string,
  }),
  name: PropTypes.string,
  wrapProps: PropTypes.object,
};
