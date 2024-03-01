import React from "react";
import { render } from "@testing-library/react";
import GravityFormForm from "../../src/index";
import { SettingsProvider } from "../../src/providers/SettingsContext";
import mockFormData from "../mocks/formData";
import mergeDeep from "../../src/utils/mergeDeep";

function renderGravityForm(data = {}, presetValues = {}) {
  return render(
    <SettingsProvider
      helperText={{}}
      databaseId={mockFormData.gfForm.databaseId}
    >
      <GravityFormForm
        data={mergeDeep(mockFormData, data)}
        presetValues={presetValues}
      />
    </SettingsProvider>
  );
}

export default renderGravityForm;
