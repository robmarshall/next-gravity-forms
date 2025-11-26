import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { submitGravityForm } from "../../../src/fetch";

jest.mock("../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("Time field", () => {
  const baseField = {
    id: 9,
    label: "Preferred time",
    type: "TIME",
    timeFormat: "H12",
    isRequired: true,
    inputs: [
      {
        id: 9.1,
        customLabel: "Hour",
        placeholder: "Hour",
      },
      {
        id: 9.2,
        customLabel: "Minute",
        placeholder: "Minute",
      },
      {
        id: 9.3,
        customLabel: "AM/PM",
      },
    ],
  };

  const renderField = (overrides = {}) =>
    renderGravityForm({
      data: {
        gfForm: {
          formFields: {
            nodes: [{ ...baseField, ...overrides }],
          },
        },
      },
    });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders hour, minute and am/pm inputs for 12-hour format", () => {
    renderField();

    expect(screen.getByLabelText("Hour")).toBeInTheDocument();
    expect(screen.getByLabelText("Minute")).toBeInTheDocument();
    expect(screen.getByLabelText("AM/PM")).toBeInTheDocument();
  });

  it("omits the am/pm selector when timeFormat is H24", () => {
    renderField({ timeFormat: "H24" });

    expect(screen.getByLabelText("Hour")).toBeInTheDocument();
    expect(screen.getByLabelText("Minute")).toBeInTheDocument();
    expect(screen.queryByLabelText("AM/PM")).not.toBeInTheDocument();
  });

  it("shows required validation error when no values are provided", async () => {
    const { container } = renderField({ isRequired: true });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    await waitFor(() => {
      expect(container.querySelector(".gfield_description")).toHaveTextContent(
        "This field is required."
      );
    });

    expect(submitGravityForm).not.toBeCalled();
  });

  it("blocks invalid time values", async () => {
    const { container } = renderField();

    fireEvent.input(screen.getByLabelText("Hour"), {
      target: { value: "13" },
    });

    fireEvent.input(screen.getByLabelText("Minute"), {
      target: { value: "10" },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    await waitFor(() => {
      expect(container.querySelector(".gfield_description")).toHaveTextContent(
        "Please enter a valid time."
      );
    });

    expect(submitGravityForm).not.toBeCalled();
  });

  it("submits formatted value when a valid time is provided", async () => {
    renderField();

    fireEvent.input(screen.getByLabelText("Hour"), {
      target: { value: "10" },
    });

    fireEvent.input(screen.getByLabelText("Minute"), {
      target: { value: "30" },
    });

    fireEvent.change(screen.getByLabelText("AM/PM"), {
      target: { value: "pm" },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    await waitFor(() => {
      expect(submitGravityForm).toHaveBeenCalled();
    });

    expect(submitGravityForm).toHaveBeenCalledWith({
      id: mockFormData.gfForm.databaseId,
      fieldValues: [
        {
          id: baseField.id,
          value: "10:30 pm",
        },
      ],
    });
  });
});
