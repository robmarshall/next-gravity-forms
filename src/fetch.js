import { submitMutationQuery } from "./query";

/**
 * Wrapper for the fetchAPI function that gets GraphQL data from Wordpress.
 */
async function fetchAPI(body, { baseUrl, isMultipart } = {}) {
  const headers = isMultipart ? {} : { "Content-Type": "application/json" };
  const requestOptions = {
    method: "POST",
    headers,
    body: isMultipart ? body : JSON.stringify(body),
  };

  const res = await fetch(
    baseUrl || process.env?.NEXT_PUBLIC_WORDPRESS_API_URL,
    requestOptions
  );
  const json = await res.json();

  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    throw new Error("Failed to fetch API");
  }
  return json.data;
}

export async function submitGravityForm({ id, fieldValues }) {
  const isFileUpload = fieldValues.some((field) =>
    field.hasOwnProperty("fileUploadValues")
  );

  if (isFileUpload) {
    return submitFormWithFile({ id, fieldValues });
  } else {
    return fetchAPI(
      {
        query: submitMutationQuery,
        variables: { id, fieldValues },
      },
      {
        baseUrl: process.env?.NEXT_PUBLIC_WORDPRESS_FORM_SUBMIT_URL,
      }
    );
  }
}

async function submitFormWithFile({ id, fieldValues }) {
  const formData = new FormData();
  const operations = {
    query: submitMutationQuery,
    variables: {
      id,
      fieldValues: fieldValues.map((field) => ({
        ...field,
        fileUploadValues: null, // we're going to send files via map
      })),
    },
  };

  formData.append("operations", JSON.stringify(operations));

  const fileMap = {};

  fieldValues.forEach((field, fieldIndex) => {
    if (
      field.fileUploadValues instanceof FileList ||
      field.fileUploadValues instanceof Array
    ) {
      Array.from(field.fileUploadValues).forEach((file, fileIndex) => {
        const fileKey = `file_${fieldIndex}_${fileIndex}`;
        formData.append(fileKey, file);
        fileMap[fileKey] = [
          `variables.fieldValues.${fieldIndex}.fileUploadValues.${fileIndex}`,
        ];
      });
    }
  });

  formData.append("map", JSON.stringify(fileMap));

  return fetchAPI(formData, {
    baseUrl: process.env?.NEXT_PUBLIC_WORDPRESS_FORM_SUBMIT_URL,
    isMultipart: true,
  });
}
