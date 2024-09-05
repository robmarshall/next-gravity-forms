import { screen, fireEvent } from "@testing-library/react";
import renderGravityForm from "./render";
import mockFormData from "../mocks/formData";

jest.mock("../../src/fetch", () => ({
  submitGravityForm: jest.fn(
    () => new Promise((resolve) => setTimeout(resolve, 1000))
  ), // Mocking an API call with a delay
}));

describe("MaxLength counter", () => {
  const fields = [
    {
      id: 4,
      pageNumber: 1,
      type: "TEXT",
      label: "Single",
      maxLength: 20,
    },
    {
      id: 5,
      pageNumber: 1,
      type: "TEXTAREA",
      label: "Message",
      maxLength: 50,
    },
  ];

  let container;

  beforeEach(() => {
    const { container: renderedContainer } = renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: fields } },
      },
    });
    container = renderedContainer;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const getCounterElement = (id) =>
    container.querySelector(
      `#field_${mockFormData.gfForm.databaseId}_${id} div.ginput_counter`
    );

  it("renders max length components", async () => {
    const textCounterEl = getCounterElement(4);
    const textareaCounterEl = getCounterElement(5);

    expect(textCounterEl).toBeInTheDocument();
    expect(textareaCounterEl).toBeInTheDocument();
  });

  it("updates character counters when input values change", async () => {
    const inputEl = screen.getByLabelText("Single");
    fireEvent.change(inputEl, { target: { value: "1234567890" } });

    const textareaEl = screen.getByLabelText("Message");
    fireEvent.change(textareaEl, {
      target: { value: "This is a longer text for the textarea field." },
    });

    const textCounterEl = getCounterElement(4);
    const textareaCounterEl = getCounterElement(5);

    expect(textCounterEl).toHaveTextContent("10 of 20 max characters");
    expect(textareaCounterEl).toHaveTextContent("45 of 50 max characters");
  });
});
