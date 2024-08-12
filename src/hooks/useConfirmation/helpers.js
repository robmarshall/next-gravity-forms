import formatPayload from "../../utils/formatPayload";
import formatQueryString from "../../utils/formatQueryString";

export const findConfirmation = (confirmations) => {
  return confirmations?.find((el) => {
    // First check if there is a custom confirmation
    // that is not the default.
    if (el.isActive && !el.isDefault) {
      return true;
    }

    // If not, revert back to the default one.
    if (el.isDefault) {
      return true;
    }
  });
};

export const getQueryString = (queryString, values, fields) => {
  try {
    if (!queryString) return "";

    const formRes = formatPayload({
      serverData: fields,
      clientData: values,
    }).map((item) => ({
      ...item,
      field: fields.find((i) => i.id === item.id),
    }));

    return formatQueryString(queryString, formRes);
  } catch (e) {
    return "";
  }
};
