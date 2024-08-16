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

describe("Radio field", () => {
  const field = {
    id: 3,
    type: "RADIO",
    choices: [
      {
        isOtherChoice: null,
        isSelected: false,
        text: "First Choice",
        value: "first",
      },
      {
        isOtherChoice: null,
        isSelected: false,
        text: "Second Choice",
        value: "second",
      },
      {
        isOtherChoice: null,
        isSelected: false,
        text: "Third Choice",
        value: "third",
      },
    ],
    hasOtherChoice: true,
    isRequired: true,
    label: "Radiobuttons",
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

    // renders other choice
    expect(
      screen.getByLabelText(/Other Choice, please specify/i)
    ).toBeInTheDocument();
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

  it("other choice works", async () => {
    fireEvent.click(screen.getByLabelText("Other"));

    fireEvent.input(screen.getByLabelText(/Other Choice, please specify/i), {
      target: {
        value: "Other value",
      },
    });
    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    expect(submitGravityForm).toBeCalledWith({
      id: mockFormData.gfForm.databaseId,
      fieldValues: [
        {
          value: "Other value",
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
    const newField = { ...field };
    newField.choices[0].isSelected = true;
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
