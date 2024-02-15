import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";
import { useSettings } from "../../providers/SettingsContext";

// TODO: Enable Select All Choice
const SelectorList = ({ fieldData, name, ...wrapProps }) => {
  const { strings } = useSettings();
  const {
    id,
    choices,
    cssClass,
    isRequired,
    size,
    type: typeUpper,
  } = fieldData;

  const type = valueToLowerCase(typeUpper);

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name]}
      inputData={fieldData}
      labelFor={name}
      {...wrapProps}
    >
      <div className={`gfield_${type}`} id={name}>
        {choices.map(({ isSelected, text, value }, index) => {
          const choiceID = index + 1;
          return (
            <div key={`${name}-${index + 1}`}>
              <input
                className={classnames(
                  `gravityform__field__input__${type}`,
                  `gravityform__field__input__${type}--` + choiceID,
                  cssClass,
                  valueToLowerCase(size)
                )}
                defaultChecked={isSelected}
                id={`${name}_${choiceID}`}
                name={name}
                {...register(name, {
                  required: isRequired && strings.errors.required,
                })}
                type={type}
                value={value}
              />
              &nbsp;
              <label
                htmlFor={`${name}_${choiceID}`}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          );
        })}
      </div>
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
