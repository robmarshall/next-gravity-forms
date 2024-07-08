import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";
import { getByText } from "@testing-library/react";

describe("Section field", () => {
  const field = {
    id: 9,
    type: "HTML",
    content: "<div>test html here</div>",
    cssClass: null,
    hasMargins: true,
    label: "HTML Block",
  };

  const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

  it("renders correctly", async () => {
    const { container } = renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: [field] } },
      },
    });
    const element = container.querySelector(`div#${fieldId}`);

    // section rendered
    expect(element).toBeInTheDocument();

    // has correct class name
    expect(element).toHaveClass("gfield_html_formatted");

    // renders content
    expect(getByText(element, /test html here/i)).toBeInTheDocument();
  });
});
