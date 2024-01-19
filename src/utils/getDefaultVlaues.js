function getDefaultValues(fields) {
  const values = {};

  if (!Array.isArray(fields)) return values;

  fields.forEach(({ type, id, inputs, defaultValue, choices }) => {
    const inputName = `input_${id}`;

    // Simplify the logic for fields with similar handling
    const simpleFieldTypes = [
      "DATE",
      "HIDDEN",
      "NUMBER",
      "PHONE",
      "POSTCONTENT",
      "POSTEXCERPT",
      "POSTTITLE",
      "SELECT",
      "SIGNATURE",
      "TEXTAREA",
      "TEXT",
      "WEBSITE",
      "EMAIL",
    ];

    if (simpleFieldTypes.includes(type) && defaultValue) {
      values[inputName] = defaultValue;
    }

    // Special handling for EMAIL type with inputs
    if (type === "EMAIL" && inputs?.length > 0) {
      const [email, confirmation] = inputs;
      if (email.defaultValue) values[inputName] = email.defaultValue;
      if (confirmation?.defaultValue)
        values[`${inputName}_2`] = confirmation.defaultValue;
    }

    // Common logic for MULTISELECT, CHECKBOX, and RADIO
    if (
      ["MULTISELECT", "CHECKBOX", "RADIO"].includes(type) &&
      choices?.some((i) => i.isSelected)
    ) {
      values[inputName] =
        type === "RADIO"
          ? choices.find((i) => i.isSelected).value
          : choices.filter((i) => i.isSelected).map((i) => i.value);
    }

    // Handling for NAME type
    if (type === "NAME" && inputs?.length > 0) {
      inputs.forEach(({ defaultValue, choices, id }) => {
        if (defaultValue) values[`input_${id}`] = defaultValue;
        else if (choices?.some((i) => i.isSelected))
          values[`input_${id}`] = choices.find((i) => i.isSelected).value;
      });
    }
  });

  return values;
}

export default getDefaultValues;
