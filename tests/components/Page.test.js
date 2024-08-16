import { screen, fireEvent, act } from "@testing-library/react";
import renderGravityForm from "./render";

import { submitGravityForm } from "../../src/fetch";

// mock submit so we don't run real request
jest.mock("../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("Pages", () => {
  const pagination = {
    pageNames: ["Page 1", "Page 2"],
    lastPageButton: {
      text: "Previous 3",
      type: "TEXT",
      imageUrl: "",
    },
    hasProgressbarOnConfirmation: true,
    progressbarCompletionText: "Completed",
    style: "BLUE",
    type: "PERCENTAGE",
    color: null,
    backgroundColor: null,
  };

  const fields = [
    {
      id: 1,
      pageNumber: 1,
      type: "TEXT",
      label: "Text page 1",
      isRequired: true,
    },
    {
      id: 2,
      pageNumber: 1,
      type: "TEXT",
      label: "Dummy 1",
    },
    {
      id: 3,
      pageNumber: 2,
      type: "PAGE",
      nextButton: {
        type: "TEXT",
        text: "Next",
        imageUrl: "",
      },
      previousButton: {
        type: "TEXT",
        text: "Prev sraka",
        imageUrl: "",
      },
    },
    {
      id: 4,
      pageNumber: 2,
      type: "TEXT",
      label: "Text page 2",
      isRequired: true,
    },
    {
      id: 5,
      pageNumber: 2,
      type: "TEXT",
      label: "Dummy 2",
    },
  ];

  it("render pages", async () => {
    renderGravityForm({
      data: {
        gfForm: {
          pagination,
          formFields: { nodes: fields },
        },
      },
    });

    expect(screen.queryByText("Text page 1")).toBeInTheDocument(); // render as first page
    expect(screen.queryByText("Text page 2")).not.toBeInTheDocument(); // not in doc since it's second page
  });

  it("render correct fields for the second page", async () => {
    renderGravityForm({
      data: {
        gfForm: {
          pagination,
          formFields: { nodes: fields },
        },
      },
    });

    fireEvent.input(screen.getByLabelText(/Text page 1/i), {
      target: {
        value: "test",
      },
    });

    await act(async () => {
      fireEvent.click(screen.getByDisplayValue("Next"));
    });

    expect(screen.queryByText("Text page 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Text page 2")).toBeInTheDocument();
  });

  it("render errors for the page", async () => {
    renderGravityForm({
      data: {
        gfForm: {
          pagination,
          formFields: { nodes: fields },
        },
      },
    });

    await act(async () => {
      fireEvent.click(screen.getByDisplayValue("Next"));
    });

    // we have 2 required fields, but since we render 1 page only, we should get only 1 error
    expect(screen.queryAllByText(/Field is required./i).length).toBe(1);
  });

  it("prev / next buttons work", async () => {
    renderGravityForm({
      data: {
        gfForm: {
          pagination,
          formFields: { nodes: fields },
        },
      },
    });

    fireEvent.input(screen.getByLabelText(/Text page 1/i), {
      target: {
        value: "test",
      },
    });

    await act(async () => {
      fireEvent.click(screen.getByDisplayValue("Next"));
    });

    // inspect first page elements
    expect(screen.queryByText("Text page 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Text page 2")).toBeInTheDocument();
    // renders progress of second page
    expect(screen.queryByText("Step 2 of 2")).toBeInTheDocument();

    await act(async () => {
      // we also check if custom level gets rendered
      fireEvent.click(screen.getByDisplayValue("Previous 3"));
    });

    // inspect second page elements
    expect(screen.queryByText("Text page 1")).toBeInTheDocument();
    expect(screen.queryByText("Text page 2")).not.toBeInTheDocument();

    // renders progress of first page
    expect(screen.queryByText("Step 1 of 2")).toBeInTheDocument();
  });

  it("renders completed progress", async () => {
    const { container } = renderGravityForm({
      data: {
        gfForm: {
          pagination,
          formFields: { nodes: fields },
        },
      },
    });

    fireEvent.input(screen.getByLabelText(/Text page 1/i), {
      target: {
        value: "test",
      },
    });

    await act(async () => {
      fireEvent.click(screen.getByDisplayValue("Next"));
    });

    fireEvent.input(screen.getByLabelText(/Text page 2/i), {
      target: {
        value: "test",
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "Submit1" }));
    });

    expect(
      container.querySelector(`.gform_confirmation_message`)
    ).toBeInTheDocument();

    expect(screen.queryByText("Completed")).toBeInTheDocument();

    expect(submitGravityForm).toBeCalled();
  });

  it("render steps progress", async () => {
    const { container } = renderGravityForm({
      data: {
        gfForm: {
          pagination: { ...pagination, type: "STEP" },
          formFields: { nodes: fields },
        },
      },
    });

    expect(container.querySelector(`.gf_step_number`).innerHTML).toBe("1");
    expect(container.querySelector(`.gf_step_label`).innerHTML).toBe("Page 1");

    fireEvent.input(screen.getByLabelText(/Text page 1/i), {
      target: {
        value: "test",
      },
    });

    await act(async () => {
      fireEvent.click(screen.getByDisplayValue("Next"));
    });

    expect(
      container.querySelectorAll(`.gf_step`)[1].querySelector(`.gf_step_number`)
        .innerHTML
    ).toBe("2");
  });
});
