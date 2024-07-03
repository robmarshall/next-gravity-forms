import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { valueToLowerCase, isNonEmptyObject } from "../../utils/helpers";
import { outputDescription } from "../../utils/inputSettings";

const InputWrapper = ({
  children,
  errors,
  inputData: {
    description,
    descriptionPlacement,
    isRequired,
    label,
    maxLength,
    type,
    inputs,
    choices,
  },
  labelFor,
  wrapClassName,
  ginputClassName,
  wrapId,
}) => {
  const joinedLabel = `${label}${
    isRequired ? '<span class="gfield_required">*</span>' : ""
  }`;

  const options = inputs || choices;
  const compareValue = type === "EMAIL" ? 1 : 0; // for email field inputs consist of 1 input by default, and 2 in case of confirmation email

  const Label = options?.length > compareValue ? "legend" : "label"; // if field has inputs, we render label as <legend>
  const Wrapper = options?.length > compareValue ? "fieldset" : "div"; // if field has inputs, we render wrapper as <fieldset>

  return (
    <Wrapper
      className={classnames(
        wrapClassName,
        errors?.type && "gravityform__field--error"
      )}
      id={wrapId}
    >
      {labelFor && (
        <Label
          className="gfield_label gform-field-label"
          htmlFor={labelFor}
          dangerouslySetInnerHTML={{ __html: joinedLabel }}
        />
      )}
      {outputDescription(description, descriptionPlacement, "above", errors)}
      <div
        className={classnames(
          `ginput_container ginput_container_${valueToLowerCase(type)}`,
          ginputClassName
        )}
      >
        {children}
        {maxLength > 0 && (
          <div className="charleft ginput_counter warningTextareaInfo">
            {maxLengthSentence(maxLength, type)}
          </div>
        )}
        {/* TODO: Implement number min/max, these currently aren't fetch by the source plugin
            https://docs.gravityforms.com/field-object/#number
            <div class="instruction ">
              Please enter a number from <strong>1</strong> to <strong>15</strong>.
            </div>
        */}
      </div>
      {outputDescription(description, descriptionPlacement, "below", errors)}
      {isNonEmptyObject(errors) && (
        <div
          aria-live="polite"
          className="gravityform__error_message gfield_description validation_message"
        >
          {errors.message}
        </div>
      )}
    </Wrapper>
  );
};

const maxLengthSentence = (length, type) => {
  const word = type === "number" ? "numbers" : "characters";
  return length && ` (maxiumum ${length} ${word})`;
};

export default InputWrapper;

InputWrapper.propTypes = {
  children: PropTypes.node,
  errors: PropTypes.object,
  errorMessage: PropTypes.string,
  inputData: PropTypes.shape({
    description: PropTypes.string,
    descriptionPlacement: PropTypes.string,
    label: PropTypes.string,
    isRequired: PropTypes.bool,
    maxLength: PropTypes.number,
    type: PropTypes.string,
    inputs: PropTypes.array,
    choices: PropTypes.array,
  }),
  labelFor: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  wrapClassName: PropTypes.string,
  wrapId: PropTypes.string,
  ginputClassName: PropTypes.string,
};
