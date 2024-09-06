/**
 * Returns the appropriate Label and Wrapper components based on the input type and number of options.
 * (`legend/label` or `div/fieldset`)
 *
 * @param {string} type
 * @param {array} inputs
 * @param {array} choices
 * @returns
 */
const getLabelAndWrapperComponents = (type, inputs, choices) => {
  const options = inputs || choices;
  const childLength = options?.length;

  const components = {
    CONSENT: { Label: "legend", Wrapper: "fieldset" },
    SELECT: { Label: "label", Wrapper: "div" },
    MULTISELECT: { Label: "label", Wrapper: "div" },
    EMAIL: {
      Label: childLength > 1 ? "legend" : "label",
      Wrapper: childLength > 1 ? "fieldset" : "div",
    },
  };

  return (
    components[type] || {
      Label: childLength > 0 ? "legend" : "label",
      Wrapper: childLength > 0 ? "fieldset" : "div",
    }
  );
};

export default getLabelAndWrapperComponents;
