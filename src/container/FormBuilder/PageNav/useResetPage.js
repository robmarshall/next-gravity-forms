import { useEffect, useRef } from "react";
import { usePrevious } from "../../../hooks";

// listen for errors and open specific page with error
function useResetPage({ errors, setPage, nodes, loading }) {
  // get the first error key (i.e. input_3) from errors object
  const inputKeyError = Object.keys(errors)?.[0];
  const prevLoading = usePrevious(loading);
  const hasRun = useRef();

  // re-set hasRun so we can re-run functionality to go the the page when user clicked on submit again
  useEffect(() => {
    if (loading !== prevLoading) hasRun.current = false;
  }, [loading, prevLoading]);

  useEffect(() => {
    // don't run the hook when page has opened already
    // it prevents opening other pages if there are more errors
    if (inputKeyError && !hasRun.current) {
      const id = inputKeyError?.replace("input_", "");

      const page = nodes.find((i) => i.id == id)?.pageNumber;
      if (page) setPage(page);

      hasRun.current = true;
    }
  }, [inputKeyError]);
}

export default useResetPage;
