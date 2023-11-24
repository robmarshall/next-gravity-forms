import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { valueToLowerCase } from "../../utils/helpers";
import InputWrapper from "../InputWrapper";
import { Input } from "../General";
import strings from "../../utils/strings";
import getFieldError from "../../utils/getFieldError";

const standardType = (type) => {
  switch (type) {
    case "phone":
      return "tel";
    case "fileupload":
      return "file";
    default:
      return type;
  }
};

const InputField = ({ defaultValue, fieldData, name, ...wrapProps }) => {
  const { type: typeUpper } = fieldData;

  const type = valueToLowerCase(typeUpper);

  const inputType = standardType(type);

  const { inputMaskValue, isRequired, maxLength } = fieldData;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const regex = inputMaskValue ? new RegExp(inputMaskValue) : false;

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={name}
      {...wrapProps}
    >
      <Input
        defaultValue={defaultValue}
        fieldData={{ ...fieldData, type: valueToLowerCase(inputType) }}
        errors={errors}
        name={name}
        {...register(name, {
          required: isRequired && strings.errors.required,
          maxlength: {
            value: maxLength > 0 && maxLength,
            message:
              maxLength > 0 &&
              `${strings.errors.maxChar.front}  ${maxLength} ${strings.errors.maxChar.back}`,
          },
          pattern: {
            value: regex,
            message: regex && getFieldError(fieldData),
          },
        })}
      />
    </InputWrapper>
  );
};

export default InputField;

InputField.propTypes = {
  defaultValue: PropTypes.string,
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    inputMaskValue: PropTypes.string,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  wrapProps: PropTypes.object,
};
