import { screen, fireEvent, act } from "@testing-library/react";
import renderGravityForm from "./render";

jest.mock("../../src/fetch", () => ({
  submitGravityForm: jest.fn(
    () => new Promise((resolve) => setTimeout(resolve, 1000))
  ), // Mocking an API call with a delay
}));

describe("Submit button", () => {
  const fields = [
    {
      id: 4,
      layoutGridColumnSpan: 12,
      pageNumber: 1,
      type: "TEXT",
      visibility: "VISIBLE",
      descriptionPlacement: "INHERIT",
      label: "Single",
      labelPlacement: "INHERIT",
      size: "LARGE",
    },
  ];

  it("has default text", async () => {
    renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: fields }, submitButton: { text: "" } },
      },
    });

    // submit button has correct text
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("possible to override the default text", async () => {
    renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: fields }, submitButton: { text: "" } },
      },
      helperText: {
        submit: "Custom text",
      },
    });

    // submit button has correct text
    expect(screen.getByText("Custom text")).toBeInTheDocument();
  });

  it("has loading state", async () => {
    renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: fields } },
      },
      helperText: {
        loading: "loading",
      },
    });

    fireEvent.input(screen.getByLabelText(/Single/i), {
      target: {
        value: "test",
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    expect(screen.getByText("loading")).toBeInTheDocument();
  });
});
