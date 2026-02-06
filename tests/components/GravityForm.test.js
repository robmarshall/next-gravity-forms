import { screen, fireEvent, act } from "@testing-library/react";
import mockFormData from "../mocks/formData";
import renderGravityForm from "./render";
import { submitGravityForm } from "../../src/fetch";
import nodeFetch from "node-fetch";

jest.mock("../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

jest.mock("node-fetch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("GravityFormForm", () => {
  const fields = [
    {
      id: 4,
      layoutGridColumnSpan: 12,
      pageNumber: 1,
      type: "TEXT",
      visibility: "VISIBLE",
      descriptionPlacement: "INHERIT",
      label: "Single Line text",
      labelPlacement: "INHERIT",
      size: "LARGE",
    },
    {
      id: 1,
      layoutGridColumnSpan: 6,
      pageNumber: 1,
      type: "CHECKBOX",
      visibility: "VISIBLE",
      choices: [
        {
          isSelected: false,
          text: "First Choice",
          value: "First Choice",
        },
        {
          isSelected: false,
          text: "Third Choice",
          value: "Third Choice",
        },
        {
          isSelected: false,
          text: "Fouthh",
          value: "Fouthh",
        },
      ],
      descriptionPlacement: "INHERIT",
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
    },
  ];

  it("renders form correctly", async () => {
    const { container } = renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: fields } },
      },
    });
    const formElement = container.querySelector("form");

    // form to be in document
    expect(formElement).toBeInTheDocument();

    // form to have specific className
    expect(formElement).toHaveClass(
      `gravityform gravityform--id-${mockFormData.gfForm.databaseId}`
    );
    // form to have specific ID
    expect(formElement.id).toBe(`gform_${mockFormData.gfForm.databaseId}`);

    // submit button has correct text
    expect(
      screen.getByText(mockFormData.gfForm.submitButton.text)
    ).toBeInTheDocument();

    // form should have cssClass applied
    expect(formElement).toHaveClass("custom-form-class");

    // wrapper should have cssClass with __wrapper suffix
    const wrapperElement = container.querySelector(".gform_wrapper");
    expect(wrapperElement).toHaveClass("custom-form-class__wrapper");
  });

  it("renders form without cssClass when not provided", async () => {
    const { container } = renderGravityForm({
      data: {
        gfForm: {
          ...mockFormData.gfForm,
          cssClass: null,
        },
      },
    });
    const formElement = container.querySelector("form");
    const wrapperElement = container.querySelector(".gform_wrapper");

    // form should not have cssClass when not provided
    expect(formElement).not.toHaveClass("custom-form-class");

    // wrapper should not have cssClass when not provided
    expect(wrapperElement).not.toHaveClass("custom-form-class__wrapper");
  });

  it("passes baseUrl to submit the form when provided", async () => {
    submitGravityForm.mockResolvedValueOnce({
      submitGfForm: { errors: null },
    });

    const submitBaseUrl = "https://submit.example/graphql";

    renderGravityForm({
      data: { gfForm: { formFields: { nodes: fields } } },
      baseUrl: submitBaseUrl,
    });

    fireEvent.input(screen.getByLabelText(/Single Line text/i), {
      target: { value: "test" },
    });

    await act(async () => {
      fireEvent.click(screen.getByText(mockFormData.gfForm.submitButton.text));
    });

    expect(submitGravityForm).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockFormData.gfForm.databaseId,
        baseUrl: submitBaseUrl,
      })
    );
  });
});

describe("getGravityForm (server)", () => {
  it("passes baseUrl to fetch the form when provided", async () => {
    nodeFetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          data: { gfForm: { formFields: { nodes: [] } } },
        }),
    });

    const { getGravityForm } = await import("../../src/server");
    const formBaseUrl = "https://api.example/graphql";

    await getGravityForm(mockFormData.gfForm.databaseId, formBaseUrl);

    expect(nodeFetch).toHaveBeenCalledWith(
      formBaseUrl,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
  });
});
