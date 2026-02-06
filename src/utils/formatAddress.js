import { getLocationCodeByName } from "../components/Address/helpers";

const formatAddress = (response) => {
  if (!response) return response;

  const { country } = response;

  const countryCode = getLocationCodeByName("INTERNATIONAL", country);

  return {
    ...response,
    country: countryCode ?? null,
  };
};

export default formatAddress;
