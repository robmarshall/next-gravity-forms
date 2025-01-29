import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../InputWrapper";
import classnames from "classnames";
import { useSettings } from "../../providers/SettingsContext";

const Honeypot = ({ gfId, wrapClassName, fieldData, labelFor }) => {
  const name = `input_${gfId}`;

  const { register } = useFormContext();
  const { databaseId, strings } = useSettings();

  const [label, setLabel] = useState(""); // Empty by default

  useEffect(() => {
    const labels = ["Name", "Email", "Phone", "Comments"];
    const randomIndex = Math.floor(Math.random() * labels.length);
    setLabel(labels[randomIndex]);
  }, []);

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
