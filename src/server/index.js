import fetch from "node-fetch";
import { gravityFormQuery } from "../query";
export * from "../query";

/**
 * Wrapper for the fetchAPI function that gets GraphQL data from Wordpress.
 */
async function fetchAPI(query, { baseUrl, variables } = {}) {
  const res = await fetch(
    baseUrl || process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
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
    console.log(JSON.stringify(json.errors, null, 2));
    throw new Error("Failed to fetch API");
  }
  return json.data;
}

export async function getGravityForm(id, baseUrl) {
  const data = await fetchAPI(gravityFormQuery, { baseUrl, variables: { id } });

  return data;
}
