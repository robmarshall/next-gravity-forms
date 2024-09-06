import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";
import { getByText, screen, fireEvent, waitFor } from "@testing-library/react";
import { submitGravityForm } from "../../../src/fetch";
import strings from "../../../src/utils/strings";

// mock submit so we don't run real request
jest.mock("../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("Website field", () => {
  let container;
  const field = {
    id: 9,
    pageNumber: 1,
    type: "WEBSITE",
    databaseId: 9,
    label: "Website",
    isRequired: true,
  };

  const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

  beforeEach(() => {
    const { container: renderedContainer } = renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: [field] } },
      },
    });
    container = renderedContainer;
  });

  it("renders correctly", async () => {
    const fieldEl = container.querySelector(`div#${fieldId}`);

    expect(fieldEl).toBeInTheDocument();
  });

  it("should display invalid url error when value is not valid", async () => {
    fireEvent.input(screen.getByLabelText(/Website/i), {
      target: {
        value: "test",
      },
    });

    fireEvent.submit(screen.getByRole("button"));

    const fieldEl = container.querySelector(`div#${fieldId}`);

    await waitFor(() => {
      expect(getByText(fieldEl, strings.errors.url)).toBeInTheDocument();
    });

    expect(submitGravityForm).not.toBeCalled();
  });

  it("should display required error", async () => {
    fireEvent.submit(screen.getByRole("button"));

    const fieldEl = container.querySelector(`div#${fieldId}`);

    await waitFor(() => {
      expect(getByText(fieldEl, /Field is required./i)).toBeInTheDocument();
    });

    expect(submitGravityForm).not.toBeCalled();
  });
});
