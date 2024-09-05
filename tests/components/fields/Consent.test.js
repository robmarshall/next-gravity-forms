import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";
import { getByText, screen, fireEvent, waitFor } from "@testing-library/react";

import { submitGravityForm } from "../../../src/fetch";

// mock submit so we don't run real request
jest.mock("../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("Consent field", () => {
  const field = {
    id: "11",
    type: "CONSENT",
    checkboxLabel: "I agree to the privacy policy.",
    databaseId: 11,
    isRequired: true,
    label: "Consent",
  };
  let element;

  beforeEach(() => {
    const { container } = renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: [field] } },
      },
    });
    element = container.querySelector(`#${fieldId}`);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

  it("renders correctly", async () => {
    expect(element).toBeInTheDocument();

    expect(screen.getByLabelText(field.checkboxLabel)).toBeInTheDocument();
  });

  it("should display required error when value is empty", async () => {
    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(getByText(element, /Field is required./i)).toBeInTheDocument();
    });

    expect(submitGravityForm).not.toBeCalled();
  });

  it("should pass some random string when marked", async () => {
    const checkbox = screen.getByLabelText(field.checkboxLabel);
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button"));
    });

    expect(submitGravityForm).toBeCalledWith({
      id: mockFormData.gfForm.databaseId,
      fieldValues: [
        {
          value: "value", // we need to pass any string value
          id: "11",
        },
      ],
    });

    const formElement = element.querySelector("form");
    expect(formElement).not.toBeInTheDocument();
  });
});
