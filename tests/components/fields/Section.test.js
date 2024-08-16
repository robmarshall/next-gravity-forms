import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";

describe("Section field", () => {
  const field = {
    displayOnly: true,
    id: 9,
    inputType: null,
    layoutGridColumnSpan: null,
    layoutSpacerGridColumnSpan: null,
    pageNumber: 1,
    type: "SECTION",
    visibility: "VISIBLE",
    cssClass: null,
    databaseId: 9,
    label: "Section Break",
    description: "section description",
    conditionalLogic: null,
  };

  const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

  it("renders correctly", async () => {
    const { container } = renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: [field] } },
      },
    });
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
      data: {
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
      },
    });

    expect(container.querySelector(".gsection_description")).toBeNull();
  });
});
