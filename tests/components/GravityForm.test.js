import { screen } from "@testing-library/react";
import mockFormData from "../mocks/formData";
import renderGravityForm from "./render";

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
          cssClass: null 
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
});
