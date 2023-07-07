import { submitMutationQuery } from "./query";

/**
 * Wrapper for the fetchAPI function that gets GraphQL data from Wordpress.
 */
async function fetchAPI(query, { baseUrl, variables } = {}) {
  const res = await fetch(
    baseUrl || process?.env?.NEXT_PUBLIC_WORDPRESS_API_URL,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  const json = await res.json();

  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    throw new Error("Failed to fetch API");
  }
  return json.data;
}

export async function submitGravityForm({ id, fieldValues }) {
  const data = await fetchAPI(submitMutationQuery, {
    baseUrl: process?.env?.NEXT_PUBLIC_WORDPRESS_FORM_SUBMIT_URL,
    variables: { id, fieldValues },
  });

  return data?.submitGfForm;
}
