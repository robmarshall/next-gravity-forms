function addQueryParamsToUrl(url, queryString) {
  const urlObj = new URL(url);

  // Parse the existing query parameters
  const existingParams = new URLSearchParams(urlObj.search);

  // Parse the new query parameters
  const newParams = new URLSearchParams(queryString);

  // Merge new query parameters into existing ones
  for (const [key, value] of newParams.entries()) {
    existingParams.set(key, value);
  }

  // Set the updated search parameters to the URL object
  urlObj.search = existingParams.toString();

  // Return the updated URL as a string
  return urlObj.toString();
}

export default addQueryParamsToUrl;
