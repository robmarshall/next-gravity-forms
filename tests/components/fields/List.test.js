import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import List from "../../../src/components/List";
import { SettingsProvider } from "../../../src/providers/SettingsContext";
import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";
import {
  getByText,
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { submitGravityForm } from "../../../src/fetch";

jest.mock("../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("List field", () => {
  const field = {
    id: 27,
    databaseId: 27,
    type: "LIST",
    inputType: "LIST",
    label: "List",
    isRequired: false,
    maxRows: 2,
    hasColumns: false,
    choices: null,
    description: "Description",
  };

  const renderListField = (overrides = {}) =>
    renderGravityForm({
      data: {
        gfForm: {
          formFields: {
            nodes: [{ ...field, ...overrides }],
          },
        },
      },
    });

  const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Verifies that the default single-column list renders its wrapper, first row controls, and description.
  it("renders a single-column list with one row", () => {
    const { container } = renderListField();
    const element = container.querySelector(`#${fieldId}`);

    expect(element.tagName).toBe("FIELDSET");
    expect(element).toHaveClass("gfield--type-list");
    expect(screen.getByLabelText("List, Row 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Add another row")).toBeEnabled();
    expect(screen.getByLabelText("Remove row 1")).toBeDisabled();
    expect(getByText(element, "Description")).toBeInTheDocument();
  });

  // Verifies that a list limited to one row does not render row action buttons.
  it("does not render add or delete row buttons when maxRows is 1", () => {
    renderListField({ maxRows: 1 });

    expect(screen.getByLabelText("List, Row 1")).toBeInTheDocument();
    expect(screen.queryByLabelText("Add another row")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Remove row 1")).not.toBeInTheDocument();
  });

  // Verifies that users can add rows until maxRows is reached and delete rows back to a single row.
  it("adds rows up to maxRows and allows deleting rows", () => {
    renderListField();

    fireEvent.click(screen.getByLabelText("Add another row"));

    expect(screen.getByLabelText("List, Row 2")).toBeInTheDocument();
    expect(screen.getAllByLabelText("Add another row")[0]).toBeDisabled();
    expect(screen.getByLabelText("Remove row 1")).toBeEnabled();
    expect(screen.getByLabelText("Remove row 2")).toBeEnabled();

    fireEvent.click(screen.getByLabelText("Remove row 1"));

    expect(screen.queryByLabelText("List, Row 2")).not.toBeInTheDocument();
    expect(screen.getByLabelText("List, Row 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Add another row")).toBeEnabled();
    expect(screen.getByLabelText("Remove row 1")).toBeDisabled();
  });

  it("preserves surviving inputs and values when rows are inserted and deleted", () => {
    renderListField({ maxRows: 3 });
    const firstInput = screen.getByLabelText("List, Row 1");
    fireEvent.input(firstInput, { target: { value: "First" } });
    fireEvent.click(screen.getByLabelText("Add another row"));

    const secondInput = screen.getByLabelText("List, Row 2");
    fireEvent.input(secondInput, { target: { value: "Second" } });
    expect(screen.getByLabelText("List, Row 2")).toBe(secondInput);

    fireEvent.click(screen.getAllByLabelText("Add another row")[0]);
    const insertedInput = screen.getByLabelText("List, Row 2");

    expect(screen.getByLabelText("List, Row 1")).toBe(firstInput);
    expect(insertedInput).toHaveValue("");
    expect(screen.getByLabelText("List, Row 3")).toBe(secondInput);
    expect(secondInput).toHaveValue("Second");

    secondInput.focus();
    fireEvent.click(screen.getByLabelText("Remove row 1"));

    expect(firstInput).not.toBeInTheDocument();
    expect(screen.getByLabelText("List, Row 1")).toBe(insertedInput);
    expect(screen.getByLabelText("List, Row 2")).toBe(secondInput);
    expect(secondInput).toHaveValue("Second");
    expect(secondInput).toHaveFocus();

    fireEvent.click(screen.getByLabelText("Remove row 1"));
    expect(screen.getByLabelText("List, Row 1")).toBe(secondInput);
    fireEvent.click(screen.getByLabelText("Add another row"));
    expect(screen.getByLabelText("List, Row 1")).toBe(secondInput);
    expect(screen.getByLabelText("List, Row 2")).toHaveValue("");
  });

  it("keeps row IDs aligned when form resets change the number of rows", () => {
    const Harness = () => {
      const methods = useForm({
        defaultValues: {
          input_27: [{ value: "Initial first" }, { value: "Initial second" }],
        },
      });

      return (
        <SettingsProvider helperText={{}} form={mockFormData}>
          <FormProvider {...methods}>
            <List
              fieldData={{ ...field, maxRows: 4 }}
              name="input_27"
              gfId={27}
              labelFor="input_1_27"
              wrapId={fieldId}
            />
            <button type="button" onClick={() => methods.reset({ input_27: [] })}>
              Clear rows
            </button>
            <button
              type="button"
              onClick={() => methods.reset({
                input_27: [
                  { value: "Reset first" },
                  { value: "Reset second" },
                  { value: "Reset third" },
                ],
              })}
            >
              Load rows
            </button>
          </FormProvider>
        </SettingsProvider>
      );
    };

    render(<Harness />);
    const initialSecond = screen.getByLabelText("List, Row 2");
    expect(initialSecond).toHaveValue("Initial second");
    fireEvent.click(screen.getByLabelText("Remove row 1"));
    expect(screen.getByLabelText("List, Row 1")).toBe(initialSecond);

    fireEvent.click(screen.getByText("Load rows"));
    const resetThird = screen.getByLabelText("List, Row 3");
    expect(resetThird).toHaveValue("Reset third");
    fireEvent.click(screen.getByLabelText("Remove row 2"));
    expect(screen.getByLabelText("List, Row 2")).toBe(resetThird);

    fireEvent.click(screen.getByText("Clear rows"));
    expect(screen.queryByLabelText("List, Row 2")).not.toBeInTheDocument();
    expect(screen.getByLabelText("List, Row 1")).toHaveValue("");

    fireEvent.click(screen.getByLabelText("Add another row"));
    const addedInput = screen.getByLabelText("List, Row 2");
    fireEvent.click(screen.getByLabelText("Remove row 1"));
    expect(screen.getByLabelText("List, Row 1")).toBe(addedInput);
  });

  // Verifies that a list configured with choices renders headers and labeled inputs for each column.
  it("renders multiple column headers and row inputs", () => {
    const choices = [
      { text: "Column 1", value: "Column 1" },
      { text: "Column 2", value: "Column 2" },
      { text: "Column 3", value: "Column 3" },
    ];

    const { container } = renderListField({
      id: 28,
      databaseId: 28,
      hasColumns: true,
      choices,
      description: null,
    });

    expect(screen.getByText("Column 1")).toHaveClass("gfield_header_item");
    expect(screen.getByText("Column 2")).toHaveClass("gfield_header_item");
    expect(screen.getByText("Column 3")).toHaveClass("gfield_header_item");
    expect(screen.getByLabelText("Column 1, Row 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Column 2, Row 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Column 3, Row 1")).toBeInTheDocument();
    expect(container.querySelector(".ginput_container_list")).toHaveClass(
      "ginput_container_list--columns"
    );
  });

  // Verifies that custom add and delete icon URLs are rendered in the row action buttons.
  it("renders configured icon urls", () => {
    renderListField({
      addIconUrl: "https://example.com/add.png",
      deleteIconUrl: "https://example.com/delete.png",
    });

    expect(screen.getByAltText("Add")).toHaveAttribute(
      "src",
      "https://example.com/add.png"
    );
    expect(screen.getByAltText("Remove")).toHaveAttribute(
      "src",
      "https://example.com/delete.png"
    );
  });

  // Verifies that a required list blocks submission until at least one row value is provided.
  it("requires at least one non-empty row value when required", async () => {
    const { container } = renderListField({ isRequired: true });
    const element = container.querySelector(`#${fieldId}`);

    await act(async () => {
      fireEvent.submit(screen.getByText("Submit1"));
    });

    await waitFor(() => {
      expect(getByText(element, /This field is required/i)).toBeInTheDocument();
    });

    expect(submitGravityForm).not.toBeCalled();
  });

  // Verifies that a single-column list submits row values in the Gravity Forms listValues shape.
  it("submits a single-column list with multiple row values", async () => {
    renderListField();

    fireEvent.input(screen.getByLabelText("List, Row 1"), {
      target: { value: "First row" },
    });
    fireEvent.click(screen.getByLabelText("Add another row"));
    fireEvent.input(screen.getByLabelText("List, Row 2"), {
      target: { value: "Second row" },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "Submit1" }));
    });

    await waitFor(() => {
      expect(submitGravityForm).toHaveBeenCalled();
    });

    expect(submitGravityForm).toHaveBeenCalledWith({
      id: mockFormData.gfForm.databaseId,
      fieldValues: [
        {
          id: field.id,
          listValues: [
            {
              rowValues: ["First row", "Second row"],
            },
          ],
        },
      ],
    });
  });

  // Verifies that a multi-column list submits each row as a separate rowValues array.
  it("submits a multi-column list with column values", async () => {
    const choices = [
      { text: "Name", value: "name" },
      { text: "Role", value: "role" },
    ];

    renderListField({
      id: 28,
      databaseId: 28,
      hasColumns: true,
      choices,
      maxRows: 3,
    });

    fireEvent.input(screen.getByLabelText("Name, Row 1"), {
      target: { value: "Ada" },
    });
    fireEvent.input(screen.getByLabelText("Role, Row 1"), {
      target: { value: "Engineer" },
    });

    fireEvent.click(screen.getByLabelText("Add another row"));

    fireEvent.input(screen.getByLabelText("Name, Row 2"), {
      target: { value: "Grace" },
    });
    fireEvent.input(screen.getByLabelText("Role, Row 2"), {
      target: { value: "Lead" },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "Submit1" }));
    });

    await waitFor(() => {
      expect(submitGravityForm).toHaveBeenCalled();
    });

    expect(submitGravityForm).toHaveBeenCalledWith({
      id: mockFormData.gfForm.databaseId,
      fieldValues: [
        {
          id: 28,
          listValues: [
            {
              rowValues: ["Ada", "Engineer"],
            },
            {
              rowValues: ["Grace", "Lead"],
            },
          ],
        },
      ],
    });
  });
});
