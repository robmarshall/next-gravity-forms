import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";
import { getByText, screen, fireEvent, waitFor } from "@testing-library/react";

// mock submit so we don't run real request
jest.mock("../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("Custom error messages", () => {
  const fieldId = `field_${mockFormData.gfForm.databaseId}_${11}`;
  const label = "INPUT LABEL";

  afterEach(() => {
    jest.resetAllMocks();
  });

  const configureAndRenderForm = ({
    fieldType,
    errorMessage,
    inputName = null,
    additionalConfig = {},
  }) => {
    const fieldConfig = {
      id: 11,
      isRequired: true,
      type: fieldType,
      label: label,
      errorMessage,
      ...(inputName && { inputName: inputName }),
      ...additionalConfig,
    };

    return renderGravityForm({
      gfForm: {
        formFields: {
          nodes: [fieldConfig],
        },
      },
    });
  };

  describe("Input fields render custom error message", () => {
    test.each([
      ["TEXT", "Text error"],
      ["NUMBER", "Number error"],
      ["PHONE", "Phone error"],
      ["TEXTAREA", "Textarea error"],
      ["EMAIL", "Email error"],
    ])("%s", async (fieldType, errorMessage) => {
      const rendered = configureAndRenderForm({ fieldType, errorMessage });

      const container = rendered.container;
      const element = container.querySelector(`#${fieldId}`);

      fireEvent.submit(screen.getByRole("button"));

      await waitFor(() => {
        expect(getByText(element, errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe("List fields render custom error message", () => {
    const choices = [
      {
        isSelected: false,
        text: "Second Choice",
        value: "",
      },
      {
        isSelected: false,
        text: "First Choice",
        value: "first",
      },
      {
        isSelected: false,
        text: "Third Choice",
        value: "third",
      },
    ];

    test.each([
      ["SELECT", "Select error"],
      ["MULTISELECT", "Select error"],
      ["RADIO", "Radio error"],
      ["CHECKBOX", "Checkbox error"],
    ])("%s", async (fieldType, errorMessage) => {
      const rendered = configureAndRenderForm({
        fieldType,
        errorMessage,
        additionalConfig: { choices },
      });

      const container = rendered.container;
      const element = container.querySelector(`#${fieldId}`);

      fireEvent.submit(screen.getByRole("button"));

      await waitFor(() => {
        expect(getByText(element, errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe("Date fields render custom error message", () => {
    test.each([["DATE", "Date error"]])(
      "%s",
      async (fieldType, errorMessage) => {
        const rendered = configureAndRenderForm({
          fieldType,
          errorMessage,
          additionalConfig: {
            dateFormat: "YMD_DOT",
            dateType: "DROPDOWN",
            inputs: [
              {
                label: "Month",
                id: 11.1,
              },
              {
                label: "Day",
                id: 11.2,
              },
              {
                label: "Year",
                id: 11.3,
              },
            ],
          },
        });

        const container = rendered.container;
        const element = container.querySelector(`#${fieldId}`);

        fireEvent.submit(screen.getByRole("button"));

        await waitFor(() => {
          expect(getByText(element, errorMessage)).toBeInTheDocument();
        });
      }
    );
  });
});
