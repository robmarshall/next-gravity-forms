import classNames from "classnames";
import React, { useEffect } from "react";
import SubmitButton from "../../../components/Submit";
import { array, bool, func, number, object, string } from "prop-types";
import useResetPage from "./useResetPage";
import { useFormContext } from "react-hook-form";
import { checkConditionalRendering } from "../../../components/InputWrapper/helpers";

const getClasses = (labelPlacement) => {
  switch (labelPlacement) {
    case "RIGHT":
      return "right_label";
    case "LEFT":
      return "left_label";
    default:
      return "top_label";
  }
};

const PageNav = ({
  labelPlacement,
  currentPage,
  setPage,
  isLastPage,
  databaseId,
  loading,
  nodes,
  lastPageButton,
}) => {
  const {
    formState: { errors },
    trigger,
    watch,
    formFields,
    clearErrors,
  } = useFormContext();

  const pageNodes = nodes.filter((i) => i.inputType === "PAGE");

  const node = pageNodes?.[currentPage - 1];
  const { nextButton, previousButton, id } = node || {};

  const handleNextPage = async () => {
    // setFocus is needed to set a focus on the first field with error
    if (await trigger(false, { shouldFocus: true })) {
      setPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    clearErrors(); // needed in order to allow go to prev pages even when there are errors
    setPage(currentPage - 1);
  };

  // open specific page with field error if present
  useResetPage({ errors, nodes, setPage, loading });

  const previousBtn = isLastPage ? lastPageButton : previousButton;
  const prevBtnId = isLastPage ? "" : `_${id}`;

  // check if we need to show next button based on conditional rendering rules
  const isNextBtmHidden =
    nextButton?.conditionalLogic &&
    checkConditionalRendering(
      nextButton.conditionalLogic,
      watch,
      formFields?.nodes
    );

  // check if we need to show prev button based on conditional rendering rules
  const isPrevBtmHidden =
    previousButton?.conditionalLogic &&
    checkConditionalRendering(
      previousButton.conditionalLogic,
      watch,
      formFields?.nodes
    );

  return (
    <div
      className={classNames("gform_page_footer", getClasses(labelPlacement))}
    >
      {currentPage !== 1 && (
        <input
          type="button"
          id={`gform_previous_button_${databaseId}${prevBtnId}`}
          className="gform_prev_button gform-theme-button button"
          value={previousBtn?.text || "Previous"}
          onClick={handlePrevPage}
          style={isPrevBtmHidden ? { display: "none" } : undefined}
          disabled={isPrevBtmHidden ? "disabled" : undefined}
        />
      )}
      {isLastPage ? (
        <SubmitButton />
      ) : (
        <input
          type="button"
          id={`gform_next_button_${databaseId}_${id}`}
          className="gform_next_button gform-theme-button button"
          value={nextButton?.text || "Next"}
          onClick={handleNextPage}
          style={isNextBtmHidden ? { display: "none" } : undefined}
          disabled={isNextBtmHidden ? "disabled" : undefined}
        />
      )}
    </div>
  );
};

PageNav.propTypes = {
  labelPlacement: string,
  currentPage: number.isRequired,
  setPage: func.isRequired,
  isLastPage: bool.isRequired,
  loading: bool.isRequired,
  databaseId: number.isRequired,
  nodes: array.isRequired,
  lastPageButton: object,
};

export default PageNav;
