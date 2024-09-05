import { number, string } from "prop-types";
import React from "react";
import { useSettings } from "../../providers/SettingsContext";
import { interpolateString } from "../../utils/helpers";
import { useFormContext } from "react-hook-form";

const MaxLength = ({ name, maxLength }) => {
  const { strings } = useSettings();
  const { watch } = useFormContext();
  const textFieldValue = watch(name);

  return (
    <div
      className="charleft ginput_counter warningTextareaInfo"
      aria-live="polite"
    >
      {interpolateString(strings.counter, {
        value: textFieldValue?.length || 0,
        max: maxLength,
      })}
    </div>
  );
};

MaxLength.propTypes = {
  maxLength: number.isRequired,
  name: string.isRequired,
};

export default MaxLength;
