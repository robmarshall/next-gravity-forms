/* eslint-disable no-case-declarations */
import { useEffect } from "react";
import { isInternalLink } from "../utils/helpers";
import formatPayload from "../utils/formatPayload";
import formatQueryString from "../utils/formatQueryString";
import addQueryParamsToUrl from "../utils/addQueryParamsToUrl";

const findConfirmation = (confirmations) => {
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

function useConfirmation({
  success,
  confirmations,
  navigate,
  formFieldNodes,
  getValues,
}) {
  const getQueryString = (queryString) => {
    try {
      if (!queryString) return "";
      const values = getValues();

      const formRes = formatPayload({
        serverData: formFieldNodes,
        clientData: values,
      }).map((item) => ({
        ...item,
        field: formFieldNodes.find((i) => i.id === item.id),
      }));

      return formatQueryString(queryString, formRes);
    } catch (e) {
      return "";
    }
  };

  const confirmation = findConfirmation(confirmations);

  const handleRedirect = (confirmation) => {
    const { queryString, type } = confirmation;

    let url;

    if (type === "PAGE" && confirmation?.page?.node?.link) {
      url = confirmation.page.node.link;
    } else if (type === "REDIRECT" && confirmation?.url) {
      url = confirmation?.url;
    }

    if (!url) return;

    const queryStr = getQueryString(queryString);
    const redirectUrl = queryStr ? addQueryParamsToUrl(url, queryStr) : url;

    // actual redirection
    if (isInternalLink(url)) {
      navigate ? navigate(redirectUrl) : (window.location.href = redirectUrl);
    } else {
      window.location.href = redirectUrl;
    }
  };

  useEffect(() => {
    if (success && confirmation) {
      handleRedirect(confirmation);
    }
  }, [success]);

  if (confirmation?.type === "MESSAGE" && confirmation?.message) {
    const queryStr = getQueryString(confirmation.message);
    if (queryStr) {
      return { confirmation: { ...confirmation, message: queryStr } };
    }
  }

  return { confirmation };
}

export default useConfirmation;
