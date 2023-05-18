import fetch from "isomorphic-unfetch";
import https from "https";
import { gravityFormQuery, submitMutationQuery } from "../query";

/**
 * Wrapper for the fetchAPI function that gets GraphQL data from Wordpress.
 */
async function fetchAPI(query, { variables } = {}, token) {
  // rejectUnauthorized: allows us to use self-signed certificates while developing locally.
  const agent = new https.Agent({
    rejectUnauthorized: process.env.NEXT_ENVIROMENT === "local" ? false : true,
  });

  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, {
    agent,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    throw new Error("Failed to fetch API");
  }
  return json.data;
}

export async function getGravityForm(id) {
  const data = await fetchAPI(gravityFormQuery, { variables: { id } });

  return data;
}

export async function submitGravityForm({ id, fieldValues }) {
  const data = await fetchAPI(submitMutationQuery, {
    variables: { id, fieldValues },
  });

  return data?.submitGfForm;
}
