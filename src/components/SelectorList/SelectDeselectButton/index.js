import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSettings } from "../../../providers/SettingsContext";

const SelectDeselectButton = ({ id, name, choices, setValue }) => {
  const { strings } = useSettings();

  const areAllPreselected = () => {
    return choices.every((obj) => obj.isSelected);
  };

  // For initial value we check for the case when
  // all checkboxes are preselected in the backend
  const [shouldAllBeSelected, setShouldAllBeSelected] = useState(() => {
    return !areAllPreselected();
  });

  // Toggles the selection state of all checkboxes
  const handleSelectDeselectAll = () => {
    // Prepare the updated values for checkboxes:
    const updatedValues = shouldAllBeSelected
      ? choices.map((choice) => choice.value)
      : new Array(choices.length).fill(false);

    // First element is set to null because choiceID starts from 1
    // so first element of checkboxes values array is empty
    setValue(name, [null, ...updatedValues]);

    setShouldAllBeSelected(!shouldAllBeSelected);
  };

  return (
    <button
      type="button"
      onClick={handleSelectDeselectAll}
      id={`button_${id}_select_all`}
      className="gfield_choice_all_toggle gform-theme-button--size-sm"
      data-checked={+!shouldAllBeSelected}
      data-label-select={strings.checkboxes.selectAll}
      data-label-deselect={strings.checkboxes.deselectAll}
    >
      {shouldAllBeSelected
        ? strings.checkboxes.selectAll
        : strings.checkboxes.deselectAll}
    </button>
  );
};

export default SelectDeselectButton;

SelectDeselectButton.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  choices: PropTypes.array,
  setValue: PropTypes.func,
};
