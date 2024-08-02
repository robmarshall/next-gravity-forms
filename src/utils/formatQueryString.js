/**
 * Replace query string with their corresponding form values
 * @param {string} queryString
 * @param {array} formRes
 * @returns
 */
const formatQueryString = (queryString, formRes) => {
  const updatedQueryString = queryString.replace(/{([^}]+)}/g, (match, p1) => {
    const [, idStr] = p1.split(":");
    const id = parseInt(idStr);
    const formField = formRes.find((item) => item.id === id);
    const num = Number(idStr);
    const isInteger = !isNaN(num) && Number.isInteger(num);

    if (!formField) return "";

    switch (formField.field.type) {
      case "EMAIL":
        return formField.emailValues.value;

      case "CHECKBOX":
        // if all values should be returned (:1)
        if (isInteger) {
          const values = formField.checkboxValues.map((i) => i.value);
          return formField.field.choices
            ?.filter((i) => values.includes(i.value))
            ?.map((i) => i.text)
            .join(", ");
        } else {
          // specific one only (:1.2)
          const checkboxValue = formField.checkboxValues.find(
            (v) => v.inputId == idStr
          );

          if (!checkboxValue?.value) return "";

          return formField.field?.choices?.find(
            (i) => i.value == checkboxValue.value
          )?.text;
        }
      case "NAME":
        // eslint-disable-next-line no-case-declarations
        const propName = formField.field.inputs?.find(
          (i) => i.id == idStr
        )?.name;
        if (!propName) return "";

        return formField.nameValues?.[propName] || "";

      case "MULTISELECT":
        return (
          formField.values?.length > 0 &&
          formField.field?.choices
            .filter((i) => formField.values.includes(i.value))
            .map((i) => i.text)
            .join(", ")
        );
      default:
        return formField.value || "";
    }
  });

  // Remove parameters with empty values
  return updatedQueryString
    .split("&")
    .filter((param) => {
      const value = param.split("=")[1];

      return value !== "" && value !== "undefined";
    })
    .join("&");
};

export default formatQueryString;
