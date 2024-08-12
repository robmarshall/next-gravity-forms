import { screen, fireEvent, act } from "@testing-library/react";
import renderGravityForm from "./render";
import mockFormData from "../mocks/formData";
import { submitGravityForm } from "../../src/fetch";

// mock submit so we don't run real request
jest.mock("../../src/fetch", () => ({
  submitGravityForm: jest.fn(),
}));

describe("Conditional logic", () => {
  const fields = [
    {
      id: 1,
      type: "TEXT",
      label: "Single",
    },
    {
      id: 2,
      type: "TEXT",
      label: "Second",
    },
  ];

  const baseTestCases = [
    {
      conditionalLogic: {
        rules: [
          {
            fieldId: 2,
            operator: "IS",
            value: "second",
          },
        ],
        logicType: "ANY",
        actionType: "HIDE",
      },
      inputValue: "second",
      expectedDisplay: "none",
    },
    {
      conditionalLogic: {
        rules: [
          {
            fieldId: 2,
            operator: "CONTAINS",
            value: "second",
          },
        ],
        logicType: "ANY",
        actionType: "HIDE",
      },
      inputValue: "second",
      expectedDisplay: "none",
    },
    {
      conditionalLogic: {
        rules: [
          {
            fieldId: 2,
            operator: "IS_NOT",
            value: "second",
          },
        ],
        logicType: "ANY",
        actionType: "HIDE",
      },
      inputValue: "some text",
      expectedDisplay: "none",
    },
    {
      conditionalLogic: {
        rules: [
          {
            fieldId: 2,
            operator: "STARTS_WITH",
            value: "second",
          },
        ],
        logicType: "ANY",
        actionType: "HIDE",
      },
      inputValue: "second value",
      expectedDisplay: "none",
    },
    {
      conditionalLogic: {
        rules: [
          {
            fieldId: 2,
            operator: "ENDS_WITH",
            value: "end",
          },
        ],
        logicType: "ANY",
        actionType: "HIDE",
      },
      inputValue: "test value blend",
      expectedDisplay: "none",
    },
  ];

  const generateTestCases = (baseCases) => {
    const cases = [];
    baseCases.forEach((testCase) => {
      // HIDE case
      cases.push(testCase);
      // SHOW case
      cases.push({
        conditionalLogic: {
          ...testCase.conditionalLogic,
          actionType: "SHOW",
        },
        inputValue: testCase.inputValue,
        expectedDisplay: "block",
      });
    });
    return cases;
  };

  const testCases = generateTestCases(baseTestCases);

  testCases.forEach(({ conditionalLogic, inputValue, expectedDisplay }) => {
    it(`${conditionalLogic.actionType} text field if value ${conditionalLogic.rules[0].operator}`, async () => {
      const { container } = renderGravityForm({
        data: {
          gfForm: {
            formFields: {
              nodes: [
                {
                  ...fields[0],
                  conditionalLogic,
                },
                ...fields.slice(1),
              ],
            },
          },
        },
      });

      fireEvent.input(screen.getByLabelText(/Second/i), {
        target: {
          value: inputValue,
        },
      });

      const fieldId = `field_${mockFormData.gfForm.databaseId}_1`;
      const target = container.querySelector(`#${fieldId}`);

      if (expectedDisplay === "none") {
        expect(target).not.toBeInTheDocument();
      } else {
        expect(target).toBeInTheDocument();
      }
    });
  });

  // checkbox
  const baseCheckboxTestCases = [
    {
      conditionalLogic: {
        rules: [
          {
            fieldId: 2,
            operator: "IS",
            value: "second",
          },
        ],
        logicType: "ANY",
        actionType: "HIDE",
      },
      inputValue: "Third Choice",
      expectedDisplay: "none",
    },
    {
      conditionalLogic: {
        rules: [
          {
            fieldId: 2,
            operator: "CONTAINS",
            value: "second",
          },
        ],
        logicType: "ANY",
        actionType: "HIDE",
      },
      inputValue: "Third Choice",
      expectedDisplay: "none",
    },
    {
      conditionalLogic: {
        rules: [
          {
            fieldId: 2,
            operator: "STARTS_WITH",
            value: "second",
          },
        ],
        logicType: "ANY",
        actionType: "HIDE",
      },
      inputValue: "Third Choice",
      expectedDisplay: "none",
    },
  ];
  const checkboxTestCases = generateTestCases(baseCheckboxTestCases);

  checkboxTestCases.forEach(({ conditionalLogic, expectedDisplay }) => {
    it(`${conditionalLogic.actionType} checkbox field if value ${conditionalLogic.rules[0].operator}`, async () => {
      const { container } = renderGravityForm({
        data: {
          gfForm: {
            formFields: {
              nodes: [
                {
                  ...fields[0],
                  conditionalLogic,
                },
                {
                  ...fields[1],
                  type: "CHECKBOX",
                  label: "",
                  choices: [
                    {
                      isSelected: false,
                      text: "First Choice",
                      value: "first",
                    },
                    {
                      isSelected: true,
                      text: "Third Choice",
                      value: "second",
                    },
                    {
                      isSelected: false,
                      text: "Fouthh",
                      value: "fourth",
                    },
                  ],
                },
              ],
            },
          },
        },
      });

      await act(async () => {
        const fieldId = `field_${mockFormData.gfForm.databaseId}_1`;
        const target = container.querySelector(`#${fieldId}`);

        if (expectedDisplay === "none") {
          expect(target).not.toBeInTheDocument();
        } else {
          expect(target).toBeInTheDocument();
        }
      });
    });
  });

  it("submit button is hidden", async () => {
    renderGravityForm({
      data: {
        gfForm: {
          formFields: {
            nodes: [
              {
                id: 1,
                type: "TEXT",
                label: "Single",
              },
            ],
          },
          submitButton: {
            conditionalLogic: {
              rules: [
                {
                  fieldId: 1,
                  operator: "IS",
                  value: "second",
                },
              ],
              logicType: "ANY",
              actionType: "SHOW",
            },
          },
        },
      },
    });

    fireEvent.input(screen.getByLabelText(/Single/i), {
      target: {
        value: "test",
      },
    });

    const target = screen.getByText("Submit1");
    const style = window.getComputedStyle(target);

    expect(style.display).toBe("none");
  });

  // check if form ignores conditionally hidden required fields
  it("doesn't count a required field if it is conditionally hidden", async () => {
    const fields = [
      {
        id: 1,
        type: "TEXT",
        label: "Single",
        isRequired: true,
        conditionalLogic: {
          rules: [
            {
              fieldId: 2,
              operator: "IS",
              value: "second",
            },
          ],
          logicType: "ANY",
          actionType: "SHOW", // hidden by default, but required
        },
      },
      {
        id: 2,
        type: "TEXT",
        label: "Second",
        defaultValue: "test",
      },
    ];

    const { container } = renderGravityForm({
      data: {
        gfForm: {
          formFields: {
            nodes: fields,
          },
        },
      },
    });

    await act(async () => {
      fireEvent.submit(container.querySelector(`#gform_submit_button_2`));
    });

    // we check if there is file value being processed, we don't check actual uploading
    expect(submitGravityForm).toBeCalledWith({
      id: mockFormData.gfForm.databaseId,
      fieldValues: [
        {
          value: "test",
          id: 2,
        },
      ],
    });
  });
});
