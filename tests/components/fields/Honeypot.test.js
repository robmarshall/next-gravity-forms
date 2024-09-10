import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";
import { fireEvent, act, screen } from "@testing-library/react";
import { submitGravityForm } from "../../../src/fetch";

// mock submit so we don't run real request
jest.mock("../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

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

  const renderForm = (hasHoneypot = true) => {
    const renderer = renderGravityForm({
      data: {
        gfForm: { hasHoneypot, formFields: { nodes: fields } },
      },
    });

    return renderer;
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  const gfId = fields[fields.length - 1].id + 1;

  it("doesn't render field if hasHoneypot is false", () => {
    const { container } = renderForm(false);
    const element = container.querySelector(
      `#input_${mockFormData.gfForm.databaseId}_${gfId}`
    );

    expect(element).toBeNull();
  });

  it("renders honeypot", () => {
    const { container } = renderForm();
    const element = container.querySelector(
      `#input_${mockFormData.gfForm.databaseId}_${gfId}`
    );

    // renders new fake input field
    expect(element).toBeInTheDocument();

    // input field has autocomplete attr set to `new-password`
    expect(element.getAttribute("autocomplete")).toBe("new-password");
  });

  it("pass value for form submission", async () => {
    const { getByLabelText } = renderForm();
    fireEvent.change(getByLabelText("Single Line text"), {
      target: {
        value: "Miss",
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    expect(submitGravityForm).toBeCalledWith({
      id: mockFormData.gfForm.databaseId,
      fieldValues: [
        {
          value: "Miss",
          id: fields[0].id,
        },
      ],
    });
  });
});
