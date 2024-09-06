import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { valueToLowerCase, isNonEmptyObject } from "../../utils/helpers";
import { outputDescription } from "../../utils/inputSettings";
import { useSettings } from "../../providers/SettingsContext";
import getLabelAndWrapperComponents from "../../utils/getLabelAndWrapperComponents";
import classNames from "classnames";

const InputWrapper = ({
  children,
  errors,
  inputData: {
    description,
    descriptionPlacement,
    isRequired,
    label,
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
  const { Label, Wrapper } = getLabelAndWrapperComponents(
    type,
    inputs,
    choices
  );

  const { descriptionPlacement: globalPlacement } = form || {};
  const descPlacement =
    descriptionPlacement !== "INHERIT" ? descriptionPlacement : globalPlacement;

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
          htmlFor={Label === "legend" ? undefined : labelFor}
          dangerouslySetInnerHTML={{ __html: label && joinedLabel }}
        />
      )}
      {description &&
        valueToLowerCase(descPlacement) == "above" &&
        outputDescription(description, wrapId)}
      <div
        id={classNames(Label === "legend" && `${labelFor}_container`)} // only set an id when there are child elements like options
        className={classnames(
          `ginput_container ginput_container_${valueToLowerCase(type)}`,
          ginputClassName
        )}
      >
        {children}
      </div>

      {description &&
        valueToLowerCase(descPlacement) == "below" &&
        outputDescription(description, wrapId)}

      {isNonEmptyObject(errors) && (
        <div
          aria-live="polite"
          id={`validation_message_${id}`}
          className="gfield_description validation_message gfield_validation_message"
          dangerouslySetInnerHTML={{
            __html: errorMessage ? errorMessage : errors.message,
          }}
        />
      )}
    </Wrapper>
  );
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
