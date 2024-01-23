import { screen } from "@testing-library/react";
import mockFormData from "../mocks/formData";
import renderGravityForm from "./render";

describe("GravityFormForm", () => {
  it("renders form correctly", async () => {
    const { container } = renderGravityForm();
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
  });
});
