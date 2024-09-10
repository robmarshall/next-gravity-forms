import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";
import userEvent from "@testing-library/user-event";

import {
  getByText,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { submitGravityForm } from "../../../src/fetch";

// mock submit so we don't run real request
jest.mock("../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("Phone field", () => {
  const field = {
    id: 10,
    type: "PHONE",
    isRequired: true,
    label: "Phone field",
    phoneFormat: "STANDARD",
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

  it("renders correctly", async () => {
    const { container } = renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: [field] } },
      },
    });
    const element = container.querySelector(`#${fieldId}`);

    // email field rendered
    expect(element).toBeInTheDocument();
  });

  it("render masks and formats value", async () => {
    const { getByLabelText } = renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: [field] } },
      },
    });

    // Simulate typing into the phone input
    await userEvent.type(getByLabelText(/Phone field/i), "1234567890");

    await waitFor(() => {
      expect(getByLabelText(/Phone field/i).value).toBe("(123) 456-7890");
    });
  });

  it("submits form when value is correct", async () => {
    const { container, getByLabelText } = renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: [field] } },
      },
    });

    await userEvent.type(getByLabelText(/Phone field/i), "1234567890");

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    expect(submitGravityForm).toBeCalledWith({
      id: mockFormData.gfForm.databaseId,
      fieldValues: [
        {
          value: "(123) 456-7890",
          id: field.id,
        },
      ],
    });

    expect(
      container.querySelector(`.gravityform__error_message`)
    ).not.toBeInTheDocument();
  });

  it("should not set default value when value is not complete", async () => {
    const { getByLabelText } = renderGravityForm({
      data: {
        gfForm: {
          formFields: { nodes: [{ ...field, defaultValue: "123456789" }] },
        },
      },
    });

    const inputElement = getByLabelText(/Phone field/i);

    expect(inputElement.value).toBe("");
    expect(submitGravityForm).not.toBeCalled();
  });

  it("INTERNATIONAL type works", async () => {
    const { getByLabelText } = renderGravityForm({
      data: {
        gfForm: {
          formFields: { nodes: [{ ...field, phoneFormat: "INTERNATIONAL" }] },
        },
      },
    });
    const inputElement = getByLabelText(/Phone field/i);
    await userEvent.type(inputElement, "0880939999", { delay: 100 });

    expect(inputElement.value).toBe("0880939999");

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    expect(submitGravityForm).toBeCalledWith({
      id: mockFormData.gfForm.databaseId,
      fieldValues: [
        {
          value: "0880939999",
          id: field.id,
        },
      ],
    });
  });

  describe("render errors", () => {
    let container;
    let element;
    let rendered;
    beforeEach(() => {
      rendered = renderGravityForm({
        data: {
          gfForm: { formFields: { nodes: [field] } },
        },
      });
      container = rendered.container;

      element = container.querySelector(`#${fieldId}`);
    });

    it("should display required error when value is empty", async () => {
      fireEvent.submit(screen.getByRole("button"));

      await waitFor(() => {
        expect(getByText(element, /Field is required./i)).toBeInTheDocument();
      });

      expect(submitGravityForm).not.toBeCalled();
    });

    it("should reset field value when it doesn't match mask pattern", async () => {
      const { getByLabelText } = rendered;

      const inputElement = getByLabelText(/Phone field/i);
      // for some reasons it doesn't work with no delay
      await userEvent.type(inputElement, "1", { delay: 100 });

      await userEvent.tab();

      await act(async () => {
        fireEvent.submit(screen.getByRole("button"));
      });

      expect(inputElement.value).toBe("");
      expect(submitGravityForm).not.toBeCalled();
    });
  });
});
