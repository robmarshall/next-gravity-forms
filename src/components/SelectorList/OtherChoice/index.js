import { bool, func, number, object, string } from "prop-types";
import React, { useState } from "react";

const OtherChoice = ({
  strings,
  databaseId,
  id,
  index,
  name,
  register,
  isRequired,
  errorMessage,
}) => {
  const fieldId = `${databaseId}_${id}`;
  const defaultValue =
    strings.radio[`otherChoice_${id}`] || strings.radio.otherChoice || "Other";
  const label =
    strings.radio[`otherChoiceLabel_${id}`] ||
    strings.radio.otherChoiceLabel ||
    "Other Choice, please specify";

  const [isDisabled, setDisabled] = useState(true);
  return (
    <div className={`gchoice gchoice_${fieldId}_${index}`}>
      <input
        className="gfield-choice-input"
        name={name}
        type="radio"
        value="gf_other_choice"
        id={`choice_${fieldId}_${index}`}
        {...register(name, {
          onChange: (e) => {
            setDisabled(!(e.target.value === "gf_other_choice"));
          },
        })}
      />
      &nbsp;
      <label
        htmlFor={`choice_${fieldId}_${index}`}
        id={`label_${fieldId}_${index}`}
        className="gform-field-label gform-field-label--type-inline"
      >
        {defaultValue}
      </label>
      <input
        className="gchoice_other_control"
        id={`input_${fieldId}_other`}
        name={`input_${id}_other`}
        {...register(`input_${id}_other`, {
          required:
            !isDisabled &&
            isRequired &&
            (errorMessage || strings.errors.required),
        })}
        type="text"
        aria-label={label}
        defaultValue={defaultValue}
        disabled={isDisabled}
      />
    </div>
  );
};

OtherChoice.propTypes = {
  index: number.isRequired,
  strings: object.isRequired,
  databaseId: number.isRequired,
  id: number.isRequired,
  register: func.isRequired,
  name: string.isRequired,
  isRequired: bool,
  errorMessage: string,
};

export default OtherChoice;
