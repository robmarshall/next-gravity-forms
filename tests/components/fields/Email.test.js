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

describe("Email field", () => {
  const field = {
    id: 10,
    type: "EMAIL",
    visibility: "VISIBLE",
    canPrepopulate: false,
    conditionalLogic: null,
    cssClass: null,
    description: null,
    descriptionPlacement: "INHERIT",
    errorMessage: null,
    hasAutocomplete: false,
    isRequired: true,
    label: "Email",
    placeholder: null,
    shouldAllowDuplicates: true,
    size: "LARGE",
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

    // email field rendered
    expect(element).toBeInTheDocument();
  });

  const emailCases = [
    "test@test.com",
    "test+plus@test.com",
    "hello@my.kitchen",
    "test@abc.de",
    "test@business.online",
    "test+test@example.info",
  ];

  describe("submits form when value is correct", () => {
    test.each(emailCases)("given %p", async (email) => {
      const { container } = renderGravityForm({
        data: {
          gfForm: { formFields: { nodes: [field] } },
        },
      });

      fireEvent.input(screen.getByLabelText(/Email/i), {
        target: {
          value: email,
        },
      });
      await act(async () => {
        fireEvent.submit(screen.getByRole("button"));
      });

      expect(submitGravityForm).toBeCalledWith({
        id: mockFormData.gfForm.databaseId,
        fieldValues: [
          {
            emailValues: {
              value: email,
            },
            id: field.id,
          },
        ],
      });

      expect(
        container.querySelector(`.gravityform__error_message`)
      ).not.toBeInTheDocument();
    });
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
      fireEvent.submit(screen.getByRole("button"));

      await waitFor(() => {
        expect(getByText(element, /Field is required./i)).toBeInTheDocument();
      });

      expect(submitGravityForm).not.toBeCalled();
    });
  });

  const invalidEmails = ["test", "test@a.b"];

  describe("should display invalid email error when value is not valid", () => {
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
    test.each(invalidEmails)("given %p", async (email) => {
      fireEvent.input(screen.getByLabelText(/Email/i), {
        target: {
          value: email,
        },
      });

      fireEvent.submit(screen.getByRole("button"));

      await waitFor(() => {
        expect(
          getByText(element, /The email address entered is invalid/i)
        ).toBeInTheDocument();
      });

      expect(submitGravityForm).not.toBeCalled();
    });
  });

  // renders confirmation email
  describe("confirmationEmail", () => {
    let container;
    let element;
    const confirmationField = {
      ...field,
      inputs: [
        {
          id: 10,
          name: "",
          autocompleteAttribute: "email",
          customLabel: "Enter Email",
          defaultValue: null,
          label: "Enter Email",
          placeholder: null,
        },
        {
          id: 10.2,
          name: "",
          autocompleteAttribute: "email",
          customLabel: "Confirm Email",
          defaultValue: null,
          label: "Confirm Email",
          placeholder: "Enter confirmation",
        },
      ],
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

    it("renders confirmation input", () => {
      // email field rendered
      const element = screen.getByLabelText(confirmationField.inputs[1].label);
      expect(element).toBeInTheDocument();

      expect(element.placeholder).toBe("Enter confirmation");
      expect(element.type).toBe("email");
    });

    it("renders confirmation error when values don't match", async () => {
      fireEvent.input(
        screen.getByLabelText(confirmationField.inputs[0].label),
        {
          target: {
            value: "test@test.com",
          },
        }
      );

      fireEvent.input(
        screen.getByLabelText(confirmationField.inputs[1].label),
        {
          target: {
            value: "test2@test.com",
          },
        }
      );

      await act(async () => {
        fireEvent.submit(screen.getByRole("button"));
      });

      await waitFor(() => {
        expect(
          getByText(element, /Your emails do not match/i)
        ).toBeInTheDocument();
      });

      expect(submitGravityForm).not.toBeCalled();
    });

    it("submits form when values are entered correctly", async () => {
      fireEvent.input(
        screen.getByLabelText(confirmationField.inputs[0].label),
        {
          target: {
            value: "test@test.com",
          },
        }
      );

      fireEvent.input(
        screen.getByLabelText(confirmationField.inputs[1].label),
        {
          target: {
            value: "test@test.com",
          },
        }
      );

      await act(async () => {
        fireEvent.submit(screen.getByRole("button"));
      });

      expect(submitGravityForm).toBeCalledWith({
        id: mockFormData.gfForm.databaseId,
        fieldValues: [
          {
            emailValues: {
              confirmationValue: "test@test.com",
              value: "test@test.com",
            },
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
