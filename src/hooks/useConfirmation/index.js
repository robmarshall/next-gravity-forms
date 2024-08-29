import { useState } from "react";
import { isInternalLink } from "../../utils/helpers";
import addQueryParamsToUrl from "../../utils/addQueryParamsToUrl";
import { findConfirmation, getQueryString } from "./helpers";

/**
 *
 * @param {*} param0
 * @returns
 */
function useConfirmation({ confirmations, navigate, formFieldNodes }) {
  const [confirmation, setConfirmation] = useState(false);

  // actual redirection
  const handleRedirect = (url) => {
    if (isInternalLink(url)) {
      navigate ? navigate(url) : (window.location.href = url);
    } else {
      window.location.href = url;
    }
  };

  /**
   * Check confirmation type
   */
  const handleConfirmation = (values) => {
    try {
      const confirmation = findConfirmation(confirmations);

      // show empty confirmation if there is no active confirmation at all
      // so we don't render form fields anymore
      if (!confirmation) return setConfirmation(true);

      const { type, message, queryString } = confirmation;

      // handle message confirmation
      if (type === "MESSAGE" && message) {
        const newConfirmation = { ...confirmation };
        const confirmationMessageWithFormValues = getQueryString(
          confirmation.message,
          values,
          formFieldNodes
        );
        if (confirmationMessageWithFormValues)
          newConfirmation.message = confirmationMessageWithFormValues;

        return setConfirmation(newConfirmation);
      }

      // handle redirect confirmation
      let url;
      if (type === "PAGE" && confirmation?.page?.node?.link) {
        url = confirmation.page.node.link;
      } else if (type === "REDIRECT" && confirmation?.url) {
        url = confirmation?.url;
      }

      if (!url) {
        console.error("no url specified for redirection");
        return setConfirmation(true);
      }

      const queryStr = getQueryString(queryString, values, formFieldNodes);
      const redirectUrl = queryStr ? addQueryParamsToUrl(url, queryStr) : url;

      return handleRedirect(redirectUrl);
    } catch (e) {
      console.error(e);
      return setConfirmation(true);
    }
  };

  return { confirmation, handleConfirmation };
}

export default useConfirmation;
