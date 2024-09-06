import renderGravityForm from "./render";
import mockFormData from "../mocks/formData";

/**
 * Check if legend/ label/ fieldset fields get rendered based on field type and it's settings
 */
describe("InputWrapper", () => {
  const fields = [
    {
      id: 1,
      type: "EMAIL",
      databaseId: 1,
      label: "Email",
      fieldset: false,
    },
    {
      id: 2,
      type: "EMAIL",
      databaseId: 1,
      label: "Email with confirmation",
      inputs: [
        {
          id: 10,
          customLabel: "Enter Email",
          label: "Enter Email",
        },
        {
          id: 10.2,
          customLabel: "Confirm Email",
          label: "Confirm Email",
        },
      ],
      fieldset: true,
    },
    {
      id: 3,
      type: "SELECT",
      label: "Select",
      choices: [
        {
          isSelected: false,
          text: "First Choice",
          value: "First Choice",
        },
        {
          isSelected: false,
          text: "Second Choice",
          value: "Second Choice",
        },
      ],
      fieldset: false,
    },
    {
      id: 4,
      type: "RADIO",
      label: "Radios",
      choices: [
        {
          isOtherChoice: null,
          isSelected: false,
          text: "First Choice",
          value: "First Choice",
        },
        {
          isOtherChoice: null,
          isSelected: true,
          text: "Second Choice",
          value: "Second Choice",
        },
      ],
      fieldset: true,
    },
    {
      id: 5,
      type: "CHECKBOX",
      choices: [
        {
          isSelected: false,
          text: "First Choice",
          value: "First Choice",
        },
        {
          isSelected: false,
          text: "Third Choice",
          value: "Third Choice",
        },
      ],
      inputs: [
        {
          id: 1.1,
          name: "",
          label: "First Choice",
        },
        {
          id: 1.2,
          name: "",
          label: "Third Choice",
        },
      ],
      label: "Checkboxes",
      fieldset: true,
    },
    {
      id: 6,
      type: "DATE",
      dateFormat: "MDY",
      dateType: "FIELD",
      inputs: [
        {
          id: 6.1,
          label: "Month",
        },
        {
          id: 6.2,
          label: "Day",
        },
        {
          id: 6.3,
          label: "Year",
        },
      ],
      label: "Date",
      fieldset: true,
    },
    {
      id: 7,
      type: "CONSENT",
      checkboxLabel: "I agree to the privacy policy.",
      databaseId: 1,
      label: "Consent",
      fieldset: true,
    },
    {
      id: 8,
      type: "TEXT",
      databaseId: 1,
      label: "Text",
      fieldset: false,
    },
    {
      id: 9,
      label: "File",
      type: "FILEUPLOAD",
      canAcceptMultipleFiles: false,
      fieldset: false,
    },
  ];

  fields.forEach((field) => {
    // check if we render Label/ Legend / Fieldset correctly for the fields
    it(`renders correct markup for ${field.type}`, async () => {
      const { container } = renderGravityForm({
        data: {
          gfForm: { formFields: { nodes: [field] } },
        },
      });
      const { id, fieldset } = field;

      const fieldId = `field_${mockFormData.gfForm.databaseId}_${id}`;

      if (fieldset) {
        // Check if fieldset and legend elements exist when fieldset is true
        const fieldsetElement = container.querySelector(`fieldset#${fieldId}`);
        expect(fieldsetElement).toBeInTheDocument();

        const legendElement = fieldsetElement.querySelector("legend");
        expect(legendElement).toBeInTheDocument();
      } else {
        // Check if label exists when fieldset is false
        const labelElement = container.querySelector(
          `label[for="input_${mockFormData.gfForm.databaseId}_${id}"]`
        );
        expect(labelElement).toBeInTheDocument();
      }
    });
  });
});
