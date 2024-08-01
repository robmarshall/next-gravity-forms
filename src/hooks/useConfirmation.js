import { useEffect } from "react";
import { isInternalLink } from "../utils/helpers";

function useConfirmation({ success, confirmations, navigate }) {
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

  const confirmation = findConfirmation(confirmations);

  const handleRedirect = (confirmation) => {
    // TODO add fields values into link, i.e. phone={Phone:1}&email={Email:2}
    if (confirmation.type === "PAGE") {
      redirect(confirmation?.page?.node?.link);
    }

    if (confirmation.type === "REDIRECT") {
      if (!confirmation?.url) return;

      // TODO add fields values into link, i.e. phone={Phone:1}&email={Email:2}
      if (isInternalLink(confirmation.url)) {
        redirect(confirmation.url);
      } else {
        window.location.href = confirmation.url;
      }
    }
  };

  const redirect = navigate
    ? (url) => {
        navigate(url);
      }
    : (url) => {
        return (window.location.href = url);
      };

  useEffect(() => {
    if (success && confirmation) {
      handleRedirect(confirmation);
    }
  }, [success]);

  return { confirmation };
}

export default useConfirmation;
