import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";
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

describe("Password field", () => {
  const field = {
    id: 22,
    type: "PASSWORD",
    visibility: "VISIBLE",
    isRequired: true,
    label: "Password",
    placeholder: null,
    inputs: [
      {
        placeholder: null,
        label: "Enter Password",
        isHidden: null,
        id: 1,
        customLabel: null,
      },
      {
        placeholder: "Confirm Password",
        label: "Confirm Password",
        isHidden: true,
        id: 1.2,
        customLabel: null,
      },
    ],
    hasPasswordStrengthIndicator: true,
    hasPasswordVisibilityToggle: true,
    minPasswordStrength: "GOOD",
    subLabelPlacement: "INHERIT",
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

    // password field rendered
    expect(element).toBeInTheDocument();
  });

  it("renders strength indicator", async () => {
    const { container } = renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: [field] } },
      },
    });
    const element = container.querySelector(`.gform_show_password`);

    expect(element).toBeInTheDocument();
  });

  it("submits form when value is correct", async () => {
    const { container } = renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: [field] } },
      },
    });

    await act(async () => {
      const input = document.querySelector("#input_2_22");

      fireEvent.input(input, {
        target: { value: "!!@asdUUiooUU8_@" },
      });
    });

    await act(async () => {
      fireEvent.submit(
        screen.getByRole("button", { name: /submit/i, type: "submit" })
      );
    });

    expect(submitGravityForm).toBeCalledWith({
      id: mockFormData.gfForm.databaseId,
      fieldValues: [
        {
          value: "!!@asdUUiooUU8_@",
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
    beforeEach(() => {
      const rendered = renderGravityForm({
        data: {
          gfForm: { formFields: { nodes: [field] } },
        },
      });
      container = rendered.container;

      element = container.querySelector(`#${fieldId}`);
    });

    it("should display required error when value is empty", async () => {
      await act(async () => {
        fireEvent.submit(
          screen.getByRole("button", { name: /submit/i, type: "submit" })
        );
      });

      await waitFor(() => {
        expect(getByText(element, /Field is required./i)).toBeInTheDocument();
      });

      expect(submitGravityForm).not.toBeCalled();
    });

    it("should display strength error", async () => {
      const input = document.querySelector("#input_2_22");
      fireEvent.input(input, {
        target: { value: "11" },
      });

      await act(async () => {
        fireEvent.submit(
          screen.getByRole("button", { name: /submit/i, type: "submit" })
        );
      });

      await waitFor(() => {
        expect(
          getByText(element, /Your password does not meet/i)
        ).toBeInTheDocument();
      });

      expect(submitGravityForm).not.toBeCalled();
    });
  });

  describe("confirmationPassword", () => {
    let container;
    let element;
    const confirmationField = {
      id: 22,
      type: "PASSWORD",
      visibility: "VISIBLE",
      isRequired: true,
      label: "Password",
      placeholder: null,
      inputs: [
        {
          placeholder: null,
          label: "Enter Password",
          isHidden: null,
          id: 1,
          customLabel: null,
        },
        {
          placeholder: "Confirm Password",
          label: "Confirm Password",
          isHidden: null,
          id: 1.2,
          customLabel: null,
        },
      ],
      hasPasswordStrengthIndicator: true,
      hasPasswordVisibilityToggle: true,
      minPasswordStrength: "short",
      subLabelPlacement: "INHERIT",
    };

    beforeEach(() => {
      const rendered = renderGravityForm({
        data: {
          gfForm: {
            formFields: {
              nodes: [confirmationField],
            },
          },
        },
      });
      container = rendered.container;

      element = container.querySelector(`#${fieldId}`);
    });

    it("renders confirmation password", () => {
      // password field rendered
      const element = screen.getByLabelText(confirmationField.inputs[1].label);
      expect(element).toBeInTheDocument();

      expect(element.placeholder).toBe("Confirm Password");
      expect(element.type).toBe("password");
    });

    it("renders confirmation error when values don't match", async () => {
      fireEvent.input(
        screen.getByLabelText(confirmationField.inputs[0].label),
        {
          target: {
            value: "@412!Yjjt*9nM",
          },
        }
      );

      fireEvent.input(
        screen.getByLabelText(confirmationField.inputs[1].label),
        {
          target: {
            value: "@412!Yj",
          },
        }
      );

      await act(async () => {
        fireEvent.submit(
          screen.getByRole("button", { name: /submit/i, type: "submit" })
        );
      });

      await waitFor(() => {
        expect(getByText(element, /Your passwords/i)).toBeInTheDocument();
      });

      expect(submitGravityForm).not.toBeCalled();
    });

    it("submits form when values are entered correctly", async () => {
      fireEvent.input(
        screen.getByLabelText(confirmationField.inputs[0].label),
        {
          target: {
            value: "123%%2mI",
          },
        }
      );

      fireEvent.input(
        screen.getByLabelText(confirmationField.inputs[1].label),
        {
          target: {
            value: "123%%2mI",
          },
        }
      );

      await act(async () => {
        fireEvent.submit(
          screen.getByRole("button", { name: /submit/i, type: "submit" })
        );
      });

      expect(submitGravityForm).toBeCalledWith({
        id: mockFormData.gfForm.databaseId,
        fieldValues: [
          {
            value: "123%%2mI",
            id: field.id,
          },
        ],
      });

      expect(
        container.querySelector(`.gravityform__error_message`)
      ).not.toBeInTheDocument();

      const formElement = container.querySelector("form");
      expect(formElement).not.toBeInTheDocument();
    });
  });
});
