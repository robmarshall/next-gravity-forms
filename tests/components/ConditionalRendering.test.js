import { screen, fireEvent, act } from "@testing-library/react";
import renderGravityForm from "./render";

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
      renderGravityForm({
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

      const target = screen.getByLabelText(/Single/i).closest(".gfield");
      const style = window.getComputedStyle(target);
      expect(style.display).toBe(expectedDisplay);
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

  checkboxTestCases.forEach(
    ({ conditionalLogic, inputValue, expectedDisplay }) => {
      it(`${conditionalLogic.actionType} checkbox field if value ${conditionalLogic.rules[0].operator}`, async () => {
        renderGravityForm({
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
          const target = screen.getByLabelText(/Single/i).closest(".gfield");
          const style = window.getComputedStyle(target);
          expect(style.display).toBe(expectedDisplay);
        });
      });
    }
  );
});
