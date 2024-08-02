import React from "react";
import { render } from "@testing-library/react";
import GravityFormForm from "../../src/index";
import { SettingsProvider } from "../../src/providers/SettingsContext";
import mockFormData from "../mocks/formData";
import mergeDeep from "../../src/utils/mergeDeep";

function renderGravityForm({
  data = {},
  presetValues = {},
  helperText = {},
  ...props
}) {
  return render(
    <SettingsProvider helperText={helperText} form={mockFormData}>
      <GravityFormForm
        data={mergeDeep(mockFormData, data)}
        presetValues={presetValues}
        helperText={helperText}
        {...props}
      />
    </SettingsProvider>
  );
}

export default renderGravityForm;
