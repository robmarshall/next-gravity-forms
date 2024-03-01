import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";
import { screen } from "@testing-library/react";

const presetValues = {
  textField: "Preset test",
  emailField: "presettest@gmail.com",
  textAreaField: "Preset test",
  selectField: "third",
  multiselectField: "third",
  radioField: "third",
  checkboxField: "third",
};

describe("Text field", () => {
  const fieldId = `field_${mockFormData.gfForm.databaseId}_${11}`;
  const label = "INPUT LABEL";

  const configureAndRenderForm = ({
    fieldType,
    defaultValue = null,
    inputName = null,
    additionalConfig = {},
  }) => {
    const fieldConfig = {
      id: fieldId,
      type: fieldType,
      label: label,
      ...(defaultValue && { defaultValue: defaultValue }),
      ...(inputName && { inputName: inputName }),
      ...additionalConfig,
    };

    renderGravityForm(
      {
        gfForm: {
          formFields: {
            nodes: [fieldConfig],
          },
        },
      },
      presetValues
    );
  };

  // Text, textArea
  describe("Gravity Form default value handling", () => {
    describe("Input contains default value if specified", () => {
      test.each([
        ["TEXT", "Hello there"],
        ["TEXTAREA", "Hello there"],
      ])("default value for type %s", (fieldType, defaultValue) => {
        configureAndRenderForm({ fieldType, defaultValue });

        const inputElement = screen.getByLabelText(label);
        expect(inputElement.value).toBe(defaultValue);
      });
    });

    describe("Input contains preset value if specified", () => {
      test.each([
        ["TEXT", "Hello there", "textField"],
        ["TEXTAREA", "Hello there", "textAreaField"],
      ])("preset value for type %s", (fieldType, defaultValue, inputName) => {
        configureAndRenderForm({ fieldType, defaultValue, inputName });

        const inputElement = screen.getByLabelText(label);
        expect(inputElement.value).toBe(presetValues[inputName]);
      });
    });

    // Email
    const getMailInputs = (defaultValue) => {
      return {
        inputs: [
          {
            id: 10,
            name: "",
            autocompleteAttribute: "email",
            customLabel: "Enter Email",
            defaultValue: defaultValue,
            label: "Enter Email",
          },
          {
            id: 10.2,
            name: "",
            autocompleteAttribute: "email",
            customLabel: "Confirm Email",
            defaultValue: defaultValue,
            label: "Confirm Email",
          },
        ],
      };
    };

    it("Input contains default value for type EMAIL", () => {
      const defaultValue = "test@gmail.com";
      configureAndRenderForm({
        fieldType: "EMAIL",
        defaultValue: defaultValue,
        additionalConfig: getMailInputs(defaultValue),
      });

      const mainField = screen.getByLabelText("Enter Email");
      expect(mainField.value).toBe(defaultValue);

      const confirmField = screen.getByLabelText("Confirm Email");
      expect(confirmField.value).toBe(defaultValue);
    });

    it("Input contains preset value for type EMAIL", () => {
      const inputName = "emailField";
      const defaultValue = "test@gmail.com";
      configureAndRenderForm({
        fieldType: "EMAIL",
        inputName: inputName,
        additionalConfig: getMailInputs(defaultValue),
      });

      const mainField = screen.getByLabelText("Enter Email");
      expect(mainField.value).toBe(presetValues[inputName]);

      const confirmField = screen.getByLabelText("Confirm Email");
      expect(confirmField.value).toBe(presetValues[inputName]);
    });

    // Select, multiselect, radio, and checkbox
    const choices = [
      {
        isSelected: false,
        text: "First Choice",
        value: "first",
      },
      {
        isSelected: true,
        text: "Second Choice",
        value: "second",
      },
      {
        isSelected: false,
        text: "Third Choice",
        value: "third",
      },
    ];

    /**
     * Asserts the checked state of a list of choices against expected states.
     *
     * @param {boolean[]} choicesState - An array of expected checked states for the choices,
     * where each element corresponds to a choice in the `choices` array. The value is `true`
     * if the choice is expected to be checked, and `false` otherwise.
     *
     * @example
     * // if you want to assert that only second choice is checked:
     * assertChoicesCheckedState([false, true, false]);
     *  */
    function assertChoicesCheckedState(choicesState) {
      choices.forEach(({ text }, index) => {
        const inputElement = screen.getByLabelText(text);
        expect(inputElement.checked).toBe(choicesState[index]);
      });
    }

    describe("Input contains default value if specified", () => {
      test.each([
        ["SELECT", "second"],
        ["MULTISELECT", "second"],
        ["RADIO", "second"],
        ["CHECKBOX", "second"],
      ])("default value for type %s", (fieldType, defaultValue) => {
        configureAndRenderForm({
          fieldType,
          additionalConfig: { choices },
        });

        if (fieldType === "SELECT" || fieldType === "MULTISELECT") {
          const inputElement = screen.getByLabelText(label);
          expect(inputElement.value).toBe(defaultValue);
        } else if (fieldType === "RADIO" || fieldType === "CHECKBOX") {
          assertChoicesCheckedState([false, true, false]);
        }
      });
    });

    describe("Input contains preset value if specified", () => {
      test.each([
        ["SELECT", "selectField"],
        ["MULTISELECT", "multiselectField"],
        ["RADIO", "radioField"],
        ["CHECKBOX", "checkboxField"],
      ])("preset value for type %s", (fieldType, inputName) => {
        configureAndRenderForm({
          fieldType,
          inputName,
          additionalConfig: { choices },
        });

        if (fieldType === "SELECT" || fieldType === "MULTISELECT") {
          const inputElement = screen.getByLabelText(label);
          expect(inputElement.value).toBe(presetValues[inputName]);
        } else if (fieldType === "CHECKBOX") {
          assertChoicesCheckedState([false, true, true]);
        } else if (fieldType === "RADIO") {
          assertChoicesCheckedState([false, false, true]);
        }
      });
    });
  });
});
