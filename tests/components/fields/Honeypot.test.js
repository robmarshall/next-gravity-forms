import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";

describe("Honeypot field", () => {
  const gfId =
    mockFormData.gfForm.formFields.nodes[
      mockFormData.gfForm.formFields.nodes.length - 1
    ].id + 1;

  it("doesn't render field if hasHoneypot is false", () => {
    const { container } = renderGravityForm();
    const element = container.querySelector(
      `#input_${mockFormData.gfForm.databaseId}_${gfId}`
    );

    expect(element).toBeNull();
  });

  it("renders honeypot", () => {
    const { container } = renderGravityForm({
      gfForm: {
        hasHoneypot: true,
      },
    });

    const element = container.querySelector(
      `#input_${mockFormData.gfForm.databaseId}_${gfId}`
    );

    // renders new fake input field
    expect(element).toBeInTheDocument();

    // input field has autocomplete attr set to `new-password`
    expect(element.getAttribute("autocomplete")).toBe("new-password");
  });
});
