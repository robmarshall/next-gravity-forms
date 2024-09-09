import renderGravityForm from "./render";

/**
 * Check if legend/ label/ fieldset fields get rendered based on field type and it's settings
 */
describe("InputWrapper", () => {
  const fields = [
    {
      id: 2,
      type: "EMAIL",
      databaseId: 1,
      label: "Email with confirmation",
      hasAutocomplete: true,
      inputs: [
        {
          id: 10,
          customLabel: "Enter Email",
          label: "Enter Email",
          autocompleteAttribute: "email",
        },
        {
          id: 10.2,
          customLabel: "Confirm Email",
          label: "Confirm Email",
          autocompleteAttribute: "repeat-email",
        },
      ],
    },
    {
      id: 3,
      type: "SELECT",
      label: "Select",
      choices: [
        {
          isSelected: false,
          text: "First Choice",
          value: "First Choice",
        },
        {
          isSelected: false,
          text: "Second Choice",
          value: "Second Choice",
        },
      ],
      hasAutocomplete: true,
      autocompleteAttribute: "dropdown",
    },
    {
      id: 8,
      type: "TEXT",
      databaseId: 1,
      label: "Text",
      hasAutocomplete: true,
      autocompleteAttribute: "text-auto",
    },

    {
      id: 9,
      type: "PHONE",
      databaseId: 1,
      label: "Phone",
      hasAutocomplete: true,
      autocompleteAttribute: "phone-auto",
    },
    {
      id: 10,
      type: "NUMBER",
      databaseId: 1,
      label: "Number",
      hasAutocomplete: true,
      autocompleteAttribute: "number-auto",
    },
    {
      id: 11,
      databaseId: 1,
      type: "NAME",
      label: "Name",
      subLabelPlacement: "INHERIT",
      hasAutocomplete: true,
      inputs: [
        {
          id: 1.2,
          name: "",
          label: "Prefix",
          key: "prefix",
          autocompleteAttribute: "prefix",
          choices: [
            {
              text: "Dr.",
              value: "Dr.",
              isSelected: false,
            },
            {
              text: "Miss",
              value: "Miss",
              isSelected: false,
            },
          ],
        },
        {
          id: 1.3,
          name: "",
          label: "First",
          isHidden: false,
          key: "first",
          autocompleteAttribute: "first",
        },
      ],
    },
  ];

  fields.forEach((field) => {
    it(`renders autocomplete attribute for ${field.type}`, async () => {
      const { queryByLabelText } = renderGravityForm({
        data: {
          gfForm: { formFields: { nodes: [field] } },
        },
      });

      // Check if autocomplete is rendered correctly for the main input
      if (field.hasAutocomplete) {
        const isMulti = field.inputs?.length;

        if (isMulti) {
          field.inputs.forEach((input) => {
            const inputElement = queryByLabelText(input.label);

            expect(inputElement).toHaveAttribute(
              "autocomplete",
              input.autocompleteAttribute
            );
          });
        } else {
          const inputElement = queryByLabelText(field.label);

          expect(inputElement).toHaveAttribute(
            "autocomplete",
            field.autocompleteAttribute
          );
        }
      } else {
        // Check if no autocomplete attribute is rendered for fields without it
        const inputElement = queryByLabelText(field.label);

        expect(inputElement).not.toHaveAttribute("autocomplete");
      }
    });
  });
});
