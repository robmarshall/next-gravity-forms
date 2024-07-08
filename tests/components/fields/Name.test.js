import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";
import {
  getByText,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { submitGravityForm } from "../../../src/fetch";

// mock submit so we don't run real request
jest.mock("../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("Name field", () => {
  const field = {
    id: 13,
    databaseId: 13,
    type: "NAME",
    label: "Name",
    subLabelPlacement: "INHERIT",
    isRequired: true,
    inputs: [
      {
        id: 13.2,
        name: "",
        customLabel: null,
        defaultValue: "",
        label: "Prefix",
        placeholder: null,
        isHidden: false,
        key: "prefix",
        choices: [
          {
            text: "Dr.",
            value: "Dr.",
            isSelected: false,
          },
          {
            text: "Miss",
            value: "Miss",
            isSelected: true,
          },
        ],
      },
      {
        id: 13.3,
        name: "",
        customLabel: null,
        defaultValue: null,
        label: "First",
        isHidden: false,
        key: "first",
      },
      {
        id: 13.4,
        name: "",
        customLabel: null,
        defaultValue: "middle default value",
        label: "Middle",
        placeholder: null,
        isHidden: false,
        key: "middle",
      },
      {
        id: 13.6,
        name: "",
        customLabel: null,
        defaultValue: null,
        label: "Last",
        placeholder: null,
        isHidden: false,
        key: "last",
      },
      {
        id: 13.8,
        name: "",
        customLabel: null,
        defaultValue: "van",
        label: "Suffix",
        placeholder: null,
        isHidden: true,
        key: "suffix",
      },
    ],
  };

  let container;
  let element;
  let unmount;

  beforeEach(() => {
    const rendered = renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: [field] } },
      },
    });
    container = rendered.container;
    unmount = rendered.unmount;

    element = container.querySelector(`#${fieldId}`);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

  it("renders correctly", async () => {
    // field gets rendered
    expect(element).toBeInTheDocument();

    // prefix field gets rendered as dropdown
    const prefix = screen.getByLabelText("Prefix");
    expect(prefix).toBeInTheDocument();
    expect(prefix.value).toBe("Miss");

    // suffix is hidden so shouldn't be id dom, rest 4 fields should be rendered
    expect(container.querySelector(".ginput_container").children.length).toBe(
      4
    );
  });

  it("doesnt throw error if not required", async () => {
    unmount();

    const rendered = renderGravityForm({
      data: {
        gfForm: {
          formFields: {
            nodes: [
              { ...field, isRequired: false },
              { id: 14, databaseId: 13, type: "INPUT", defaultValue: "test" },
            ],
          },
        },
      },
    });
    container = rendered.container;

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    expect(submitGravityForm).toBeCalled();
  });

  it("throws error if required", async () => {
    fireEvent.change(screen.getByLabelText("Prefix"), {
      target: {
        value: "Miss",
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    await waitFor(() => {
      expect(
        getByText(
          element,
          /This field is required. Please complete the following fields: First, Last/i
        )
      ).toBeInTheDocument();
    });

    expect(submitGravityForm).not.toBeCalled();
  });

  it("submits form when values are entered correctly", async () => {
    fireEvent.change(screen.getByLabelText("Prefix"), {
      target: {
        value: "Dr.",
      },
    });

    fireEvent.input(screen.getByLabelText("First"), {
      target: {
        value: "first",
      },
    });

    fireEvent.input(screen.getByLabelText("Last"), {
      target: {
        value: "last",
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });

    expect(
      container.querySelector(`.gravityform__error_message`)
    ).not.toBeInTheDocument();

    expect(submitGravityForm).toBeCalledWith({
      id: mockFormData.gfForm.databaseId,
      fieldValues: [
        {
          nameValues: {
            prefix: "Dr.",
            first: "first",
            middle: "middle default value",
            last: "last",
            suffix: "van",
          },
          id: field.id,
        },
      ],
    });

    expect(
      container.querySelector(`.gravityform__error_message`)
    ).not.toBeInTheDocument();

    expect(submitGravityForm).toBeCalled();
  });
});
