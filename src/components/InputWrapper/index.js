import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { valueToLowerCase, isNonEmptyObject } from "../../utils/helpers";
import { outputDescription } from "../../utils/inputSettings";
import { useFormContext } from "react-hook-form";
import { ConditionalWrapper } from "../General";
import { checkConditionalRendering } from "./helpers";

const InputWrapper = ({
  children,
  errors,
  inputData: {
    description,
    errorMessage,
    descriptionPlacement,
    isRequired,
    label,
    maxLength,
    type,
    inputs,
    conditionalLogic,
    name,
  },
  labelFor,
  wrapClassName,
  wrapId,
}) => {
  const joinedLabel = `${label}${
    isRequired ? '<span class="gfield_required">*</span>' : ""
  }`;

  const { watch } = useFormContext();

  const Label = inputs?.length > 0 ? "legend" : "label"; // if field has inputs, we render label as <legend>
  // @TODO replace li with div to match new GF markup
  const Wrapper = inputs?.length > 0 ? "fieldset" : "div"; // if field has inputs, we render wrapper as <fieldset>

  const isHidden = checkConditionalRendering(conditionalLogic, watch);

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
          htmlFor={labelFor}
          dangerouslySetInnerHTML={{ __html: joinedLabel }}
        />
      )}
      {outputDescription(description, descriptionPlacement, "above", errors)}
      <ConditionalWrapper // render only when there is name field added
        condition={!!name}
        wrapper={(children) => (
          <div
            className={`ginput_container ginput_container_${valueToLowerCase(
              type
            )}`}
          >
            {children}
          </div>
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
      </ConditionalWrapper>

      {outputDescription(description, descriptionPlacement, "below", errors)}
      {isNonEmptyObject(errors) && (
        <div
          aria-live="polite"
          className="gravityform__error_message gfield_description validation_message"
        >
          {/* @OTODO: i changed this so it checks for custom errorMessages first, is it enough? */}
          {errorMessage ? errorMessage : errors.message}
        </div>
      )}
    </Wrapper>
  );
};

const maxLengthSentence = (length, type) => {
  let word = type === "number" ? "numbers" : "characters";
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
  }),
  labelFor: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  wrapClassName: PropTypes.string,
  wrapId: PropTypes.string,
};
