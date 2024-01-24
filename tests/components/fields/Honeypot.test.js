import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";

describe("Honeypot field", () => {
  const fields = [
    {
      id: 1,
      type: "TEXT",
      descriptionPlacement: "INHERIT",
      label: "Single Line text",
      labelPlacement: "INHERIT",
      size: "LARGE",
    },
  ];

  const gfId = fields[fields.length - 1].id + 1;

  it("doesn't render field if hasHoneypot is false", () => {
    const { container } = renderGravityForm({
      gfForm: { formFields: { nodes: fields } },
    });

    const element = container.querySelector(
      `#input_${mockFormData.gfForm.databaseId}_${gfId}`
    );

    expect(element).toBeNull();
  });

  it("renders honeypot", () => {
    const { container } = renderGravityForm({
      gfForm: {
        hasHoneypot: true,
        formFields: { nodes: fields },
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
