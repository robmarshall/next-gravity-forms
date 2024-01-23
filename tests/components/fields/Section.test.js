import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";
import getMockFieldByType from "../../utils/getMockFieldByType";

describe("Section field", () => {
  const field = getMockFieldByType("SECTION");
  const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

  it("renders correctly", async () => {
    const { container } = renderGravityForm();
    const sectionElement = container.querySelector(`div#${fieldId}`);

    // section rendered
    expect(sectionElement).toBeInTheDocument();

    // has correct class name
    expect(sectionElement).toHaveClass("gsection");

    // title of section rendered
    expect(container.querySelector(".gsection_title")).toBeInTheDocument();

    // renders description
    expect(
      container.querySelector(".gsection_description")
    ).toBeInTheDocument();
  });

  it("doesn't render description field if empty", () => {
    const { container } = renderGravityForm({
      gfForm: {
        formFields: {
          nodes: [
            {
              id: 9,
              type: "SECTION",
              description: null,
            },
          ],
        },
      },
    });

    expect(container.querySelector(".gsection_description")).toBeNull();
  });
});
