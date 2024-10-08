import renderGravityForm from "../render";
import mockFormData from "../../mocks/formData";
import { fireEvent, waitFor, act } from "@testing-library/react";
import { submitGravityForm } from "../../../src/fetch";

// mock submit so we don't run real request
jest.mock("../../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("Number field", () => {
  const field = {
    id: 11,
    description: "Some description",
    descriptionPlacement: "INHERIT",
    label: "Number",
    type: "NUMBER",
  };

  const fieldId = `field_${mockFormData.gfForm.databaseId}_${field.id}`;

  it("renders correctly", async () => {
    const { container } = renderGravityForm({
      data: {
        gfForm: { formFields: { nodes: [field] } },
      },
    });
    const sectionElement = container.querySelector(`div#${fieldId}`);

    expect(sectionElement).toBeInTheDocument();

    expect(sectionElement).toHaveClass("gfield--type-number");

    expect(container.querySelector(".gfield_label")).toBeInTheDocument();
  });

  describe("correct range validation message is displayed before number is submited", () => {
    test.each([
      // [rangeMin, rangeMax, expectedMessage]
      [10, null, "Please enter a number greater than or equal to 10"],
      [null, 10, "Please enter a number less than or equal to 10"],
      [2, 10, "Please enter a number from 2 to 10."],
    ])(
      "validation message for range",
      (rangeMin, rangeMax, expectedMessage) => {
        const { container } = renderGravityForm({
          data: {
            gfForm: {
              formFields: {
                nodes: [
                  {
                    id: 9,
                    type: "NUMBER",
                    rangeMin: rangeMin,
                    rangeMax: rangeMax,
                  },
                ],
              },
            },
          },
        });

        expect(
          container.querySelector(".gfield_description")
        ).toHaveTextContent(expectedMessage);
      }
    );
  });

  describe("correct validation message is displayed after out of range number is submited", () => {
    test.each([
      // [rangeMin, rangeMax, inputValue, expectedMessage]
      [10, null, 9, "Please enter a number greater than or equal to 10"],
      [null, 10, 15, "Please enter a number less than or equal to 10"],
      [2, 10, 13, "Please enter a number from 2 to 10."],
    ])(
      "validates the input %d when rangeMin is %s and rangeMax is %s",
      async (rangeMin, rangeMax, inputValue, expectedMessage) => {
        const { container, getByLabelText, getByRole } = renderGravityForm({
          data: {
            gfForm: {
              formFields: {
                nodes: [
                  {
                    id: 11,
                    label: "Number",
                    type: "NUMBER",
                    numberFormat: "DECIMAL_DOT",
                    rangeMin: rangeMin,
                    rangeMax: rangeMax,
                  },
                ],
              },
            },
          },
        });

        fireEvent.input(getByLabelText("Number"), {
          target: { value: inputValue },
        });

        await act(async () => {
          fireEvent.submit(getByRole("button"));
        });

        await waitFor(() => {
          expect(
            container.querySelector(".gfield_description")
          ).toHaveTextContent(expectedMessage);
        });

        expect(submitGravityForm).not.toBeCalled();
      }
    );
  });

  it("no validation message for range when custom validation message is provided", () => {
    const { container } = renderGravityForm({
      data: {
        gfForm: {
          formFields: {
            nodes: [
              {
                id: 9,
                type: "NUMBER",
                rangeMin: 1,
                rangeMax: 10,
                errorMessage: "Provided range is not right",
              },
            ],
          },
        },
      },
    });

    expect(container.querySelector(".gfield_description")).toBeNull();
  });

  it("invalid number field is displayed when string is entered", async () => {
    const { container, getByLabelText, getByRole } = renderGravityForm({
      data: {
        gfForm: {
          formFields: {
            nodes: [
              {
                id: 9,
                type: "NUMBER",
                label: "Number",
                numberFormat: "DECIMAL_COMMA",
              },
            ],
          },
        },
      },
    });

    fireEvent.input(getByLabelText("Number"), {
      target: { value: "test" },
    });

    await act(async () => {
      fireEvent.submit(getByRole("button"));
    });

    await waitFor(() => {
      expect(container.querySelector(".gfield_description")).toHaveTextContent(
        "Please enter a valid number"
      );
    });

    expect(submitGravityForm).not.toBeCalled();
  });

  it("custom validation message is displayed if number range validation is failed", async () => {
    const { container, getByLabelText, getByRole } = renderGravityForm({
      data: {
        gfForm: {
          formFields: {
            nodes: [
              {
                id: 9,
                type: "NUMBER",
                label: "Number",
                rangeMin: 1,
                rangeMax: 10,
                errorMessage: "Provided range is not right",
              },
            ],
          },
        },
      },
    });

    fireEvent.input(getByLabelText("Number"), {
      target: { value: 11 },
    });

    await act(async () => {
      fireEvent.submit(getByRole("button"));
    });

    await waitFor(() => {
      expect(container.querySelector(".gfield_description")).toHaveTextContent(
        "Provided range is not right"
      );
    });

    expect(submitGravityForm).not.toBeCalled();
  });

  it("converts number to money format on blur", async () => {
    const { getByLabelText } = renderGravityForm({
      data: {
        gfForm: {
          formFields: {
            nodes: [
              {
                id: 9,
                type: "NUMBER",
                label: "Number",
                numberFormat: "CURRENCY",
              },
            ],
          },
        },
        gfSettings: {
          currency: "USD",
        },
      },
    });

    const input = getByLabelText("Number");

    fireEvent.input(input, {
      target: { value: "10,000.50" },
    });

    // Trigger blur event
    fireEvent.blur(input);

    expect(input.value).toBe("$10,000.50");
  });

  describe("submits form with different number formats", () => {
    test.each([
      // type, value
      ["DECIMAL_DOT", "11.4", "11.4"],
      ["DECIMAL_COMMA", "9.999,99", "9.999,99"],
      ["CURRENCY", "$11.50", "$11.50"],
      ["CURRENCY", "$11,50", "$1,150.00"],
    ])("formatType %s", async (formatType, inputValue, formattedValue) => {
      const { container, getByRole } = renderGravityForm({
        data: {
          gfForm: {
            formFields: {
              nodes: [
                {
                  id: 11,
                  label: "Number",
                  type: "NUMBER",
                  numberFormat: formatType,
                  defaultValue: inputValue,
                },
              ],
            },
          },
          gfSettings: {
            currency: "USD",
          },
        },
      });

      await act(async () => {
        fireEvent.submit(getByRole("button"));
      });

      await waitFor(() => {
        const formElement = container.querySelector("form");
        expect(formElement).not.toBeInTheDocument();
      });

      // check values
      expect(submitGravityForm).toBeCalledWith({
        id: mockFormData.gfForm.databaseId,
        fieldValues: [
          {
            value: formattedValue,
            id: 11,
          },
        ],
      });
    });
  });
});
