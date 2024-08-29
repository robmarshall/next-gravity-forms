import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { valueToLowerCase, isNonEmptyObject } from "../../utils/helpers";
import { outputDescription } from "../../utils/inputSettings";
import { useSettings } from "../../providers/SettingsContext";

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
    id,
    isHidden,
  },
  labelFor,
  wrapClassName,
  ginputClassName,
  wrapId,
  errorMessage,
}) => {
  const joinedLabel = `${label}${
    isRequired ? '<span className="gfield_required">*</span>' : ""
  }`;

  const { form } = useSettings();
  const { descriptionPlacement: globalPlacement } = form || {};
  const descPlacement =
    descriptionPlacement !== "INHERIT" ? descriptionPlacement : globalPlacement;

  const isSelectList = ["SELECT", "MULTISELECT"].includes(type);
  const options = inputs || (choices && !isSelectList ? choices : undefined);
  const compareValue = type === "EMAIL" ? 1 : 0; // for email field inputs consist of 1 input by default, and 2 in case of confirmation email

  const checkForChildren = options?.length > compareValue;
  const Label = checkForChildren ? "legend" : "label"; // if field has inputs, we render label as <legend>
  const Wrapper = checkForChildren ? "fieldset" : "div"; // if field has inputs, we render wrapper as <fieldset>

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
          dangerouslySetInnerHTML={{ __html: label && joinedLabel }}        
        />
      )}
      {description &&
        valueToLowerCase(descPlacement) == "above" &&
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
        valueToLowerCase(descPlacement) == "below" &&
        outputDescription(description, wrapId)}

      {isNonEmptyObject(errors) && (
        <div
          aria-live="polite"
          id={`validation_message_${id}`}
          className="gfield_description validation_message gfield_validation_message"
          /* @OTODO: i changed this so it checks for custom errorMessages first, is it enough? */
          dangerouslySetInnerHTML={{
            __html: errorMessage ? errorMessage : errors.message,
          }}
        />
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
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isHidden: PropTypes.bool,
  }),
  ginputClassName: PropTypes.string,
  labelFor: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  wrapClassName: PropTypes.string,
  wrapId: PropTypes.string,
};
