import renderGravityForm from "../render";
import React, { createRef } from "react";
import { screen, fireEvent, act } from "@testing-library/react";
import { submitGravityForm } from "../../../src/fetch";

// mock submit so we don't run real request
jest.mock("../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("Custom field (markup)", () => {
  const field = {
    id: 1,
    type: "TEXT",
    label: "Custom label",
    defaultValue: "test",
  };

  // eslint-disable-next-line react/prop-types
  const CustomInputComponent = ({ onChange, value, onBlur, ...rest }) => {
    return (
      // eslint-disable-next-line react/react-in-jsx-scope
      <input
        className="custom-component"
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...rest}
      />
    );
  };

  it("renders correctly", async () => {
    const { container } = renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: [field] } },
      },
      customFormFields: { 1: CustomInputComponent },
    });

    const element = container.querySelector(".custom-component");

    expect(element).toBeInTheDocument();

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    expect(submitGravityForm).toBeCalled();
  });

  it("react-hook-form methods exposed", async () => {
    const formRef = createRef();
    renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: [field] } },
      },
      ref: formRef,
    });

    const methods = Object.keys(formRef.current);

    expect(methods).toContain("setValue");
    expect(methods).toContain("watch");
    expect(methods).toContain("reset");
    expect(methods).toContain("setError");
    expect(methods).toContain("getValues");
  });
});
