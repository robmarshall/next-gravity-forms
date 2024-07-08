import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import classnames from "classnames";
import { useSettings } from "../../providers/SettingsContext";

const Honeypot = ({ gfId, wrapClassName, fieldData, labelFor }) => {
  const labels = ["Name", "Email", "Phone", "Comments"];
  const label = labels[Math.floor(Math.random() * Math.floor(4))];
  const name = `input_${gfId}`;

  const { register } = useFormContext();
  const { databaseId, strings } = useSettings();

  return (
    <InputWrapper
      labelFor={labelFor}
      inputData={{
        label,
        description: strings.honeypot,
        ...fieldData,
      }}
      wrapClassName={classnames(
        wrapClassName,
        "gform_validation_container",
        "gfield--type-honeypot"
      )}
    >
      <input
        name={name}
        id={`input_${databaseId}_${gfId}`}
        type="text"
        autoComplete="new-password"
        {...register(name)}
      />
    </InputWrapper>
  );
};

Honeypot.propTypes = {
  fieldData: PropTypes.object,
  value: PropTypes.string,
  gfId: PropTypes.number,
  wrapClassName: PropTypes.string,
  labelFor: PropTypes.string,
};

export default Honeypot;
