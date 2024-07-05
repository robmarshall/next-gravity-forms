/**
 * This function takes the React Hook Form data (clientData) and matches it
 * against the WP Gravity Forms graphQL data (serverData).
 *
 * Once matched, it formats the data to be able to be returned back to the WP
 * backend in the correct format.
 *
 * Variable names could be better...
 *
 * Useful info on Gravity Forms graphQL:
 * https://github.com/harness-software/wp-graphql-gravity-forms/blob/develop/docs/submitting-forms.md
 */
import formatDate from "./formatDate";

const formatter = ({
  id,
  fieldResponse,
  serverDataItem,
  clientData,
  databaseId,
}) => {
  const { type, inputs, choices } = serverDataItem;
  switch (type) {
    case "ADDRESS":
      return {
        addressValues: fieldResponse, // @TODO does it work?
      };
    case "CAPTCHA":
      return {
        value: fieldResponse,
      };
    case "CHECKBOX":
      // eslint-disable-next-line no-case-declarations
      const selectedChoices = [];
      // Loop through all Gravity Form Checkbox choices.
      choices.forEach(({ value }, index) => {
        const isSelected = fieldResponse.includes(value);
        // If the Gravity Forms choice matches with selected item from user.
        // Add to response.
        if (isSelected) {
          selectedChoices.push({ inputId: inputs[index].id, value });
        }
      });

      return {
        checkboxValues: selectedChoices,
      };
    case "EMAIL":
      if (inputs?.length > 0) {
        return {
          emailValues: {
            value: fieldResponse,
            confirmationValue: clientData[`input_${databaseId}_${id}_2`],
          },
        };
      }

      return {
        emailValues: {
          value: fieldResponse,
        },
      };
    case "NAME": {
      return { nameValues: fieldResponse };
    }
    case "FILEUPLOAD":
      return {
        fileUploadValues: fieldResponse,
      };

    case "CONSENT":
    case "HIDDEN":
    case "NUMBER":
    case "PHONE":
    case "POSTCONTENT":
    case "POSTEXCERPT":
    case "POSTTITLE":
    case "RADIO":
    case "SELECT":
    case "SIGNATURE":
    case "TEXTAREA":
    case "TEXT":
    case "WEBSITE":
    case "HONEYPOT":
      return {
        value: fieldResponse,
      };
    case "DATE":
      // eslint-disable-next-line no-case-declarations
      const { dateFormat, dateType } = serverDataItem;
      return {
        value: formatDate(fieldResponse, dateType, dateFormat),
      };
    case "MULTISELECT":
      return {
        values: fieldResponse,
      };
    case "POSTCATEGORY":
      return {
        values: fieldResponse,
      };
    case "POSTCUSTOM":
      return {
        values: fieldResponse,
      };
    case "POSTTAGS":
      return {
        values: fieldResponse,
      };
    default:
      return {};
  }
};

export default ({ serverData, clientData, databaseId }) => {
  const formattedData = serverData
    .map(({ id, ...rest }) => {
      // Does this particular field have a response?
      const fieldResponse = clientData[`input_${databaseId}_${id}`];

      // If so, lets re-format and add to array.
      if (fieldResponse) {
        return {
          id,
          ...formatter({
            id,
            fieldResponse,
            clientData,
            serverDataItem: rest,
            databaseId,
          }),
        };
      }
    })
    .filter(Boolean);

  return formattedData;
};
