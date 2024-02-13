import classNames from "classnames";
import React from "react";
import SubmitButton from "../../components/Submit";

const PageNav = ({
  labelPlacement,
  currentPage,
  setPage,
  isLastPage,
  trigger,
}) => {
  const getClasses = () => {
    switch (labelPlacement) {
      case "RIGHT":
        return "right_label";
      case "LEFT":
        return "left_label";
      default:
        return "before";
    }
  };

  const handleNextPage = async () => {
    if (await trigger()) {
      setPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    setPage(currentPage - 1);
  };

  return (
    <div className={classNames("gform_page_footer", getClasses())}>
      {currentPage !== 1 && (
        <input
          type="button"
          className="gform_prev_button gform-theme-button button"
          value="Prev"
          onClick={handlePrevPage}
        />
      )}
      {isLastPage ? (
        <SubmitButton />
      ) : (
        <input
          type="button"
          className="gform_next_button gform-theme-button button"
          value="Next"
          onClick={handleNextPage}
        />
      )}
    </div>
  );
};

export default PageNav;
