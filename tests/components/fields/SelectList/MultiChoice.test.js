import renderGravityForm from "../../render";
import mockFormData from "../../../mocks/formData";
import { cleanup } from "@testing-library/react";

import {
  getByText,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { submitGravityForm } from "../../../../src/fetch";

// mock submit so we don't run real request
jest.mock("../../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

const choices = [
  {
    isSelected: false,
    text: "First Choice",
    value: "first",
  },
  {
    isSelected: false,
    text: "Second Choice",
    value: "second",
  },
  {
    isSelected: false,
    text: "Third Choice",
    value: "third",
  },
];

describe("MultiChoice field", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("as checkbox", () => {
    const field = {
      id: 1,
      type: "MULTI_CHOICE",
      inputType: "CHECKBOX",
      choices,
      label: "Multi Choice Checkboxes",
      isRequired: true,
    };

    const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

    let container;
    let element;
    beforeEach(() => {
      const rendered = renderGravityForm({
        data: {
          gfForm: { formFields: { nodes: [field] } },
        },
      });
      container = rendered.container;

      element = container.querySelector(`#${fieldId}`);
    });

    it("renders correctly", async () => {
      expect(element).toBeInTheDocument();

      expect(
        getByText(element, new RegExp(field.label, "i"))
      ).toBeInTheDocument();

      expect(container.querySelector(".gfield_checkbox")).toBeInTheDocument();
    });

    it("submits form when value is selected", async () => {
      fireEvent.click(screen.getByLabelText(/Third Choice/i));

      await act(async () => {
        fireEvent.submit(screen.getByRole("button", { name: "Submit1" }));
      });

      expect(submitGravityForm).toBeCalledWith({
        id: mockFormData.gfForm.databaseId,
        fieldValues: [
          {
            id: field.id,
            checkboxValues: [
              {
                inputId: 1.3,
                value: "third",
              },
            ],
          },
        ],
      });

      expect(
        container.querySelector(`.gravityform__error_message`)
      ).not.toBeInTheDocument();
    });

    it("should display required error when value is empty", async () => {
      fireEvent.submit(screen.getByRole("button", { name: "Submit1" }));

      await waitFor(() => {
        expect(getByText(element, /Field is required./i)).toBeInTheDocument();
      });

      expect(submitGravityForm).not.toBeCalled();
    });

    it("preset value works", async () => {
      const newField = {
        ...field,
        choices: choices.map((choice, index) => ({
          ...choice,
          isSelected: index === 0,
        })),
      };
      cleanup();

      renderGravityForm({
        data: {
          gfForm: { formFields: { nodes: [newField] } },
        },
      });

      await act(async () => {
        fireEvent.submit(screen.getByRole("button", { name: "Submit1" }));
      });

      expect(submitGravityForm).toBeCalledWith({
        id: mockFormData.gfForm.databaseId,
        fieldValues: [
          {
            id: field.id,
            checkboxValues: [
              {
                inputId: 1.1,
                value: "first",
              },
            ],
          },
        ],
      });
    });
  });

  describe("as radio", () => {
    const field = {
      id: 3,
      type: "MULTI_CHOICE",
      inputType: "RADIO",
      choices,
      label: "Multi Choice Radiobuttons",
      isRequired: true,
    };

    const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

    let container;
    let element;
    beforeEach(() => {
      const rendered = renderGravityForm({
        data: {
          gfForm: { formFields: { nodes: [field] } },
        },
      });
      container = rendered.container;

      element = container.querySelector(`#${fieldId}`);
    });

    it("renders correctly", async () => {
      expect(element).toBeInTheDocument();

      expect(
        getByText(element, new RegExp(field.label, "i"))
      ).toBeInTheDocument();

      expect(container.querySelector(".gfield_radio")).toBeInTheDocument();
    });

    it("submits form when value is selected", async () => {
      fireEvent.click(screen.getByLabelText(/Third Choice/i));

      await act(async () => {
        fireEvent.submit(screen.getByRole("button"));
      });

      expect(submitGravityForm).toBeCalledWith({
        id: mockFormData.gfForm.databaseId,
        fieldValues: [
          {
            value: "third",
            id: field.id,
          },
        ],
      });

      expect(
        container.querySelector(`.gravityform__error_message`)
      ).not.toBeInTheDocument();
    });

    it("should display required error when value is empty", async () => {
      fireEvent.submit(screen.getByRole("button"));

      await waitFor(() => {
        expect(getByText(element, /Field is required./i)).toBeInTheDocument();
      });

      expect(submitGravityForm).not.toBeCalled();
    });

    it("preset value works", async () => {
      const newField = {
        ...field,
        choices: choices.map((choice, index) => ({
          ...choice,
          isSelected: index === 0,
        })),
      };
      cleanup();

      renderGravityForm({
        data: {
          gfForm: { formFields: { nodes: [newField] } },
        },
      });

      await act(async () => {
        fireEvent.submit(screen.getByRole("button"));
      });

      expect(submitGravityForm).toBeCalledWith({
        id: mockFormData.gfForm.databaseId,
        fieldValues: [
          {
            value: "first",
            id: field.id,
          },
        ],
      });
    });
  });
});
