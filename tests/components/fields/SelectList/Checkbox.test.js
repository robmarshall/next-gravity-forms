import renderGravityForm from "../../render";
import mockFormData from "../../../mocks/formData";
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

describe("Checkbox field", () => {
  const field = {
    id: 1,
    type: "CHECKBOX",
    choices: [
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
      {
        isSelected: false,
        text: "Fouthh",
        value: "fourth",
      },
    ],
    hasSelectAll: true,
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
      {
        id: 1.3,
        name: "",
        label: "Fouthh",
      },
    ],
    label: "Checkboxes",
    isRequired: true,
  };

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

  afterEach(() => {
    jest.resetAllMocks();
  });

  const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

  it("renders correctly", async () => {
    // radio field rendered
    expect(element).toBeInTheDocument();

    // renders legend element
    expect(
      getByText(element, new RegExp(field.label, "i"))
    ).toBeInTheDocument();

    // renders select all
    expect(
      screen.getByRole("button", { name: "Select All" })
    ).toBeInTheDocument();
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
              inputId: 1.2,
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

  it("select all works", async () => {
    fireEvent.click(screen.getByRole("button", { name: "Select All" }));

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
            {
              inputId: 1.2,
              value: "third",
            },
            {
              inputId: 1.3,
              value: "fourth",
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
});
