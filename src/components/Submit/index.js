import React from "react";
import { useSettings } from "../../providers/SettingsContext";

const SubmitButton = () => {
  const { loading, databaseId, form: { submitButton } = {} } = useSettings();
  return (
    <button
      className="gravityform__button gform_button button"
      disabled={loading}
      id={`gform_submit_button_${databaseId}`}
      type="submit"
    >
      {loading ? (
        <span className="gravityform__button__loading_span">Loading</span>
      ) : (
        submitButton?.text
      )}
    </button>
  );
};

export default SubmitButton;
