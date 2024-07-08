import renderGravityForm from "../../render";
import mockFormData from "../../../mocks/formData";
import {
  screen,
  fireEvent,
  act,
  waitFor,
  getByText,
} from "@testing-library/react";
import { submitGravityForm } from "../../../../src/fetch";

// mock submit so we don't run real request
jest.mock("../../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("Date field picker", () => {
  const field = {
    calendarIconType: "NONE",
    cssClass: null,
    dateFormat: "MDY",
    dateType: "PICKER",
    descriptionPlacement: "INHERIT",
    id: 1,
    inputType: "DATE",
    isRequired: true,
    label: "Date",
    pageNumber: 1,
    placeholder: "fill date here",
    subLabelPlacement: "INHERIT",
    type: "DATE",
    visibility: "VISIBLE",
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

  it("renders correctly", async () => {
    const { container } = await act(async () => {
      return renderGravityForm({
        gfForm: { formFields: { nodes: [field] } },
      });
    });

    const element = container.querySelector(`#${fieldId}`);

    expect(element).toBeInTheDocument();
  });

  it("submits when form is correct", async () => {
    const { container } = await act(async () => {
      return renderGravityForm({
        gfForm: { formFields: { nodes: [field] } },
      });
    });

    await fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "07-08-2024" },
    });

    await act(async () => {
      fireEvent.submit(screen.getByText(/submit/i));
    });

    expect(submitGravityForm).toBeCalledWith({
      id: mockFormData.gfForm.databaseId,
      fieldValues: [
        {
          value: "07/08/2024",
          id: field.id,
        },
      ],
    });

    expect(
      container.querySelector(`.gravityform__error_message`)
    ).not.toBeInTheDocument();
  });

  describe("render errors", () => {
    let container;
    let element;
    beforeEach(async () => {
      const rendered = await act(async () => {
        return renderGravityForm({
          gfForm: { formFields: { nodes: [field] } },
        });
      });

      container = rendered.container;

      element = container.querySelector(`#${fieldId}`);
    });

    it("should display required error when value is empty", async () => {
      fireEvent.submit(screen.getByText(/submit/i));

      await waitFor(() => {
        expect(getByText(element, /Field is required./i)).toBeInTheDocument();
      });

      expect(submitGravityForm).not.toBeCalled();
    });

    it("should display required error when date is incorrect format", async () => {
      await fireEvent.change(screen.getByLabelText(/Date/i), {
        target: { value: "fakeinput" },
      });

      await fireEvent.submit(screen.getByText(/submit/i));

      await waitFor(() => {
        expect(getByText(element, /Field is required./i)).toBeInTheDocument();
      });

      expect(submitGravityForm).not.toBeCalled();
    });
  });

  it("shows placeholder value correctly", async () => {
    await act(async () => {
      return renderGravityForm({
        gfForm: { formFields: { nodes: [field] } },
      });
    });

    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
  });
});
