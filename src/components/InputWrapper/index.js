import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { valueToLowerCase, isNonEmptyObject } from "../../utils/helpers";
import { outputDescription } from "../../utils/inputSettings";
import { useFormContext } from "react-hook-form";
import { checkConditionalRendering } from "./helpers";

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
    conditionalLogic,
    choices,
  },
  labelFor,
  wrapClassName,
  ginputClassName,
  wrapId,
}) => {
  const joinedLabel = `${label}${
    isRequired ? '<span className="gfield_required">*</span>' : ""
  }`;

  const { watch, formFields } = useFormContext();

  const options =
    inputs || (choices && !["SELECT", "MULTISELECT"].includes(type));
  const compareValue = type === "EMAIL" ? 1 : 0; // for email field inputs consist of 1 input by default, and 2 in case of confirmation email

  const checkForChildren = options?.length > compareValue;
  const Label = checkForChildren ? "legend" : "label"; // if field has inputs, we render label as <legend>
  const Wrapper = checkForChildren ? "fieldset" : "div"; // if field has inputs, we render wrapper as <fieldset>

  const isHidden = checkConditionalRendering(
    conditionalLogic,
    watch,
    formFields
  );

  return (
    <Wrapper
      className={classnames(
        wrapClassName,
        errors?.type && "gravityform__field--error"
      )}
      id={wrapId}
      style={isHidden ? { display: "none" } : undefined}
    >
      {labelFor && (
        <Label
          className="gfield_label gform-field-label"
          htmlFor={checkForChildren ? undefined : labelFor}
          dangerouslySetInnerHTML={{ __html: joinedLabel }}
        />
      )}
      {description &&
        valueToLowerCase(descriptionPlacement) == "above" &&
        outputDescription(description, wrapId)}
      <div
        id={checkForChildren ? labelFor : undefined} // only set an id when there are child elements like options
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

      {description &&
        (valueToLowerCase(descriptionPlacement) == "below" ||
          valueToLowerCase(descriptionPlacement) == "inherit") &&
        outputDescription(description, wrapId)}

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
    conditionalLogic: PropTypes.object,
    inputs: PropTypes.array,
    choices: PropTypes.array,
  }),
  ginputClassName: PropTypes.string,
  labelFor: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  wrapClassName: PropTypes.string,
  wrapId: PropTypes.string,
};
